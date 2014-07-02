<?php

class Comment extends CI_Controller{
    
    public function __construct() {
        parent::__construct();
        $this->load->model("comment_model");
        $this->load->model("mark_model");
        $this->load->model("user_model");
        $this->is_logged_in();
    }


    function commentpage(){
        $limit = 10;
        $markid = key_exists('markid',$_POST)? $_POST['markid'] : '';
        $tocount = intval($this->comment_model->get_comment_parent_num_by_mark_id($markid));
        $topage =  ceil($tocount/$limit);
        $cupage = key_exists('cupage',$_POST)? $_POST['cupage'] : $topage;
        $start = ($tocount - ($topage-$cupage+1) * $limit + 1) < 1? 1 : ($tocount-($cupage-$cupage+1) * $limit +1);
        $end = $tocount- ($topage-$cupage)*$limit;
        $markinfo = json_encode($this->mark_model->get_mark_detail($markid));
        $list = json_encode($this->comment_model->get_comment_limit($markid, $start, $end));
        $this->load->view('ajax/commentpage.php',array("list"=>$list, "markinfo"=>$markinfo, "markid"=>$markid,"cupage"=>$cupage,"tocount"=>$tocount));
    }

    function get_more_comment(){
        $limit = 10;
        $markid = key_exists('markid',$_POST)? $_POST['markid'] : '';
        $tocount = $this->comment_model->get_comment_parent_num_by_mark_id($markid);
        $topage =  ceil($tocount/$limit);
        $cupage = key_exists('markid',$_POST)? (intval($_POST['cupage'])-1 ): $topage;
        $start = ($tocount- ($topage-$cupage+1) * $limit +1) < 1? 1 : ($tocount- ($cupage-$cupage+1) * $limit +1);
        $end = $tocount- ($topage-$cupage)*$limit;
        $list = json_encode($this->comment_model->get_comment_limit($markid, $start, $end));
        echo $list;
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

    function add_comment(){
        $user = $this->session->userdata("user");
        $markid = key_exists('markid', $_POST)? $_POST['markid'] : 0;
        $replyto = key_exists('replyto', $_POST)? $_POST['replyto'] : 0;
        $parentid = key_exists('parentid', $_POST)? $_POST['parentid'] : 0;
        $text = key_exists('text', $_POST)? $_POST['text'] : 0;
        $ret = $this->comment_model->add_comment($markid, $user->id, $replyto, $parentid, $text);
        echo json_encode($ret);
    }

    function get_comment(){
        echo json_encode($this->comment_model->get_comment_limit($_REQUEST["mark_id"], $_REQUEST["start"], $_REQUEST["limit"]));
    }
}

?>
