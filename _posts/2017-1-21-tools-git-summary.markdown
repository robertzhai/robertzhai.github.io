---
layout: post
title:  "git summary"
date:   2017-1-21 15:30:0 +0800
categories: tools
---
    
> 之前总结了svn的相关命令，见[svn命令总结](https://robertzhai.github.io/tools/2016/12/02/tools-svn-summary.html)。
> 这次抽空把git整理了下。八二原则，常用的就是少部分命令。

1.初始化项目，设置提交显示的用户名和邮箱

	git init
	git config user.name "robertzhai"
 	git config user.email "robertzhai131@163.com"
>设置 ssh key: [https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)

2.添加不提交的目录和文件到.gitignore文件,demo如下

	target
	.gitignore
	out/
3.添加文件到暂存区

	git add *
	
4.提交暂存区的文件到本地仓库

	git ci -m 'add file '
	
5.本地项目与远程仓库关联,修改远程仓库,ssh和http(s)方式

	git remote add origin https://github.com/robertzhai/java.git
	
	 git remote set-url origin  git@github.com:robertzhai/java.git
	 
	 ssh的方式在设置ssh key后push不用输密码，https方式需要输密码，可以用expect来自动输入密码
>github.sh,下载：[https://github.com/robertzhai/shell/blob/master/github.sh](https://github.com/robertzhai/shell/blob/master/github.sh) 
>
	#!/usr/bin/expect
	spawn git push origin master
	expect "Username for 'https://github.com':"
	send "robertzhai\r"
	expect "Password for 'https://robertzhai@github.com':"
	send "robert2014\r"
	expect eof%
	
6.推动本地仓库到远程仓库

	git push origin master
	
7.查看所有分支

	git branch -a
	
8.拉取所有分支

	git fetch -a
	
9.查看某个config的值

	git config user.name
	
10.跟新远程的修改到本地

	 git pull origin master

11.打标签tag

	git tag basic
	
12.查看tag

	git show basic
	
13.推送tag

	git push origin basic
	
14.查看远程仓库 
 
	git remote -v

15.查看远程分支

	git branch -r
	
16.创建并切换到新分支，并push到github

	git checkout -b flask-mongodb-bootstrap-v1.0.0
	git push origin flask-mongodb-bootstrap-v1.0.0
	
	Counting objects: 41, done.
	Delta compression using up to 4 threads.
	Compressing objects: 100% (39/39), done.
	Writing objects: 100% (41/41), 251.89 KiB | 0 bytes/s, done.
	Total 41 (delta 4), reused 0 (delta 0)
	remote: Resolving deltas: 100% (4/4), done.
	To git@github.com:robertzhai/todo-mvc.git
	 * [new branch]      flask-mongodb-bootstrap-v1.0.0 -> flask-mongodb-bootstrap-v1.0.0
	
17.查看版本号
	
	git --version
	
18.分支 merge

	git merge branchname
	
19.revert没有commit的文件
    git checkout file
	

## 扩展阅读
* [https://git-scm.com/book/zh/v1](https://git-scm.com/book/zh/v1)  
* [git 权威指南](https://pan.baidu.com/s/1kV5COab)

	

	

