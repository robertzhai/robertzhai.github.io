---
layout: post
title:  "svn命令总结"
date:   2016-12-02 20:30:0 +0800
categories: tools
---

# 1.分支合并主干  
	cd branch
	svn up
	svn merge https://abc.com/app/trunk/myapp
	svn ci -m 'merge brunk'
	 
# 2.主干合并分支
	cd trunk
	svn up
	svn merge https://abc.com/app/branches/myapp_BRANCH
	svn ci -m 'merge branch'
	 
# 3.冲突解决
	编辑文件，进行修改 
	svn resolve file
	 
# 4. local add, incoming add upon merge问题解决
	svn resolve --accept working -R . 
	
# 5. revert 目录下所有更改
	svn revert --depth=infinity .
	
# 6. svn 命令设置alias
	
	alias sst="svn st | grep -v Runtime | grep -v Uploads | grep -v .buildpath | grep -v .settings  "
	alias sdiff="svn diff "
	alias sup="svn up"
	alias srevert="svn revert"
	alias sci="svn ci"
	alias sinfo="svn info"
	alias sdel="svn del"
	alias sco="svn co"
	alias slog="svn log -v | more "
	alias srevertall="svn revert --depth=infinity . "
	alias smerge="svn merge "
	alias sresolve="svn resolve "
	alias sadd="svn add "
	alias scopy="svn copy "
	
# svn 总结
	使用使用门槛低，比较方便，必须联网提交，git不联网也可以提交，很多团队都在转向git ,后续再整理下git的。
	
# 扩展阅读
>1.[GIT和SVN之间的五个基本区别](http://www.vaikan.com/5-fundamental-differences-between-git-svn/)
	
