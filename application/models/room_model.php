<?php

class Room_model extends CI_Model
{

    private $ADD_ROOM_SQL = "insert into room (creator_id, datafile_id, time, title, description) values({creator_id}, {datafile_id}, '{time}', '{title}', '{description}')";

    private $ADD_ROOM_MEMBER_SQL = "insert into room_member (room_id, member_id) values({room_id}, {member_id})";

    private $CHECK_ROOM_MEMBER_EXIST_SQL = "select * from room_member where room_id = {room_id} and member_id = {member_id}";

    private $GET_USERCREATE_ROOM_BY_CREATOR_ID_SQL = "select id, creator_id, datafile_id, name, title, DATE_FORMAT(time, '%b %e, %Y at %h:%i %p') as time, description from room where creator_id = {creator_id} and deleted = 0 order by room.time desc";

    private $GET_USERJOIN_ROOM_BY_CREATOR_ID_SQL = "select room_id from room_member where member_id = {member_id}";

    private $GET_ROOM_BY_ROOM_ID_SQL = "select R.id, R.creator_id, R.datafile_id, R.name, R.title, DATE_FORMAT(R.time, '%b %e, %Y at %h:%i %p') as time, R.description, U.title as file_title, U.userid from room as R inner join upload_file as U on R.datafile_id = U.id where R.deleted = 0 and U.deleted = 0 and R.id in ({room_id}) order by R.time desc";

    private $GET_ROOM_DETAIL_BY_ID_SQL = "select id, creator_id, datafile_id, name, title, DATE_FORMAT(time, '%b %e, %Y at %h:%i %p') as time, description from room where deleted = 0 and room.id = {room_id} ";

    private $GET_ROOM_MEMBER_BY_ROOMID_SQL = "select member_id from room_member where room_id = {room_id}";

    private $GET_USER_BY_USER_ID_SQL = "select nickname, small_headshot from user where id = {user_id}";

//    private $GET_ROOM_BY_CREATOR_ID_SQL = "select R.id, R.creator_id, datafile_id, R.name, U.title as file_title, R.title, DATE_FORMAT(R.TIME, '%b %e, %Y at %h:%i %p') as time, R.description from room as R inner join upload_file as U on U.id = R.datafile_id where R.deleted = 0 and U.deleted = 0 and creator_id = {user_id} and datafile_id = {datafile_id}";

    private $GET_ROOM_BY_CREATOR_ID_SQL = "select R.id, R.creator_id, datafile_id, R.name, U.title as file_title, U.userid, R.title, DATE_FORMAT(R.time,'%M %D,%Y %H:%i') as time, R.description from room as R inner join upload_file as U on U.id = R.datafile_id where R.deleted = 0 and U.deleted = 0 and creator_id = {user_id}";
   
    private $GET_ROOM_CREATOR_HEADSHOT_SQL = "select username, small_headshot from user inner join room on room.creator_id = user.id where room.id = {room_id}";
   
    private $GET_ROOM_MEMBER_HEADSHOT_SQL = "select username, small_headshot from user inner join room_member on room_member.member_id = user.id where room_id = {room_id} limit 0,2";

    private $DELETE_ROOM_BY_DATAFILE_ID_SQL = "update room set deleted = 1 where datafile_id = {datafile_id}";

    public $room_hash_key = "zhaolaoban";

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @brief  新建一个room
     *
     * @param $creator_id
     * @param $datafile_id
     *
     * @return
     */
    function add_room($creator_id, $datafile_id, $time, $title, $description)
    {
        $title = htmlspecialchars($title);
        $description = htmlspecialchars($description);
        $query_str = str_replace(array("{creator_id}", "{datafile_id}", "{time}", "{title}", "{description}"),
            array($creator_id, $datafile_id, $time, $title, $description),
            $this->ADD_ROOM_SQL
        );
        $this->db->query($query_str);
        return $this->db->insert_id();
    }

    /**
     * @brief 增加房间成员
     * @param $room_id
     * @param $member_id
     */
    function add_room_member($room_id, $member_id)
    {
        $query_str = str_replace(array("{room_id}", "{member_id}"),
            array($room_id, $member_id),
            $this->CHECK_ROOM_MEMBER_EXIST_SQL);
        $query = $this->db->query($query_str);
        $sql = "select creator_id from room where id = $room_id";
        $query1 = $this->db->query($sql);
        if (count($query->result_array()) == 0 && $query1->row()->creator_id != $member_id) {
            $query_str = str_replace(array("{room_id}", "{member_id}"),
                array($room_id, $member_id),
                $this->ADD_ROOM_MEMBER_SQL
            );
            $this->db->query($query_str);
        }
    }

    function get_room_member_headshot($room_id){
        $query_str = str_replace('{room_id}', $room_id, $this->GET_ROOM_CREATOR_HEADSHOT_SQL);    
        $query = $this->db->query($query_str);
        $creator = $query->result_array();
        $query_strr = str_replace('{room_id}', $room_id, $this->GET_ROOM_MEMBER_HEADSHOT_SQL);    
        $query1 = $this->db->query($query_strr);
        $member = $query1->result_array();
        $headshot =  array_merge($creator, $member);
        return $headshot;
    } 



