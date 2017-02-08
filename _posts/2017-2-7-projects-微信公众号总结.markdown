---
layout: post
title:  "微信公众号总结"
date:   2017-2-7 20:0:0 +0800
categories: projects
---

## 公众号项目
> 朋友的一个项目，我协助开发了一部分功能，主要有刷新access_token、创建菜单、subscribe、scan、
unsubscribe、菜单响应、给对应微信用户发送消、服务器端swoole长连接和第三方socket服务通讯。
用的lnmp+codeigniter+swoole

## 刷新access_token
>定时脚本一小时运行一次，调用access_token接口获取下access_token存储到表中，请求微信api时用
最新的access_token，异常用log_message打日志。

## 设置微信服务器回调应用服务器的回调地址和token
>这个必须要设置，

## 创建菜单
>按照文档，调用创建菜单接口，有个坑就是菜单名直接json_encode会提示字符超长，中文unicode后变长了，
要用json_encode($data,JSON_UNESCAPED_UNICODE)

## 微信接口curl调用
>因为都是https的，需要设置ssl，格式都是json的，需要设置下header

    
    if ($https) {
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // 跳过证书检查
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);  // 从证书中检查SSL加密算法是否存在
    }  
    
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                        'Content-Type: application/json; charset=utf-8',
                        'Content-Length: ' . strlen($data),
       )
    );
  

## 设置不同的日志路径，cli和web分开

    if (is_cli() && !isset($_SERVER['REMOTE_ADDR'])) {
        $config['log_path'] = '/wwwroot/logs/cli/';
    } else {
        $config['log_path'] = '/wwwroot/logs/web/';
    }

## cli运行
>运行 php index.php cli/controllername actionname  
设置cli请求校验

    if (!is_cli() || isset($_SERVER['REMOTE_ADDR'])) {
       header("HTTP/1.0 404 Not Found");
       exit('Not Found');
    }

## 给用户发消息

    public function send_text_message()
        {
            $open_id      = $open_id;
            $access_token = $this->query_token();
            $url          = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" . $access_token;
            $arr          = array(
                'touser'  => $open_id,
                'msgtype' => 'text',
                'text'    => array(
                    'content' => 'hello send_text_message',
                ),
            );
            $result = HttpClient::post($url, $arr, true);
            return $result;
        }

## 微信服务器和开发者服务器的交互图
![wechat_server]({{ site.url }}/assets/reading/wechat_server.jpg)  


## 扩展阅读  
>1. [http://mp.weixin.qq.com/wiki/home/index.html](http://mp.weixin.qq.com/wiki/home/index.html) 
>2. [微信API开发demo](http://www.huceo.com/post/407.html)
