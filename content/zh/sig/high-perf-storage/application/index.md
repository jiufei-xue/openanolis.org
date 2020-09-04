---
title: "io_uring 应用适配"
aliases: "/alinux2/docs/Inclavare-Container"
---

### echo server

#### 项目介绍

echo server 是一个经典的用于评估网络性能的测试套件，多个客户端并发地向服务端发送固定长度消息，服务端收到消息后直接将消息原样返回给客户端。echo server 本身也是一种经典的网络编程模型，redis，nginx 等基本都是采用此编程模型。



#### 项目文档

传统上 echo server 通常利用 select，epoll，kequeue 等机制实现。以 epoll 为例，利用 epoll_ctl 监听用于网络通信的fd，利用 epoll_wait 可以获得可读写的文件句柄，然后再对每个返回的文件句柄调用 recv()，send() 等进行消息收发。
io_uring 提供的网络编程模型不同于 epoll，以recv()为例，它不需要通过 epoll_ctl 进行文件句柄的注册，io_uring 首先在用户态用 sqe 结构描述一个 io 请求，然后用户程序通过调用 io_uring_submit_and_wait() 来提交和等待该请求，类似于 epoll_wait()，最后 io_uring_submit_and_wait() 返回时的cqe结构用于描述之前提交的 recv() 请求的完成状态。
io_uring 相比于 epoll 可以极大降低系统的用户态到内核态上下文切换开销，从而提高 echo server 的 qps。我们在物理机环境进行 echo server 编程模型下 io_uring 和 epoll 的性能对比，server 端 cpu Intel(R) Xeon(R) CPU E5-2682 v4 @ 2.50GHz, client 端 cpu Intel(R) Xeon(R) CPU E5-2630 0 @ 2.30GHz。



![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/156169/1596510433089-21317043-f058-4cc9-9b33-bdc3b2c2d642.png)



上图是 io_uring 和 epoll 在 echo_server 场景下 qps 数据对比，可以看出在测试环境中，连接数 1000 及以上时，io_uring 的性能优势开始体现，io_uring 的极限性能单 core 在 24 万 qps 左右，而 epoll 单 core 只能达到 20 万 qps 左右，收益在 20% 左右。



![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/156169/1596510443168-42725629-8efd-44da-a282-b5c1cafa2ad8.png)



上图统计的是 io_uring 和 epoll 在 echo server 场景下系统调用上下文切换数量的对比，可以看出 io_uring 可以极大的减少用户态到内核态的切换次数，在连接数超过 300 时，io_uring 用户态到内核态的切换次数基本可以忽略不计。



#### 项目仓库

https://github.com/OpenAnolis/io_uring-echo-server



### redis

#### 项目介绍

redis 是一个高性能的 key-value 数据结构存储，可以用来作为数据库，缓存和消息队列。
redis 将所有数据集存储在内存中，性能非常高，并且支持 Pipelining 命令，可一次发送多条命令来提高吞吐率，减少通信延迟。另外相比较其他 key-value 缓存产品，它还有以下几个特点：
1）redis 支持数据的持久化。
2）redis 不仅支持简单的 key-value 类型的数据，同时还提供 list，set，zset，hash 等数据结构的存储。
3）redis 支持主从复制。



#### 项目文档

redis 6.0 之前为单线程模型，客户端请求的处理都在主线程内完成，通过 ae 事件模型以及 IO 多路复用技术来高速的处理客户端请求。具体流程如下。



![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/67250/1596702207476-54f95047-7583-4834-941f-9fa72780bf05.png)



> 注意：redis 4.0 版本之后就不是传统意义的单线程模型，server 端会起一些后台线程来处理缓慢的操作。但在 redis 6.0 之前，处理客户端的请求（包括 socket 读、包解析和处理，socket 写）都是由顺序串行的主线程处理，也就是我们这里所谓的“单线程”。



redis 6.0 之后，可以配置用一组单独的 IO 线程进行 read/write socket 读写调用（默认不开启）。ae 事件依然在主线程中处理，当有数据需要读写时，主线程把任务平均分发给 IO 线程（主线程也处理一部分任务），并等待所有线程完成，其余流程保持不变。为了简化模型，我们这里的描述和测试都以单线程为例。



