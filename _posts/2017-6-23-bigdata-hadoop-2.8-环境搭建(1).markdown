---
layout: post
title:  "bigdata-hadoop-2.8-mapredue-环境搭建(1)"
date:   2017-6-23 20:30:0 +0800
categories: bigdata
---


# 配置ssh,无需登录密码在Hadoop集群
    ssh-keygen -t rsa
    cat id_rsa.pub >>authorized_keys
    chmod 600 authorized_keys
    chmod -R 700  .ssh
    ssh localhost

# install hadoop
    mkdir /wwwroot/hadoop/
    wget http://apache.fayea.com/hadoop/common/hadoop-2.8.0/hadoop-2.8.0.tar.gz


#config hadoop
>hadoop-env.sh

    export HADOOP_OPTS="$HADOOP_OPTS -Djava.net.preferIPv4Stack=true"
    改为
    export HADOOP_OPTS="$HADOOP_OPTS -Djava.net.preferIPv4Stack=true -Djava.security.krb5.realm= -Djava.security.krb5.kdc="

>core-site.xml 配置hdfs地址和端口

    <configuration>
      <property>
         <name>hadoop.tmp.dir</name>
            <value>/wwwroot/hadoop/hadoop-2.8.0/hdfs</value>
        <description>A base for other temporary directories.</description>
      </property>
      <property>
         <name>fs.default.name</name>
         <value>hdfs://localhost:8020</value>
      </property>
    </configuration>

>mapred-site.xml 配置mapreduce中jobtracker的地址和端口

    <configuration>
        <property>
            <name>mapred.job.tracker</name>
            <value>localhost:8021</value>
          </property>
    </configuration>


>hdfs-site.xml 修改hdfs备份数

    <!-- 该配置文件制定了HDFS的默认参数及副本数,因为仅运行在一个节点上,所以这里的副本数为1 -->
    <configuration>
        <property>
            <name>dfs.replication</name>
            <value>1</value>
        </property>
    </configuration>
    
    
# 格式化HDFS
    hdfs namenode -format

# ~/.bash_profile 配置Hadoop环境变量

    #hadoop
    export HADOOP_HOME='/wwwroot/hadoop/hadoop-2.8.0'
    export PATH=$HADOOP_HOME/sbin:$HADOOP_HOME/bin:$PATH
    alias hadoop="hdfs dfs "

# start hadoop
    start-dfs.sh  
    http://localhost:50070
    

# start yarn service
    start-yarn.sh 
    http://localhost:8088

	
# 创建work目录
    hadoop -mkdir /user
    hadoop -mkdir /user/username
    
# 上传文件到hdfs
    hadoop -put python/wordcount/wd_data wd_data
    
# hadoop-mapreduce-examples grep job 测试
    bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.8.0.jar \
    grep wd_data  wd_data_output_test '[a-z]{3}' 
    
# 从hdfs下载文件到本地
    hadoop -get wd_data_output_test wd_data_output_test
    
# 查看结果
    
    hadoop-2.8.0 cat wd_data_output_test/part-r-00000
    1	tes
    1	def
    1	abc
    
# 查看job
    yarn application -list
    
# kill job
    yarn application -kill $ApplicationId