---
title: "社区贡献指南"
---

### 目录

<!--报告 BUG-->

<!--报告安全漏洞-->

<!--报告崩溃事件-->

<!--报告一般 BUG-->

<!--报告 Alibaba Cloud Linux 操作系统 BUG-->

<!--帮助改进项目-->

<!--获取内核源码-->

<!--构建内核-->

<!--提交补丁-->



### 1 报告 BUG

参与本项目最直接的方式就是使用 Cloud Kernel 和 Alibaba Cloud Linux 操作系统并向我们报告使用中遇到的 BUG. 不过在提交 BUG 报告之前，需要先了解一些基本原则：

##### 1.1 报告安全漏洞

我们欢迎来自安全领域的研究专家向我们提交内核及操作系统方面的漏洞报告，然而我们不鼓励任何人直接公开安全漏洞细节。如需报告安全漏洞，烦请发送相关报告至我们的服务邮箱 [security@OpenAnolis.org](mailto:security@openanolis.org), 我们会第一时间查收并仔细审阅。

##### 1.2 报告崩溃事件

我们深知操作系统和内核的崩溃事件(Kernel Panic)对于任何用户来说都是一个很严重的事件，我们会将此类 BUG 报告提升到高优先级来解决，请在项目的 issues 页面报告此类问题。为了便于我们更好地理解您所碰到的问题，请尽可能包含下列信息：

`Kdump core 文件或者系统崩溃时的内核栈输出信息；`

`有可能触发崩溃的嫌疑应用或操作；`

`如果 Kdump core 或内核栈无法捕捉，至少需要提供内核版本信息。`

`分析内核崩溃问题极具挑战性，我们鼓励任何尝试帮助复现问题，以推进问题排查的行为。`

##### 1.3 报告一般 BUG

请在项目的 issues 页面报告此类问题。

##### 1.4 报告 Alibaba Cloud Linux 操作系统 BUG

Cloud Kernel 与 Alibaba Cloud Linux 操作系统关系紧密，如果您遇到任何 Alibaba Cloud Linux 操作系统相关的问题，也请在项目的 issues 页面提交 BUG 报告，或者在邮件列表及开发者论坛参与讨论。

### 2 帮助改进项目

##### 2.1 获取内核源码

在决定参与内核开发之前，建议您先获取内核源码并构建内核。您可以从 Releases 页面下载到稳定版内核的压缩包，然后解压缩到某个目录：

```
tar xzf ck-release-7.tar.gz
```

或者您也可以从我们的 Git 仓库 Clone 代码：

```
git clone [git@github.com](mailto:git@github.com):alibaba/cloud-kernel.git
```

Cloud Kernel 是基于 Upstream LTS v4.19.91 版本进行开发的，正式发布分支为 master 分支，开发分支为 linux-next 分支。建议您基于开发分支进行开发。

##### 2.2 构建内核

构建内核之前，您需要一个内核配置文件。我们在 configs 分支提供了一个默认内核配置文件，您只需下载并将其重命名为 .config，然后保存到内核源码树的顶层目录下。

```
cd cloud-kernel/

wget https://raw.githubusercontent.com/alibaba/cloud-kernel/configs/config-4.19.y-x86_64 -O .config
```

请注意，默认内核配置文件是一个精简定制版本，删掉了众多驱动模块，其中就包括存储设备驱动和网卡驱动等。因此您不应该直接将此内核运行于物理机上，否则物理机可能因缺少驱动而无法启动。我们推荐您只在 KVM 虚拟机中运行该内核，或者您确认已自行在非 KVM 平台中启用所需的驱动模块。 如需在物理机上运行，可以使用我们提供的备用配置文件

假设您已事先安装好所需的工具链，此时您可以开始构建内核了：

```
cd cloud-kernel

make oldconfig

make -jN # N 一般是您系统中 CPU 的逻辑核数

make modules -jN

sudo make modules_install

sudo make install
```

接下来，您可以重启并运行您的新内核。重启前请确保您有紧急启动系统的手段，以防新内核无法正常启动。

##### 2.3 提交补丁

在您日常使用 Cloud Kernel 过程中，您或许发现了一些内核 BUG，并且找到了修复它的方法。欢迎将修复整理成补丁发送给我们。

Cloud Kernel 的开发和 Linux 内核社区开发模式基本一致，您可以参阅 kernel.org 上的 “submitting patches guide” 一文。此外，我们还有一些特殊的开发规约如下：

