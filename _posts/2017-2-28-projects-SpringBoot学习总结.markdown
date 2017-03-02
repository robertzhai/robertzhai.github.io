---
layout: post
title:  "SpringBoot学习总结"
date:   2017-2-28 20:0:0 +0800
categories: projects
---

## SpringBoot
>SpringMvc的项目早期开发要配置很多的xml文件，Spring Boot的设计目的是用来简化新Spring应用的
创建以及开发过程。Spring Boot并不是用来替代Spring的解决方案，而是和Spring框架紧密结合用于提升
Spring开发者体验的工具。Spring Boot应用通常只需要非常少量的配置代码，而且有内嵌的Web服务器，
让开发者能够更加专注于业务逻辑。

## 约定优先配置（convention over configuration）
>和其它的框架类似，加速了开发java相关的api和web,感觉和php的框架的一样。

## 视频教程
>[https://www.youtube.com/watch?v=Ke7Tr4RgRTs](https://www.youtube.com/watch?v=Ke7Tr4RgRTs)

## blog 教程
>这个blog教程断断续续看完了，写的不错，地址：[https://course.tianmaying.com/spring-mvc](https://course.tianmaying.com/spring-mvc)

## pom.xml

    <?xml version="1.0" encoding="UTF-8"?>
    <project xmlns="http://maven.apache.org/POM/4.0.0"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
        <modelVersion>4.0.0</modelVersion>
    
        <groupId>spboot</groupId>
        <artifactId>robert</artifactId>
        <version>1.0-SNAPSHOT</version>
    
        <parent>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-parent</artifactId>
            <version>1.4.3.RELEASE</version>
        </parent>
    
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-web</artifactId>
            </dependency>
    
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-test</artifactId>
                <scope>test</scope>
            </dependency>
    
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-thymeleaf</artifactId>
            </dependency>
    
            <dependency>
                <groupId>net.sourceforge.nekohtml</groupId>
                <artifactId>nekohtml</artifactId>
                <version>1.9.22</version>
            </dependency>
        </dependencies>
    
        <properties>
            <java.version>1.8</java.version>
        </properties>
    
    
        <build>
            <plugins>
                <plugin>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-maven-plugin</artifactId>
                </plugin>
            </plugins>
        </build>
    
    </project>
   
## 扩展阅读  
>1. [http://projects.spring.io/spring-boot/](http://projects.spring.io/spring-boot/) 
