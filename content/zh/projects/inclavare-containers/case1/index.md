
---
## sys-delay定位偶发夯机问题

---

### 问题及现象

   系统在没有任何外部可见的压力变化情况下系统突然发生抖动，时间在几秒到几十秒不等，导致业务出现一波超时。从系统资源的监控角度看表现为sys cpu 突然冲高，但根因不明确。此时使用diagnose-tools sys-delay来抓取sys占用过长的情况。



### 问题定位

使能sys_delay，使用默认阈值为50ms

```
diagnose-tools sys-delay –activate
```



运行几天后抓到了现场sys cpu高时的调用栈：

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/137158/1596613662704-24ed66d9-7577-4cb7-a051-27d8f828a575.png)



### 问题分析

分析linux kernel代码可知，此时**“申请高阶内存系统无法满足，需进行内存页面合并”** ，这个导致了系统抖动。持续对机器进行观察，发现内存碎片很严重。

![image](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/18573/1580971674772-6617c632-5a78-42ae-a2e3-ad44374a239b.png?x-oss-process=image%2Fresize%2Cw_1500)



在这种内存碎片比较严重同时系统网络负载比较高会频繁申请高阶内存的情况下，没有什么特别好的办法能完全避免这个问题，但是可以做到一定程度的缓解，尽量让问题发生的概率降低，最直接的一个办法就是调整内存min水线，让系统保留更多的内存。