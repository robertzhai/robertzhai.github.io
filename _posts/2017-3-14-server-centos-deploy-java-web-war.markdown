---
layout: post
title:  "server- <<centos-deploy-java-web-war>>"
date:   2017-3-14 21:30:0 +0800
categories: server
---

>今天整理了下java的web项目部署到centos服务器的步骤，方便供后续查阅。

## spring boot 项目打war包 
>Application.class

    @SpringBootApplication
    public class Application extends SpringBootServletInitializer {

        @Autowired
        private UserRepository repository;
        
        private static Logger logger = LogManager.getLogger(Application.class);
    
        @Override
        protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
            return application.sources(Application.class);
        }
    
        public static void main(String[] args) {
            SpringApplication.run(Application.class);
            logger.info("info ");
            logger.error("error");
            logger.warn("warn");
        }
    }

>pom.xml
    
    <groupId>spboot</groupId>
    <artifactId>robert</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>
    
    .....
    
    <build>
            <plugins>
                <plugin>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-maven-plugin</artifactId>
                </plugin>
    
            </plugins>
            <finalName>spboot</finalName>
        </build>

>mvn clean

>mvn package

>讲war包上传到tomcat的webapps目录 /tomcat/tomcat8/webapps

## install jdk
>wget --no-cookies --no-check-certificate --header 
"Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie" 
"http://download.oracle.com/otn-pub/java/jdk/8u121-b13/e9e7ea248e2c4826b92b3f075a80e441/jdk-8u121-linux-x64.rpm"
>sudo rpm -ivh jdk-8u121-linux-x64.rpm
>java version

     $java -version
     java version "1.8.0_121"
     Java(TM) SE Runtime Environment (build 1.8.0_121-b13)
     Java HotSpot(TM) 64-Bit Server VM (build 25.121-b13, mixed mode)

## java_home classpath 配置
>sudo vim /etc/profile.d/java.sh
    
    #!/bin/bash
    JAVA_HOME=/usr/java/jdk1.8.0_121/
    PATH=$JAVA_HOME/bin:$PATH
    export PATH JAVA_HOME
    export CLASSPATH=.

>chmod +x /etc/profile.d/java.sh; 
>source /etc/profile.d/java.sh;


## config tomcat
>conf/server.xml
 
    <Connector port="8080"
               protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443"
               compression="on"
               URIEncoding="utf-8"
    />

## start tomcat
>bin/catalina.sh start

#参考

* [https://docs.spring.io/spring-boot/docs/current/reference/html/howto-traditional-deployment.html](https://docs.spring.io/spring-boot/docs/current/reference/html/howto-traditional-deployment.html)