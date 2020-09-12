## gzip压缩实践

####同事反映内网一个api接口浏览器下载时间很长，没有开启gzip,需要开启gzip减少下载时间

####内网域名是走的公司的通用平台，默认不开启gzip,抓包看了下
```
connection →keep-alive  
content-type →application/json; charset=utf-8 
server →nginx   
transfer-encoding →chunked   
```

#### 查了下gzip相关文档和公司平台，对location部分增加了如下配置

```
gzip on;
gzip_comp_level 4;
gzip_min_length 1024;
gzip_types text/plain application/x-javascript  application/json text/css application/xml text/javascript;

```

#### 再查看相应头，有了content-encoding →gzip ，下载时间明显缩短

```
connection →keep-alive
content-encoding →gzip
content-type →application/json; charset=utf-8
server →nginx
transfer-encoding →chunked

```

#### gzip 工作原理
>1)浏览器请求url，并在request header中设置属性accept-encoding:gzip。表明浏览器支持gzip。

>2)服务器收到浏览器发送的请求之后，判断浏览器是否支持gzip，如果支持gzip，则向浏览器传送压缩过的内容，不支持则向浏览器发送未经压缩的内容。一般情况下，浏览器和服务器都支持gzip，response headers返回包含content-encoding:gzip。

>3)浏览器接收到服务器的响应之后判断内容是否被压缩，如果被压缩则解压缩显示页面内容。


#### gzip 指令说明
```
1) gzip on：开启gzip。

2) gzip_comp_level：gzip压缩比。

3) gzip_min_length：允许被压缩的页面最小字节数。

4) gzip_types：匹配MIME类型进行压缩，text/html默认被压缩。
```


#### 参考
* http://nginx.org/en/docs/http/ngx_http_gzip_module.html


