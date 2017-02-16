---
layout: post
title:  "微信公众号总结"
date:   2017-2-7 20:0:0 +0800
categories: projects
---

## 公众号项目
>一个微信公众号的项目，主要包括刷新access_token、创建菜单、subscribe、scan、
unsubscribe、菜单响应、给对应微信用户发送消、服务器端swoole长连接和第三方socket服务实时数据通讯。
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
        $config['log_path'] = '/path/logs/cli/';
    } else {
        $config['log_path'] = '/path/logs/web/';
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
![wechat_server]({{ site.url }}/assets/projects/wechat_server.jpg) 
 
## swoole 扩展安装

    cd swoole
    phpize
    ./configure
    make 
    sudo make install

## swoole socket长连接,实时推送数据
>要设置connect、receive、error、close几个回调事件。

    $client = new swoole_client(SWOOLE_SOCK_TCP, SWOOLE_SOCK_ASYNC);
    $client->on("connect", function (swoole_client $cli) {
        //发送注册信息，注册客户端连接
        $cli->send($register);  
    };
    $client->on("receive", function (swoole_client $cli, $data) {
    };
    $client->on("error", function (swoole_client $cli) {
    };
    $client->on("close", function (swoole_client $cli) {
        $cli->connect(Constant::PUSH_HOST, Constant::PUSH_PORT); //重连
        log_message('error', 'socket断开后重连' . PHP_EOL);
    };
    //配置参数
    $client->set(array(
    ));
    $client->connect(Constant::PUSH_HOST, Constant::PUSH_PORT);
    //一分钟发一次心跳包，和socket服务器之间的心跳，如果超过一定时间没有发心跳包服务器会认
    //为连接失效，会断开连接。, 
    swoole_timer_tick(60 * 1000, function ($timer_id) use ($client) {
    };
            
## swoole 和 codeigniter 结合使用
>在codeigniter的action里面直接使用 swoole 的api，通过cli调用 swoole 的异步api  

## mysql 重新连接 / 保持连接有效
>当你在处理一些重量级的 PHP 操作时，如果超过了数据库的超时值， 你应该考虑在执行后续查询之前
先调用 reconnect() 方法向数据库发送 ping 命令， 这样可以优雅的保持连接有效或者重新建立起连接。
>mysql_ping() 检查到服务器的连接是否正常。如果断开，则自动尝试连接。本函数可用于空闲很久的脚本
来检查服务器是否关闭了连接，如果有必要则重新连接上。如果到服务器的连接可用则 mysql_ping() 返回
 TRUE，否则返回 FALSE。,参考[http://codeigniter.org.cn/user_guide/database/connecting.html](http://codeigniter.org.cn/user_guide/database/connecting.html)
 
     面向对象风格
     
     bool mysqli::ping ( void )
     过程化风格
     
     bool mysqli_ping ( mysqli $link )
    
    $this->db->reconnect();
    /**
     * Reconnect
     *
     * Keep / reestablish the db connection if no queries have been
     * sent for a length of time exceeding the server's idle timeout
     *
     * @return	void
     */
    public function reconnect()
    {
        if ($this->conn_id !== FALSE && $this->conn_id->ping() === FALSE)
        {
            $this->conn_id = FALSE;
        }
    }
  
## 脚本同一时间只能一个运行
>cronjob
*/2 * * * * cd /wwwroot/app; php index.php socket/pushclient push >>/wwwroot/logs/cli/push.log
    
    $cmd = 'ps aux | grep -i socket/Pushclient | grep -v grep | wc -l';
    exec($cmd, $ret);
    log_message('debug', '$ret:' . json_encode($ret));

    if ($ret && intval($ret[0]) >= 3) {
        log_message('debug', 'PushClient already running');
        exit('PushClient already running');
    } else {
        log_message('error', 'PushClient not running, start');
    }
    
    
## 扩展阅读  
>1. [http://mp.weixin.qq.com/wiki/home/index.html](http://mp.weixin.qq.com/wiki/home/index.html) 
>2. [微信API开发demo](http://www.huceo.com/post/407.html)
>3. [http://codeigniter.org.cn/](http://codeigniter.org.cn/)
>4. [http://www.swoole.com/](http://www.swoole.com/)