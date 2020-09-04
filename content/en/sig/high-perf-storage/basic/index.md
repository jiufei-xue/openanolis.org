---
title: "io_uring 基础技术"
aliases: "/aliyun -acts/docs/Cloud-Linux-Os"
---

### io_uring

#### 项目介绍

io_uring 是由 block 维护者 Jens Axboe 开发的新异步 IO 框架。io_uring 在 2019 年 1 月初提出，到 2019 年 3 月初合并到 Linux 内核主线，仅用短短的 2 个月时间就合入了 Linux v5.1，充分表明了社区对该框架的积极态度。当前社区发展非常火热，很多主流应用都开始提供对 io_uring 的支持。

#### 项目文档

###### io_uring 原理介绍

为了从根本上解决当前 Linux aio 存在的问题和约束，io_uring 从零开始全新设计的了异步 IO 框架。其设计的主要目标如下：
1、简单易用，方便应用集成。
2、可扩展，不仅仅为 block IO 使用，同样可以用于网络 IO。
3、特性丰富，满足所有应用，如 buffer io。
4、高效，尤其是针对大部分场景的 512 字节或 4K IO。
5、可伸缩，满足峰值场景的性能需要。

io_uring 为了避免在提交和完成事件中的内存拷贝，设计了一对共享的 ring buffer 用于应用和内核之间的通信。其中，针对提交队列（SQ），应用是 IO 提交的生产者（producer），内核是消费者（consumer）；反过来，针对完成队列（CQ），内核是完成事件的生产者，应用是消费者。



![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/65019/1596421089153-25a2d719-f81d-4916-9073-f6d1a8493d74.png)



共享环的设计主要带来以下 3 个好处：
1、提交、完成请求时节省应用和内核之间的内存拷贝；
2、使用 SQPOLL 高级特性时，应用程序无需调用系统调用；
3、无锁操作，用 memory ordering 实现同步。

##### io_uring 系统调用

```
/**
 * io_uring_setup - setup a context for performing asynchronous I/O
 *
 * The io_uring_setup() system call sets up a submission queue (SQ) and completion queue (CQ) with at least
 * entries entries, and returns a file descriptor which can be used to perform subsequent operations on the 
 * io_uring instance.  The submission and completion queues are shared between userspace and the kernel,
 * which eliminates the need to copy data when initiating and completing I/O.
 */
int io_uring_setup(u32 entries, struct io_uring_params *p);

/**
 * io_uring_enter - initiate and/or complete asynchronous I/O
 *
 * io_uring_enter() is used to initiate and complete I/O using the shared submission and completion queues
 * setup by a call to io_uring_setup(2).  A single call can both submit new I/O and wait for completions of I/O
 * initiated by this call or previous calls to io_uring_enter().
 */
int io_uring_enter(int fd, unsigned int to_submit, unsigned int min_complete,
                   unsigned int flags, sigset_t *sig)

/**
 * io_uring_register - register files or user buffers for asynchronous I/O
 *
 * The io_uring_register() system call registers user buffers or files for use in an io_uring(7) instance referenced 
 * by fd.  Registering files or user buffers allows the kernel to take long term references to internal data 
 * structures or create long term mappings of application memory, greatly reducing per-I/O overhead.
 */
 int io_uring_register(int fd, unsigned int opcode, void *arg,
                      unsigned int nr_args)
```



- 支持的异步操作

**ORING_OP_NOP**
仅产生一个完成事件，除此之外没有任何操作。

**IORING_OP_READV / IORING_OP_WRITEV**
异步方式提交 readv() / writev() 请求，大多数场景最核心的操作，类似 preadv2 / pwritev2。

**IORING_OP_FSYNC**
异步下发 fsync() 调用，注意这里并不能保证下发 fsync() 之前的写请求一定先完成，需要额外通过标记 IOSQE_IO_DRAIN 来实现。

**IORING_OP_READ_FIXED / IORING_OP_WRITE_FIXED**
使用已注册的 buffer 来提交 IO 操作，由于这些 buffer 已经完成映射，可以降低系统调用的开销。

