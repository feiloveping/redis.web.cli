<?php
/**
 * Created by PhpStorm.
 * User: cm
 * Date: 2019/7/22
 * Time: 11:41
 */

class RedisCli
{
    private $redis;
    
    /**
     * RedisCli constructor.
     * @param $redis
     */
    public function __construct()
    {
        try{
            $this->redis = new Redis();
            $this->redis->connect('127.0.0.1',6379);
        }catch (Exception $e){
           var_dump($e) ;
        }
    }
    
    private function _dbIndex($params){
        if(isset($params['index']) && !empty($params['index'])){
            $index = $params['index'];
        }else{
            $index = 0;
        }
        $this->redis->select($index);
    }
    
    /**
     * 查看 全部信息
     * @return string
     */
    public function dbInfo(){
        return $this->redis->info();
    }
    
    
    /**
     *  const REDIS_NOT_FOUND       = 0;
     *  const REDIS_STRING          = 1;
     *  const REDIS_SET             = 2;
     *  const REDIS_LIST            = 3;
     *  const REDIS_ZSET            = 4;
     *  const REDIS_HASH            = 5;
     * @param $params
     * @return array
     */
    public function getDbAllKeys($params){
        $this->_dbIndex($params);
        $data = $this->redis->keys("*");
        return $this->_getKeysMsg($data);
    }
    
    /**
     * 搜索包含关键词的数据
     * @param $params
     * @return array
     */
    public function search($params){
        $this->_dbIndex($params);
        $keyword = $params['keyword'];
        $data = $this->redis->keys("*$keyword*");
        return $this->_getKeysMsg($data);
    }
    
    /**
     * 获得单个key的基本信息
     * @param $params
     * @return array
     */
    public function keyDetail($params){
        $this->_dbIndex($params);
        $key = $params['key'];
        $data = $this->_getKeyValue($key);
        return $data;
    }
    
    public function _getKeyValue($key){
        $data = $this->_getKeyMsg($key);
        switch ($data['type']){
            case Redis::REDIS_STRING:
                $value = $this->redis->get($key);
                break;
            case Redis::REDIS_SET:
                $value = $this->redis->sMembers($key);
                break;
            case Redis::REDIS_LIST:
                $value = $this->redis->lRange($key,0,-1);
                break;
            case Redis::REDIS_ZSET:
                $value = $this->redis->zRange($key,0,-1,true);
                break;
            case Redis::REDIS_HASH:
                $value = $this->redis->hGetAll($key);
                break;
            default:
                $value = "";
                break;
        }
    
        $data['value'] = $value;
        return $data;
    }
    
    /**
     * 根据key值,获得改key的类型和过期时间等信息
     * @param $data
     * @return array
     */
    private function _getKeysMsg($data){
        if(empty($data)){
            return $data;
        }
        $keyMessage = [];
  
        foreach ($data as $key){
            $keyMessage[] = $this->_getKeyMsg($key);
        }
        return $keyMessage;
    }
    
    private function _getKeyMsg($key){
        return [
            "key" => $key,
            "ttl" => $this->redis->ttl($key),
            "type"=> $this->redis->type($key)
        ];
    }
    
    public function deleteKey($params){
        $this->_dbIndex($params);
        $key = $params['key'];
        $this->redis->delete($key);
    }
    
    
    
}