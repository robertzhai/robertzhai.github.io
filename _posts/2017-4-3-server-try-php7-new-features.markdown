---
layout: post
title:  "try-php7-new-features"
date:   2017-4-3 20:0:0 +0800
categories: server
---

## php7
>目前项目用的php大多是php5.x, 最近看了本<<php 7 programming cookbook>>,
尝试了下php7的一些新特性，考虑对以前的部分项目进行升级到php7,
在测试机上安装了下php7,尝试了下一些新特性。

## install php7

    ./configure --prefix=/usr/local/php7 \
    --with-config-file-path=/usr/local/php7/etc \
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

## php7 version

    /usr/local/php7/bin/php -v
    PHP 7.1.3 (cli) ( NTS )
    Copyright (c) 1997-2017 The PHP Group
    Zend Engine v3.1.0, Copyright (c) 1998-2017 Zend Technologies

## strict_types
>在脚本开头如果申明strict_types=1，就回对参数进行严格检查，如int传float会报错，不申明的话会
进行强制转换。
>declare(strict_types=1);

## 测试用例

    function add(int $a, int $b): int {
        return $a + $b;
    }
    
    $result = $_GET['key1'] ?? $_GET['key2'] ?? '';
    var_dump($result);
    $result = $_GET['key3'] ?? '';
    var_dump($result);
    
    var_dump(intdiv(10,3));
    var_dump(intdiv(10,5));
    
    define('MY_DATA', [
        'a',
        'b',
        'c'
    ]);
    
    echo MY_DATA[1]; 
    
    $class = new class(array('data'=>'class')) {
    
        public function __construct($data) {
    
            $this->data = $data;
    
        }
    
        public function __call($name, $params) {
    
            preg_match('/^(get|set)(.*?)$/i', $name, $matche);
            $prefix = $matche[1] ?? '';
            $suffix = $matche[2] ?? '';
            if($prefix && $suffix) {
                $prefix = strtolower($prefix);
                $suffix = strtolower($suffix);
                if($prefix == 'get') {
                    return $this->$suffix ?? '';
                }
            }
            return '';
        }
    
    };
    
    var_dump($class->getData());
    

## 网盘

* [php 7 programming cookbook](https://pan.baidu.com/s/1qXQpgeg)


## 参考

* [http://php.net/manual/zh/migration70.new-features.php](http://php.net/manual/zh/migration70.new-features.php)

   
