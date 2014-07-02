<?php
class Mark_model extends CI_Model{

    private $INSERT_MARK_SQL = "insert into mark (datafile_id,creator_id,title,description,x,y,w,h,type,time,deleted,room_id) values ({datafile_id},{creator_id},'{title}','{description}',{x},{y},{w},{h},{type},'{time}',0,{room_id})";
 
    private $DEL_MARK_BY_ID_SQL = "DELETE FROM mark WHERE id = {mark_id}";
     
    private $GET_MARK_BY_DATAFILE_ID_SQL = "select mark.id as mark_id,creator_id,username,user.description as user_desc,email,company,small_headshot,middle_headshot,big_headshot,title,mark.description as mark_desc,x,y,w,h,type,DATE_FORMAT(time, '%b %e, %Y at %h:%i %p') as time,room_id,(select count(mark_id)  from comment where mark_id = mark.id group by mark_id) as num from mark inner join user on mark.creator_id=user.id where creator_id = (select userid from upload_file where id = {datafile_id}) and datafile_id = {datafile_id} order by time desc limit {start},{limit}";    

    private $GET_MARK_LOCATION_BY_DATAFILE_ID_SQL = "select x, y, w, h from mark where datafile_id = {datafile_id}";
    
    private $GET_HOTEST_MARK_BY_DATAFILE_ID_SQL = "select mark.id as mark_id,creator_id,username,user.description as user_desc,email,company,small_headshot,middle_headshot,big_headshot,datafile_id,title,mark.description as mark_desc,x,y,w,h,type,DATE_FORMAT(time, '%b %e, %Y at %h:%i %p') as time,room_id,(select count(mark_id)  from comment where mark_id = mark.id group by mark_id) as num from mark inner join user on mark.creator_id=user.id where datafile_id = {datafile_id} order by num desc, mark.time desc limit {start} , {limit}";

    private $GET_LATEST_MARK_BY_DATAFILE_ID_SQL = "select mark.id as mark_id,creator_id,username,user.description as user_desc,email,company,small_headshot,middle_headshot,big_headshot,datafile_id,title,mark.description as mark_desc,x,y,w,h,type,DATE_FORMAT(time, '%b %e, %Y at %h:%i %p') as time,room_id,(select count(mark_id)  from comment where mark_id = mark.id group by mark_id) as num from mark inner join user on mark.creator_id = user.id where datafile_id = {datafile_id} order by time desc limit {start} , {limit} ";

    private $GET_USERMAKE_MARK_BY_ID_SQL = "select mark.id as mark_id,creator_id,username,user.description as user_desc,email,company,small_headshot,middle_headshot,big_headshot,datafile_id,title,mark.description as mark_desc,x,y,w,h,type,DATE_FORMAT(time, '%b %e, %Y at %h:%i %p') as time,room_id,(select count(mark_id) from comment where mark_id = mark.id group by mark_id) as num from mark inner join user on user.id = mark.creator_id where datafile_id = {datafile_id} and creator_id = {user_id} order by time desc limit {start},{limit}";
    
    private $GET_ALL_MARK_BY_DATAFILE_ID_SQL = "select mark.id as mark_id,creator_id,username,user.description as user_desc,email,company,small_headshot,middle_headshot,big_headshot,title,mark.description as mark_desc,x,y,w,h,type,DATE_FORMAT(time, '%b %e, %Y, %h:%i %p') as time,room_id,(select count(mark_id)  from comment where mark_id = mark.id group by mark_id) as num from mark inner join user on mark.creator_id=user.id where datafile_id = {datafile_id} order by time desc limit {start},{limit}";    

