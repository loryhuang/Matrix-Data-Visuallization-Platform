<?php
    class Memcached_model extends CI_Model{
        
        function __construct(){
            parent::__construct();
            $this->load->driver('cache', array('adapter'=>'memcached'));
        }  

        public function data_query($query){
            $key = md5($query);
            if(($ret = $this->cache->memcached->get($key))){
                return $ret;
            }else{
                $ret = $this->db->query($query)->result_array();
                $this->cache->memcached->save($key, $ret);
                return $ret;
            }
        }
    }
?>
