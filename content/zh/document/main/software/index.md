---
title: "5. 软件管理"
aliases: "/aliyun -tracer/docs/software"
---

Alibaba Cloud Linux 2 采用RPM（Red Hat Package Manager）包管理系统，使用命令rpm、yum能够方便的进行查询，安装，升级及删除等软件管理操作。

[注] yum命令操作前提需要配置正确的yum源，yum源的配置请参考“2.2软件包源配置”章节。

 

## 5.1软件查询

可以使用rpm或yum命令来方便的查询软件包的版本、安装日期、软件许可证类型、签名信息以及软件包简介等诸多信息。也可以方便的查询系统中已经安装的软件包列表，配置的yum源中可以安装的软件包列表等信息。

### 5.1.1查询软件包信息

·    可以使用rpm命令 -q 选项来查询指定已安装软件包的详细信息：

 rpm -qi <package-name> ...

例如：

```
 1 # rpm -qi aliyun-cli

 2 Name    : aliyun-cli

 3 Version   : 3.0.24

 4 Release   : 1.al7

 5 Architecture: x86_64

 6 Install Date: Thu 29 Aug 2019 01:58:47 PM CST

 7 Group    : Development/Tools

 8 Size    : 24595975

 9 License   : ASL 2.0

10 Signature  : RSA/SHA256, Wed 28 Aug 2019 11:19:21 AM CST, Key ID eb801c41873141a8

11 Source RPM : aliyun-cli-3.0.24-1.al7.src.rpm

12 Build Date : Mon 26 Aug 2019 11:43:27 AM CST

13 Build Host : e69b16555.et15sqa

14 Relocations : (not relocatable)

15 Packager  : Alibaba Cloud Linux OS Team <alicloud-linux-os@service.alibaba.com>

16 Vendor   : Alibaba Cloud

17 URL     : https://github.com/aliyun/github.com

18 Summary   : Aliyun Command Line Interface

19 Description :

20 The Alibaba Cloud CLI is a tool to manage and use Alibaba Cloud resources through a command line interface.
```

 

·    也可以使用 yum info 命令来查询一个或多个软件包信息：

```
 yum info <package-name> ...
```

例如：

```
 1 # yum info aliyun-cli

 2 Loaded plugins: fastestmirror

 3 Loading mirror speeds from cached hostfile

 4 Installed Packages

 5 Name    : aliyun-cli

 6 Arch    : x86_64

 7 Version   : 3.0.24

 8 Release   : 1.al7

 9 Size    : 23 M

10 Repo    : installed

11 From repo  : plus

12 Summary   : Aliyun Command Line Interface

13 URL     : https://github.com/aliyun/github.com

14 License   : ASL 2.0

15 Description : The Alibaba Cloud CLI is a tool to manage and use Alibaba Cloud resources through a command line interface.

 
```



### 5.1.2查询软件包列表

·    可以使用rpm命名的 -qa 选项列印系统中已经安装的软件包列表：

```
 rpm -qa
```

·    也可以使用 yum list 命令来列印系统中已经安装的软件包列表：

```
 yum list installed
```

·    或者使用yum的list命令列出yum源所有可用的软件包：

```
# yum list [all]
```

 

### 5.1.3软件包组查询

Yum将功能相关的软件包组成一个软件包组，方便统一安装或卸载。可以通过 yum group 相关命令来查询yum源中提供的可用软件包组信息及列表.

·    查询yum源可用软件包组列表：

```
yum group list
```

例如：

```
 1 # yum group list

 2 Loaded plugins: fastestmirror

 3 There is no installed groups file.

 4 Maybe run: yum groups mark convert (see man yum)

 5 Loading mirror speeds from cached hostfile

 6 Available Environment Groups:

 7   Minimal Install

 8  Compute Node

 9  Infrastructure Server

10  File and Print Server

11  Basic Web Server

12  Virtualization Host

13  Server with GUI

14  GNOME Desktop

15  KDE Plasma Workspaces

16  Development and Creative Workstation

17 Available Groups:

18   Compatibility Libraries

19   Console Internet Tools

20   Development Tools

21   Graphical Administration Tools

22   Legacy UNIX Compatibility

23   Scientific Support

24   Security Tools

25   Smart Card Support

26   System Administration Tools

27   System Management

28 Done
```

 

·    查询一个或多个软件包组信息：

```
 yum group info <group-name> ...
```

例如：

```
 1 # yum group info "Security Tools"

 2 Loaded plugins: fastestmirror

 3 There is no installed groups file.

 4 Maybe run: yum groups mark convert (see man yum)

 5 Loading mirror speeds from cached hostfile

 6

 7 Group: Security Tools

 8 Group-Id: security-tools

 9  Description: Security tools for integrity and trust verification.

10  Default Packages:

11   +scap-security-guide

12  Optional Packages:

13   aide

14   hmaccalc

15   openscap

16   openscap-utils

17  scap-workbench

18  strongimcv

19  tncfhh

20  tpm-quote-tools

21  tpm-tools

22  trousers
```

 

## 5.2软件安装

