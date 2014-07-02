<?php

require_once "memcached_model.php";

class User_model extends Memcached_model
{

    private $GET_USER_BY_USERNAME_SQL = "select * from user where username = '{username}'";

    private $INSERT_USER_SQL = "insert into user (username, pwd ,email) values ('{username}', '{pwd}' , '{email}')";

    private $GET_USER_BY_USER_ID_SQL = "select user.id as user_id, big_headshot, middle_headshot, small_headshot, username,email,company,description from user where id = {user_id}";

    private $UPDATE_USER_BY_USER_ID_SQL = "update user set nickname = '{nickname}', description= '{description}', email = '{email}' , company = '{company}' where id = {user_id}";

    private $UPDATE_USER_PHOTO_BY_USER_ID_SQL = "update user set big_headshot = '{big_headshot}', middle_headshot = '{middle_headshot}', small_headshot = '{small_headshot}' where id = {user_id}";

    private $DELETE_ROOM_USERSELF_BY_ID_SQL = "update room set deleted = 1 where id = {room_id} and creator_id = {user_id} ";

    private $DELETE_HEATMAP_USERSELF_BY_ID_SQL = "update upload_file set deleted = 1 where id = {heatmap_id} and userid = {user_id} ";

    function __construct()
    {
        parent::__construct();
        $this->load->model("datafile_model");
        $this->load->model("room_model");
    }

   /**
     * @brief 检查用户名是否存在
     *
     * @param  $username
     *
     * @return 0表示不存在 ，1表示用户已存在
    */

    function check_user_name($username){
        $username = htmlspecialchars($username);
        $user = $this->get_user_by_username($username);
        if (0 != count($user)) {
            return 1;
        }else{
            return 0;
        }
    }

    /**
     * @brief  用户注册
     *
     * @param $username
     * @param $pwd
     * @param $pwd_confirm
     *
     * @return 0表示成功，1表示用户已存在，2表示密码不一致
     */

    function register($username, $pwd, $pwd_confirm ,$email)
    {
        $username = htmlspecialchars($username);
        $pwd = htmlspecialchars($pwd);
        $pwd_confirm = htmlspecialchars($pwd_confirm);
        $email = htmlspecialchars($email);
        
        $user = $this->get_user_by_username($username);
        if (0 != count($user)) {
            return 1;
        }
        if ($pwd != $pwd_confirm) {
            return 2;
        }
        $query_str = str_replace(array('{username}', '{pwd}','{email}'), array($username, $pwd , $email), $this->INSERT_USER_SQL);
        $this->db->query($query_str);
        return 0;
    }


    /**
     * @brief  根据用户名获取用户信息
     *
     * @param $username
     *
     * @return 单个用户信息的array
     */
    function get_user_by_username($username)
    {
        $query_str = str_replace("{username}", $username, $this->GET_USER_BY_USERNAME_SQL);
        $query = $this->db->query($query_str);
        if(sizeof($query->row()) == 0){return null;}
        return $query->row();
    }

    /**
     * @brief  用户登录
     *
     * @param $username
     * @param $pwd
     *
     * @return 0表示成功，1表示用户不存在，2表示密码错误
     */
    function login($username, $pwd, &$user)
    {
        $username = htmlspecialchars($username);
        $user = $this->get_user_by_username($username);
        if (0 == count($user)) {
            return 1;
        }
        if ($user->pwd != $pwd) {
            return 2;
        }
        return 0;
    }

