
---
title: "基础环境配置"
aliases: "/aliyun -tracer/docs/basic"
---



## 2.1系统配置

### 2.1.1时区配置

2.1.1.2 硬件时钟

Linux 系统中存在两种时钟，硬件时钟 (hardware clock) 与系统时钟 (system time)。

硬件时钟又称为 RTC (Real Time Clock)，在以下描述中 RTC 时间与硬件时钟具有相同概念。硬件时钟拥有独立的电源控制电路，因而在系统断电后可以使用内部的独立电源保持工作，在系统启动后会读取硬件时钟的计数，以设置系统时钟。

通常使用 hwclock 命令获取或设置硬件时钟。

 

**硬件时钟的时间标准**

在了解 hwclock 的具体命令之前，我们有必要了解一下硬件时钟采用的时间标准。

RTC 硬件实际上只是维护一个 RTC 计数，其本身并不带有任何时间标准，因而 RTC 时间本身并没有任何意义，并不能描述墙上时间 (wall time)。但是 hwclock 命令默认需要输出墙上时间，因而 hwclock 必须为 RTC 时间增加一个属性，即RTC 时间采用的时间标准。

hwclock 将这些属性保存在 /etc/adjtime 文件，该文件的第三行描述了 RTC 时间使用的时间标准，支持 local time 与 UTC 两种时间标准，hwclock 即根据其指定的时间标准，来解读 RTC 时间。

```
1 0.0 0 0.0

2 0

3 LOCAL
```

·    "LOCAL" 表示按照 local time 时间标准解读 RTC 时间，即认为当前 RTC 时间为 local time 格式。

·    "UTC" 表示按照 UTC 时间标准解读 RTC 时间，即认为当前 RTC 时间为 UTC 格式，即此时 RTC 时间为 0 时区的时间，需要根据当地所在的时区，计算当地的 local time。

为了防止 time zone 或 DST 切换导致的计时问题，通常推荐 RTC 时间采用 UTC 时间标准。

 

**获取硬件时钟**

使用如下命令获取 RTC 时间，其按照 /etc/adjtime 文件中指定的时间标准解读 RTC time，并总是输出为 local time 标准。

```
1 hwclock

2 hwclock -r[--show]
```

其输出格式为

1 Sat 27 Apr 2019 10:46:08 AM CST -0.781827 seconds

此外也可以显式地设置使用哪种时间标准，而不是 /etc/adjtime 文件中指定的时间标准来解读 RTC time，但是总是按照 local time 标准输出，同时该命令不会修改 /etc/adjtime 文件中指定的时间标准。

```
hwclock [-u[--utc], --local]

·    --utc 按照 UTC 标准解读 RTC time
·    --local 按照 localtime 标准解读 RTC time
```

**设置硬件时钟**

使用如下命令设置 RTC 时间，--date 参数后面跟着的时间总是 local time 标准，hwclock 会根据 /etc/adjtime 文件中指定的时间标准，以及用户通过 --date 参数指定的时间，计算 RTC 时间的调整量，从而更新 RTC time

```
hwclock --set --date="yyyy-mm-dd HH:MM:SS"
```

该命令的格式例如

```
hwclock --set --date="2011-08-14 16:45:05"
```

此外也可以在该命令后加上 --utc 或 --local 参数，以显式地更改 /etc/adjtime 文件中使用的时间标准

```
hwclock --set --date="yyyy-mm-dd HH:MM:SS" [-u[--utc], --local]

·    --utc 将 /etc/adjtime 文件中指定的时间标准修改为 UTC 标准
·    --local 将 /etc/adjtime 文件中指定的时间标准修改为 localtime 标准
```

**与系统时钟同步**

使用以下命令，使用硬件时钟来同步系统时钟。

```
hwclock --hctosys
```

使用以下命令，使用系统时钟来同步硬件时钟。

```
hwclock --systohc
```

 

2.1.1.3 系统时钟

系统时钟 是 Linux 内部维护的一个时钟，格式为自 epoch (since 1970) 的秒数（包含秒与纳秒），系统时钟的格式总是 UTC 时间标准。

通常使用 date 或 timedatectl 管理系统时钟。

 

