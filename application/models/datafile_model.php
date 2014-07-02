<?php

class Datafile_model extends CI_Model{

    private $INSERT_FILE_SQL = "insert into upload_file (userid, filename, is_backup, origin_filename,TIME, title, description,size,zoom) values ({userid}, '{filename}', {is_backup}, '{origin_filename}','{time}','{title}', '{description}','{size}',{zoom})";

    private $INSERT_IMAGE_SQL = "insert into attach_image (datafile_id, filename, is_backup, filetype) values ({fileid}, '{filename}', {is_backup}, '{filetype}')";

    private $INSERT_MARK_SQL = "insert into mark (datafile_id, userid, text, x, y) values ({fileid}, {userid}, '{text}', {x}, {y})";

    private $GET_FILE_LIST_BY_USERID_SQL = "select * from upload_file where userid = {userid} and deleted = 0";

    private $GET_FILE_BY_ID_SQL = "select id, filename, userid, is_backup, origin_filename, DATE_FORMAT(TIME, '%b %e,%Y,%h:%i %p') as TIME, title, description ,size ,zoom from upload_file where id = {fileid} and deleted = 0";

    private $GET_IMAGE_BY_ID_SQL = "select * from attach_image where datafile_id = {fileid}";

    private $GET_MARK_BY_FILEID_SQL = "select * from mark where datafile_id = {fileid}";

    private $GET_DATAFILE_BY_USERID_SQL = "select id, filename, title, description, size ,DATE_FORMAT(TIME, '%b %e,%Y,%h:%i %p') as TIME from upload_file where userid = {userid} and deleted = 0 order by upload_file.TIME desc";

    private $DELETE_HEATMAP_USERSELF_BY_ID_SQL = "update upload_file set deleted = 1 where id = {id} and userid ={selfid} ";

    private $GET_IMAGE_BY_DATAFILE_ID_SQL = "select * from attach_image where datafile_id = {datafile_id} and filetype = 'png'";
    
    private $UPDATE_CDT_FILE_SQL = "update upload_file set filename = '{name}' where id = {id} ";

    function __construct(){
        parent::__construct();
        $this->load->model("room_model");
    }
    
    /**
        * @brief  上传数据文件，在数据库中插入一条user和file相关的记录
        *
        * @param $userid
        * @param $filename
        * @param $origin_filename
        *
        * @return 0表示成功，-1表示失败
     */
    function upload_file($userid, $filename, $origin_filename, $title, $description,$size,$zoom){
        $filename = mysql_real_escape_string(htmlspecialchars($filename));
        $title = mysql_real_escape_string(htmlspecialchars($title));
        $origin_filename = mysql_real_escape_string(htmlspecialchars($origin_filename));
        $description = mysql_real_escape_string(htmlspecialchars($description));
        $query_str = str_replace(array('{userid}', '{filename}', '{is_backup}', '{origin_filename}', '{time}', '{title}', '{description}','{size}','{zoom}'), 
                                 array($userid, $filename, 0, $origin_filename, date("Y-m-d H:i:s"), $title, $description , $size , $zoom), 
                                 $this->INSERT_FILE_SQL);                 
        $query = $this->db->query($query_str);
        return $this->db->insert_id();
    }

    /**
        * @brief  根据用户id获取文件列表
        *
        * @param $userid
        *
        * @return 
    */
    
    function get_datafile_list_by_userid($userid){//GET_FILE_LIST_BY_USERID_SQL
        if($userid == ""){return null;}
        $query_str = str_replace('{userid}', $userid, $this->GET_DATAFILE_BY_USERID_SQL); 
        $query = $this->db->query($query_str);
        if(sizeof($query->result()) == 0){
            return array();
        }
        return $query->result();
    }

