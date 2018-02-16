---
layout: post
title:  "sourcestudy-WebBench"
date:   2018-2-14 20:0:0 +0800
categories: sourcestudy
---

# Web Bench

    一个用c语言写的服务端压测工具.
    Web Bench is very simple tool for benchmarking WWW or proxy servers. 
    Uses fork() for simulating multiple clients and can use HTTP/0.9-HTTP/1.1 requests. 

# install
    wget http://home.tiscali.cz/~cz210552/distfiles/webbench-1.5.tar.gz
    make && make install
    
# version
    webbench-1.5 webbench  --version
    1.5
# 使用
     
    1) webbench http://github.com/  -t 10 -c 20
    Webbench - Simple Web Benchmark 1.5
    Copyright (c) Radim Kolar 1997-2004, GPL Open Source Software.
    
    Benchmarking: GET http://github.com/
    20 clients, running 10 sec.
    
    Speed=2214 pages/min, 3800 bytes/sec.
    Requests: 369 susceed, 0 failed.


# 源码树
     webbench-1.5 tree -L 2
    .
    ├── COPYRIGHT -> debian/copyright
    ├── ChangeLog -> debian/changelog
    ├── Makefile
    ├── debian
    │   ├── changelog
    │   ├── control
    │   ├── copyright
    │   ├── dirs
    │   └── rules
    ├── socket.c
    ├── webbench.1
    └── webbench.c

# socket.c
    
    就是建立一个客户端到服务端的socket连接，准备后续的发送数据准备,返回一个socket 
    文件描述符(a descriptor)
    
    几个函数：
        gethostbyname
        socket
        connect
    
    2个struct：
        struct sockaddr {
        unsigned short    sa_family;    // address family, AF_xxx
        char              sa_data[14];  // 14 bytes of protocol address
        };
    
    
        // IPv4 AF_INET sockets:
        
        struct sockaddr_in {
            short            sin_family;   // e.g. AF_INET, AF_INET6
            unsigned short   sin_port;     // e.g. htons(3490)
            struct in_addr   sin_addr;     // see struct in_addr, below
            char             sin_zero[8];  // zero this if you want to
        };
        
        struct in_addr {
            unsigned long s_addr;          // load with inet_pton()
        };

# usage()
    fprintf 函数,输出格式化的多行提示信息

# getopt_long()
    解析用户的命令行长格式或短格式的参数,参数支持 912Vfrt:p:c:?h
    getopt_long(argc,argv,"912Vfrt:p:c:?h",long_options,&options_index))
    是getopt函数的升级版
    
# build_request()
    通过url参数构造 request header 
    bzero,strcpy,strcat,index 这些函数

# pipe()
    创建一个管道，实现父子进程通信。
    管道的读写规则:
    　　管道两端可分别用描述字fd[0]以及fd[1]来描述，需要注意的是，管道的两端是固定了任务的。
    即一端只能用于读，由描述字fd[0]表示，称其为管道读端；另一端则只能用于写，由描述字fd[1]
    来表示，称其为管道写端。
        如果试图从管道写端读取数据，或者向管道读端写入数据都将导致错误发生。一般文件的I/O函
    数都可以用于管道，如close、read、write等等。
    
    fdopen 将文件描述词转为文件指针,可以对管道进行读写操作。

# fork()
    fork一个子进程，子进程返回Pid=0 ，父进程返回pid>0 是子进程的pid
 
# setvbuf()
    函数：设置文件流的缓冲区
# bench()
    
    fork 多个子进程，打个管道，读管道，子进程将结果写入管道,执行benchcore
    
# benchcore()
    

# shutdown()
    终止socket通信
    
# alarm()
    设置信号传送闹钟,设置信号SIGALRM 在经过参数seconds 指定的秒数后传送给目前的进程. 
    如果参数seconds 为0, 则之前设置的闹钟会被取消, 并将剩下的时间返回.

# sigaction()
    查询或设置信号处理方式
 

# all in one,包括源码和其它的测试脚本
* https://github.com/robertzhai/source_study_notes/tree/master/webbench-1.5

# 参考
* http://blog.zhangjikai.com/2016/03/05/%E3%80%90C%E3%80%91%E8%A7%A3%E6%9E%90%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%8F%82%E6%95%B0--getopt%E5%92%8Cgetopt_long/
* http://home.tiscali.cz/~cz210552/webbench.html
* http://c.biancheng.net/cpp/
* http://www.cplusplus.com/reference/clibrary/

