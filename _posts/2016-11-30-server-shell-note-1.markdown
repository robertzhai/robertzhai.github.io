---
layout: post
title:  "shell笔记（一）"
date:   2016-11-30 8:30:0 +0800
categories: server
---


## sed 替换数字为空
	sed -r 's/[0-9]+//g' data.txt
	
## sed 不考虑特殊字符进行替换
	sed -e 's#user_id`#user_id#g' data.txt
	
## sed 正则替换
	sed -r "s/user_id='(.*?)'/user_id=''/g" > data.txt  

## awk 指定多个分割字符
	cat  update.txt  | awk -F 'QUERY|SET|WHERE' '{print $1,"where" $3;}' >update_filter.txt
	
## urldecode 对文本进行decode
	vim ~/.bash_profile
	增加
	alias urldecode='python -c "import sys, urllib as ul; print ul.unquote_plus(sys.stdin.read())"'
	
	然后就可以进行decode
	
## grep or
	grep -E "Can't connect to MySQL|No host could be connected|Lost connection to MySQL server|Connect to Mysql"  decode-ral-worker.log.wf.2016112808 | wc -l
	
## 统计排序-降序去重
	cat delete.txt  | sort | uniq -c | sort -rn -k 1 > uniq_delete.txt
	
## grep and
	grep -E 'distinct.*station_id' log.txt
	
## grep not
	grep -v 'mysql' filename
	
## awk 格式化输出
	awk -F 'err_no|err_info|extra=' '{ printf("err_no=%s,error_info=%s\n",  $2, $3); }'  warn.txt
 
 # comm 两文件做差集
    comm命令的参数
        -1   不显示只在第1个文件里出现过的列。
        -2   不显示只在第2个文件里出现过的列。
        -3   不显示只在第1和第2个文件里出现过的列。
    comm - 12     就只显示在两个文件中都存在的行；
    comm - 23    只显示在第一个文件中出现而未在第二个文件中出现的行；
    comm - 123  则什么也不显示。
    comm a.txt b.tx
    comm -1 a.txt b.txt
    
 # tac
    cat的变身，逆序查看文件内容
    
 