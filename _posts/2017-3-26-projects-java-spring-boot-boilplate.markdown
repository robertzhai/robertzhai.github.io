---
layout: post
title:  "java-spring-boot-boilplate"
date:   2017-3-26 20:0:0 +0800
categories: projects
---

## java-spring-boot-boilplate
>convention over configuration的原则，用spring boot可以很快开发web项目，不用写很多的配置，
jrebel可以livereload方便调试, based on jpa、redis、mysql、maven、log4j2 etc。clone本
项目即可基于已经完成的样例代码进行快速开发、部署。

**[**基于**]**

* jpa
* redis
* mysql
* spring boot
* tomcat
* jrebel
* maven
* log4j2


## debug
>sh debug.sh   

## deploy
>sh deploy.sh  

## structure  

  ├── java  
  │   └── com    
  ├── resources    
  │   ├── META-INF    
  │   ├── application.properties    
  │   ├── conf    
  │   ├── log4j-spring.properties  
  │   ├── log4j2.xml  
  │   ├── rebel.xml  
  │   ├── static  
  │   └── templates  
  └── webapp  

## src 
  
  ├── Application.java  
  ├── cli  
  ├── config  
  ├── domain  
  ├── entity  
  ├── library  
  ├── service  
  ├── util  
  └── web  

## request flow
>web->service->domain

  * web : controller
  * service : service layer
  * library: lib
  * entity : entity for entity object
  * domain : jpa layer for dao operation
  * config : jedis config etc
  * cli : crontab job
  * Application.java: starter

   
## github

* [https://github.com/robertzhai/java-spring-boot-boilplate](https://github.com/robertzhai/java-spring-boot-boilplate)