    private $GET_USERCOLLECT_MARK_BY_ID_SQL = "select mark.id as mark_id,creator_id,username,user.description as user_desc,email,company,small_headshot,middle_headshot,big_headshot,datafile_id,title,mark.description as mark_desc,x,y,w,h,type,DATE_FORMAT(time, '%b %e, %Y at %h:%i %p') as time,room_id,(select count(mark_id) from comment where mark_id = mark.id group by mark_id) as num from mark inner join user on user.id = mark.creator_id where datafile_id = {datafile_id} and mark.id in (select collect_id from collect where user_id = {user_id}) order by time desc limit {start}, {limit}";

    private $GET_USERCOLLECT_NUM_BY_ID_SQL = "select count(*) as num from collect c, mark m where c.user_id = {user_id} and c.collect_id = m.id and m.datafile_id = {datafile_id}";

    private $GET_MARK_NUM_BY_ID_SQL = "select count(mark.id) as num from mark where datafile_id = {datafile_id} and creator_id = (select userid from upload_file where id = {datafile_id})";

    private $GET_CREATOR_ID_BY_FILE_ID_SQL = "select userid from upload_file where id = {datafile_id}";

    private $ADD_COLLECT_SQL = "insert into collect (user_id, collect_id, time ,deleted) values({user_id}, {collect_id}, '{time}',{deleted})";

    private $GET_COLLECT_NUM_BY_USER_MARK_SQL = "select count(*) as num from collect where user_id = {user_id} and collect_id = {collect_id}";

    private $GET_ALL_MARK_NUM_BY_ID_SQL = "select count(*) as num from mark where datafile_id = {datafile_id}";

    private $GET_CREATOR_MESSAGE_BY_DATAFILE_ID_SQL = "select username,user.description as user_desc,email,company,small_headshot,middle_headshot,big_headshot from user where id = (select userid from upload_file where id = {datafile_id})";

    private $GET_MARK_DETAIL_BY_MARK_ID_SQL = "select title, mark.TYPE as type, mark.description, user.id, username, small_headshot from mark inner join user on user.id = (select creator_id from mark where id = {mark_id}) where mark.id = {mark_id}";
    function __construct(){
        parent::__construct();
        $this->load->model("comment_model");   
    }


    /**
        * @brief  增加一条mark标记
        *
        * @param $datafile_id heatmap的id
        * @param $creator_id 创建者id
        * @param $title mark标题
        * @param $description mark描述
        * @param $x 起点横坐标
        * @param $y 起点纵坐标
        * @param $w 终点横坐标
        * @param $h 终点纵坐标
        * @param $type mark类型，0代表pin，1代表region
        * @param $room_id mark所在roomid
        *
        * @return 成功返回0
    */
    
    function insertMark($datafile_id,$creator_id,$title,$description,$x,$y,$w,$h,$type,$room_id){
        $title = htmlspecialchars($title);
        $description = htmlspecialchars($description);

        if($type == 0){ //Only pins have the title and description and need check
            $sql = "select * from mark where title = '$title'";
            $con = $this->db->query($sql);
            if(sizeof($con->result_array()) != 0){return 0; }
            if(strpos($title, '#')){return '#';}
        }
        
        $query_str = str_replace(array('{datafile_id}','{creator_id}','{title}','{description}','{x}','{y}','{w}','{h}','{type}','{time}','{room_id}'),
                                array($datafile_id,$creator_id,$title,$description,$x,$y,$w,$h,$type, date("Y-m-d H:i:s") , $room_id),
                                $this->INSERT_MARK_SQL);
        $query = $this->db->query($query_str);
        return $this->db->insert_id();
    }

    function  delete_mark_by_id($mark_id){
        if($mark_id == "" || is_null($mark_id)){
            return;
        }
        $query_str = str_replace('{mark_id}',$mark_id,$this->DEL_MARK_BY_ID_SQL);
        $this->db->query($query_str);  
    }


