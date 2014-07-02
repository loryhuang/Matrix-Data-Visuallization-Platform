<?php
    function data_query($object, $query){
        $key = md5($query);
        if(($ret = $object->cache->memcached->get($key))){
            return $ret;
        }else{
            $ret = $object->db->query($query)->result_array();
            $object->cache->memcached->save($key, $ret);
            return $ret;
        }

    }
?>
