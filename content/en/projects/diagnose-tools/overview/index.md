
---
title: "Diagnose-tools介绍"

---

# Diagnose-tools介绍

Diagnose-tools是一套用于快速定位linux操作系统各种性能异常、抖动问题的工具集，也是在阿里巴巴双十一交易场景里锤炼出来的最佳实践。

相比于目前业界的一些诊断工具，它有如下优点：



**功能丰富**

针对系统的CPU、内存、I/O、IRQ、load、文件系统、mutex、进程管理等全面监控，能应对各种场景的问题诊断。



**定制灵活**

每个监控都是一个单独插件，每个插件可独立运行，并随时可动态启停，灵活定制。



**高性能**

通过优化的算法尽量减少对系统的干扰，在插件运行过程中对线上业务的性能影响降到最低，保证线上业务近乎苛刻的稳定性要求。



**简单明了**

系统诊断结果简单明了，问题现场的backtrace可同时支持kernel和user态，并能以火焰图输出结果，易于问题分析。



# 快速开始

1, 编译安装

```
git clone https://github.com/alibaba/diagnose-tools.git
cd diagnose-tools
make devel
make deps
make
```

上述命令执行成功后，diagnose-tools自动完成安装



2, 快速使用

插入模块：

```
diagnose-tools install
```



之后就可以使用各个插件，每个插件的模式相同:

```
diagnose-tools xxx --activate      //启用插件
diagnose-tools xxx --report        //查看结果
diagnose-tools xxx --deactivate    //停用插件
```





eg，使用perf查看系统资源:

启用perf功能：

```
diagnose-tools perf --activate
```

采集一段时间查看结果：

```
diagnose-tools perf --report
```

或者将结果生成火焰图，更直观的查看：

```
diagnose-tools perf -report > out.txt
diagnose-tools flame --input out.txt  --output out.svg
```

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/137158/1596609104314-37cec690-4a9b-4e4f-8925-99ae9ce30678.png?x-oss-process=image%2Fresize%2Cw_1500)



# 