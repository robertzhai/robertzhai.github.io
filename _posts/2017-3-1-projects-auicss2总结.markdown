---
layout: post
title:  "auicss2总结"
date:   2017-3-1 20:0:0 +0800
categories: projects
---

## AUI-靠谱的移动前端框架
>一个移动端的css框架，文档见[http://www.auicss.com/index.php?s=Document](http://www.auicss.com/index.php?s=Document)
，比较好用，界面效果不错，可以做表单、卡片、导航、列表等等，相对与bootstrap加载的文件更少，
渲染更快。

## 2.0
>完美兼容IOS 5.1+ 到Android 4.2+,全局使用rem控制尺寸，完美适应不同分辨率移动设备。

## 使用

    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>title</title>
        <meta name="viewport"
              content="maximum-scale=1.0,minimum-scale=1.0,user-scalable=0,width=device-width,initial-scale=1.0"/>
        <link rel="shortcut icon" href="/favicon.ico">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <meta name="format-detection" content="telephone=no,email=no,date=no,address=no">
    
        <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>static/auiv2/css/aui.css">
    
    </head>
    <body>
    
    ---
    <script src="http://apps.bdimg.com/libs/zepto/1.1.4/zepto.min.js"></script>
    <script>
    
        $('#cancel').click(function () {
            history.go(-1);
        });
    
        $('#edit_submit').click(function () {
    
            var user_name = $('#user_name').val();
            var sex = $("input[name='sex']:checked").val()
            var mobile = $('#mobile').val();
            if (!mobile || !(/^1\d{10}$/.test(mobile))) {
                alert('手机号输入错误');
            } else {
                $.ajax({
                    type: 'POST',
                    url: '/user/updateaccount',
                    // data to be added to query string:
                    data: {user_name: user_name, sex: sex, mobile: mobile, medical_history: medical_history},
                    // type of data we are expecting in return:
                    dataType: 'json',
                    timeout: 3000,
                    context: $('body'),
                    success: function (data) {
                        console.log(data)
                        if (data && data.errno == 0) {
                            alert('修改成功')
                            location.href = "/user/profile";
                        } else {
                            alert(data.errmsg ? data.errmsg : '系统异常,请稍后再试')
                        }
                    },
                    error: function (xhr, type) {
                        alert('网络不好,请稍后再试')
                    }
                })
    
            }
        });
    
    </script>
    </body>
    </html>


## ui效果图
![aui]({{ site.url }}/assets/projects/aui01.png)  
![aui]({{ site.url }}/assets/projects/aui02.png)  
![aui]({{ site.url }}/assets/projects/aui03.png)  

   
## 扩展阅读 
 
* [http://frozenui.github.io/](http://frozenui.github.io/) 
* [http://sui.taobao.org/sui/docs/](http://sui.taobao.org/sui/docs/)