**使用 date 管理系统时钟**

date 是 coreutils 包的一部分，可以用于管理系统时钟。

 

**获取系统时钟**

使用如下命令获取当前的系统时钟，输出的系统时钟格式为 local time 时间标准。

```
date
```

输出格式如下

```
Mon May 13 19:15:14 CST 2019
```

date 默认总是以 local time 标准显示系统时钟，用户也可以显式地指定以 UTC 标准显示输出的系统时钟，此时实际显示时区 0 的 local time。

```
date -u[--utc]
```

输出格式如下

```
Mon May 13 11:15:14 UTC 2019
```

此外用户也可以指定输出的特定格式。

```
date +""format
```

例如

date +"%Y-%m-%d %H:%M"

```
2016-09-16 17:30
```

 

**设置系统时钟**

使用如下命令设置系统时钟，此时按照 local time 时间标准解读 "YYYY-MM-DD HH:MM:SS" 参数。

```
date --set YYYY-MM-DD HH:MM:SS
```

此外用户也可以显式指定按照 utc 时间标准解读 "YYYY-MM-DD HH:MM:SS" 参数。

```
date --set YYYY-MM-DD HH:MM:SS --utc
```

 

**使用 timedatectl 管理系统时钟**

timedatectl 是 systemd 包的一部分，可以用于同时管理硬件时钟与系统时钟。

 

2.1.1.3.2.1 获取系统时钟

timedatectl

```
Local time: Mon 2019-05-13 19:27:54 CST

 Universal time: Mon 2019-05-13 11:27:54 UTC

 RTC time: Mon 2019-05-13 11:27:54

 Time zone: Asia/Shanghai (CST, +0800)

 NTP enabled: yes

 NTP synchronized: yes

 RTC in local TZ: yes

 DST active: n/a
```

 

**设置系统时钟**

使用如下命令可以同时设置硬件时钟与系统时钟，相当于依次运行 date --set 与 hwclock --systohc，此时默认按照 UTC 时间标准解读 "YYYY-MM-DD HH:MM:SS"。

```
timedatectl set-time YYYY-MM-DD HH:MM:SS
```

timedatectl 默认按照 UTC 时间标准解读 "YYYY-MM-DD HH:MM:SS"，用户也可以显式指定按照 local time 标准进行解读。

```
timedatectl set-local-rtc <boolean>
```

例如关闭 NTP 服务。

```
timedatectl set-ntp boolean
```

 

2.1.1.4 时区

当硬件时钟与系统时钟采用 UTC 时间标准时，其维护的时间其实是时区 0 的 local time，必须根据本地所在的时区，才能计算本地的 local time。

/usr/share/zoneinfo/ 目录下以主要城市的形式组织所有的时区，其中每个文件描述一个对应的时区

```
1 # cat /usr/share/zoneinfo/Asia/Shanghai]

2 ...

3 CST-8
```

同时 /etc/localtime 实际指向 /usr/share/zoneinfo/ 目录下的其中一个文件，以描述系统当前所在的时区。

ls -l /etc/localtime

```
lrwxrwxrwx. 1 root root 35 Mar 27 10:13 /etc/localtime -> ../usr/share/zoneinfo/Asia/Shanghai
```

 

**显示所有时区**

使用如下命令显示所有的时区。

timedatectl list-timezones

例如

timedatectl list-timezones

```
Africa/Abidjan

Africa/Accra

Africa/Addis_Ababa

Africa/Algiers

Africa/Asmara

Africa/Bamako

Africa/Bangui
```

 

**设置时区**

可以通过手动改变 /etc/localtime 指向的 timezone 文件，以改变系统当前的时区。

```
unlink /etc/localtime

ln -s /usr/share/zoneinfo/GB /etc/localtime
```

也可以使用 timedatectl 命令设置系统的时区，其中 <time_zone> 必须为 timedatectl list-timezones 的输出格式。

```
timedatectl set-timezone <time_zone>
```

例如

```
timedatectl set-timezone Europe/Prague
```

 

**时间同步服务**

系统可以使用 NTP 服务实现系统时钟的自动同步，使用以下命令开启或关闭 NTP 服务。

