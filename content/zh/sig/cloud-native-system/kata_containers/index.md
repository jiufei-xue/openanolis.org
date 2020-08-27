---
title: "Kata Containers"
aliases: "/alinux2/docs/Open-Stack-Meaning"
---

### Kata Containers 项目介绍

项目主页： https://katacontainers.io/

Kata Containers 是由 OpenStack 基金会管理，但独立于 OpenStack 项目之外的容器项目。整合了来自 Intel Clear Containers  和 Hyper runV 的技术，使得容器拥有虚拟机般的安全性。致力于构建一个使用容器镜像以超轻量级虚机的形式创建容器的的标准实现。

Kata Containers 支持不同平台的硬件 （x86-64，arm等），符合 OCI (Open Container Initiative) 规范，同时还可以兼容 [Kubernetes](https://www.oschina.net/p/kubernetes) 的 CRI（Container Runtime Interface）接口规范。项目目前已包含多个配套组件代码库，包括 Runtime，Agent， Proxy，Shim，Kernel 等。

Kata Containers 通过使用硬件虚拟化来提供容器间隔离，每个 container/pod 都是作为一个轻量级 VM 启动的，有自己独有的内核。这也缩短了 Kata Containers 与传统 VM 的安全性和传统 Linux 容器的轻量级优点之间的差距。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/301940/1597914926147-5a0138d9-402d-4caa-9123-40b8f9a7d2b9.png?x-oss-process=image%2Fresize%2Cw_1500)