    /**
     * @brief  通过creator_id获取用户创建的房间
     *
     * @param $creator_id
     *
     * @return 返回创建的房间信息
     */
    function get_user_create_room($creator_id)
    {
        if ($creator_id == "") {
            return null;
        }
        $query_str = str_replace('{creator_id}', $creator_id, $this->GET_USERCREATE_ROOM_BY_CREATOR_ID_SQL);
        $query = $this->db->query($query_str);
        if(sizeof($query->result_array()) == 0){return null;}
        $result = $query->result_array();
        $tmp = array();
        foreach($result as $row){
            $lin = $this->get_room_member_headshot($row["id"]);
            $row["member"] = $lin;
            $tmp[] = $row;
        }
        return $tmp;
    }

    /**
     * @brief  通过memeber_id获取用户进入过的房间
     *
     * @param $member_id
     *
     * @return 返回进入过的房间信息
     */
    function get_user_join_room($member_id)
    {
        if ($member_id == "") {
            return null;
        }
        $query_str = str_replace('{member_id}', $member_id, $this->GET_USERJOIN_ROOM_BY_CREATOR_ID_SQL);
        $query = $this->db->query($query_str);
        $result = $query->result_array();

        $tmp = array();
        foreach ($result as $row) {
            $tmp[] = $row["room_id"];
        }
        $all_room_id = join(",", $tmp);
        $room_list = $this->room_model->get_room_by_room_ids($all_room_id);
        if(sizeof($room_list) == 0){return null;}
        return $room_list;
    }

    function get_room_by_room_ids($room_id)
    {
        if ($room_id == "") {
            return null;
        }
        $query_str = str_replace('{room_id}', $room_id, $this->GET_ROOM_BY_ROOM_ID_SQL);
        $query = $this->db->query($query_str);
        $result = $query->result_array();
        $tmp = array();
        foreach($result as $row){
            $lin = $this->get_room_member_headshot($row["id"]);
            $row["member"] = $lin;
            $tmp[] = $row;
        }
        if(sizeof($tmp) == 0){return null;}
        return $tmp;
    }

    function get_room_detail_by_room_id($room_id)
    {
        if ($room_id == "") {
            return null;
        }
        $query_str = str_replace('{room_id}', $room_id, $this->GET_ROOM_DETAIL_BY_ID_SQL);
        $query = $this->db->query($query_str);
        $result = $query->row();

        $member_id_list = $this->get_room_member_by_room_id($room_id);
        $tmp = array();
        foreach ($member_id_list as $member_id) {
            $tmp[] = $this->get_user_name_and_headshot_by_user_id($member_id["member_id"]);
        }
        $conversation = $this->conversation_model->get_conversation_by_room_id($room_id);
        $result->member = $tmp;
        $result->conversation = $conversation;
        if(sizeof($result) == 0){return null;}
        return $result;
    }

    function get_user_name_and_headshot_by_user_id($user_id)
    {
        if ($user_id == "") {
            return null;
        }
        $query_str = str_replace('{user_id}', $user_id, $this->GET_USER_BY_USER_ID_SQL);
        $query = $this->db->query($query_str);
        $result = $query->row();
        if(sizeof($result) == 0){return null;}
        return $result;
    }

    function get_room_member_by_room_id($room_id)
    {
        $query_str = str_replace('{room_id}', $room_id, $this->GET_ROOM_MEMBER_BY_ROOMID_SQL);
        $query = $this->db->query($query_str);
        if(sizeof($query->result_array()) == 0) {
            return array();
        }
        return $query->result_array();
    }

    function get_heatmap_room_by_user_id($user_id, $datafile_id)
    {
        if ($user_id == "") {
            return null;
        }
        $query_str = str_replace(array('{user_id}','{datafile_id}'),
            array($user_id, $datafile_id),
            $this->GET_ROOM_BY_CREATOR_ID_SQL);
        $query = $this->db->query($query_str);
        if(sizeof($query->result_array()) == 0){
            return array();
        }
        $result = $query->result_array();
//        $tmp = array();
//        foreach ($result as $row) {
//            $tmp[$row["datafile_id"]][] = $row;
//        }
        return $result;
    }

    function get_heatmap_rooms_by_user_id($user_id)
    {
        if ($user_id == "") {
            return null;
        }
        $query_str = str_replace(array('{user_id}'),
            array($user_id),
            $this->GET_ROOM_BY_CREATOR_ID_SQL);
        $query = $this->db->query($query_str);
        if(sizeof($query->result_array()) == 0){
            return array();
        }
        $result = $query->result_array();
        $joinroom = $this->get_user_join_room($user_id);
        $tmp = array();
        $crt = array();
        $join = array();
        $room = array();
        if(count($result != 0)){
        foreach($result as $row){
            $row["created"] = 1;
            $crt[] = $row;
        }
        foreach($joinroom as $row) {
            $row["created"] = 0;
            $join[] = $row;
        }
        $array_join = array_merge($crt, $join);
        $i = 0;
        foreach($array_join as $row){
            $room[$row["datafile_id"]][] = $row; 
        }
        foreach($room as $row) {
            $tmp[$i] = new stdClass();
            $tmp[$i]->datafile_id = $row[0]["datafile_id"];
            $tmp[$i]->title = $row[0]["file_title"];
            $tmp[$i]->room_list = $row;
            if($row[0]["creator_id"] == $row[0]["userid"]){$tmp[$i]->created = 1;}
            else {$tmp[$i]->created = 0;}
            $i++;
        }
        return $tmp;
        }
        else {return array();}
    }
    
    function delete_room_by_datafile_id($datafile_id){
        $query_str = str_replace('{datafile_id}', $datafile_id, $this->DELETE_ROOM_BY_DATAFILE_ID_SQL);
        $this->db->query($query_str);
    }
}

?>
