---
title: "7. 内核管理"
---

Alibaba Cloud Kernel内核作为Alibaba Cloud Linux 2的基础组件，对下管理所有硬件资源、对上为所有应用软件提供系统管理接口，是所有应用软件的基础。Alibaba Cloud Linux 2选用Linux Kernel LTS版本4.19为基础，在兼容大部分基础软件的前提下进行了大量定制优化，来 保证云上最佳的用户体验。下面主要介绍一些内核常用使用方法。

## 7.1 内核版本查看、升级、降级方法

### 7.1.1 内核版本查看

查看内核版本查看方法主要使用uname命令，可以查看内核版本、发布信息、硬件平台信息等。

**uname**

常用选项组合为：

列出内核所有版本信息

```
uname -a
```

单独列出内核发布版本信息

```
uname -r
```

单独列出内核发布时间信息

```
 uname -v
```



### 7.1.2 内核升级、降级方法

Alibaba Cloud Linux 2使用yum进行kernel包的管理。

**yum**

常用升降级方法：

将内核升级到最新支持的内核版本

```
 sudo yum update kernel
```

历史内核版本查询

```
 sudo yum --showduplicates list kernel 
```

将内核升级或者降级到指定内核版本

```
 sudo yum install kernel-<version>.x86_64 // version参见上面查询到的内核版本信息
```

 

 

## 7.2 自定义内核

对于内核使用，很多用户可能会有一些不同的诉求，希望通过自己的定制来使用一些新的功能、新的优化，所以本节介绍一下如何自定义Alibaba Cloud Kernel：

下载内核：

安装源代码yum源

```
 sudo yum install -y alinux-release-source
```

安装源码下载工具

```
 sudo yum install -y yum-utils
```

下载内核源代码

```
 sudo yumdownloader --source kernel //也可以指定kernel版本号
```

 

修改源码和编译 

安装内核源码rpm

```
 rpm -idv kernel-<version>.src.rpm
```

进入对应源码目录修改源代码

使用rpmbuild命令编译出新的kernel rpm

```
 rpmbuild -bb /root/rpmbuild/SPEC/kernel.spec
```

 