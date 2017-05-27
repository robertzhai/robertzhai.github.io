---
layout: post
title:  "读书- <<java程序性能优化>>笔记"
date:   2017-5-26 20:30:0 +0800
categories: reading
---


## jvm内存模型
![cover]({{ site.url }}/assets/reading/java/003.png)
![cover]({{ site.url }}/assets/reading/java/002.png)


## jvm 内存分配参数
![cover]({{ site.url }}/assets/reading/java/001.png)

## 设置初识堆内存
 -Xms

## 设置最大堆内存
 -Xmx 
  
  	java -Xmx12M com.robert.web.mem.TestStack

 
 	java -Xms1M -Xmx15M -verbose:gc  com.robert.web.mem.TestStack
 	
## 设置新生代
 -Xmn
 	
 	设置较大的新生代会减小老年代的大小，会影响GC, 新生代一般设置为整个堆空间的1/4-1/3
 	
## 设置持久代
 -XX:MaxPermsize 
 
 	持久代（方法区）不属于堆的一部分，决定了系统可以支持多少个类定义和多少常量
 	
## 设置线程栈
 -Xss
 
 	线程栈是线程的一块私有空间，线程进行局部变量分配和函数调用需要在栈中开辟空间
 	
## 设置新生代 eden、so、s1空间比例
-XX:SurvivorRatio=eden/s0=eden/s1

	s0和s1是from空间和to空间，大小相等，只能相同，在minor GC后 会互换角色
	
	java -Xms1M -Xmx15M -verbose:gc  -XX:SurvivorRatio=2   com.robert.web.mem.TestStack
	

## 设置老年代和新生代比例
	-XX:NewRatio=老/新

##获取GC的信息

	-verbose:gc
	-XX:+PrintGC  
	-XX:+PrintGCDetails
	
## 禁止显示的GC

	-XX:+DisableExplicitGC,禁用显示的GC操作，如禁止程序中使用System.gc()触发的Full GC
	
##垃圾回收算法
引用计数法
>无法解决循环引用问题，不适合jvm的垃圾回收

标记-清除法
>通过根节点标记所有可达对象，然后清除不可达对象  

复制算法
>比标记-清除法相对高效的回收方法，将内存分为2块，每次只使用其中一块。新生代的串行垃圾回收器用到了复制算法。

标记-压缩法
>是一种老年代的回收算法，对所有可达对象做一次标记，将所有存活的对象压缩到内存的一端，之后清理边界外所有的空间	
分代
>对新生代用复制算法，老年代用标记-压缩算法



  
>下载地址：[github下载](https://github.com/robertzhai/ebooks/blob/master/java/readme.md)。  

 
 
 
## 封面
![cover]({{ site.url }}/assets/reading/java/004.png)