    /**
     * @brief  获取用户所有信息
     *
     * @param $user_id
     *
     * @return
     */
    function get_user_by_user_id($user_id)
    {
        if ($user_id == "") {
            return null;
        }
        $query_str = str_replace('{user_id}', $user_id, $this->GET_USER_BY_USER_ID_SQL);
        $query = $this->db->query($query_str);
        $result = $query->result_array();
        $datafile = $this->datafile_model->get_datafile_list_by_user_id($user_id);
        $tem = array();
        /**
         * @brief  插入heatmap信息
         *
         * @param $row
         */
        foreach ($result as $row) {
            $tem[$row["user_id"]] = $row;
            if ($datafile != "") {
                foreach ($datafile as $item)
                    $tem[$row["user_id"]]["heatmap"][] = $item;
            }
            if (!array_key_exists('heatmap', $tem[$row["user_id"]])) {
                $tem[$row["user_id"]]["heatmap"] = null;
            }
        }

        /**
         * @brief  插入user创建的房间
         *
         * @param $user_id
         *
         * @return
         */
        $room_create = $this->room_model->get_user_create_room($user_id);
        $apt = array();
        foreach ($tem as $row) {
            $apt[$row["user_id"]] = $row;
            if ($room_create != "") {
                foreach ($room_create as $item) {
                    $apt[$row["user_id"]]["roomCreate"][] = $item;
                }
            }
            if (!array_key_exists('roomCreate', $apt[$row["user_id"]])) {
                $apt[$row["user_id"]]["roomCreate"] = array();
            }

        }

        /**
         * @brief  插入user加入的房间
         *
         * @param $user_id
         *
         * @return
         */
        $room_join = $this->room_model->get_user_join_room($user_id);
        $tmp = array();
        foreach ($apt as $row) {
            $tmp[$row["user_id"]] = $row;
            if ($room_join != "") {
                foreach ($room_join as $item)
                    $tmp[$row["user_id"]]["roomJoin"][] = $item;
            }
            if (!array_key_exists('roomJoin', $tmp[$row["user_id"]])) {
                $tmp[$row["user_id"]]["roomJoin"] = array();
            }

        }
        $lin = array();
        foreach ($tmp as $row) {
            $lin[] = $row;
        }
        return $lin;
    }

    function get_user_detail_by_user_id($user_id){
        if ($user_id == "") {
            return null;
        }
        $query_str = str_replace('{user_id}', $user_id, $this->GET_USER_BY_USER_ID_SQL);
        $query = $this->db->query($query_str);
        $result = $query->result_array();
        return $result;
    }

    function get_user_simple_info_by_id($user_id){
        if ($user_id == "") {
            return null;
        }
        $query_str = str_replace('{user_id}', $user_id, $this->GET_USER_BY_USER_ID_SQL);
        $query = $this->db->query($query_str);
        $result = $query->row();
        return $result;
    }

    /**
     * @brief 更新用户的nickname,description,email,company
     *
     * @param $user_id
     * @param $nickname
     * @param $description
     * @param $email
     * @param $company
     *
     * @return 更新成功返回1，失败返回0
     */
    function update_user_by_user_id($user_id, $nickname, $description, $email, $company)
    {
        $query_str = str_replace(array('{nickname}', '{description}', '{email}', '{company}', '{user_id}'),
            array($nickname, $description, $email, $company, $user_id),
            $this->UPDATE_USER_BY_USER_ID_SQL);
        $this->db->query($query_str);
        return $this->db->affected_rows();
    }

    /**
     * @brief  更新用户头像
     *
     * @param $user_id
     * @param $big_headshot
     * @param $middle_headshot
     * @param $small_headshot
     *
     * @return 更新成功返回1，失败返回0
     */
    function update_user_photo_by_user_id($user_id, $big_headshot, $middle_headshot, $small_headshot)
    {
        $query_str = str_replace(array('{user_id}', '{big_headshot}', '{middle_headshot}', '{small_headshot}'),
            array($user_id, $big_headshot, $middle_headshot, $small_headshot),
            $this->UPDATE_USER_PHOTO_BY_USER_ID_SQL);
        $this->db->query($query_str);
        return $this->db->affected_rows();
    }

    /**
     * @brief  删除用户创建的room，将upload_file中deleted字段改为1
     *
     * @param $room_id 房间id
     * @param $user_id 用户id
     *
     * @return 删除成功返回1，失败返回0
     */
    function delete_room_by_id($room_id, $user_id)
    {
        $query_str = str_replace(array('{room_id}', '{user_id}'),
            array($room_id, $user_id), $this->DELETE_ROOM_USERSELF_BY_ID_SQL);
        $this->db->query($query_str);
        return $this->db->affected_rows();
    }

    /**
     * @brief  删除用户创建的heatmap，将room中deleted字段改为1
     *
     * @param $heatmap_id heatmap的id
     * @param $user_id 用户id
     *
     * @return 删除成功返回1，失败返回0
     */
    function delete_heatmap_by_id($heatmap_id, $user_id)
    {
        $query_str = str_replace(array('{heatmap_id}', '{user_id}'),
            array($heatmap_id, $user_id), $this->DELETE_HEATMAP_USERSELF_BY_ID_SQL);
        $this->db->query($query_str);
        $this->load->model("room_model");
        $this->room_model->delete_room_by_datafile_id($id);
        return $this->db->affected_rows();
    }

    function test(){
        return $this->data_query("select * from user where id = 29;");
    }

}

?>
