<?php

class Comment_model extends CI_Model{

    private $ADD_COMMENT_SQL = "insert into comment (mark_id, user_id, reply_to_user_id, father_comment_id, time, text, deleted) values ({mark_id}, {user_id}, {reply_to_user_id}, {father_comment_id}, '{time}', '{text}', 0)";

    private $GET_COMMENT_BY_MARK_ID_SQL = "select comment.id as commentid, mark_id, user_id, reply_to_user_id,(select  nickname from user where id = reply_to_user_id) as reply_nickname , father_comment_id, DATE_FORMAT(time, '%b %e, %Y at %h:%i %p') as time, text, nickname, description, email, company, small_headshot, middle_headshot, big_headshot from comment inner join user on comment.user_id = user.id where mark_id = {mark_id} order by mark_id asc, father_comment_id asc, time asc";

    private $GET_COMMENT_NUM_BY_MARK_ID_SQL = "select count(*) as num from comment where mark_id = {mark_id}";
    
    private $GET_COMMENT_BY_MARKS_ID_SQL = "select comment.id as commentid, mark_id, user_id, reply_to_user_id, father_comment_id, DATE_FORMAT(comment.time, '%b %e, %Y at %h:%i %p') as time, text, nickname, description, email, company, small_headshot, middle_headshot, big_headshot from comment inner join user on comment.user_id = user.id where mark_id in ({mark_id}) order by mark_id asc, father_comment_id asc, time asc";

    private $GET_COMMENT_BY_COMMENT_ID_SQL = "select comment.id as commentid, mark_id, user_id, reply_to_user_id, (select  nickname from user where id = reply_to_user_id) as reply_nickname ,father_comment_id, DATE_FORMAT(time, '%b %e, %Y at %h:%i %p') as time, text, nickname, description, email, company, small_headshot, middle_headshot, big_headshot from comment inner join user on comment.user_id = user.id where comment.id = {comment_id} ";

    private $GET_COMMENT_PARENT_NUM_BY_MARK_ID_SQL = "select count(*) as num from comment where mark_id = {mark_id} and father_comment_id = 0";

    function __construct(){
        parent::__construct();
    }

    /**
     * @brief  增加一个mark的评论或对评论的回复
     *
     * @param $user_id 评论者id
     * @param $mark_id 0表示没有针对mark
     * @param $father_comment_id 父级评论的id
     * @param $reply_to_user_id 在二级评论中回复对象用户的id，0表示没有
     * @param $text 评论或回复的文本
     *
     * @return 成功插入的id
     */
    function add_comment($mark_id, $user_id, $reply_to_user_id, $father_comment_id, $text){
        $text = htmlspecialchars($text);
        $query_str = str_replace(array('{mark_id}', '{user_id}', '{reply_to_user_id}', '{father_comment_id}', '{time}', '{text}'), 
                                array($mark_id, $user_id, $reply_to_user_id,$father_comment_id,date("Y-m-d H:i:s"),$text), 
                                $this->ADD_COMMENT_SQL);
        $query = $this->db->query($query_str);
        $comment_id =  $this->db->insert_id();
        $query_last = str_replace(array('{comment_id}'),array($comment_id),$this->GET_COMMENT_BY_COMMENT_ID_SQL);
        $query_result = $this->db->query($query_last);
        return $query_result->result_array();
    }

    /**
     * @brief 根据mark_id获取评论以及评论的回复
     *
     * @param $mark_id
     *
     * @return 
     */
    function get_comment_by_mark_id($mark_id){
        if($mark_id == ""){
            return null;
        }
        $query_str = str_replace('{mark_id}',$mark_id, $this->GET_COMMENT_BY_MARK_ID_SQL);
        $query = $this->db->query($query_str);
        $result = $query->result_array();  
        $tmp = array();
        ## 生成具有层级结构的数据
        foreach($result as $row){
            if($row["father_comment_id"] == 0){
                $tmp[$row["commentid"]] = $row;
                
            }else{
                $tmp[$row["father_comment_id"]]["child"][] = $row;
            }
        }
        $ret = array();
        foreach($tmp as $item){
            $ret[] = $item;
        }
        if(sizeof($ret) == 0){return null;}
        return $ret;
    }

    function get_comment_limit($mark_id, $start, $limit){
        if($mark_id == ""){
            return null;
        }
        if($start == ""){ $start = 0; }
        $comment = $this->get_comment_by_mark_id($mark_id);
        $tmp = array();
        if($limit > sizeof($comment)){
            $end = sizeof($comment);
        }
        else {
            $end = $limit;
        }
        for($i = $start-1 ; $i<$end ; $i++){
            $tmp[] = $comment[$i];
        }
        if(sizeof($tmp) == 0){return null;}
        return $tmp;
    }

    /**
     * @brief 根据mark_id获取评论数目
     *
     * @param $mark_id
     *
     * @return $num
     */
    function get_comment_num_by_mark_id($mark_id){
        if($mark_id == ""){
            return null;
        }
        $query_str = str_replace('{mark_id}', $mark_id, $this->GET_COMMENT_NUM_BY_MARK_ID_SQL);        
        $query = $this->db->query($query_str);
        $result = $query->result_array();
        foreach ($result as $row) {
            $num=$row['num'];
        }
        return $num;
    }

    function get_comment_parent_num_by_mark_id($mark_id){
        if($mark_id == ""){
            return null;
        }
        $query_str = str_replace('{mark_id}', $mark_id, $this->GET_COMMENT_PARENT_NUM_BY_MARK_ID_SQL);
        $query = $this->db->query($query_str);
        $result = $query->result_array();
        foreach ($result as $row) {
            $num=$row['num'];
        }
        return $num;

    }


    function get_comment_by_mark_ids($mark_id){
        if($mark_id == ""){
            return null;
        }
        $query_str = str_replace('{mark_id}', $mark_id, $this->GET_COMMENT_BY_MARKS_ID_SQL);
        $query = $this->db->query($query_str);
        $result = $query->result_array();
        $tmp = array();
        ## 生成具有层级结构的数据
        foreach($result as $row){
            if($row["father_comment_id"] == 0){
                $tmp[$row["commentid"]] = $row;
                continue;
            }else{
                $tmp[$row["father_comment_id"]]["child"][] = $row;
            }
        }
        $ret = array();
        foreach($tmp as $item){
            $ret[] = $item;
        }
        if(sizeof($ret) == 0){return null;}
        return $ret;
    }

}

?>