    /**
        * @brief  获取用户创建的heatmap信息
        *
        * @param $userid 用户id 
        *
        * @return  heatmap信息列表
     */
    function get_datafile_list_by_user_id($userid){
        if($userid == ""){return null;}
        $query_str = str_replace('{userid}', $userid, $this->GET_DATAFILE_BY_USERID_SQL);
        $query = $this->db->query($query_str);
        $result = $query->result_array();
        $tem = array();
        foreach($result as $row){
            $tem[] = $row ;
        }
        if(sizeof($tem) == 0){return null;}
        return $tem;
    }

    /**
        * @brief  根据文件id获取文件
        *
        * @param $fileid
        *
        * @return 
     */
    function get_file_by_id($fileid){
        if($fileid == ""){return null;}
        $query_str = str_replace('{fileid}', $fileid, $this->GET_FILE_BY_ID_SQL); 
        $query = $this->db->query($query_str);
        if(sizeof($query->row()) == 0){return null;}
        return $query->row();
    }

    /**
        * @brief  根据文件id获取生成的tif和png图片
        *
        * @param $fileid
        *
        * @return 
     */
    function get_image_by_id($fileid){
        if($fileid == ""){return null;}
        $query_str = str_replace('{fileid}', $fileid, $this->GET_IMAGE_BY_ID_SQL); 
        $query = $this->db->query($query_str);
        if(sizeof($query->result()) == 0){return null;}
        return $query->result();
    }

    /**
        * @brief  
        *
        * @param $fileid
        * @param $filename filename是不带后缀的，分别将后缀为tif和png插到数据库中
        *
        * @return 
     */
    function log_image_info($fileid, $imagename){
        $imagename = htmlspecialchars($imagename);
        $suffix = array("png", "tif");
        foreach($suffix as $s){
            $query_str = str_replace(array('{fileid}', '{filename}', '{is_backup}', '{filetype}'), array($fileid, $imagename . "." . $s, 0, $s), $this->INSERT_IMAGE_SQL);                 
            $this->db->query($query_str);
        } 
    }
    
    /**
        * @brief  
        *
        * @param $fileid
        * @param $filename f将后缀为txt的文件名插到数据库中
        *
        * @return 
    */
    
    function update_cdt_file($fileid,$filename){         
        $query_str = str_replace(array('{id}','{name}'), array($fileid,$filename), $this->UPDATE_CDT_FILE_SQL);
        $this->db->query($query_str);
    }
      
    /**
        * @brief 数据图片添加标记
        * @param $fileid
        * @param $userid
        * @param $text
        * @param $x
        * @param $y
        *
        * @return 
     */
    
    function mark_image($fileid, $userid, $text, $x, $y){
        $query_str = str_replace(array('{fileid}', '{userid}', '{text}', '{x}', '{y}'), 
                                array($fileid, $userid, $text, $x, $y), 
                                $this->INSERT_MARK_SQL);                 
        $this->db->query($query_str);
    }
    
    /**
        * @brief  根据数据文件id获取相关标记
        *
        * @param $fileid
        *
        * @return 
     */
    function get_mark_by_fileid($fileid){
        if($fileid == ""){return null;}
        $query_str = str_replace("{fileid}", $fileid, $this->GET_MARK_BY_FILEID_SQL);
        $query = $this->db->query($query_str);
        if(sizeof($query->result()) == 0){return null;}
        return $query->result();
    }

    /**
        * @brief  删除用户创建的heatmap，将uploadfile表中deleted字段改为0
        *
        * @param $id
        * @param $selfid
        *
        * @return 删除成功返回1，失败返回0
     */
    function delete_heatmap_by_id($id,$selfid){
        $query_str = str_replace(array('{id}','{selfid}'),array($id,$selfid),$this->DELETE_HEATMAP_USERSELF_BY_ID_SQL);
        $this->db->query($query_str);
        //$this->room_model->delete_room_by_datafile_id($id);
        return $this->db->affected_rows();
    }

    function get_imagename_by_datafile_id($datafile_id){
        $query_str = str_replace('{datafile_id}', $datafile_id, $this->GET_IMAGE_BY_DATAFILE_ID_SQL);
        $query = $this->db->query($query_str);
        return $query->row();
    }
}

?>