**IORING_OP_POLL_ADD / IORING_OP_POLL_REMOVE**
使用 IORING_OP_POLL_ADD 可对一组文件描述符执行 poll() 操作，可以使用 IORING_OP_POLL_REMOVE 显式地取消 poll()。注意，其工作方式为 one shot，即一旦 poll 操作完成，需要重新提交。

**IORING_OP_SYNC_FILE_RANGE**
执行 sync_file_range() 调用，是对 fsync() 的一个增强。

**IORING_OP_SENDMSG / IORING_OP_RECVMSG**
基于 sendmsg() 和 recvmsg() 提供异步收发网络包功能。

**IORING_OP_TIMEOUT / IORING_OP_TIMEOUT_REMOVE**
用户态程序等待 IO 完成事件时，可以通过 IORING_OP_TIMEOUT 设置一个超时时间，类似 io_getevents(2) 的 timeout 机制。

**IORING_OP_ACCEPT**
异步 accept4()。

**IORING_OP_ASYNC_CANCEL**
尝试取消 in-flight 的异步上下文中的请求。通常可中断的请求如 socket IO 无论是否已经开始运行都将被取消，而 block IO 请求只能取消尚未开始的请求。

**IORING_OP_LINK_TIMEOUT**
类似 IORING_OP_TIMEOUT，IORING_OP_LINK_TIMEOUT 仅针对特定的 linked SQE（IOSQE_IO_LINK）。

**IORING_OP_CONNECT**
异步 connect()，调用者可通过 IORING_OP_POLL_ADD 来实现 connect 请求的异步等待。

**IORING_OP_FALLOCATE**
异步 fallocate()。

**IORING_OP_OPENAT / IORING_OP_CLOSE / IORING_OP_OPENAT2**
异步openat()，close()，openat2()。

**IORING_OP_FILES_UPDATE**
IORING_REGISTER_FILES_UPDATE 的异步替代方案。

**IORING_OP_STATX**
异步 statx()。

**IORING_OP_READ / IORING_OP_WRITE**
异步方式提交 read / write 请求，是 IORING_OP_READV / IORING_OP_WRITEV 的 non-vectored 版本。

**IORING_OP_FADVISE / IORING_OP_MADVISE**
异步 posix_fadvise() / madvise。

**IORING_OP_SEND / IORING_OP_RECV**
异步 send() / recv()。

**IORING_OP_EPOLL_CTL**
增加，删除或修改 epoll 的事件列表。

**IORING_OP_SPLICE**
异步 splice()。

**IORING_OP_PROVIDE_BUFFERS / IORING_OP_REMOVE_BUFFERS**

**IORING_OP_TEE**
异步 tee()。



- 相关文档

