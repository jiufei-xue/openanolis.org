---
title: "Kata Containers 2.0 蓝图"
aliases: "/alinux2/docs/Open-Stack-Meaning"
---

## 2.0 里程碑的预设目标

Kata 2.0 的主要目标包括：

- 保持和已有的 Kubernetes 生态系统的兼容性；
- 允许将全部的应用内容，也就是说不仅是运行时的进程，也包括镜像/根文件系统封装进沙箱中；
- 去掉 Agent 的不必要功能；
- 将宿主机的功能尽量留在用户空间，并让长生命周期进程可以使用非 root 权限运行；
- 支持 cloud-hypervisor 并为 Kata 的场景进行配置与定制。

那么现在让我们来看看这会对架构和协议/接口有什么潜在影响：

## 对 CRI 接口的考虑

就 Kubernetes 而言，所有运行时功能都通过容器运行时接口（CRI，定义位于kubernetes/cri-api）进行定义。仔细看一下，我们可以把 CRI 定义的功能分为两个部分——只关于节点本身的全局操作和有 Pod 上下文的操作：

- 节点全局操作:

- - `Version`, `Status`
  - `RunPodSandbox`, `ListPodSandbox`, `ListContainers`, `ListContainerStats`
  - `ListImages`, `ImageStatus`, `RemoveImage`, `ImageFsInfo`

- Pod 相关操作:

- - `StopPodSandbox`, `RemovePodSandbox`, `PodSandboxStatus`
  - `CreateContainer`, `StartContainer`, `StopContainer`, `RemoveContainer`, `ContainerStatus`, `UpdateContainerResources`, `ReopenContainerLog`, `ContainerStats`, `UpdateRuntimeConfig`
  - `ExecSync`, `Exec`, `Attach`, `PortForward`
  - `PullImage`

注意 CRI 里面的 `PullImage` 是有 Pod 上下文的操作，这个操作从来都是在 PodSandbox 创建之后才进行的，并且从 Kubernetes 1.14 起，这个操作就带有一个 `PodSandboxConfig` 参数，其中的 `PodSandboxMetadata` 结构是包含 Pod 名称的。所以，作为一个高层定义，CRI 定义得非常谨慎，并没有假设镜像的文件系统究竟是维护在沙箱内还是宿主机全局的。

根据功能的划分，我们可以重新分配一下如何实现 CRI 的功能：

![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/301940/1597915418781-666c68d5-1d72-48ce-b0b9-368bfc2f73a5.png)

在CRI Daemon，也就是目前 containerd 和 CRI-O 的位置，应该维护一个节点全局的Pod和容器的索引，并且它应该负责根据 RuntimeClass 来通过插件创建沙箱。此外的所有 Pod 内功能的操作应该交给负责“Pod相关功能”的部分，也就是现在 shim-v2 的位置，不过我想它已经比一个垫片（shim）大太多了，可能叫“沙箱伴侣”更合适。

### 对 CRI Daemon 的影响

要实现上述描述中的镜像进入沙箱的行为，CRI Daemon 需要有一些调整：

- 短路掉节点全局功能中的镜像相关动作（`ListImages`, `ImageStatus`, `RemoveImage`, `ImageFsInfo`），因为我们把所有的镜像和 rootfs 管理操作都放到沙箱里了，所以也就没必要再做全局的镜像管理了。
- 对于拉取镜像，有两个选择：

- - 如果我们尽量保持 shim-v2 接口的现状的话，我们可能需要在 daemon 里短路拉取镜像的操作，等到真的创建容器的时候再去事实地拉取镜像；
  - 但是，上述方法的一个问题是，如果拉取镜像出错，那么只能表现为创建容器出错，这混淆了API本身的语义。而如果我们想让操作尽可能地忠于他们本身的语义的话，我们就应该把这个操作也添加到 shim-v2接口里面。

- 对于 Create 和 Exec 操作，目前是 containerd 或者 CRI-O 创建标准输入输出 pipe 并交给 shim-v2 执行的，但我们如果希望进一步地隔离沙箱，就不应该使用宿主机上的管道，而应该把标准输入输出的实现的自由交给沙箱。

当然我们肯定是要支持 containerd 和 CRI-O 的，并且要开箱即用，毕竟 containerd 和 CRI-O 已经跑在大多数人的机器上了。所以，上面这些改动应该是可插拔的，而且，我们在 Kata 2.0 中也应当对当前的 containerd 和 CRI-O 至少保留一个兼容模式。

### 把容器放入沙箱中：效率与隔离性

基于之前文章中的想法，我们做了一些把容器镜像拉取工作挪到沙箱里面的调研，大致如下图所示

![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/301940/1597915418799-30e24699-97ac-438b-b8d5-2849be8cdeb8.png)

我们可以引入一个辅助容器专用来拉取镜像、制作容器 rootfs。把这个功能留给一个容器的目的在于，我们不希望为此来增加 agent 的复杂度，并且这样可以尽量少地影响 agent 本来的行为。

与把镜像放在宿主机上相比，把镜像放在沙箱中会消耗更多一些的空间，而且会影响容器启动的速度，因为每次启动 Pod 都必须拉一次镜像，但对于云用户来说，这样就不必让镜像被云服务商经手一次了，对于云用户和服务商来说，常常是可以接受的。

