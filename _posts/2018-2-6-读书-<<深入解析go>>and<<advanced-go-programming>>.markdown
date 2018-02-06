---
layout: post
title:  "读书-<<深入解析go>>and<<advanced-go-programming>>"
date:   2018-2-6 20:0:0 +0800
categories: reading
---

# go 几个核心的知识点
>gopath,goroot环境变量配置

    #mac go 配置
    export GOROOT=/usr/local/opt/go/libexec
    export GOPATH=/wwwroot/gopath
    export PATH=$GOROOT/bin:$GOPATH/bin:$PATH
    #sublime config,安装插件 GoSublime
    {
        "PATH": "/usr/local/opt/go/libexec/bin",
        "GOPATH": "/wwwroot/gopath"
    }
    
    
>go是编译型的带垃圾回收的高级语言
>垃圾回收，三色标记法
>goroutine调度，M、 P、 G 三种角色的关系
>go内存模型
>组合来实现面向对象,struct
>不要通过共享内存来通信，而应该通过通信来共享内存; channel
>sync 读写锁
>go web框架

## 2本看的感觉比较好的书。    
>深入解析go下载地址：[深入解析go](https://pan.baidu.com/s/1mjrySNe)  
>advanced-go-programming下载地址：[advanced-go-programming](https://pan.baidu.com/s/1jKd6dYA)      

部分书中例子代码见[https://github.com/robertzhai/go/tree/master/advanced](https://github.com/robertzhai/go/tree/master/advanced)

# go runtime
![Go-runtime]({{ site.url }}/assets/reading/Go-runtime-Page-1-1.png)

# go sched
![go-sched]({{ site.url }}/assets/reading/go-sched-Page-1.png)


 参考

* [https://golang.org/ref/mem](https://golang.org/ref/mem)
* [https://povilasv.me/go-scheduler/](https://povilasv.me/go-scheduler/)