    /**
        * @brief  通过datafile_id获得创建者标注的所有mark及其评论
        *
        * @param $datafile_id 
        * @param $start 
        * @param $limit 
        * @return mark的及其评论数目
     */
    function get_mark_by_datafile_id($datafile_id,$start,$limit){
        if($datafile_id == ""){return null;}
        $query_str = str_replace(array('{datafile_id}','{datafile_id}','{start}','{limit}'),
                                array($datafile_id,$datafile_id,$start,$limit),
                                $this->GET_MARK_BY_DATAFILE_ID_SQL);
        $query = $this->db->query($query_str);
        $mark_list = $query->result_array();

        return $mark_list;
    }

    /**
        * @brief  通过datafile_id获取最热门的mark信息
        *
        * @param $datafile_id
        * @param $start 起始位置
        * @param $limit 取得数量
        *
        * @return 
     */
    function get_hotest_mark_by_datafile_id($datafile_id,$start,$limit){
        if($datafile_id == ""){return null;}
        $query_str = str_replace(array('{datafile_id}','{start}','{limit}'),
                                array($datafile_id,$start,$limit),
                                $this->GET_HOTEST_MARK_BY_DATAFILE_ID_SQL);
        $query = $this->db->query($query_str);
        if(sizeof($query->result_array()) == 0){return null;}
        return $query->result_array();
    }

    /**
        * @brief  通过datafile_id获取最新的mark信息
        *
        * @param $datafile_id
        * @param $start 起始位置
        * @param $limit 取得数量
        *
        * @return 
     */
    function get_latest_mark_by_datafile_id($datafile_id,$start,$limit){ 
        if($datafile_id == ""){return null;}
        $query_str = str_replace(array('{datafile_id}','{start}','{limit}'),
                                array($datafile_id,$start,$limit),
                                $this->GET_LATEST_MARK_BY_DATAFILE_ID_SQL);
        $query = $this->db->query($query_str);
        if(sizeof($query->result_array()) == 0){return null;}
        return $query->result_array();
    }

    /**
        * @brief  通过datafile_id获取用户在查看的heatmap上做的mark
        *
        * @param $datafile_id heatmap id
        * @param $user_id 用户id
        * @param $start 起始位置
        * @param $limit 取得数量
        *
        * @return 
     */
    function get_user_make_mark_by_id($datafile_id,$user_id,$start,$limit){
        if($datafile_id == "" || $user_id == ""){return null;}
        $query_str = str_replace(array('{datafile_id}','{user_id}','{start}','{limit}'),
                                array($datafile_id,$user_id,$start,$limit),
                                $this->GET_USERMAKE_MARK_BY_ID_SQL);
        $query = $this->db->query($query_str);
        if(sizeof($query->result_array()) == 0){return null;}
        return $query->result_array();
    }

    /**
        * @brief  通过datafile_id获取在查看的heatmap上所有的mark
        *
        * @param $datafile_id heatmap id
        * @param $user_id 用户id
        * @param $start 起始位置
        * @param $limit 取得数量
        *
        * @return 
     */
    function get_all_mark_by_datafile_id($datafile_id,$start,$limit){
        if($datafile_id == ""){return null;}
        $query_str = str_replace(array('{datafile_id}','{start}','{limit}'),
                                array($datafile_id,$start,$limit),
                                $this->GET_ALL_MARK_BY_DATAFILE_ID_SQL);
        $query = $this->db->query($query_str);
        if(sizeof($query->result_array()) == 0){return array();}
        return $query->result_array();
    }


    /**
        * @brief  通过datafile_id获取用户在查看的heatmap上收集的mark
        *
        * @param $datafile_id
        * @param $user_id
        * @param $start 起始位置
        * @param $limit 取得数量
        *
        * @return 
     */
    function get_user_collect_mark_by_id($datafile_id,$user_id,$start,$limit){
        if($datafile_id == "" || $user_id == ""){return null;}
        $query_str = str_replace(array('{datafile_id}','{user_id}','{start}','{limit}'),
                                array($datafile_id,$user_id,$start,$limit),
                                $this->GET_USERCOLLECT_MARK_BY_ID_SQL);
        $query = $this->db->query($query_str);
        if(sizeof($query->result_array()) == 0){return null;}
        return $query->result_array();
    }

