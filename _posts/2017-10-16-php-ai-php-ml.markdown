---
layout: post
title:  "php-ai-php-ml"
date:   2017-10-16 20:30:0 +0800
categories: bigdata
---

无意中发现php有个ml的库,不过需要php7以上才支持，看了下文档，简单整理下。

## install php 7.1
    
    brew install php-version
    brew unlink php56
    brew tap homebrew/dupes
    brew tap homebrew/homebrew-php
    brew install php71
    php-version 7
    
    php -v
    PHP 7.1.10 (cli) (built: xx) ( NTS )
    Copyright (c) 1997-2017 The PHP Group
    Zend Engine v3.1.0, Copyright (c) 1998-2017 Zend Technologies
     
## start php ml lib
    
    下载依赖
    composer require php-ai/php-ml  
    
    <?php
    require_once 'vendor/autoload.php';
    
    use Phpml\Classification\KNearestNeighbors;
    
    $samples = [[1, 3], [1, 4], [2, 4], [3, 1], [4, 1], [4, 2]];
    $labels = ['a', 'a', 'a', 'b', 'b', 'b'];
    
    $classifier = new KNearestNeighbors();
    $classifier->train($samples, $labels);
    
    echo $classifier->predict([3, 2]);
    
    上面是KNN算法的例子，输出：
    b




# 参考

* [https://www.leocode.net/article/index/26.html](https://www.leocode.net/article/index/26.html)
* [https://github.com/php-ai/php-ml](https://github.com/php-ai/php-ml)