##### 2.3.1 回合(Backport)补丁的规则

我们拒绝重复发明轮子，因此如果在社区已有针对某问题的解决方案，请直接回合该解决方案，而非自己再想一个新的解决方案。其他与回合有关的规则有：

(1) 保持原来的补丁格式: 如果该补丁可以不经修改直接回合成功，你应该将该补丁的作者信息、补丁标题和代码等保持原样，除去引用的 Upstream 补丁 ID 和你自己的 Signed-off-by 签名信息之外， 补丁日志(commit log)的内容也应该保持原样。

(2) 引用 Upstream 补丁 ID: 在 commit log 的开头应该引用一个永久的 Upstream ID, 比如 Linus tree 里的 commit id 就是个有效的 ID，而 tip tree 这种维护者的开发树里的 commit 就不是有效的 ID. 你可以用下列格式来引用：

commit  upstream. # 主线 Commit

commit  from xxx branch. # 其他永久分支

cherry-picked from https://github.com/xxxx/commit/xxxx # 固定 URL 也可以

(3) 在 Commit log 结尾添加自己的 Signed-off-by 签名，以便大家方便查询是谁回合了该补丁。

(4) 引入最小的依赖补丁，做最少的改动: 如果一个补丁无法直接回合到当前代码，可能存在两种情况，需要引入更多的依赖补丁，或者修改原有代码。如果依赖的补丁很干净(所谓”干净“是指依赖的补丁没有引入其他不相关的改动)，数量又少(大约在一到两个补丁左右)，可以考虑一起回合这些依赖补丁；否则，你应该考虑以最小代价改动补丁代码。

(5) 描述你的改动: 如果你改动了原有补丁的代码，你可以考虑在 commit log 中添加一行描述，或者追加一段文字来描述你的改动。常见的一行描述格式如下：

在你自己的 Signed-off-by 上方添加一对方括号，里面简要描述你的改动

[ Shile: fix following conflicts by adding a dummy argument ]

Signed-off-by: Shile Zhang [shile.zhang@linux.alibaba.com](mailto:shile.zhang@linux.alibaba.com)

##### 2.3.2 新补丁的编写与提交规则

(1) Upstream 优先: 如果 Upstream 没有现成解决方案，你需要写一个新的补丁，然后将这个补丁提交到 LKML 或者其他社区进行 review。当 review 通过后，你可以将补丁回合到 Cloud Kernel 中。有一个例外是，如果问题很紧急，需要尽快出补丁，那么补丁则可以先提给我们 review，而无需走 Upstream review 流程。

(2) 鼓励写测试用例: 我们欢迎在 commit log 里描述测试用例和测试数据，如果这么做，我们能更有效地进行 review.

(3) 不要脏修复: 补丁在功能上应该尽可能通用，我们不欢迎脏修复(dirty hack)或者临时方案。如果补丁的功能不够通用，我们建议增加一个 CONFIG_* 选项，或者使用内核启动参数, /proc /sys 接口等方式使得该功能可随时关闭。

##### 2.3.3 其他规则

(1) 大补丁系列鼓励使用关键字: 有时候你会提交一个大补丁系列，包含了20多个甚至更多补丁。这种情况下我们推荐在每个补丁的标题栏中添加一个关键字前缀。例如在一个补丁系列中，我们要引入一个新的硬件平台，单个补丁可能显示如下：

```
ACPI/ADXL: Add address translation interface using an ACPI DSM
EDAC, skx_edac: Delete duplicated code

intel_rapl: Fix module autoloading issue
```

此时，你可以将每个补丁都加上 ICX: 关键字前缀，用来提示整个补丁系列都是围绕 ICX 平台同一个主题的。如下：

```
ICX: ACPI/ADXL: Add address translation interface using an ACPI DSM
ICX: EDAC, skx_edac: Delete duplicated code

ICX: intel_rapl: Fix module autoloading issue
```

此条规则既适用于回合补丁，也适用于自己制作的补丁。

##### 2.3.4 提交补丁的方式

当您的补丁完成后，可以提交给我们审核。当前我们接受下列两种方式进行审核：

使用传统的内核开发者的方式，发送补丁到开发者邮件列表: [ cloud-kernel@OpenAnolis.org](mailto:cloud-kernel@OpenAnolis.org)，或者：

在 GitHub 页面 上给我们发送 pull request.

