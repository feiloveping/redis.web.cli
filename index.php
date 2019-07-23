<?php
/**
 * Created by PhpStorm.
 * User: cm
 * Date: 2019/7/22
 * Time: 11:43
 */
$params = $_GET;
$action = $_GET['action'];
header("Content-type:text/html;charset=utf-8");
require_once __DIR__ . "/RedisCli.php";
$config = require_once __DIR__ . "/config.php";

$redisCli = new RedisCli($config['redis']);


if(method_exists($redisCli,$action)){
    $re = $redisCli->$action($params);
    echo json_encode($re);
}