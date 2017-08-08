---
layout: post
title:  "rabbitmq安装和使用"
date:   2017-8-8 20:30:0 +0800
categories: server
---


# 安装
    https://www.rabbitmq.com/download.html
    
# php 封装

    <?php
    
    /**
     * @desc   RabbitMesQueue.php
     * @author robertzhai
     */
    class RabbitMesQueue
    {
    
        private static $exchange_instance;
    
        private static $channel_instance;
    
        private static $amqp_connection;
    
        private static $queue_instance;
    
        //交换机名
        const EXCHANGE_NAME = 'sugar.xiaotangyi.durable';
        //路由key
        const KEY_ROUTE = 'usertestdata';
    
        const QUEUE_NAME = 'worker.xiaotangyi';
    
        public function __construct($conn_args)
        {
            if (self::$exchange_instance &&
                self::$exchange_instance instanceof AMQPExchange
            ) {
                return;
            }
            $conn_args = array(
                'host'     => $conn_args['host'],
                'port'     => $conn_args['port'],
                'login'    => $conn_args['login'],
                'password' => $conn_args['password'],
                'vhost'    => '/'
            );
            $e_name    = self::EXCHANGE_NAME; //交换机名
            //创建连接和channel
            $conn = new AMQPConnection($conn_args);
            if (!$conn->connect()) {
                log_message('error', ' Cannot connect to the broker!  '  . PHP_EOL);
            } else {
                log_message('debug',' succ connect to the broker!  ');
            }
            self::$amqp_connection = $conn;
            $channel = new AMQPChannel($conn);
            self::$channel_instance = $channel;
            $ex = new AMQPExchange($channel);
            $ex->setName($e_name);
            $ex->setFlags(AMQP_DURABLE); //持久化
            $ex->setType(AMQP_EX_TYPE_DIRECT);
            $ex->declareExchange();
            self::$exchange_instance = $ex;
        }
    
        public function producer($message, $connected = true)
        {
            log_message('debug', ' in producer '  . PHP_EOL);
            log_message('debug', ' in producer message: ' . json_encode($message)  . PHP_EOL);
            $k_route = self::KEY_ROUTE; //路由key
            //消息内容
            if(!$message){
                return false;
            }
            if(is_array($message) || is_object($message)) {
                $message = json_encode($message);
            }
            log_message('debug', 'producer message:' . $message . PHP_EOL);
    
            $send_result = self::$exchange_instance->publish($message, $k_route);
            if(!$connected && self::$amqp_connection->isConnected()) {
                self::$amqp_connection->disconnect();
            }
            if ($send_result) {
                log_message('debug', "Send Message $message succ" . "\n");
                return true;
            } else {
                log_message('error', "Send Message $message fail" . "\n");
                return false;
            }
    
        }
    
        public function __destruct()
        {
            if(self::$amqp_connection->isConnected()) {
                self::$amqp_connection->disconnect();
                self::$amqp_connection = null;
            }
    
            if(self::$exchange_instance && self::$exchange_instance) {
                self::$exchange_instance = null;
            }
    
        }
    
        private function init_queue() {
    
            if(!self::$queue_instance ||
                !(self::$queue_instance instanceof AMQPQueue) ) {
                //创建队列
                $queue = new AMQPQueue(self::$channel_instance);
                $queue->setName(self::QUEUE_NAME);
                $queue->setFlags(AMQP_DURABLE); //持久化
                $queue->declareQueue();
                //绑定交换机与队列，并指定路由键
                $boolBind = $queue->bind(self::EXCHANGE_NAME, self::KEY_ROUTE);
                if(!$boolBind){
                    log_message('error', " queue->bind(self::EXCHANGE_NAME, self::KEY_ROUTE) FAIL");
                    exit(" queue->bind(self::EXCHANGE_NAME, self::KEY_ROUTE) FAIL");
                }
                self::$queue_instance = $queue;
            }
        }
        
        public function consumer() {
            $this->init_queue();
            return self::$queue_instance->get();
        }
    
        /**
         * @return AMQPConnection
         */
        public  function ack($envelope)
        {
            $this->init_queue();
            //手动发送ACK应答
            return self::$queue_instance->ack($envelope->getDeliveryTag());
        }
    }
 
    
# 参考

* [RabbitMQ 中文文档－PHP版](https://rabbitmq.shujuwajue.com/) 
* [https://www.rabbitmq.com/](https://www.rabbitmq.com/) 