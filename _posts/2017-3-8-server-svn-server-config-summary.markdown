---
layout: post
title:  "svn server config summary"
date:   2017-3-8 20:0:0 +0800
categories: server
---

>搭建一个svn server方便上传代码，记录下关键几个文件备忘。

## 隐藏Apache的版本号及其它敏感信息
>ServerSignature Off

## /conf/authz，用户进行分组

    [groups]
    server = aa
    fe = bb
    pm = cc,dd
    
    [sugar:/]
    @server = rw
    * =
    
    [sugar:/h5]
    @server = rw
    @fe = rw

   
## conf/passwd

    [users]
    aa = pwd_aa
    bb = pwd_bb

## /etc/httpd/conf.d/svn.conf

    <Location  /svn>
    
    
        DAV svn
    
    
        SVNParentPath /data/svn
    
        AuthType Basic
    
        AuthName "Authorization SVN"
    
        AuthzSVNAccessFile  /path/conf/authz
    
        AuthUserFile /path/conf/http_passwd
    
        Require valid-user
    
    </Location>


## /etc/httpd/conf/httpd.conf

    LoadModule dav_module modules/mod_dav.so
    LoadModule dav_fs_module modules/mod_dav_fs.so
    LoadModule dav_svn_module modules/mod_dav_svn.so

## 访问http://ip:port/svn/projectname/h5
    
    输入密码和svn co能正常说明配置正确


## Could not open the requested SVN filesystem
>svnParentPath 配置错


## 扩展阅读 
 
* [https://my.oschina.net/pengqiang/blog/535009](https://my.oschina.net/pengqiang/blog/535009) 
