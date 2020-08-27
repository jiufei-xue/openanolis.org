---
title: "快速上手"
aliases: "/ali-diagnose/docs/QuickStart"
---


## 1.快速上手

建议在 Centos 7.5/7.6 版本中进行实验。

**第一步、使用如下命令clone代码：**

```git clone https://github.com/alibaba/diagnose-tools.git```

**第二步、在diagnose-tools目录中运行如下命令初始化编译环境：**

```
make devel        # 安装编译过程中需要的包

make deps         # 编译依赖库，目前主要是编译java agent，以支持用户态java符号表解析
```

**第三步、编译工具：**

```make```

这一步实际上会完成rpm的安装，你也可以用如下命令分别完成相应的工作：

```
make module       # 编译内核模块

make tools        # 编译用户态命令行工具

make java_agent   # 编译java agent

make pkg          # 制作rpm安装包
```
**第四步、测试**

```make test```

不清楚的地方，加我的微信：linux-kernel

**pupil**：按照tid查询特定线程在主机上的PID/进程名称/进程链/堆栈等等。

**sys-delay**：监控syscall长时间运行引起调度不及时。间接引起系统Load高、业务RT高。

**sys-cost**：统计系统调用的次数及时间。

**sched-delay** : 监控系统调度延迟。找到引起调度延迟的进程。

**irq-delay**：监控中断被延迟的时间。

**irq-stats**：统计中断/软中断执行次数及时间。

**irq-trace**：跟踪系统中IRQ/定时器的执行。

**load-monitor**：监控系统Load值。每10ms查看一下系统当前Load，超过特定值时，输出任务堆栈。
这个功能多次在线上抓到重大BUG。
可以分别监控Load/Load.R/Load.D/Task.D等指标。

**run-trace**：监控进程在某一段时间段内，在用户态/内核态运行情况。

**perf**: 对线程/进程进行性能采样，抓取用户态/内核态调用链。

**kprobe**：在内核任意函数中，利用kprobe监控其执行，并输出火焰图。

**uprobe**：在用户态应用程序中使用探针，在应用中挂接钩子。

**utilization**：监控系统资源利用率，找到CPU被哪些野进程干扰，以及进程对内存的使用情况。

**exit-monitor**：监控任务退出。在退出时，打印任务的用户态堆栈信息。

**mutex-monitor**：监控长时间持有mutex的流程。

**exec-monitor**: 监控进程调用exec系统调用创建新进程。

**alloc-top**：统计内存分配数量，按序输出内存分配多的进程

**high-order**：监控分配大内存的调用链

**drop-packet**：监控内核TCP/IP各个流程中的丢包。

**tcp-retrans**：监控TCP/IP套接字上的重传。

**ping-delay**：监控ping报文在内核中的路径，确认影响报文延迟的原因。

**rw-top**：监控写文件。找到突发引起文件读写的进程/调用链。

**fs-shm**：本功能监控当前打开的SHM文件。

**fs-orphan**：导出文件系统孤儿节点。

**fs-cache**：监控文件系统缓存占用情况，统计每个文件占用的缓存数量。