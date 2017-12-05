---
layout: post
title:  "2017-11-18-bigdata-book-<<hadoop-with-python>>part-1"
date:   2017-11-18 20:30:0 +0800
categories: bigdata
---


# install hadoop
    brew install hadoop
   
#Hadoop 配置单节点使用

使用单节点配置文件目录 /usr/local/Cellar/hadoop/2.8.2/libexec/etc/hadoop

#配置 hdfs-site.xml

    设置副本数为 1:
    
    <configuration>
      <property>
        <name>dfs.replication</name>
        <value>1</value>
      </property>
    </configuration>
#配置 core-site.xml

    设置文件系统访问的端口：
    
    <configuration>
      <property>
        <name>fs.defaultFS</name>
        <value>hdfs://localhost:9000</value>
      </property>
    </configuration>
#配置 mapred-site.xml

    设置 MapReduce 使用的框架：
    
    <configuration>
      <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
      </property>
    </configuration>
# 配置 yarn-site.xml

    <configuration>
        <property>
            <name>yarn.nodemanager.aux-services</name>
            <value>mapreduce_shuffle</value>
        </property>
    </configuration>

# Hadoop 运行

    加入启动和停止 Hadoop 的 alias
    
    alias hdstart="start-dfs.sh ; start-yarn.sh"
    alias hdstop="stop-yarn.sh ; stop-dfs.sh"
#格式化文件系统

    $ hdfs namenode -format
#启动 

    hdstart
#建立用户空间

    hdfs dfs -mkdir /user
    hdfs dfs -mkdir /user/yourusername
# hdfs commands

1. 查看hdfs root 内容
    hdfs dfs -ls /
    hdfs dfs -ls -R  /
    
2.Creating a Directory
    hdfs dfs -mkdir /user
    hdfs dfs -mkdir /user/hduser
    
3.Copy Data onto HDFS
    hdfs dfs -put input.txt /user/hduser
 
4.Retrieving Data from HDFS
    hdfs dfs -cat /user/hduser/README.md
    hdfs dfs -get /user/hduser/README.md /tmp/README.md

5. help
    hdfs dfs -help
    
6. Snakebite
    Snakebite is a Python package, created by Spotify, that provides a Python 
    client library, allowing HDFS to be accessed programmatically from Python 
    applications. The client library uses protobuf messages to communicate 
    directly with the NameNode. The Snakebite package also includes a command-line 
    interface for HDFS that is based on the client library”

     pip install snakebite
     
     from snakebite.client import Client
     client = Client('localhost', 8020)
     
     ~/.snakebiterc
     {
       "config_version": 2,
       "use_trash": true,
       "namenodes": [
         {"host": "localhost", "port": 8020, "version": 9}
       ]
     }

     
     ➜  hadoop-2.8.0 git:(master) ✗ snakebite --help
     snakebite [general options] cmd [arguments]
     general options:
       -D --debug                     Show debug information
       -V --version                   Hadoop protocol version (default:9)
       -h --help                      show help
       -j --json                      JSON output
       -n --namenode                  namenode host
       -p --port                      namenode RPC port (default: 8020)
       -v --ver                       Display snakebite version
     
     commands:
       cat [paths]                    copy source paths to stdout
       chgrp <grp> [paths]            change group
       chmod <mode> [paths]           change file mode (octal)
       chown <owner:grp> [paths]      change owner
       copyToLocal [paths] dst        copy paths to local file system destination
       count [paths]                  display stats for paths
       df                             display fs stats
       du [paths]                     display disk usage statistics
       get file dst                   copy files to local file system destination
       getmerge dir dst               concatenates files in source dir into destination local file
       ls [paths]                     list a path
       mkdir [paths]                  create directories
       mkdirp [paths]                 create directories and their parents
       mv [paths] dst                 move paths to destination
       rm [paths]                     remove paths
       rmdir [dirs]                   delete a directory
       serverdefaults                 show server information
       setrep <rep> [paths]           set replication factor
       stat [paths]                   stat information
       tail path                      display last kilobyte of the file to stdout
       test path                      test a path
       text path [paths]              output file in text format
       touchz [paths]                 creates a file of zero length
       usage <cmd>                    show cmd usage

       to see command-specific options use: snakebite [cmd] --help
     
     
     The snakebite CLI is a Python alternative to the hdfs dfs command.
     
7. hadoop streaming example
    grep input 目录里面，含有多少个 hdfs
    hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.8.2.jar grep  input  output  hdfs
    
8. python streaming  MapReduce job
    
    echo $(whoami) 
    echo "start python streaming job ";
    hdfs dfs -rm -r /user/$(whoami)/output
    
    hadoop jar share/hadoop/tools/lib/hadoop-streaming-2.8.2.jar  \
    -files ./python/mapper.py,./python/reducer.py \
    -mapper mapper.py  -reducer reducer.py  \
    -input /user/$(whoami)/input/core-site.xml -output output
    
    echo "end python streaming job"
    
    hdfs dfs -cat /user/$(whoami)/output/part-00000
    
9. mrjob
    pip install mrjob
    
