---
layout: post
title:  "服务器环境搭建和配置- centos install nginx php mysql "
date:   2017-1-23 18:30:0 +0800
categories: server
---

>搭建一个LNMP的测试环境，记录下，备忘。

## nginx configure and install

    wget ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.37.tar.gz
    wget http://zlib.net/zlib-1.2.11.tar.gz
    wget http://nginx.org/download/nginx-1.8.1.tar.gz

    编译安装zlib,pcre,然后编译nginx

    ./configure --sbin-path=/usr/local/nginx/nginx \
    --conf-path=/usr/local/nginx/nginx.conf \
    --pid-path=/usr/local/nginx/nginx.pid \
    --with-http_ssl_module \
    --with-pcre=/home/work/pcre-8.39 \
    --with-zlib=/home/work/zlib-1.2.11 \


## mysql compile and install

    wget http://ftp.ntu.edu.tw/MySQL/Downloads/MySQL-5.6/mysql-5.6.34.tar.gz

    cmake \
    -DCMAKE_INSTALL_PREFIX=/usr/local/mysql \
    -DMYSQL_DATADIR=/usr/local/mysql/data \
    -DSYSCONFDIR=/etc \
    -DWITH_MYISAM_STORAGE_ENGINE=1 \
    -DWITH_INNOBASE_STORAGE_ENGINE=1 \
    -DWITH_MEMORY_STORAGE_ENGINE=1 \
    -DWITH_READLINE=1 \
    -DMYSQL_UNIX_ADDR=/var/lib/mysql/mysql.sock \
    -DMYSQL_TCP_PORT=3306 \
    -DENABLED_LOCAL_INFILE=1 \
    -DWITH_PARTITION_STORAGE_ENGINE=1 \
    -DEXTRA_CHARSETS=all \
    -DDEFAULT_CHARSET=utf8 \
    -DDEFAULT_COLLATION=utf8_general_ci     


## php configure and install

    yum install –y gd php-gd freetype freetype-devel libpng libpng-devel libjpeg*

    wget http://am1.php.net/distributions/php-5.6.30.tar.gz

    ./configure --prefix=/usr/local/php \
    --with-config-file-path=/usr/local/php/etc \
    --with-mysql=/usr/local/mysql \
    --with-mysqli=/usr/local/mysql/bin/mysql_config \
    --with-mysql-sock=/var/lib/mysql/mysql.sock \
    --with-pdo-mysql=/usr/local/mysql \
    --with-gd --with-zlib --with-iconv -enable-zip --enable-pdo \
    --enable-xml --with-openssl --with-curl --enable-bcmath \
    --enable-ftp --enable-xml --with-openssl --with-curl \
    --enable-bcmath --enable-ftp --enable-mbstring --enable-fpm \
    --with-gd --enable-shmop \
    --enable-sysvsem --enable-mbregex --enable-gd-native-ttf \
    --enable-pcntl --enable-sockets --with-xmlrpc --enable-soap \
    --without-pear --with-gettext --enable-session \
    --with-jpeg-dir=/usr/lib --with-png-dir=/usr/lib \
    --with-freetype-dir=/usr/lib

## nginx.conf

    user  nobody;
    worker_processes  1;
    events {
        worker_connections  1024;
    }
    http {
        include       mime.types;
        default_type  application/octet-stream;
        log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                          '$status $body_bytes_sent "$http_referer" '
                          '"$http_user_agent" "$http_x_forwarded_for"';
        access_log  logs/access.log  main;
        sendfile        on;
        tcp_nopush     on;
        tcp_nodelay        on;
        keepalive_timeout  60;

        gzip  on;
        gzip_vary          on;
        gzip_comp_level    6;
        gzip_buffers       16 8k;
        gzip_min_length    1000;
        gzip_proxied       any;
        gzip_disable       "msie6";
        gzip_http_version  1.0;
        gzip_types         text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript application/javascript;

        server {
            listen       80;
            server_name  localhost;
            location / {
                root   html;
                index  index.html index.htm;
            }
            #error_page  404              /404.html;
            # redirect server error pages to the static page /50x.html
            #
            error_page   500 502 503 504  /50x.html;
            location = /50x.html {
                root   html;
            }
            location ~ \.php$ {
                root           /www/;
                fastcgi_pass   127.0.0.1:9000;
                fastcgi_index  index.php;
                fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
                include        fastcgi_params;
            }
            # deny access to .htaccess files, if Apache's document root  concurs with nginx's one
            location ~ /\.ht {
                deny  all;
            }
        }
    }
 

## chkconfig 开机启动  

    sudo cp support-files/mysql.server /etc/init.d/mysql
    sudo chkconfig mysql on
    sudo cp sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm
    sudo chkconfig php-fpm on
  
## 启动服务

    sudo service mysql start
    sudo service php-fpm start


## ssh 信任关系，配置好本地可以 ssh 或者 rsync 远程开发机，不用输入密码
    mkdir /home/work/.ssh
    cd ~
    chmod 700 .ssh
    生成本地的私钥和公钥
    ssh-keygen -t rsa
    scp id_rsa.pub work@abc.hostname:/home/work/.ssh/authorized_keys
    ssh work@abc.hostname
    cd /home/work/.ssh/
    chmod 600 authorized_keys
    不能少了chmod两步，否则会导致ssh还需要输入密码
    

## 上传代码到服务器
    rsync -avr --exclude=xxx.sh  *  work@abc.host:/path/to


# 扩展阅读
* [my-nginx-conf-for-wpo.html](https://imququ.com/post/my-nginx-conf-for-wpo.html)
* [www.nginx.cn/231.html](http://www.nginx.cn/231.html)
* [www.nginx.cn/install](http://www.nginx.cn/install)
* [yq.aliyun.com](https://yq.aliyun.com/articles/38540)