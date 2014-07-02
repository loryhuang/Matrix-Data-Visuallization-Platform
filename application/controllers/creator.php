<?php
class Creator extends CI_Controller{

    public function __construct() {
        parent::__construct();
        $this->load->model("comment_model");
        $this->load->model("user_model");
        $this->load->model("mark_model");
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

    function insert_mark(){
       $result = $this->mark_model->insertMark($_REQUEST["datafile_id"], $_REQUEST["creator_id"], $_REQUEST["title"], $_REQUEST["description"], $_REQUEST["x"], $_REQUEST["y"], $_REQUEST["w"], $_REQUEST["h"], $_REQUEST["type"], $_REQUEST["room_id"]);
        echo $result;
    }

    /**
     * @brief  
     *
     * @return 
     */
    function get_mark(){

        echo json_encode($this->mark_model->get_mark_by_datafile_id($_REQUEST["datafile_id"], $_REQUEST["start"], $_REQUEST["limit"]));

    }

    function get_hotest_mark(){
        return json_encode($this->mark_model->get_hotest_mark_by_datafile_id($_REQUEST["datafile_id"], $_REQUEST["start"], $_REQUEST["limit"]));
    }


    function get_latest_mark(){
        return json_encode($this->mark_model->get_latest_mark_by_datafile_id($_REQUEST["datafile_id"], $_REQUEST["start"], $_REQUEST["limit"]));
    }

    function get_usermake_mark(){
        return json_encode($this->mark_model->get_user_make_mark_by_id($_REQUEST["datafile_id"], $_REQUEST["user_id"], $_REQUEST["start"], $_REQUEST["limit"]));
    }

    function get_usercollect_mark(){
        return json_encode($this->mark_model->get_user_collect_mark_by_id($_REQUEST["datafile_id"], $_REQUEST["user_id"], $_REQUEST["start"], $_REQUEST["limit"]));
    }
}
?>
