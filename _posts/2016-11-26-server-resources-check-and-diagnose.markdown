---
layout: post
title:  "服务器负载和资源查看和诊断相关命令使用"
date:   2016-11-26 8:0:0 +0800
categories: server
---

## free 内存使用   

	free -m
	                total       used       free     shared    buffers     cached
    Mem:         64407      61313       3094          0        550      55163
    -/+ buffers/cache:       5599      58807
    Swap:            0          0          0
    
	显示可用内存58807M,总内存64407M  

## top 看负载  
	主要看 load average和是否有些不明进程在运行，用pidstat查看对应进程的资源使用情况

## pidstat查看某进程使用内存、cpu、disk情况  
  
    查看5861进程
    pidstat -r -p 5861 3
	08:41:08 AM       PID  minflt/s  majflt/s     VSZ    RSS   %MEM  Command
    08:41:11 AM      5861      1.00      0.00  664944 216948   0.33  pusher
    08:41:14 AM      5861      1.00      0.00  664944 216948   0.33  pusher
    08:41:17 AM      5861      1.00      0.00  664944 216948   0.33  pusher
    08:41:20 AM      5861      1.00      0.00  664944 216948   0.33  pusher
    08:41:23 AM      5861      1.00      0.00  664944 216948   0.33  pusher
    08:41:26 AM      5861      1.00      0.00  664944 216948   0.33  pusher 
	pidstat -u -p 5861 3
	08:43:46 AM       PID    %usr %system  %guest    %CPU   CPU  Command
    08:43:49 AM      5861    2.00    2.67    0.00    4.67     8  pusher
    08:43:52 AM      5861    1.67    3.00    0.00    4.67     8  pusher
    pidstat -d -p 5861 3
    08:44:48 AM       PID   kB_rd/s   kB_wr/s kB_ccwr/s  Command
    08:44:51 AM      5861      0.00      0.00      0.00  pusher
    08:44:54 AM      5861      0.00      6.67      0.00  pusher
    08:44:57 AM      5861      0.00      0.00      0.00  pusher
    08:45:00 AM      5861      0.00      0.00      0.00  pusher
    08:45:03 AM      5861      0.00      0.00      0.00  pusher

## ps 和 grep 通过进程名查看进程  

    如查看nginxps aux | grep nginx
    23131    18314  0.0  0.0 24084 2288 ?        S    Jul06   7:40 nginx: worker process
    23131    18315  0.0  0.0 24084 2128 ?        S    Jul06   7:52 nginx: worker process
    23131    18316  0.0  0.0 24084 2284 ?        S    Jul06   0:47 nginx: worker process
    23131    18317  0.0  0.0 24084 2288 ?        S    Jul06   7:22 nginx: worker process
    23131    18318  0.0  0.0 24084 2292 ?        S    Jul06   7:26 nginx: worker process
    23131    18319  0.0  0.0 24084 2292 ?        S    Jul06   6:39 nginx: worker process

## netatat 查看端口号   
   
    netstat -ant | grep 8099
	
	tcp        0      0 0.0.0.0:8099                0.0.0.0:*                   LISTEN
    tcp        0      0 10.99.23.15:8777            172.22.146.63:58099         ESTABLISHED  
	
## ping看主机是否能通   

    ping baidu.com
	
	PING baidu.com (180.149.132.47): 56 data bytes
    64 bytes from 180.149.132.47: icmp_seq=0 ttl=52 time=5.500 ms
    64 bytes from 180.149.132.47: icmp_seq=1 ttl=52 time=5.478 ms

## telnet看主机某端口是否能通 ，是否有防火墙不能访问或者没开通外网端口  

    telnet 10.99.23.15 8099
	
	Trying 10.99.23.15...
    Connected to cp01-rdqa-dev194.cp01.baidu.com.
    Escape character is '^]'.
    ^]

## df 查看磁盘使用情况  

    df -h

## du 查看当前目录下文件和文件夹大小  

    du -sh *
    516K	controllers
    4.0K	favicon.ico
    4.0K	index.php
    2.1M	library
    4.0K	link.sh
 
## lsof查看删除的文件描述符还未释放
    lsof | grep deleted
    
## kill 进程
	kill -9 pid
	
	一般结合awk和xargs使用
	ps aux | grep nginx | awk '{pirnt $2;}' | xargs kill -9 
	

  
## 参考资料
1.[http://www.infoq.com/cn/news/2015/12/linux-performance](http://www.infoq.com/cn/news/2015/12/linux-performance)  
2.[http://www.cnblogs.com/ggjucheng/archive/2013/01/13/2858874.html](http://www.cnblogs.com/ggjucheng/archive/2013/01/13/2858874.html)  