另一方面，OCI 在过去的一年里对下一代镜像规范进行了讨论，并推出了 OCI Image artifacts 扩展规范，合理利用 artifacts 可以让我们在 OCI 规范框架内进行一些工作来加速镜像的拉取，当然，这需要镜像用户授权基础设施来访问用户镜像内容来时下加速。这里是[我们在阿里巴巴和蚂蚁金服做的镜像加速](http://mp.weixin.qq.com/s?__biz=MzUzOTk2OTQzOA==&mid=2247483897&idx=2&sn=4613d1dab5d1e6784e49d67342fcc8d4&chksm=fac11308cdb69a1eaf25ea90760577fa2261be8f8fbbba0f36d5cb331e4cb9943f467d05dcab&scene=21#wechat_redirect)的一个示意：

![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/301940/1597915418923-9007c104-4129-4a28-b3b0-f5107d931d05.png)

这里，利用 artifacts，我们可以把“内容感知”的元数据也一起放在 registry 里，在 Kata 这一端，我们可以在下载元数据之后就告知上层镜像拉取已经完成、可以启动容器了，当 virtiofsd 接到数据访问请求再延迟拉取镜像。这个方案中，所有的组件都位于用户空间，所以我们可以加入很多高级功能，比如更好的数据去重和per-chunk 的数据校验，不需要全部拉取就可以进行数据完整性检查。（PS：这些逻辑对 Kata 和 runC 应该是通用的。）

## 关于 Agent 的功能

接下来是 sandbox 内部——“危险区”。我们对 agent 对考量包括：

- 对于长时间运行对 daemon，应该仅仅包含必须要做的功能，能做的越少，我们也就越安全；
- 但是要保证和 OCI 镜像与 CRI 语义的兼容性；
- 当然，也要尽量低开销。

在版本 1.10 的开发周期中，我们已经试验性地加入了一个 Rust 版本的 agent，它的体积要远小于之前的 Go 版本。而且，我们也实现了一个 Rust 版本的 ttRPC 并正在测试中（本文发出时已经开源并[贡献回到 ttRPC 的上游、containerd 社区](http://mp.weixin.qq.com/s?__biz=MzUzOTk2OTQzOA==&mid=2247483911&idx=1&sn=28eb395482fd7e6835b3fd6f1e5af3a0&chksm=fac110f6cdb699e02d9d7ae6d2197183fb5d9415f0624c0e47fbb24dba3a26ef4a6184fcfb53&scene=21#wechat_redirect)了），[把这些都集中在一起](http://mp.weixin.qq.com/s?__biz=MzUzOTk2OTQzOA==&mid=2247483897&idx=1&sn=4bfa20fcacbcd4f463ced3cc092095ab&chksm=fac11308cdb69a1edec111d0b7b608fa84afdcf27557c54ae1c802fc3b8d858feec36cd8be31&scene=21#wechat_redirect)，我们有望将 agent 的内存开销压向 0MB。

下面我们就来看看部分计划中的 Kata 2.0 的 agent 架构。

### Sandbox 操作

在上海 PTG 上，agent 的功能也是讨论的焦点之一。部分开发者提起，agent protocol 中的 sandbox 操作对 agent 是否有意义，因为 agent 正在运行本身就意味着 sandbox 已经建立好了，所以，一个想法是要从协议中去掉 `CreateSandbox` 和 `DestroySandbox`两个操作。不过在 Kata 语境里， `CreateSandbox` 本身实际上是执行的 "InitSandbox" 操作，这个语义仍然是需要的。不过，我们可能确实可以去掉 pause container 来简化 sandbox 的容器组织。

### init, 通信守护进程, 和 OCI 启动器

另一方面，我们也在考察 agent 的内在功能。在上海峰会的论坛讨论中，与会者都同意 agent 是被攻击风险最高的组件，显然应该让它的守护进程的权限越少越好。这里我们可以把 agent 的功能划分成这么几个部分：

![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/301940/1597915418771-e9261f23-8a53-4ca3-97d0-e3b907ef5bce.png)

- 容器的 init 显然是需要的，无法删除。
- 在 bundle 内解析运行 OCI 容器的功能可以在容器创建之后退出。
- 监控、事件等关于可观测性、可调试性的功能肯定是需要的，但我们应该努力让它们更加安全高效。

简而言之，agent 本身的发展方向应该是不仅更轻，而且更加模块化、并被更仔细地限制访问权限。

## Cloud-hypervisor 和 rust-vmm

在 1.10 开发周期里做的另一个工作是把 cloud-hypervisor 作为 Kata Containers 的一个新的 hypervisor，在 Kata 2.0 里，我们希望可以进一步推进这个方向。我在上一篇 blog 里提到：

> 让主机的用户态工具、VMM、乃至应用的内核联合起来，彼此协同为沙箱中的应用提供服务。

因为目前的 cloud-hypervisor 是一个中立、模块化和比较安全的 VMM，我们可以考虑构建一个 cloud-hypervisor 的 profile，添加我们需要的功能、减除不必要的功能，来作为我们的“面向云原生的虚拟化”的一个部分。