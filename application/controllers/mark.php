<?php
/**
 * Created by xigualzn.
 * Date: 13-8-13
 * Time: 上午9:51
 * To change this template use File | Settings | File Templates.
 */

class Mark extends CI_Controller{

    public function __construct() {
        parent::__construct();
        $this->load->model("comment_model");
        $this->load->model("user_model");
        $this->load->model("mark_model");
        //$this->is_logged_in();
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
     * 登录后请求首页内容
     */
    function get_minepage(){
        $fileid = key_exists('fileid',$_POST) ? $_POST['fileid'] : null;
        if($fileid == null) {
            redirect('sga/not_existed');
        }
        $cupage =  key_exists('cupage',$_POST )? $_POST['cupage'] : 1;

        $user_id = $this->session->userdata("user")->id;
        $creator_id = $this->mark_model->get_creator_id_by_file_id($fileid);
        $user_info = $this->user_model->get_user_simple_info_by_id($creator_id);
        $is_creator = $user_id == $creator_id ? 1 : 0;

        $limit = 10;
        if($is_creator){
            $limit = 3;
        }
        $start = ($cupage-1) * $limit;
        $mark_list = json_encode($this->mark_model->get_mark_by_datafile_id($fileid, $start, $limit));
        $tocount = $this->mark_model->get_mark_num_by_file_id($fileid);

        $collect_list = json_encode($this->mark_model->get_user_collect_mark_by_id($fileid, $user_id, $start, $limit));
        $collect_tocount = $this->mark_model->get_user_collect_num_by_id($user_id, $fileid);
        $creator_about = (object) array('is_creator'=>$is_creator, 'collect_list'=>$collect_list, 'collect_tocount'=>$collect_tocount);

        $this->load->view('ajax/minepage.php',array(
            "user_info" => $user_info,
            "mark_list"=> $mark_list,
            "cupage"=>$cupage,
            "tocount"=>$tocount,
            "creator_about"=>$creator_about));
    }

    /**
     * 首页个人部分请求所有创建或者收集的mark
     */
    function show_all(){
        $fileid = key_exists('fileid',$_POST) ? $_POST['fileid'] : null;
        $type =  key_exists('type',$_POST )? $_POST['type'] : "";
        $userid = $this->session->userdata("user")->id;
        $start = 3;
        if($fileid == null || $type == "" || $userid == null) {

        }
        if($type == "create") {
            $tocount = $this->mark_model->get_user_mark_num_by_file_id($fileid,$userid);
            $list= $this->mark_model->get_user_make_mark_by_id($fileid, $userid,$start,$tocount);
        } else {
            $tocount = $this->mark_model->get_user_collect_num_by_id($userid, $fileid);
            $list = $this->mark_model->get_user_collect_mark_by_id($fileid, $userid, $start, $tocount);
        }
        echo json_encode($list);

    }

    /**
     * 首页creator、top、latest、mine导航栏切换
     */
    function get_navi(){
        $navitype =key_exists('navitype',$_POST)?$_POST['navitype'] : 'creator';
        $fileid = key_exists('fileid', $_POST) ? $_POST['fileid'] : '';
        $cupage = key_exists('cupage',$_POST)?$_POST['cupage']: 1 ;
        $limit = 10 ;
        $start = ($cupage-1) * $limit;
        switch($navitype){
            case 'creator':
                $creatorid = $this->mark_model->get_creator_id_by_file_id($fileid);
                $user_info = $this->user_model->get_user_detail_by_user_id($creatorid);
                $list = $this->mark_model->get_mark_by_datafile_id($fileid, $start, $limit);
                $tocount = $this->mark_model->get_creator_id_by_file_id($fileid);
                $tocount_collect = null ;
                $list_collect = null;
                break;
            case 'top':
                $list = $this->mark_model->get_hotest_mark_by_datafile_id($fileid, $start, $limit);
                $tocount = $this->mark_model->get_all_mark_num_by_file_id($fileid);
                $user_info = null;
                $tocount_collect = null ;
                $list_collect = null;
                break;
            case 'latest':
                $list = $this->mark_model->get_latest_mark_by_datafile_id($fileid, $start, $limit);
                $tocount = $this->mark_model->get_all_mark_num_by_file_id($fileid);
                $user_info = null;
                $tocount_collect = null ;
                $list_collect = null;
                break;
            case 'mine':
                $userid =$this->session->userdata("user")->id;
                $user_info = $this->user_model->get_user_detail_by_user_id($userid);
                $tocount = $this->mark_model->get_user_mark_num_by_file_id($fileid,$userid);
                $list= $this->mark_model->get_user_make_mark_by_id($fileid, $userid,$start, 3);
                $tocount_collect = $this->mark_model->get_user_collect_num_by_id($userid, $fileid);
                $list_collect = $this->mark_model->get_user_collect_mark_by_id($fileid, $userid, $start, 3);
                break;
        }

        $list = json_encode(array("tocount" => $tocount,"user_info" => $user_info, "list" => $list, "tocount_collect"=>$tocount_collect, "list_collect" => $list_collect));
        echo $list;
    }

    /**
     * 首页mark部分请求下一页函数
    */
    function get_more_mark(){
        $navitype =key_exists('navitype',$_POST)?$_POST['navitype'] : 'creator';
        $fileid = key_exists('fileid', $_POST) ? $_POST['fileid'] : '';
        $cupage = key_exists('cupage',$_POST)?$_POST['cupage']: 1 ;
        $limit = 10 ;
        $start = $cupage * $limit;
        switch($navitype){
            case 'creator':
                $tocount = intval($this->mark_model->get_creator_id_by_file_id($fileid));
                $end = (($cupage+1) * $limit > $tocount ? $tocount : ($cupage+1) * $limit ) - 1;
                $list = $this->mark_model->get_mark_by_datafile_id($fileid, $start, $end);
                break;
            case 'top':
                $tocount = intval($this->mark_model->get_all_mark_num_by_file_id($fileid));
                $end = (($cupage+1) * $limit > $tocount ? $tocount : ($cupage+1) * $limit ) - 1;
                $list = $this->mark_model->get_hotest_mark_by_datafile_id($fileid, $start, $end);
                break;
            case 'latest':
                $tocount = intval($this->mark_model->get_all_mark_num_by_file_id($fileid));
                $end = (($cupage+1) * $limit > $tocount ? $tocount : ($cupage+1) * $limit ) - 1;
                $list = $this->mark_model->get_latest_mark_by_datafile_id($fileid, $start, $end);
                break;
            case 'mine':
                $userid =$this->session->userdata("user")->id;
                $tocount = intval($this->mark_model->get_user_mark_num_by_file_id($fileid,$userid));
                $end = (($cupage+1) * $limit > $tocount ? $tocount :($cupage+1) * $limit ) - 1;
                $list = $this->mark_model->get_user_make_mark_by_id($fileid, $userid, $start, $end);
                break;
        }
        echo json_encode($list);
    }

    function show_collect(){
        $userid =$this->session->userdata("user")->id;
        $fileid = key_exists('fileid', $_POST) ? $_POST['fileid'] : '';
        $start = 0;
        $tocount= $this->mark_model->get_user_collect_num_by_id($userid,$fileid);
        $list = $this->mark_model->get_user_collect_mark_by_id($fileid,$userid,$start,$tocount);
        echo json_encode($list);
    }

    function callback_wrap($str)
    {
        if (isset($_GET['callback'])) {
            return $_GET["callback"] . "(" . $str . ");";
        } else {
            return $str;
        }
    }

    function insert(){
        $mark_id = $this->mark_model->insertMark($_REQUEST["datafile_id"],$_REQUEST["creator_id"],$_REQUEST["title"],$_REQUEST["description"],$_REQUEST["x"],$_REQUEST["y"],$_REQUEST["w"],$_REQUEST["h"],$_REQUEST["type"],$_REQUEST["room_id"]);
        echo $mark_id;
    }

    function get_mark(){

        echo json_encode($this->mark_model->get_mark_by_datafile_id($_REQUEST["datafile_id"],$_REQUEST["start"],$_REQUEST["limit"]));

    }
    
    function del_mark(){
        $this->mark_model->delete_mark_by_id($_REQUEST["id"]); 
    }

    function get_hotest_mark(){
        echo json_encode($this->mark_model->get_hotest_mark_by_datafile_id($_REQUEST["datafile_id"],$_REQUEST["start"],$_REQUEST["limit"]));
    }
    
    function get_latest_mark(){
        echo json_encode($this->mark_model->get_latest_mark_by_datafile_id($_REQUEST["datafile_id"],$_REQUEST["start"],$_REQUEST["limit"]));
    }

    function get_usermake_mark(){
        echo json_encode($this->mark_model->get_user_make_mark_by_id($_REQUEST["datafile_id"],$_REQUEST["user_id"],$_REQUEST["start"],$_REQUEST["limit"]));
    }
    function get_all_mark(){
        echo json_encode($this->mark_model->get_all_mark_by_datafile_id($_REQUEST["datafile_id"],$_REQUEST["start"],$_REQUEST["limit"]));
    }
    function get_usercollect_mark(){
        echo json_encode($this->mark_model->get_user_collect_mark_by_id($_REQUEST["datafile_id"],$_REQUEST["user_id"],$_REQUEST["start"],$_REQUEST["limit"]));
    }

    function add_collect(){
        $this->mark_model->add_collect($_REQUEST["user_id"],$_REQUEST["collect_id"]);
    }

}

?>
