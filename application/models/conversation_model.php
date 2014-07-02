<?php

class Conversation_model extends CI_Model{

    private $ADD_CONVERSATION_SQL = "insert into conversation(room_id, speaker_id, text, mark_id, time) values({room_id}, {speaker_id}, '{text}', {mark_id}, '{time}')";

    private $GET_CONVERSATION_BY_ROOM_ID_SQL = "select C.id, C.room_id, C.speaker_id, C.text, C.mark_id, DATE_FORMAT(time, '%b %e, %Y at %h:%i %p') as time, U.big_headshot, U.small_headshot, U.nickname from conversation as C inner join user as U on C.speaker_id = U.id where C.room_id = {room_id}";

    public function __construct(){
        parent::__construct();
    }

    /**
        * @brief 添加一条房间中的发言
        *
        * @param $user_id
        * @param $room_id
        * @param $text
        * @param $mark_id 0表示不针对任何mark发言
        *
        * @return 
     */
    function add_conversation($user_id, $room_id, $text, $mark_id){
        $text = htmlspecialchars($text);
        $query_str = str_replace(array("{speaker_id}", "{room_id}", "{text}", "{mark_id}", "{time}"),
                                 array($user_id, $room_id, $text, $mark_id, date("Y-m-d H:i:s") ),
                                 $this->ADD_CONVERSATION_SQL);
        $this->db->query($query_str);
        return $this->db->insert_id();
    }

    /**
        * @brief  根据room_id获取所有的会话
        *
        * @param $room_id
        *
        * @return 
     */
    function get_conversation_by_room_id($room_id){
        if($room_id == ""){return null;}
        $query_str = str_replace("{room_id}", $room_id, $this->GET_CONVERSATION_BY_ROOM_ID_SQL);
        $query = $this->db->query($query_str);
        if(sizeof($query->result_array()) == 0){return null;}
        return $query->result_array();
    }
}
?>
