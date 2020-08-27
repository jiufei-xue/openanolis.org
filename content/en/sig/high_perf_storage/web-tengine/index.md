---
title: "Web Tengine"
aliases: "/alinux2/docs/Web-Tengine"
---

本文档中提供了Web Tengine的使用工程。

## aliyun Linux 方案与原生Centos+Nginx
* [tengine项目](http://tengine.taobao.org)
* [tengine Github](https://github.com/alibaba/tengine)

Tengine项目没有内部Owner，归属中间件团队，有没有和service Mesh的落地场景？

个人贡献者：
http://wangfakang.github.io

没有解决方案和宣传主页材料

只有source tar 包的分发，没有PRM和容器分发

Tengine TCP 负载均衡，tengine默认不支持tcp转发，所以编译时加入tcp模块，也支持动态加载模块。

## 使用说明
服务端还需要调整一下系统的参数，在/etc/sysctl.conf中

* Fedora 上安装：
[Fedora](https://blog.51cto.com/12083623/2382140)
* CentOS7上安装：
[CentOS7](https://www.jianshu.com/p/0a2892028350)
* Ubuntu 上源码安装：

## Nginx的性能对比：
[性能对比报告](http://nx.alibaba-inc.com/repos/ecs-lab-32041-32041-32080-32239-32397-32723-32976-33164-33391-34224-34342-34729-36049-36049-36276-36786-36951-37106.html)

## dubbo qps性能

## 引用到Service Mesh
操作系统是最直接，最有效的分发渠道，你是如何统计使用量，如何聚齐用户社区的？

[Nginx开发从入门到精通](http://tengine.taobao.org/book/)