    function get_user_collect_num_by_id($user_id,$datafile_id){
        if( $user_id == ""){return null;}
        $query_str = str_replace(array('{user_id}','{datafile_id}'),
            array($user_id,$datafile_id),
            $this->GET_USERCOLLECT_NUM_BY_ID_SQL);
        $query = $this->db->query($query_str);
        $result = $query->result_array();
        foreach ($result as $row) {
            $num=$row['num'];
        }
        return $num;
    }

    /**根据datafile_id获取map创建者的所有mark的number
     * @param $datafile_id
     * @return mixed
     */
    function get_mark_num_by_file_id($datafile_id){
        if($datafile_id == ""){return null;}
        $query_str = str_replace(array('{datafile_id}','{datafile_id}'),
            array($datafile_id,$datafile_id),
            $this->GET_MARK_NUM_BY_ID_SQL);
        $query = $this->db->query($query_str);
        $result = $query->result_array();
        foreach ($result as $row) {
            $num=$row['num'];
        }
        return $num;
    }

    /**根据datafile_id获取file创建者的所有mark数目
     * @param $datafile_id
     * @return mixed
     */
    function get_creator_id_by_file_id($datafile_id){
        if($datafile_id == ""){return null;}
        $query_str = str_replace(array('{datafile_id}'),
            array($datafile_id),
            $this->GET_CREATOR_ID_BY_FILE_ID_SQL);
        $query = $this->db->query($query_str);
        $result = $query->result_array();
        foreach ($result as $row) {
            $num=$row['userid'];
        }
        return $num;
    }


     function add_collect($user_id,$mark_id){
        if($user_id == "" || $mark_id == ""){return null;}
        $num_query_str=str_replace(array('{user_id}','{collect_id}'),
            array($user_id , $mark_id ),$this->GET_COLLECT_NUM_BY_USER_MARK_SQL);
        $query = $this->db->query($num_query_str);
        $result = $query->result_array();
        foreach ($result as $row) {
            $num=$row['num'];
        }
        if($num > 0){
            return;
        }
        $query_str = str_replace(array('{user_id}','{collect_id}','{time}','{deleted}'),
            array($user_id , $mark_id , date("Y-m-d H:i:s"), 0),
            $this->ADD_COLLECT_SQL);
        $this->db->query($query_str);
    }

    /**根据datafile_id和creator_id获取用户的所有mark数目
     * @param $datafile_id
     * @param $user_id
     * @return mixed
     */
    function get_user_mark_num_by_file_id($datafile_id, $user_id){
        if($datafile_id == "" || $user_id == ""){return null;}
        $query_str = str_replace('{datafile_id}', $datafile_id, $this->GET_ALL_MARK_NUM_BY_ID_SQL) . " and creator_id = $user_id";
        $query = $this->db->query($query_str);
        $result = $query->result_array();
        foreach ($result as $row) {
            $num=$row['num'];
        }
        return $num;
    }

    function get_all_mark_num_by_file_id($datafile_id){
        if($datafile_id == ""){return null;}
        $query_str = str_replace(array('{datafile_id}'),
            array($datafile_id),
            $this->GET_ALL_MARK_NUM_BY_ID_SQL);
        $query = $this->db->query($query_str);
        $result = $query->result_array();
        foreach ($result as $row) {
            $num=$row['num'];
        }
        return $num;
    }

    function get_mark_detail($mark_id){
        if($mark_id == ""){return null;}
            $query_str = str_replace(array('{mark_id}', '{mark_id}'),
                array($mark_id, $mark_id),
                $this->GET_MARK_DETAIL_BY_MARK_ID_SQL);
        $query = $this->db->query($query_str);
        return $query->row();
    }

}
    
?>
