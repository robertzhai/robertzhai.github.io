---
layout: post
title:  "server- <<swoole-hearbeat-exception>>"
date:   2017-3-20 21:30:0 +0800
categories: server
---

>swoole定时器发心跳，之前加了异常不能捕获socket断开的异常，终极方案是判断返回值

## swoole_timer_tick 
>Severity: Warning --> swoole_client::send(): object is not instanceof swoole_client.

    //30s发一次心跳包
    swoole_timer_tick(30 * 1000, function ($timer_id) use ($client) {
        //心跳包内容
        $heartbeat_param = 'ping';
        $heartbeat_bin = pack('C4', 0, 0, 0, strlen($heartbeat_param));  //加4字节宽的包头
        try {
            if (!$client || !($client instanceof swoole_client)) {
                .....
            }
            $send_result = $client->send($heartbeat_param);
            log_message('debug', "send result:" . $send_result);
            //判断返回值
            if(!$send_result) {
                log_message('error', 'client 被服务端断开,退出重新执行' . PHP_EOL);
                $mail_result = MailTool::send('socket报警', 'client 被服务端断开,退出重新执行');
                if ($mail_result) {
                    log_message('debug', '发送报警邮件成功');
                } else {
                    log_message('error', '发送报警邮件失败');
                }
                exit('client 被服务端断开,退出重新执行');
            }
            log_message('debug', '发送心跳' . PHP_EOL);
        } catch (Exception $e) {
            log_message('error', '发送心跳, error:' . $e->getMessage() . PHP_EOL);
            log_message('error', ' 检测心跳错误,执行关闭 $client->close() ' . PHP_EOL);
            exit(' $client->close() ');
        }

    });


## 参考

* [https://wiki.swoole.com/wiki/page/41.html](https://wiki.swoole.com/wiki/page/41.html)