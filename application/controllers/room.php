<?php

class Room extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model("room_model");
        $this->load->model("conversation_model");
        $this->is_logged_in();
    }

    function is_logged_in()
    {
        $is_logged_in = $this->session->userdata("user");
        if(!isset($is_logged_in) || $is_logged_in != TRUE) 
        {
            $url_this = "http://" . $_SERVER ['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
            redirect('user/login_form?ret_url=' . urlencode($url_this));

        }
    }

    /**
     * @brief  创建房间
     *
     * @params datafile_id 房间所针对的datafile_id
     * @return
     */
    public function create_room()
    {
        $datafile_id = $_REQUEST["datafile_id"];
        $room_title = $_REQUEST["title"];
        $room_desc = $_REQUEST["description"];
        $user = $this->session->userdata("user");

        $create_time = date("Y-m-d H:i:s");
        $room_id = $this->room_model->add_room($user->id, $datafile_id, $create_time, $room_title, $room_desc);
        ## hash通过datafileid_HASHKEY_roomid_createtime经过base64编码确定
        $hash_content = $datafile_id . "_" . $this->room_model->room_hash_key .
            "_" . strval($room_id) . "_" . $create_time;
        $hash = base64_encode($hash_content);

        $room_detail = $this->room_model->get_room_detail_by_room_id($room_id);

        $this->load->view("chat_room", array(
            "room_id" => $room_id,
            "hash" => $hash,
            "user" => $user,
            "room_detail" => $room_detail));
    }

    public function enter_room()
    {
        $user = $this->session->userdata("user");
        $hash = $_REQUEST["hash"];
        $hash_content = base64_decode($hash);
        if (!strstr($hash_content, $this->room_model->room_hash_key)) {
            echo 'Room hash error';
        } else {
            list($datafile_id, $room_hash_key, $room_id, $create_time) = explode("_", $hash_content);
            $this->room_model->add_room_member($room_id, $user->id);
            $room_detail = $this->room_model->get_room_detail_by_room_id($room_id);
            $this->load->view("chat_room", array(
                "room_id" => $room_id,
                "hash" => $hash,
                "user" => $user,
                "room_detail" => $room_detail));
        }
    }

    /**
     * @brief  添加一条房间的会话
     *
     * @return
     */
    function add_conversation()
    {
        $room_id = $_REQUEST["room_id"];
        $user = $this->session->userdata("user");
        $text = $_REQUEST["text"];
        $mark_id = $_REQUEST["mark_id"];
        $conversation_id = $this->conversation_model->add_conversation($user->id, $room_id, $text, $mark_id);
        echo $conversation_id;
    }

    /**
     * @brief  获取房间所有会话
     *
     * @return
     */
    function get_conversation()
    {
        $room_id = $_REQUEST["room_id"];
        echo json_encode($this->conversation_model->get_conversation_by_room_id($room_id));
    }

    function to_room()
    {
        $roomid = key_exists('roomid', $_POST) ? $_POST['roomid'] : '';
        $this->load->view('chat_room.php');
    }

}

?>
