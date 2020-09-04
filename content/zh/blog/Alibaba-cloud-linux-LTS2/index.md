---
title: "Alibaba Cloud Linux 2 LTS 介绍"
author: "晓贾"
description: "Alibaba Cloud Linux 2 LTS 正式发布，提供更高性能和更多保障！"
categories: "Alibaba Cloud Linux"
tags: ["Alibaba Cloud Linux"]
date: 2020-08-19T15:00:00+08:00
cover: "/cover.jpeg"
---

在Alibaba Cloud Linux 2（原Aliyun Linux 2）上线一年之际阿里云对外正式发布Alibaba Cloud Linux 2 LTS版本。LTS版本的发布对于Alibaba Cloud Linux 2来说是一个重要的里程碑，标志阿里云将为Alibaba Cloud Linux 2提供长期支持、稳定的更新、更好的服务，为Alibaba Cloud Linux 2的客户提供更多保障。

Alibaba Cloud Linux 2 LTS版本发布后，阿里云将会为该版本提供长达5年的软件维护、问题修复服务，从**2019-03-27开始到2024-03-31结束**：包括：

- **免费的服务和支持**：Alibaba Cloud Linux 2的客户可以通过阿里云工单系统、钉钉或者社区等途径来寻求阿里云的免费支持服务。
- **软件持续更新和集成**：长达五年的维护周期，持续更新和集成软件，保证至少每4个月一次的更新节奏。
- **问题&CVE修复**：提供急速的问题和CVE修复支持
  ![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/jpeg/301940/1598862926834-c579d09d-aed2-448e-b3d7-e4e975db7d96.jpeg)
  本次发布的LTS版本更专注于性能的和稳定性的提升，包括：
- **启动优化**：对OS启动全流程做了优化，在原来Alibaba Cloud Linux 2的基础上启动性能再次优化40%，相比于其他OS启动时间减少60%；
- **运行时优化**：通过对调度、内存、文件系统等多个子系统进行了全方面的优化，使Alibaba Cloud Linux 2在多种benchmark的测试下相比其他OS有10%~30%的性能提升；
- **稳定性提升**：阿里云在对Alibaba Cloud Linux 2进行多方面的质量保障，并且经过阿里经济体应用的规模验证，及时发现问题并解决，保证了线上宕机率相比其他OS减少50%；
  ![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/jpeg/301940/1598862926871-6c00271f-47c4-4fa0-bf76-7907d47be227.jpeg)
  在提升性能和稳定性的同时，该版本还为用户提供了更多、更丰富的功能，包括：
- **多架构支持**：全面支持X86 CPU包括：INTEL CooperLake、IceLake；AMD Milan、Rome:HYGON。同时支持多款ARM CPU：Kunpeng、PHYTUIM；
  ![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/jpeg/301940/1598862926867-03a1b268-282d-4395-b9e1-4dc4c0219c7c.jpeg)
- **资源隔离特性增强**：Alibaba Cloud Linux 2在kernel本身就具备的namespace隔离能力的基础上，为容器混合部署场景提供更多的资源隔离手段，提升容器间的隔离性，保证了容器中应用的稳定性。
  ![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/jpeg/301940/1598862926874-01766640-93ff-4b1c-b058-f20c3f394f38.jpeg)
- **丰富的应用软件**：Alibaba Cloud Linux 2在集成了大量丰富的开源软件生态的同时，也将更多优秀的阿里巴巴经济体开源软件向客户开放，包括dragonwell、tengine、dragonfly等。
  ![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/jpeg/301940/1598862926882-83f78808-595d-4f0c-af98-59d1dc86ad35.jpeg)
  客户的数据安全是阿里云的生命线，安全防护一直是阿里云非常重视的技术，之前Alibaba Cloud Linux 2发布了中国首个CIS benchmark，而本次Alibaba Cloud Linux 2 LTS也发布了多个安全功能，包括：
- **自动修复方案 & 安全告警中心：**

1、Alibaba Cloud Linux 2 LTS为用户提供了自动CVE修复方案，只需要进行简单的配置即可为用户无感知的完成CVE安全漏洞的修复，极大的提升了系统的安全修复能力；

2、同时Alibaba Cloud Linux 2也发布了自己的安全告警中心，为用户提供CVE安全漏洞的跟踪、修复、记录。

![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/jpeg/301940/1598862926821-58b37e7c-0312-4a3a-92ce-6fca46eeac7c.jpeg)

- **可信解决方案**：Alibaba Cloud Linux 2 LTS还为用户提供了一套安全解决方案，为系统完整性提供安全基线并且能对非法篡改行为溯源，该方案通过组合了TPM2、IMA、内核模块签名等多种安全特性，实现了从芯片到关键应用的安全可信，可以提升系统整体的完全性防护能力。
  ![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/jpeg/301940/1598862926835-1fb3a94e-7734-4c04-8705-5c2d65aa03b9.jpeg)
  Linux操作系统是一个非常庞大而复杂的开源系统，整个系统的持续演进不仅仅需要专业的团队进行维护，也希望有更多的企业、个人和社区一起参与共建，帮助操作系统更好的服务更多的人，欢迎更多的朋友来使用Alibaba Cloud Linux 2 LTS，和我们一起发现问题、反馈问题、解决问题，将Alibaba Cloud Linux 2 LTS做的更好。