---
title: "4. 网络配置"
aliases: "/aliyun -tracer/docs/network"
---

## 4.1网络配置工具介绍

Alibaba Cloud Linux使用 systemd-networkd 守护进程进行网络配置操作，用于替代传统操作系统服务 network.service , 它属于 systemd 软件包的一部分，默认安装于 Alibaba Cloud Linux操作系统中。

此外，用户还可以选择使用 systemd-resolvd 系统服务来管理网络名称解析(DNS)服务，注意如果用户在 systemd-networkd 的配置文件中指定了 DNS 相关的条目，则 systemd-resolvd 将成为必选服务。

### 4.1.1 服务的启动与停止

请注意，如果您并非处于本地登录连接环境中，请谨慎执行下列操作，以避免远程网络连接关闭无法操作服务器。

·    运行下列命令以启动网络守护进程：

```
sudo systemctl start systemd-networkd
```

·    运行下列命令以关闭网络守护进程：

```
sudo systemctl stop systemd-networkd
```

·    运行下列命令重新启动网络守护进程：

```
sudo systemctl restart systemd-networkd
```

·    运行下列命令默认开启网络守护进程：

```
sudo systemctl enable systemd-networkd

sudo systemctl disable network.service
```

·    运行下列命令默认关闭网络守护进程，使用旧的 network.service 网络服务：

```
sudo systemctl disable systemd-networkd

sudo systemctl enable network.service
```



### 4.1.2 networkctl 工具

systemd-networkd 提供了 networkctl 工具用于查看网络连接状态。

·    运行 networkctl list 命令可以查看当前操作系统中所有存在的网络连接状态：

```
$ networkctl list
```

```
 IDX LINK       TYPE        OPERATIONAL SETUP

 1 lo        loopback      carrier   unmanaged

 2 eth0       ether       routable  configured

 3 eth1       ether       degraded  configuring
```

·    运行 networkctl status <link> 命令可以查看某一个网络连接的详情：

 $ networkctl status eth0

```
 2: eth0

  Link File: n/a

Network File: /etc/systemd/network/10-eth0.network

​      Type: ether

​     State: routable (configured)

​     Path: pci-0000:00:03.0

​     Vendor: Red Hat, Inc.

​      Model: Virtio network device

  HW Address: 52:54:0b:ee:d3:21

​      MTU: 1500

   Address: 11.238.211.33

​        fe80::5054:bff:feee:d321

​    Gateway: 11.238.211.247 (Hangzhou H3C Technologies Co., Limited)

​      DNS: 10.101.0.1

​        10.101.0.17

​       10.101.0.33

​    Domain: system.mydomain.com

​        mydomainsite.net
```



## 4.2网卡配置

### 4.2.1 配置文件

不同于 network.service ，Alibaba Cloud Linux 2 的网络配置文件并非保存在 /etc/sysconfig/network-scripts/ 下面（该路径是由 initscripts 软件包维护的），而是存在于下列三处路径中：

\1. 本地管理员目录： /etc/systemd/network/

\2. 运行时环境目录（重启丢失）： /run/systemd/network

\3. 网络服务目录： /usr/lib/systemd/network

注意上述三处路径生效优先级依次递减，即本地管理员目录下的配置文件有最高生效权限；此外，若不同目录下有同名文件，则低优先级的目录中的配置文件内容将被忽略。

### 4.2.2 配置样例：静态网络

 1 $ cat /etc/systemd/network/20-eth0.network

```
[Match]

 Name=eth0

[Network]

 Address=11.238.211.33/24

  Gateway=11.238.211.247

  Domains=system.mydomain.com mydomainsite.net

  DNS=10.101.0.1

 DNS=10.101.0.17

 DNS=10.101.0.33
```



### 4.2.3 配置样例： DHCP 网络

```
 $ cat /etc/systemd/network/50-dhcp.network

 [Match]

 Name=eth*

 [Network]

 DHCP=ipv4
```

 

### 4.2.4 配置说明

·    网络配置目录下的文件必须以 .network 为后缀，其他后缀名的配置文件将会自动忽略；

·    配置文件必须指定 [Match] 字段，用于说明该配置生效于哪些设备。 Name 项指定了设备名称，可以使用空白符分隔多个设备，或使用通配符；

·    网络配置目录下的文件以字典序排列，配置依次生效，但后生效的配置文件不会覆盖同名的已经生效的配置文件。举例：在前两小节中分别配置了 eth0 为静态网络，通配所有 eth* 为 DHCP 网络，因为 eth0 静态网络配置文件先生效，因此不受之后 DHCP 网络配置影响，即使后者使用了通配符。

## 4.3路由配置

### 4.3.1 route / ip route 命令

传统的 route 命令（属于 net-tools 软件包）和 ip 命令（属于 iproute 软件包）仍然有效，可以使用这两个工具在运行时配置网络路由。

·    显示当前路由表

1 $ route

 2 Kernel IP routing table

 3 Destination   Gateway     Genmask     Flags Metric Ref  Use Iface

 4 default     gateway     0.0.0.0     UG  0   0    0 eth0

 5 11.238.211.0  0.0.0.0     255.255.255.0  U   0   0    0 eth0

 6

 7 # 或者

 8

 9 $ ip route show

10 default via 11.238.211.247 dev eth0 proto static

11 11.238.211.0/24 dev eth0 proto kernel scope link src 11.238.211.33

·    添加网关到默认路由

```
sudo route add default gw <gw_addr>
```

 # 或者

```
sudo ip route add default via <gw_addr>
```

 