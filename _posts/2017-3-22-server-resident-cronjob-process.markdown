---
layout: post
title:  "server- <<resident-cronjob-process>>"
date:   2017-3-22 21:30:0 +0800
categories: server
---

>接手了个项目，需要常驻后台的cronjob，总结下常用的方法

#### shell，担当manager来定时检测process，如果没有run就start
>*/1 * * * * 1 sh check.sh


    #!/bin/bash
    
    count=`ps aux | grep processname | grep -v grep`
    if [ $? -ne 0 ]; then
        start_command > /dev/null &
        echo "start process....."
    else
        echo "runing....."
    fi

#### 进程自己检测,防重入，同一时间只一个进程 run

>*/1 * * * * 1 start_process_command

    $cmd = 'ps aux | grep -i processname | grep -v grep | wc -l';
    exec($cmd, $result);
    log_message('debug', '$ret:' . json_encode($ret));

    if ($result && intval($result[0]) >= 3) {
        log_message('debug', 'processname already running');
        exit('processname already running');
    } else {
        log_message('error', 'processname not running, start');
    }
    
   
#### python的 Supervisor
>[http://supervisord.org/](http://supervisord.org/)