[Efficient IO with io_uring](http://kernel.dk/io_uring.pdf)
[Linux异步IO新时代：io_uring](https://kernel.taobao.org/2019/06/io_uring-a-new-linux-asynchronous-io-API/)
[下一代异步 IO io_uring 技术解密](https://mp.weixin.qq.com/s?__biz=MzUxNjE3MTcwMg==&mid=2247484537&idx=1&sn=21d3104fd80fa2474a3770bf4b4b814f)



#### 项目仓库

https://github.com/OpenAnolis/cloud-kernel

### liburing

#### 项目介绍

liburing 提供 io_uring 的用户态库，方便用户操作 io_uring 实例。通过 liburing 库，应用无需了解诸多 io_uring 的细节就可以简单地使用起来。例如，无需担心 memory barrier，或者是 ring buffer 管理之类等。



#### 项目文档

用户需安装 liburing 和 liburing-devel 包以使用 io_uring，相关接口在头文件 /usr/include/liburing.h 中定义。

```
sudo yum install liburing liburing-devel
```



基于 liburing 的一个 helloworld 示例如下：

```
#include <unistd.h>
#include <fcntl.h>
#include <string.h>
#include <stdio.h>
#include <liburing.h>

#define ENTRIES     4

int main(int argc, char *argv[])
{
    struct io_uring ring;
    struct io_uring_sqe *sqe;
    struct io_uring_cqe *cqe;
    struct iovec iov = {
        .iov_base = "Hello World",
        .iov_len = strlen("Hello World"),
    };
    int fd, ret;

    if (argc != 2) {
        printf("%s: <testfile>\n", argv[0]);
        return 1;
    }

    /* setup io_uring and do mmap */
    ret = io_uring_queue_init(ENTRIES, &ring, 0);
    if (ret < 0) {
        printf("io_uring_queue_init: %s\n", strerror(-ret));
        return 1;
    }

    fd = open("testfile", O_WRONLY | O_CREAT);
    if (fd < 0) {
        printf("open failed\n");
        ret = 1;
        goto exit;
    }

    /* get an sqe and fill in a WRITEV operation */
    sqe = io_uring_get_sqe(&ring);
    if (!sqe) {
        printf("io_uring_get_sqe failed\n");
        ret = 1;
        goto out;
    }

    io_uring_prep_writev(sqe, fd, &iov, 1, 0);

    /* tell the kernel we have an sqe ready for consumption */
    ret = io_uring_submit(&ring);
    if (ret < 0) {
        printf("io_uring_submit: %s\n", strerror(-ret));
        goto out;
    }

    /* wait for the sqe to complete */
    ret = io_uring_wait_cqe(&ring, &cqe);
    if (ret < 0) {
        printf("io_uring_wait_cqe: %s\n", strerror(-ret));
        goto out;
    }

    /* read and process cqe event */
    io_uring_cqe_seen(&ring, cqe);

out:
    close(fd);
exit:
    /* tear down */
    io_uring_queue_exit(&ring);
    return ret;
}
```



- 相关文档

[Liburing README](https://github.com/axboe/liburing/blob/master/README)
[Efficient IO with io_uring](http://kernel.dk/io_uring.pdf)



#### 项目仓库

https://github.com/OpenAnolis/liburing



### fio

#### 项目介绍

fio 的全称是 flexible I/O tester，是常用的磁盘性能测试工具。fio 通过产生一系列的线程或进程来执行用户指定的特定类型 IO 操作。典型的用法是用户将需要模拟的 IO 负载写入到 job file 中。fio 支持多种 IO 引擎，通过 ioengine=io_uring，我们可以在 fio 中使用 io_uring 接口来测试磁盘性能。

#### 项目文档

用户需要安装 fio-3.17 以使用 io_uring 引擎。

```
sudo yum install -y alinux-release-experimentals
sudo yum install -y fio-3.17
```



使用 io_uring 的示例如下：

```
fio -name=iouring_test -filename=/mnt/vdd/testfile -iodepth=128 -thread -rw=randread -ioengine=io_uring -sqthread_poll=1 -direct=1 -bs=4k -size=10G -numjobs=1 -runtime=120 -group_reporting
```



- 普通 ECS

测试环境：ecs.i2.2xlarge，8 vCPU 64 GiB，I2 本地存储 1788 GiB。
1、默认模式下，略微提升。
2、开启 sqthread_poll 后，顺序读写提升很明显，达到 160% ~ 170%；随机读写提升 30% ~ 150%。



**4k 顺序读**



![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/65019/1596502912878-f9bace59-a66c-4ed7-b17f-a09a21f4a22a.png)

**4k 顺序写**

![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/65019/1596502921003-eb954869-3156-43bf-b7c3-d9b74654a69a.png)



​																								**4k 随机读**



![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/65019/1596502927554-4f950c25-186f-4a83-ad3b-c40ac2d38fe8.png)

​                                                                                                **4k 随机写**

![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/65019/1596502934554-3204d542-189c-4521-b45e-3cfad0d8cf8e.png)



- 神龙裸金属

测试环境：神龙裸金属实例，96 CPU 503 G，本地盘为三星 PM963。
1、开启 iopoll 后，基本与 SPDK 接近。

**4k 随机读**

![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/65019/1596503008418-c94b846c-ee1b-46d9-92b7-1ebcc871ce38.png)



##### 相关文档

[Fio README](https://github.com/axboe/fio/blob/master/README)
[io_uring 新异步 IO 机制，性能提升超 150%，堪比 SPDK](https://mp.weixin.qq.com/s?__biz=MzUxNjE3MTcwMg==&mid=2247484448&idx=1&sn=29e791cf602b8614c9d288c1859407f7)



#### 项目仓库

https://github.com/OpenAnolis/fio