利用 io uring 的异步下发和 FAST POLL 机制优化之后，redis 的主线程大致流程图如下：



![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/67250/1596701773214-7092b0b4-9b62-4c85-8004-ef32bbb77f3e.png)



注意：这里的 readQueryFromClient 和 writeToClient 都从原来的同步读写变为异步接口，只是准备读写请求，在io_uring_submit_and_wait() 中统一下发。请求真实完成之后，调用新增的回调函数 readDoneFromClient 和writeDoneToClient 进行后续处理。



**测试环境**
CPU: Intel(R) Xeon(R) CPU E5-2682 v4 @ 2.50GHz
server 和client 在同一台机器上。



![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/67250/1596704893158-4ee0ae7f-769c-4421-8aea-fbe5911876b8.png)



![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/67250/1596705123048-b764b684-22c0-4f21-9a06-81255ec4cc69.png)



![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/67250/1596705268670-41b32112-751d-4781-8fd0-1511fcb965f0.png)



![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/67250/1596705279654-55e97555-f080-4a45-9c5f-52d3073755ea.png)



以上是 redis 在 event poll 和 io_uring 下的 qps 对比，可以看到：

1. 高负载情况下，io_uring 相比 event poll，吞吐提升 8%~11%。

1. 开启 sqpoll 时，吞吐提升 24%~32%。
   这里读者可能会有个疑问，开启 sqpoll 额外使用了一个 CPU，性能为什么才提升 30% 左右？那是因为 redis 运行时同步读写就消耗了 70% 以上的 CPU，而 sq_thread 只能使用一个 CPU 的能力，把读写工作交给 sq_thread 之后，理论上 QPS 最多能提升 40% 左右（1/0.7 - 1 = 0.42），再加上 sq_thread 还需要处理中断以及本身的开销，因此只能有 30% 左右的提升。





#### 项目仓库

https://github.com/OpenAnolis/redis

### nginx

#### 项目介绍

nginx 是一款轻量级的 web 服务器、反向代理服务器，由于它的内存占用少，启动极快，高并发能力强，在互联网项目中广泛应用。
![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/67250/1596425950219-706075da-e69f-4262-a5eb-308590d3dfea.png)



nginx 由一个 master 和多个 worker 进程组成，master 和 worker 进程都是单线程架构，并且多个 worker 之间不需要加锁，独立处理与 client 的连接和网络请求。





#### 项目文档

nginx 在 Linux 下默认使用 epoll 异步事件驱动模型来高效处理客户端请求。当系统支持 io_uring 时，我们可以配置用 io_uring 替代 epoll 作为默认的异步事件驱动模型。



用户需要安装 liburing 以及 liburing-devel。

```
sudo yum install liburing liburing-devel
```



为了让 nginx 使用 io_uring，编译前需要显式加上 --with-io-uring。

```
./auto/configure --with-io-uring
make
make install
```



**测试环境**
CPU: Intel(R) Xeon(R) CPU E5-2682 v4 @ 2.50GHz，打开CPU漏洞缓解（mitigation=on）。



nginx 配置

```
user root;
http {
    access_log  off;
    server {
        access_log  off; // 关闭access log，否则会写日志，影响测试
        location / {
            return 200;  // 不读本地文件，直接返回200
        }
    }
}
```



**测试结果**
1、单 worker 场景，当连接数超过 500 时，QPS提升 20% 以上。
2、connection 固定 1000，worker 数目在 8 以下时，QPS 有 20% 左右的提升。随着 worker 数目增大，收益逐渐降低。
3、短连接场景，io uring 相对于 event poll 非但没有提升，甚至在某些场景下有 5%~10% 的性能下降。究其原因，除了 io uring 框架本身带来的开销以外，还可能跟 io uring 编程模式下请求批量下发带来的延迟有关。



**单worker，连接数变化，长连接QPS对比**
![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/67250/1596609165276-76447279-eee8-4eb0-ac52-f3b9d85bba1d.png)



**连接数固定，nginx worker变化，长连接QPS对比**
![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/67250/1596611657568-59c0b7c6-70c2-406c-90cd-5d521a6f7c2b.png)



**短连接QPS对比**
![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/67250/1596611176527-895679ea-eec8-485f-972e-1000be8be6c8.png)





#### 项目仓库

https://github.com/OpenAnolis/nginx