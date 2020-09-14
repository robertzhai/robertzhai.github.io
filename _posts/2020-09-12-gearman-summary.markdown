### 为什么要用 gearman 
>gearman 非常适合来做异步的任务调度和分发，我们项目组采用gearman来做性能优化，将耗时上报、更新db、更新redis等相关的封装成一个个job ,采用doBackground提交给job server 集群, 启动多个job worker来从job server 集群拉取job进行处理。 

### gearman的内部机制
> gearman 分为 client 、server 和 worker 3 个角色，client 将job 提交给server ,server 将job 派发给空闲的worker，3个通过tcp来通讯。 使用gearman需要安装一个gearman server , 负责接收客户端提交的job,job默认保存在内存中， job可以持久化到mysql 等storage里面，保证job server 重启数据不丢，下面整理下linux开发机上相关的安装。

### gcc 版本
>gcc version 4.9.4 (GCC)

### 安装依赖
>boost  
    yum install boost-devel

>gperf  
    yum install gperf

>libevent  
    yum install libevent-devel

>libuuid  
    yum install libuuid-devel


###  gearman server 安装

>下载最新的包  
    wget   https://github.com/gearman/gearmand/releases/download/1.1.18/gearmand-1.1.18.tar.gz  
> tar zxvf gearmand-1.1.18.tar.gz   
> cd gearmand-1.1.18   
> ./configure
> make && make install 

### start gearman server ,myslq 作为持久化
>   /usr/local/sbin/gearmand -d  -Lx.x.x.x -p x 
    --log-file--log-file=/data/logs/gearman/gearmand.log \  
    --queue-type=MySQL \  
    --mysql-host=x.x.xx.xx \  
    --mysql-port=x \ 
    --mysql-user=db_gearman \  
    --mysql-password=pwd \  
    --mysql-db=user ; 

### php gearman 扩展安装
> wget http://pecl.php.net/get/gearman-1.1.2.tgz 
> tar zxf gearman-1.1.2.tgz   
> /usr/php/bin/phpize    
> ./configure --with-php-config=/usr/php/bin/php-config   
> make && make install   

### 测试gearman

>php worker    
>
    <?php    
    $worker = new GearmanWorker();  
    $worker->addServer("127.0.0.1", '4730');  
    $worker->addFunction("reverse", "reverse_fn");      
    while (1) {  
        print "Waiting for job...\n";  
        $ret = $worker->work();  
        if ($worker->returnCode() != GEARMAN_SUCCESS) {  
            break;    
        }  
    }    
    function reverse_fn(GearmanJob $job) {  
        $workload = $job->workload();  
        echo "Received job: " . $job->handle() . "\n";  
        echo "Workload: $workload\n";  
        $result = strrev($workload);  
        echo "Result: $result\n";  
        return $result;  
    }  
>   
>   php client     
>
    <?php     
        $client = new GearmanClient();  
        $client->addServer("127.0.0.1", '4730');    
        echo "Sending job\n";  
        $result = $client->doNormal("reverse", "Hello!");  
        if ($result) {  
              echo "Success: $result\n";  
        }


### 环境迁移注意的问题
>线上环境需要和测试环境的保持一致，避免版本不一致带来问题。


###参考文档
* http://gearman.org/