1 timedatectl set-ntp no

 

## 2.2软件包源配置

yum (Yellow dog Updater, Modified) 是 Fedora、RedHat 以及 SuSE 使用的 rpm 包管理器，其能够从指定的服务器自动下载特定软件及其所有依赖软件的RPM包并且安装，从而自动处理依赖关系。

rpm 命令只是知晓软件的依赖关系，若当前安装软件所依赖的软件尚未安装时，rpm 只是会提示用户并中断执行过程；而 yum 则会解析软件的依赖关系，并自动安装所依赖的软件。

### 2.2.1配置yum

2.2.1.1 /etc/yum.conf

yum 的配置文件主要为 /etc/yum.conf，文件主要包含 main section 与 repository section 两部分。

**main section**

[main] section 定义了 yum 的全局参数。

```
 1 [main]
 2 cachedir=
 3 logfile=
 4 keepcache=0
 5 debuglevel=2
 6 exactarch=1
 7 obsoletes=1
 8 plugins=0
 9 installonly_limit=3
10 reposdir=
11 retries=5
```

reposdir 描述了 .repo 文件所在的目录，默认为 /etc/yum.repos.d/，该目录下的 .repo 文件用于描述系统使用的 yum 源。

tsflags 描述 transaction flags。

```
tsflags='noscripts, notriggers, nodocs, test, justdb, nocontexts'
```

override_install_langs 用于替换 _install_langs 宏，可以用于只安装指定的 locale 文件。

```
override_install_langs=en_US.utf
```

**repository section**

除了通过 reposdir 字段描述的目录下的 .repo 文件来描述 yum 源，还可以直接在 /etc/yum.conf 文件的 repository section 描述

```
[repository]

name=repository_name

baseurl=repository_url

mirrorlist=
```

其中

·    repository 字段即为 yum 源的 ID

·    baseurl 字段描述 yum 源的 url 地址

·    mirrorlist 字段指向网络上的一个文件，该文件中包含了多个 url 地址，每个 url 地址都描述该 yum 源的一个镜像；当指定 mirrorlist 字段时，可以指定或不指定 baseurl 字段。

**/etc/yum.repos.d/**

/etc/yum.repos.d/ 目录下为每个 yum 源维护一个 .repo 文件，yum 运行过程中会扫描该目录下的所有 .repo 文件，从而构建当前系统使用的所有 yum 源。

### 2.2.2添加、启用和禁止yum源

yum-utils 工具用于管理 /etc/yum.repos.d/ 目录下的 .repo 文件。

使用如下命令显示所有使能的 yum 源。

```
yum repolist
```

使用如下命令添加 yum 源，该命令会下载 --add-repo 参数指定的 .repo 文件，并保存在 /etc/yum.repos.d/ 目录下。

```
yum-config-manager --add-repo=http://yum.oracle.com/public-yum-ol7.repo
```

使用如下命令使能 yum 源，--enable 参数用于指定需要使能的 yum 源。

```
yum-config-manager --enable ol7_developer
```



### 2.2.3使用yum管理软件包

2.2.3.1 查询

列出所有 yum 源中提供的所有软件。

```
yum list
```

此外 yum list 也可以使用通配符，例如 yum list pam* 输出 yum 源提供的所有名称以 "pam" 开头的软件。

输出所有已安装的软件。

```
yum list installed
```

查找 yum 源提供的某个关键词相关的所有软件。

```
yum search <package>
```

根据yum search返回的包的名称，之后就可以查询特定包的相关信息，包括包的版本、具体描述等。

```
yum info <package>
```

 

2.2.3.2 安装

根据包的名称安装特定的包。

```
yum install <package>
```

 

2.2.3.3 删除
 根据包的名称卸载特定的包。

1 yum remove <package>

 

2.2.3.4 升级

检查当前已安装的包中哪些包可以更新。

```
yum check-update
```

yum update 与 yum upgrade 都用于升级包，区别在于 yum upgrade 在升级之后会删除一些 obsolete 的包，而 yum update 则不会。

```
yum update <software> 

yum upgrade <software>
```

升级所有包。

```
yum update
```

 