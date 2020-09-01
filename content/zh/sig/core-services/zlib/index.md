---
title: "zlib"
---

zlib提供数据压缩的函数库，linux系统中广泛使用了zlib，如kernel使用zlib进行网络报文压缩，内核镜像压缩，libpng，openssh/openssl，git，rpm等等都使用到了zlib。

我们针对aarch64上的zlib做了性能调优分析，通过使用NEON，crc32指令集代替C代码实现，提升zlib的压缩和解压缩性能。