---
layout: post
title:  "Resque使用总结"
date:   2017-2-26 20:0:0 +0800
categories: projects
---

## Resque
>是一个基于redis的异步处理消息的queue

## Job
>一个待处理的任务，比如发邮件、发短信,一个job需要有对应的job class,例如UserJob,必须要实现一个
perform方法，用户处理job的任务，job的数据通过$this->args来获取。
    
    class UserJob
    {
    
        public function perform()
        {
            $data       = $this->args;
            $saveResult = $this->save_user($data);
            if ($saveResult) {
                Log::debug(__CLASS__ . ' perform succ : ' . json_encode($data));
            } else {
                Log::error(__CLASS__ . ' process fail : ' . json_encode($data));
            }
        }
        
        ......
        
    }
    

## Job入队
>讲job加入到redis队列里面,比如讲UserJob加入UserJobQueue里面
Resque::enqueue('UserJobQueue', 'UserJob', $data, true);

## Worker
>一个worker就是处理Job的角色，对消息进行消费，相当于consumer，分为blocking和nonblocking两种
模式，就是使用redis的blpop和lpop从队列里面获取job的数据。worker通过Resque::fork()产生子进程来处理消息，父
worker来监听子进程的状态，子进程处理完消息就退出，父进程继续Resque::fork()产生子进程来消费更多的消息,父进程默认会sleep 5秒，
如果消息多，可以设置为1或0，sleep时间短些。

    $this->child = Resque::fork();
    
    // Forked and we're the child. Run the job.
    if ($this->child === 0 || $this->child === false) {
        $status = 'Processing ' . $job->queue . ' since ' . strftime('%F %T');
        $this->updateProcLine($status);
        $this->logger->log(Psr\Log\LogLevel::INFO, $status);
        $this->perform($job);
        if ($this->child === 0) {
            exit(0);
        }
    }

    if($this->child > 0) {
        // Parent process, sit and wait
        $status = 'Forked ' . $this->child . ' at ' . strftime('%F %T');
        $this->updateProcLine($status);
        $this->logger->log(Psr\Log\LogLevel::INFO, $status);

        // Wait until the child process finishes before continuing
        pcntl_wait($status);
        $exitStatus = pcntl_wexitstatus($status);
        if($exitStatus !== 0) {
            $job->fail(new Resque_Job_DirtyExitException(
                'Job exited with exit code ' . $exitStatus
            ));
        }
    }

    $this->child = null;
    $this->doneWorking();

## worker的启动方式
>QUEUE=redis_queue_user nohup php resque_user.php &
>QUEUE是对应消费的队列名

## 重启worker进程
>ps aux | grep resque | grep -v 'grep' | awk '{print $2;}'
    
## 扩展阅读  
>1. [http://avnpc.com/pages/run-background-task-by-php-resque](http://avnpc.com/pages/run-background-task-by-php-resque) 
>2. [https://github.com/chrisboulton/php-resque](https://github.com/chrisboulton/php-resque)