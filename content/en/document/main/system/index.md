---
title: "3.系统服务管"
aliases: "/aliyun -tracer/docs/system"
---

## 3.1 系统服务介绍

系统服务（system service）是指负责提供特定功能的系统程序，通常运行在后台。系统服务通常管理系统中比较重要的功能、接近底层的设备，举例来说，Alibaba Cloud Linux启用的系统服务有 chronyd, sshd, networkd 等，分别负责时间同步、远程登录、网络配置等。

## 3.2 系统服务管理方式

Alibaba Cloud Linux使用 systemd 作为系统服务管理器。

[systemd](https://freedesktop.org/wiki/Software/systemd/) 是 Linux 系统基础构建组件。systemd 提供一个系统和服务管理器，运行为 1 号进程，并负责启动系统其他程序。systemd 主要功能包括但不限于：支持任务并行化；利用 socket 和 dbus 接口激活服务；支持按需启动守护进程；利用 Linux cgroup 接口跟踪进程；维护挂载点和自动挂载点；基于事务依赖关系进行精密的服务控制。systemd 兼容 Sysv 和 LSB 启动脚本，能够很好地替代 sysvinit。systemd 还有诸多其他有用特性：日志记录守护程序；控制基本系统配置的实用程序，例如主机名，日期，区域设置；维护已登录用户和正在运行的容器和虚拟机的列表；管理系统帐户，运行时目录和设置；管理简单网络配置；网络时间同步；日志转发；名称解析等。

## 3.3 管理系统服务

监视和控制 systemd 的主要命令是 systemctl，该命令可用于查看系统状态和管理系统及服务。详见 systemctl(1)。其他一些辅助命令包括：

·    systemd-analyze，启动耗时分析

·    hostnamectl，主机信息管理

·    localectl，本地化管理

·    timedatectl，时区管理

·    loginctl，当前登录用户管理

systemd 可以管理所有系统资源，不同的资源统称为 Unit（单元）。单元可以描述如下内容：系统服务（.service）、挂载点（.mount）、sockets（.sockets） 、系统设备（.device）、交换分区（.swap）、文件路径（.path）、启动目标（.target）、由 systemd 管理的计时器（.timer）。详见 systemd.unit(5) 。

### 3.3.1 分析系统状态

·    枚举系统服务单元

激活的单元

```
 $ systemctl list-units
```



运行失败的单元

```
 $ systemctl list-units --failed
```



所有已安装的单元

```
 $ systemctl list-unit-files
```

·    查看系统服务单元状态

系统状态

```
 $ systemctl status
```



服务单元状态（以 sshd.service 为例）

```
 $ systemctl status sshd.service
```



服务进程状态（以 sshd 为例）

```
 $ systemctl status $(pidof sshd)
```



### 3.3.2 使用系统服务

启动单元：

```
 $ systemctl start <Unit>
```



停止单元：

```
 $ systemctl stop <Unit>
```

 

重启单元：

```
 $ systemctl restart <Unit>
```



杀死单元的所有进程

```
 $ systemctl kill <Unit>
```



重新加载单元配置：

```
 $ systemctl reload <Unit>
```



检查单元是否自动启动：

```
 $ systemctl is-enabled <Unit>
```



开机自动激活单元：

```
 $ systemctl enable <Unit>
```



取消开机自动激活单元：

```
 $ systemctl disable <Unit>
```

 