Alibaba Cloud Linux 2系统支持多种软件包安装方式，常用有以下3种方式：

·    通过yum源安装

·    通过rpm包安装

·    通过源码包直接编译安装

### 5.2.1通过yum源安装软件

配置好yum源后，可以方便的使用 yum install 命令安装需要的软件包。安装前可以使用上一节的查询命令来查询要安装的软件包是否可用。

**注意！以下命令均需要root权限。**

·    安装指定软件包：

```
yum install <package-name>
```

例如：

```
 1 # yum install aliyun-cli

 2 Loaded plugins: fastestmirror

 3 Loading mirror speeds from cached hostfile

 4 Resolving Dependencies

 5 --> Running transaction check

 6 ---> Package aliyun-cli.x86_64 0:3.0.29-1.al7 will be installed

 7 --> Finished Dependency Resolution

 8

 9 Dependencies Resolved

10

11 =============================================================================================================

12  Package          Arch          Version            Repository      Size

13 =============================================================================================================

14 Installing:

15  aliyun-cli         x86_64         3.0.29-1.al7          plus         5.9 M

16

17 Transaction Summary

18 =============================================================================================================

19 Install 1 Package

20

21 Total download size: 5.9 M

22 Installed size: 25 M

23 Is this ok [y/d/N]:
```

注意，这里命令提示：

·    y 表示执行安装操作；

·    d 表示执行下载操作，不安装；

·    N 表示不执行任何操作。

·    可以使用 yum group install 来安装指定的软件包组：

```
 yum group install <group-name>
```

例如：

```
# yum group install "Development Tools"
```

 

### 5.2.2通过rpm包安装软件

可以通过yum命令，或rpm命令来直接安装下载的rpm软件包。虽然Alibaba Cloud Linux 2兼容CentOS等第三方rpm软件包，但推荐从Alibaba Cloud Linux 2官方yum源网站（http://mirrors.aliyun.com/alinux/2.1903/）下载安装。

·    通过rpm安装：

```
 rpm -ivh <rpm> # 安装指定的rpm包，并保留已经安装的版本
```

 或

```
 rpm -Uvh <rpm> # 安装指定的rpm包，同时删除已经安装的版本
```

[注] rpm 安装rpm软件包时不会自动安装依赖的软件包

·    通过yum安装：

```
 yum install <rpm>
```

[注] yum install 命令会自动安装rpm包需要的依赖软件。

 

### 5.2.3源码直接编译安装

直接源码安装请参照相应软件源码包中的安装说明操作，如源码中人README或INSTALL等文档提示。

 

## 5.3软件升级

**注意！以下命令均需要root权限。**

·    可以使用 yum update 命令来升级指定的软件包：

```
 yum update <package-name>
```

例如：

 

```
1 # yum update aliyun-cli

 2 Loaded plugins: fastestmirror

 3 Loading mirror speeds from cached hostfile

 4 Resolving Dependencies

 5 --> Running transaction check

 6 ---> Package aliyun-cli.x86_64 0:3.0.24-1.al7 will be updated

 7 ---> Package aliyun-cli.x86_64 0:3.0.29-1.al7 will be an update

 8 --> Finished Dependency Resolution

 9

10 Dependencies Resolved

11

12 ================================================================================================================================================

13  Package               Arch              Version                Repository           Size

14 ================================================================================================================================================

15 Updating:

16  aliyun-cli             x86_64             3.0.29-1.al7              plus             5.9 M

17

18 Transaction Summary

19 ================================================================================================================================================

20 Upgrade 1 Package

21

22 Total download size: 5.9 M

23 Is this ok [y/d/N]:
```

 

·    或者使用 yum update 命令来升级所有系统中所有已经安装的软件包到yum源最新版本：

1 yum update

 

## 5.4软件删除

**注意！以下命令均需要root权限。**

·    使用 yum remove 命令来删除指定的软件包：

```
yum [-y] remove <package-name> 
```

·    -y 选项会跳过确认直接执行删除超作。

例如：

```
 1 # yum remove aliyun-cli

 2 Loaded plugins: fastestmirror

 3 Resolving Dependencies

 4 --> Running transaction check

 5 ---> Package aliyun-cli.x86_64 0:3.0.24-1.al7 will be erased

 6 --> Finished Dependency Resolution

 7

 8 Dependencies Resolved

 9

10 =============================================================================================================

11  Package          Arch          Version            Repository       Size

12 =============================================================================================================

13 Removing:

14  aliyun-cli         x86_64         3.0.24-1.al7         @plus         23 M

15

16 Transaction Summary

17 =============================================================================================================

18 Remove 1 Package

19

20 Installed size: 23 M

21 Is this ok [y/N]:
```

·    使用 rpm group remove 命令来删除指定软件包组：

```
 yum group remove <group-name>
```

例如：

```
# yum group remove "Development Tools"
```

 

·    使用rpm命令 -e 选项来删除指定软件包：

```
 rpm -e <package-name>
```

例如：

```
# rpm -e aliyun-cli
```

[注] rpm -e 命令无确认提示，会直接执行删除操作。

 


