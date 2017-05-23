---
layout: post
title:  "server-520-online-operating-activity-summary"
date:   2017-5-23 20:0:0 +0800
categories: server
---

## 520运营活动
主要包括用户抽奖和兑换奖品，积分相关的查询和更新，上线后qps峰值达到3万多（包括
静态资源和api接口），服务比较稳定，未出现大问题，总结下相关的设计经验。
 
## 设计时对重接口进行拆分
    
    当一个接口返回数据多时会导致接口响应较慢，可以讲不同的数据进行拆分到不同的接口，让单个
    接口的查询时间提升，代价就是前端需要多做一些工作。
    
## mysql 分表 和 单独建库
    运营活动考虑流量大，对积分表、兑换奖品表和抽奖表做了分表，按uid%10 进行分表散列，查询只会按
    uid进行查询，这些表单独建了库，和其它业务的数据库隔离，不影响以前的业务。
    对关键的如用户的积分查询采用开启事务强制查主库，防止主从同步延迟导致用户积分没更新。
    
## redis做cache
 
    用户的奖品列表和一些公告用redis做一级缓存，设置过期时间，脚本或者api接口里进行更新或者清楚缓存,
    更新数据采用redis和mysql双写的策略。
    
## redis 超时锁
    
    对用户的行为包括抽奖和兑换加了锁，采用了redis的setnx来获取锁，获取锁失败提示客户端重试，
    解锁失败，会检查锁的过期时间进行解锁,超时锁的好处能自动解锁，防止redis异常不能del，用户
    就不能继续操作了。
    
    
     /**
     * 获取超时锁
     * @param $key
     * @param int $expire
     * @return bool
     */
    public static function timeoutLock($key, $expire=5) {

        $redis = self::getInstance();
        if ($redis) {
            if ($redis->setnx($key, time() + $expire)) {
                return true;
            } else {
                $lockTime = $redis->get($key);
                // 锁已过期，删除锁，重新获取
                if($lockTime  && $lockTime < time()) {
                    if(self::timeoutUnlock($key)) {
                        return $redis->setnx($key, time() + $expire);
                    }
                }
            }
        }
        return false;
    }
    
    /**
     * 超时锁解锁
     * @param $key
     * @return bool
     */
    public static function timeoutUnlock($key) {
        $redis = self::getInstance();
        if ($redis) {
            return $redis->del($key);
        }
        return false;
    }
    
 
## 日志要打印对应关键字，进行监控，便于查找问题
    
    打日志要加上对应业务关键字，方便监控，查找问题进行grep日志方便

## 奖品发放加统计报表邮件

    通过cron进行统计，每半小时发一次统计邮件
 

## 奖品的库存控制

    用计数器对每个奖品设置对应的库存值，每个奖品有对应的发放量，用户领取时先进行check库存，如果库存够就进行
    发放，如果库存不够就提示重试，采用redis的incr 和  decr 来控制库存，如果给用户发放失败，需要
    恢复库存。
    
    当然还有一种思路就是用list讲奖品放入，发放时pop成功进行发放，失败再push进去，这样也可以控制库存。

## 第三方tp接口

    第三方tp接口有2个上线后超时比例比较多，采取了紧急下线措施，后续上线第三方tp要对第三方tp进行压测，
    达不到要求要第三方进行调整，否则上线后问题比较多影响用户体验。
    

## 抽奖算法
    
    参考了微信的对奖品进行按时间轴进行均分的方案，能避免活动未结束奖品就发放完毕。
    

## 服务降级处理
    
    设置单机接口的处理时间超过阈值指定的次数后触发，提示前端当前参与人太多，请稍后重试，采用
    apc来设置计数器来实现。可以用其它的方式如redis或memcache来实现。

## 参考文档

* [微信平台抽奖算法总结-再也不用怕奖品被提前抢光](http://www.xuanfengge.com/luck-draw.html)