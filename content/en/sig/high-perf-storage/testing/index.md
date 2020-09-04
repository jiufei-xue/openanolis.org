---
title: "io_uring 测试框架"
aliases: "/alinux2/docs/Community"
---

### io_uring-perf-test

#### 项目介绍

io_uring 性能测试框架，用于 io_uring 迭代开发期的性能回归。



#### 项目文档

io_uring 官方社区主要在 liburing 中进行功能测试，但性能回归测试缺乏，该项目旨在建立一套性能回归框架，其依赖 liburing，CMake，pthread 等组件。



**编译**

```
cmake -S . -B cmake-build-debug/
make -C cmake-build-debug/ all
```



**快速使用**

```
bash ./test.sh
```



该命令将构建并运行 test.sh 中配置的性能测试单元。

**使用样例: round_writev**

```
$./round_write -?
Usage: round_write [OPTION...]

 Test Arguments
  -d io_depth                set io_depth
  -f file_name               set file path for test
  -i io_size                 set io_size
  -s file_size               set test file size

 Loader Arguments
  -r round_count             set round count
  -w warm_up                 set warm up round

  -?, --help                 Give this help list
      --usage                Give a short usage message
```



- 相关文档
  https://github.com/OpenAnolis/io_uring-perf-test/blob/master/README



#### 项目仓库

https://github.com/OpenAnolis/io_uring-perf-test