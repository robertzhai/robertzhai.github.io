---
layout: post
title:  "nginx config summary(一)"
date:   2016-11-23 21:0:0 +0800
categories: server
---

# 非法请求过滤  
>1.method

	if ($request_method !~ ^(GET|HEAD|POST)$) {
		return 403;
	}  

>2.url 包含特殊字符  

	if ( $request_uri ~ "(\$|;|'|%27|\(|\)|\<|%3C|\>|%3E)+" ){
		return 403;
	}  
	
>3.禁止文件注入  
 
	if ($query_string ~ "[a-zA-Z0-9_]=http://") {
		return 403;
	}  
	if ($query_string ~ "[a-zA-Z0-9_]=(\.\.//?)+") {
		return 403;
	}  	
	if ($query_string ~ "[a-zA-Z0-9_]=/([a-z0-9_.]/?)+") {
		return 403;
	}  

>4.特殊单词  
 
	
	if ( $request_uri ~* "(etc\/passwd)|(bash_)|(mysql)|(echo)|(expr)|(\.git)|(\.svn)|(\.bash)" ){
		return 403;
	}  
	
>5.接口后缀  
 
	
	location ~*  \.(aspx|asp|jsp|cgi|php|do|json|txt|log|inc|ini|xml|git|svn|htaccess|csv)$ {
		    return 403;
	}

# https 访问
>1.生成证书  

	openssl req -x509 -nodes -days 36500 -newkey rsa:2048 -keyout ./nginx.key -out ./nginx.crt

>2.修改nginx配置  

	 server {

        listen 443 ssl;

        ssl_certificate /usr/local/etc/nginx/ssl/nginx.crt;
        ssl_certificate_key /usr/local/etc/nginx/ssl/nginx.key;
        keepalive_timeout   70;
        server_name robert.com;
        #禁止在header中出现服务器版本，防止黑客利用版本漏洞攻击
        server_tokens off;
        #如果是全站 HTTPS 并且不考虑 HTTP 的话，可以加入 HSTS 告诉你的浏览器本网站全站加密，并且强制用 HTTPS 访问
        #add_header Strict-Transport-Security "max-age=31536000; includeSubdomains";
        # ......
        fastcgi_param   HTTPS               on;
        fastcgi_param   HTTP_SCHEME         https;
        root /wwwroot;
        index index.php  index.html index.htm main.php;

        location ~ \.php$ {
            fastcgi_pass   127.0.0.1:9000;
            fastcgi_index  index.php;
            fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include        fastcgi_params;
        }

    }  
      
      
     
>3.重启nginx  
     
# proxy pass 反向代理
>1.配置将外网请求转发到内网某台机器

	location /apitest/ {
	      proxy_pass       http://10.99.20.14:8099/api/;
	      proxy_set_header Host      $host;
	      proxy_set_header X-Real-IP $remote_addr;
	}
	10.99.20.14是内网开发机的ip,如上所示,请求 http://abc.com/apitest/query  就相当于请求   http://10.99.20.14:8099/api/query ,实现讲外网请求转发到内网,不用申请开发机的外网ip。
	
>2.配置负载均衡  
 
	upstream  blog.com {
              server   192.168.1.1:8080;
              server   192.168.1.7:8081;         
      }
      server
      {
              listen  8080;
              server_name  www.abc.com;
              location / {
                   proxy_pass        http://blog.com;
                   proxy_set_header   Host             $host;
                   proxy_set_header   X-Real-IP        $remote_addr;
                   proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
              }           
      }


# css , js , images cache
>  
		
	# images (?:exp)匹配exp,不捕获匹配的文本，也不给此分组分配组号
	location ~* \.(?:jpg|jpeg|gif|png|ico|)$ {
	  root /wwwroot/web;
	  expires 1M;
	  access_log off;
	  add_header Cache-Control "public";
	}
	
	# CSS and Javascript 
	location ~* \.(?:css|js)$ {
		root /wwwroot/web;
	  expires 1y;
	  access_log off;
	}
	
	
	
# 参考资料
1.[https://github.com/h5bp/server-configs-nginx/blob/master/h5bp/location/expires.conf ](https://github.com/h5bp/server-configs-nginx/blob/master/h5bp/location/expires.conf )  
2.[https://www.nginx.com/resources/wiki/start/](https://www.nginx.com/resources/wiki/start/)  
3.[http://nginx.org/en/docs/http/ngx_http_headers_module.html](http://nginx.org/en/docs/http/ngx_http_headers_module.html)
4.[http://deerchao.net/tutorials/regex/regex.htm#backreference](http://deerchao.net/tutorials/regex/regex.htm#backreference)