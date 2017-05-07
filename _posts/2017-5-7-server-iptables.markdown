---
layout: post
title:  "server-iptables"
date:   2017-5-7 20:0:0 +0800
categories: server
---

## iptable 的规则主要会用到INPUT、OUTPUT、FORWARD 3种policy,可用iptables --help
查看使用方法。服务器为了安全需要禁用一些端口，就需要用iptable来设置。
    
    INPUT:开放给外部的
    OUTPUT:开放给内部的
    FORWARD：转发的

## nmap查看服务器端口情况
    nmap ip
    
    Starting Nmap 7.40 ( https://nmap.org ) 
    Nmap scan report for ip
    Host is up (0.034s latency).
    Not shown: 984 closed ports
    PORT     STATE    SERVICE
    22/tcp   open     ssh
    80/tcp   open     http
    139/tcp  filtered netbios-ssn
    445/tcp  filtered microsoft-ds
    593/tcp  filtered http-rpc-epmap
    1068/tcp filtered instl_bootc
    3306/tcp filtered mysql
    3333/tcp filtered dec-notes
    3690/tcp open     svn
    4444/tcp filtered krb524
    6129/tcp filtered unknown
    6667/tcp filtered irc
    8083/tcp open     us-srv
    8084/tcp open     unknown
    8086/tcp open     d-s-n
    8088/tcp open     radan-http

## 禁止外部访问某个端口(如3306) 
 
    -A:添加
    -p:protocol
    --dport:目标端口
    -j:jump,set target for rule

    sudo iptables -A  INPUT -p tcp --dport 3306 -j DROP
    sudo /etc/init.d/iptables save
    sudo /etc/init.d/iptables restart
    
## 允许外部访问某个端口(如3306)
    
    sudo iptables -A  INPUT -p tcp --dport 3306 -j ACCEPT
    sudo /etc/init.d/iptables save
    sudo /etc/init.d/iptables restart
 
## 查看规则
    
    sudo /etc/init.d/iptables status
    
    表格：filter
    Chain INPUT (policy ACCEPT)
    num  target     prot opt source               destination
    1    DROP       tcp  --  0.0.0.0/0            0.0.0.0/0           tcp dpt:3306
    
    Chain FORWARD (policy ACCEPT)
    num  target     prot opt source               destination
    
    Chain OUTPUT (policy ACCEPT)
    num  target     prot opt source               destination

## 删除规则,按status里面的chain num编号删除

    sudo iptables -D INPUT 1
 
## 常用命令

    $ /etc/init.d/iptables start     # 开启防火墙，或者service iptables start，以下同理
    $ /etc/init.d/iptables stop      # 停止防火墙
    $ /etc/init.d/iptables restart   # 重启防火墙
    $ /etc/init.d/iptables status    # 查看端口状态
    $ /etc/init.d/iptables save      # 保存配置
    $ chkconfig iptables off         # 永久关闭防火墙
    $ chkconfig iptables on          # 永久关闭后启用