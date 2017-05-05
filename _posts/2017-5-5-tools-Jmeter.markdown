---
layout: post
title:  "tools-Jmeter"
date:   2017-5-5 20:0:0 +0800
categories: tools
---

## Jmeter   
>api和网站压力测试的工具，支持gui和terminal两种方式

## mac 安装
>下载jmeter binary version from http://jmeter.apache.org/download_jmeter.cgi
>click bin/ApacheJMeter.jar 就能启动jmeter的gui界面

## 新建test plan
>在线程组下面分别新建http请求默认值、http cookie管理器、http请求、用图表查看结果、用图形查
看结果，具体参考：http://jmeter.apache.org/usermanual/build-web-test-plan.html


## sample time 和 Latency
>Latency is a difference between time when request was sent and time when response has started to be received.
>Response time (= Sample time = Load time = Elapsed time) is a difference between time when request was sent and 
time when response has been fully received.
>So Response time always >= latency.

## jmeter demo 
![jmeter.png]({{ site.url }}/assets/tools/jmeter.png)
![jmeter01.png]({{ site.url }}/assets/tools/jmeter01.png)


## 参考
* http://jmeter.apache.org/index.html