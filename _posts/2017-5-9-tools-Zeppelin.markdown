---
layout: post
title:  "tools-Zeppelin"
date:   2017-5-9 20:0:0 +0800
categories: tools
---

## intro
    Zeppelin 是一个基于 Web 的支持交互式数据分析 notebook，是一个
    Web笔记形式的交互式数据查询分析工具，可以在线用SQL等多种形式对数据进行查询分析并生成报表。
    Zeppelin可以分为Web，Notebook以及Interpreter三个大部分, Zeppelin的后台数据引擎可以指定，
   开发者可以通过实现更多的解释器来为Zeppelin添加数据引擎。

## install
    [http://zeppelin.apache.org/download.html](http://zeppelin.apache.org/download.html)  
    bin/zeppelin-daemon.sh start
    bin/zeppelin-daemon.sh stop
    bin/zeppelin-daemon.sh restart

## Zeppelin 工作模型
![zep00]({{ site.url }}/assets/tools/zeppelin_work_model.png)

## JDBC连接MySQL分析数据
>1.修改 jdbc interpreter
![zep]({{ site.url }}/assets/tools/zep01.png)
![zep]({{ site.url }}/assets/tools/zep00.png)

>2.添加notebook pv_uv_report,指定jdbc为interpreter
![zep]({{ site.url }}/assets/tools/zep03.png)

>3.jdbc查询pv、uv 图表展示
![zep]({{ site.url }}/assets/tools/zep04.png)
![zep]({{ site.url }}/assets/tools/zep05.png)
![zep]({{ site.url }}/assets/tools/zep06.png)


## 其它interpreter
>python -> %python  
>shell -> %sh  
>markdown -> %md  


## 参考
* [http://xiaqianlin.cn/?p=635](http://xiaqianlin.cn/?p=635)
* [https://zeppelin.apache.org](https://zeppelin.apache.org)