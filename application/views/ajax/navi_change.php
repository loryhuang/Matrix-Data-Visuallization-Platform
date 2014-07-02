<?php
/**
 * Created by xigualzn.
 * Date: 13-8-9
 * Time: 下午8:19
 */
session_start();

$type = key_exists('type',$_POST)? $_POST['type']:'creator';
switch($type){
    case 'creator':
        echo 'creator';
        break;
    case 'latest':
        echo 'latest';
        break;
    case 'top':
        echo 'top';
        break;
    case 'mine':
        echo 'mine';
        break;
    default :
        echo 'creator';
}