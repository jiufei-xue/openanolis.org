---
title: "Cloud Linux OS"
aliases: "/sofa-acts/docs/Cloud-Linux-Os"
---

## 1.现有开源，Linux 发新版开源

打通AliOS及开源Cloud Linux

## 2 容器镜像，dockerhub
操作系统作为软件分发渠道，Dragonwell开始，默认JDK，已经有Java docker image，侧重基础软件，社区用ACK + Aliyun Linux做方案

## 3. Aliyun Linux与K8S互操作认证，有利于社区，应该是PD来做，但不在晓贾的优先级里面。
是不是可以从社区来做。

## 4. guestOS  Vmware + OpenStack , zStack
VMware 闭源难以debug，已经有VMare OpenStack的guest driver/image，OpenStack支持：
我们是面向云的开源发行版，希望有更多的用户在云上使用，

**向蜜鸟**

和内部开源项目联合，作为分发渠道，我们有RPM 构建体系
但比如CLI没有痛点，用户要用会自己安装下载。但一旦我们的装机量上来了，他们就会主动基于Aliyun构建。

1.1 裸机ISO，等到有第三方合作伙伴

PRM包开放

镜像构建开源