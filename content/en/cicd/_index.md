---
layout: singlepage
title: 下载

---

### Alibaba Cloud Linux 2.1903 LTS 虚拟机镜像

下载专为 KVM 虚拟化环境提供的 Alibaba Cloud Linux 2.1903 长期支持(LTS) 版本的虚拟机镜像文件，可以快速搭建可用的虚拟机操作系统环境。

- 下载地址：http://mirrors.aliyun.com/alinux/image/
- 安装说明：https://help.aliyun.com/document_detail/155430.html

### Alibaba Cloud Linux 2.1903 容器镜像

下载可用于 Docker 等容器环境的镜像，可基于该容器镜像快速制作包含自定义应用程序的新镜像。

- 地址：registry.cn-hangzhou.aliyuncs.com/alinux/aliyunlinux:2.1903
- 获取镜像方法：docker pull registry.cn-hangzhou.aliyuncs.com/alinux/aliyunlinux:2.1903

### 源码下载

- 访问 mirrors.aliyun.com/alinux/2.1903/ 各个 source/SRPMS 子目录
- 系统内执行 `yumdownloader --source <pkg>` 下载源码