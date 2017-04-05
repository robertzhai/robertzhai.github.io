---
layout: post
title:  "php-extension-ip2long"
date:   2017-4-4 20:0:0 +0800
categories: server
---

## ip2long
>php中的ip2long函数在有前缀0的情况想不能正常返回，正好可以作为一个扩展来实现的例子，基于php5.6。

## ext_skel 生成reobet扩展骨架
>cd php-5.6.30/ext/ 
>./ext_skel --extname=robert


## 修改config.m4

    PHP_ARG_WITH(robert, for robert support,
    [  --with-robert             Include robert support])
    
## 修改 php_robert.h

    PHP_FUNCTION(robert_ip2long);
    

## 修改 robert.c 实现 robert_ip2long

    zend_module_entry robert_module_entry = {
        STANDARD_MODULE_HEADER,
        "robert",
        robert_functions,
        PHP_MINIT(robert),
        PHP_MSHUTDOWN(robert),
        PHP_RINIT(robert),		/* Replace with NULL if there's nothing to do at request start */
        PHP_RSHUTDOWN(robert),	/* Replace with NULL if there's nothing to do at request end */
        PHP_MINFO(robert),
        PHP_ROBERT_VERSION,
        STANDARD_MODULE_PROPERTIES
    };

    const zend_function_entry robert_functions[] = {
    	PHP_FE(confirm_robert_compiled,	NULL)		/* For testing, remove later. */
    	PHP_FE(robert_ip2long,NULL) /* for robert_ip2long */
    	PHP_FE_END	/* Must be the last line in robert_functions[] */
    };

    PHP_FUNCTION(robert_ip2long) {
    
    	char *ip = NULL;
    	int ip_len;
    	unsigned int ip1,ip2,ip3,ip4;
    	unsigned long result;
    
    	if (zend_parse_parameters(ZEND_NUM_ARGS() TSRMLS_CC, "s", &ip, &ip_len) == FAILURE) {
    	    return;
    	}
        //	php_printf("input_ip=:%s", ip);
    	sscanf(ip, "%d.%d.%d.%d", &ip1, &ip2, &ip3, &ip4);
        //	php_printf("%d.%d.%d.%d", ip1, ip2,ip3,ip4);
        //	result = (((ip1 * 255) + ip2) * 255 + ip3) * 255 + ip4;
    	result =  (ip1 << 24) | ( ip2 << 16) | ( ip3 << 8 ) | ip4;
    	RETURN_LONG(result);
    
    }

## build ext robert_ip2long 生成 robert.so
    
    /usr/local/php/bin/phpize
    ./configure --with-php-config=/usr/local/php/bin/php-config
    sudo make && sudo  make install
    sudo service php-fpm restart

## check robert ext
    
    $ php -m | grep robert
    robert
    
## test case

    <?php
    var_dump(robert_ip2long('127.255.255.255'));
    var_dump(robert_ip2long('027.255.255.255'));
    var_dump(robert_ip2long('255.255.255.255'));

    output:
    int(2147483647)
    int(469762047)
    int(4294967295)
    int(4294967295)


## 段错误调试方法
>ulimit -c unlimited
>gdb php -c core.15151
   

## github source code

* [https://github.com/robertzhai/php-ext-dev](https://github.com/robertzhai/php-ext-dev)


## 参考

* [http://www.cnblogs.com/iblaze/archive/2013/06/02/3112603.html](http://www.cnblogs.com/iblaze/archive/2013/06/02/3112603.html)
* [如何调试PHP的Core之获取基本信息](http://www.laruence.com/2011/06/23/2057.html)
* [PHP ip2long() 回传值为负数 的 解法](http://www.hksilicon.com/articles/4155?lang=cn)
