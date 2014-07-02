<?php

class User extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model("room_model");
        $this->load->model("user_model");
        $this->load->model("mark_model");
    }

    function is_logged_in()
    {
        $is_logged_in = $this->session->userdata("user");
        if(isset($is_logged_in) && $is_logged_in == TRUE)
        {
            redirect('/sga/heatmap_index');
        }
    }

    public function browser_not_support()
    {
        $this->load->view("browser_not_support");
    }

    function check_user_name(){
         $ret = $this->user_model->check_user_name($_POST["username"]);
         echo $ret;
    }



    function register()
    {
        $ret = $this->user_model->register($_POST["username"], $_POST["pwd"], $_POST["pwd_confirm"], $_POST["email"]);
        //redirect("user/login_form");
        echo $ret;
    }



    function login()
    {
        $ret = $this->user_model->login($_POST["username"], $_POST["pwd"], $user);
        if ($ret == 0) {
            $this->session->set_userdata(array("user" => $user));
        }
        echo $ret;
//        $ret_url = isset($_REQUEST["ret_url"]) ? $_REQUEST["ret_url"] : site_url() . "/sga/datafile_list";
//        if ($ret == 0) {
//            $this->session->set_userdata(array("user" => $user));
//            echo $ret_url;
//        } else {
//            echo $ret;
//        }
    }

    function logout()
    {
        $this->session->unset_userdata("user");
        redirect("user/login_form");
    }

    function register_form()
    {
        $this->load->view("register");
    }

    function login_form()
    {
        $this->is_logged_in();
        $this->load->view("login", array(
            "ret_url" => isset($_GET["ret_url"]) ?
                $_GET["ret_url"] : site_url() . "/sga/heatmap_index"));
    }

    function  get_other_page($uid)
    {
        $active = 'profile';
        $this->get_page($uid, $active);

    }

    function get_person_page()
    {
        $active = key_exists('active', $_POST) ? $_POST['active'] : 'profile';
        $uid = key_exists('uid', $_POST) ? $_POST['uid'] : '';

        $user = $this->session->userdata("user");
        $selfId = $user->id;
        //通过user_id获取用户的所有信息
        $result = $this->user_model->get_user_by_user_id($uid);

        //添加room的hash信息
        for ($i = 0; $i < count($result[0]["roomCreate"]); $i++) {
            $datafile_id = $result[0]["roomCreate"][$i]["datafile_id"];
            $room_id = $result[0]["roomCreate"][$i]["id"];
            $create_time = $result[0]["roomCreate"][$i]["time"];
            $hash_content = $datafile_id . "_" . $this->room_model->room_hash_key .
                "_" . strval($room_id) . "_" . $create_time;
            $result[0]["roomCreate"][$i]["hash"] = base64_encode($hash_content);
        }
        for ($i = 0; $i < count($result[0]["roomJoin"]); $i++) {
            $datafile_id = $result[0]["roomJoin"][$i]["datafile_id"];
            $room_id = $result[0]["roomJoin"][$i]["id"];
            $create_time = $result[0]["roomJoin"][$i]["time"];
            $hash_content = $datafile_id . "_" . $this->room_model->room_hash_key .
                "_" . strval($room_id) . "_" . $create_time;
            $result[0]["roomJoin"][$i]["hash"] = base64_encode($hash_content);
        }

        $result = json_encode($result);
        $this->load->view("ajax/person_page.php", array(
            "active" => $active,
            "result" => $result,
            "userId" => $uid,
            "selfId" => $selfId));
    }

    /**
     * @brief   更新用户资料nickname,description,email,company
     *
     * @return 成功返回1，失败返回0
     */
    function update_person_info()
    {
        /** 更新nickname的session**/
        $this->load->library("session");
        $user = $this->session->userdata("user");
        $user->nickname = $_REQUEST["nickname"];
        $this->session->set_userdata("user",$user);

        $result = $this->user_model->update_user_by_user_id($_REQUEST["uid"], $_REQUEST["nickname"], $_REQUEST["description"], $_REQUEST["email"], $_REQUEST["company"]);
        echo $result;
    }

    /**
     *删除 heatmap
     */
    function delete_heatmap()
    {
        $heatmap_id = $_POST['heatmapId'];
        $user = $this->session->userdata("user");
        $user_id = $user->id;
        //删除用户创建的heatmap，将upload_file表中deleted字段改为0，删除成功返回1，失败返回0
        $result = $this->user_model->delete_heatmap_by_id($heatmap_id, $user_id);
        echo $result;
    }

    /**
     *删除 room
     */
    function delete_room()
    {
        $room_id = $_POST['roomId'];
        $user = $this->session->userdata("user");
        $user_id = $user->id;
        //删除用户创建的room，将room表中deleted字段改为0，删除成功返回1，失败返回0
        $result = $this->user_model->delete_room_by_id($room_id, $user_id);
        echo $result;
    }

    /**
     *删除个人头像
     */
    function remove_person_headshot()
    {
        $result = 0;
        $big_pic_url = $_POST['bigpic_url'];
        $default_big = "images/default_headshot_big.jpg";
        $default_middle = "images/default_headshot_middle.jpg";
        $default_small = "images/default_headshot_small.jpg";

        $user = $this->session->userdata("user");
        $selfId = $user->id;

        if (!(stripos($big_pic_url, $default_big) > 0)) {
            $pic_url = str_replace(base_url(), './', $big_pic_url);

            if(file_exists($pic_url)){
                unlink($pic_url);
            }
            if(file_exists(str_replace("big","middle",$pic_url))){
                unlink(str_replace("big", "middle", $pic_url));
            }
            if(file_exists(str_replace("big", "small", $pic_url))){
                unlink(str_replace("big", "small", $pic_url));
            }

            /** 更新头像session **/
            $user->big_headshot = $default_big;
            $user->middle_headshot = $default_middle;
            $user->small_headshot = $default_small;
            $this->session->set_userdata("user",$user);

            $result = $this->user_model->update_user_photo_by_user_id($selfId, $default_big, $default_middle, $default_small);
            if($result == "1"){
                $result = $result .",".IMAGE_URL_PREFIX.$default_big.",".IMAGE_URL_PREFIX.$default_middle.",".IMAGE_URL_PREFIX.$default_small;
            }

        }
        echo $result;
    }

    function update_person_photo_info()
    {
        $result = $this->user_model->update_user_photo_by_user_id($_REQUEST["uid"], $_REQUEST["big_headshot"], $_REQUEST["middle_headshot"], $_REQUEST["small_headshot"]);
        return $result;
    }

    /**
     * @brief 上传原始图像
     */
    function upload_picture()
    {
        $uid = $_REQUEST['pictureId'] . "_" . time();
        $allowed_file_type = array(
            'image/jpg'
        , 'image/jpeg'
        , 'image/png'
        , 'image/pjpeg'
        , 'image/gif'
        , 'image/x-png'
        ); // allowed file type
        $max_file_size = 2097152; // max file size 2.5M
        $max_width = 400; // max picture width
        $max_height = 400;
        $upload_dir = "./tmp"; // upload path
        $msg = "";
        $result = false;
        // check file's type
        if (!in_array($_FILES["uploadPicture"]["type"], $allowed_file_type)) {
            $msg = $_FILES["uploadPicture"]["type"] . " is illegalFileType";
        } else {
            if ($_FILES['uploadPicture']['name']) {
                // if upload path is not exsit, new it.
                if (!file_exists($upload_dir)) {
                    mkdir($upload_dir, 0777, true);
                }

                $ext = pathinfo($_FILES['uploadPicture']['name'], PATHINFO_EXTENSION);
                $tmp_file = $upload_dir . '/' . $uid . '_tmp.' . $ext;
                $file = $upload_dir . '/' . $uid . '.' . $ext;
                $result = move_uploaded_file($_FILES["uploadPicture"]["tmp_name"], $tmp_file);
                @$SIZE = getimagesize($tmp_file);
                $width = $SIZE[0];
                $height = $SIZE[1];

                // 如果原图宽度大于规定的最大宽度则进行缩放
                if ($width > $max_width) {
                    $height = $max_width * $height / $width;
                    $width = $max_width;
                }

                // 如果原图宽度大于规定的最大高度则进行缩放
                if ($height > $max_height) {
                    $width = $max_height * $width / $height;
                    $height = $max_height;
                }

                // 存储经过缩放的上传图片\
                $this->load->library("picture");
                $this->picture->get_pic_info($tmp_file);
                $this->picture->dest_image($file);
                $this->picture->zoom_type(1);
                $this->picture->zoom_size($width, $height);
                $this->picture->zoom();

                // 删除临时文件
                if (file_exists($tmp_file)) {
                    unlink($tmp_file);
                }
            }
        }

        $result = ($result) ? 'true' : 'false';
        $file = str_replace("./", base_url(), $file);
        $this->load->view("ajax/upload_picture.php", array("result" => $result, "file" => $file, "width"=>$width, "height"=>$height, "msg" => $msg));
    }

    function show(){
        echo json_encode($this->room_model->get_heatmap_room_by_user_id($_REQUEST["user_id"]));
    }

    /**
     * @brief 上传截取后的图像
     */
    function upload_cut_picture()
    {
        $IMAGE_BIG_SIZE = 100;
        $IMAGE_MIDDLE_SIZE = 50;
        $IMAGE_SMALL_SIZE = 30;
        $crop_left = $_REQUEST['crop_left'];
        $crop_top = $_REQUEST['crop_top'];
        $crop_width = $_REQUEST['crop_width'];
        $crop_height = $_REQUEST['crop_height'];
        $pic_url = $_REQUEST['cutPictureUrl'];
        $pic_url = str_replace(base_url(), "./", $pic_url);
        $old_pic_url = $_REQUEST['oldPictureUrl'];
        $uid = $_REQUEST['cutPictureId'];
        $path_prefix = "./resource/image/user/";
        $tmp_path = "./tmp/";
        $pic_name = str_replace($tmp_path, "", $pic_url);

        //当已经存在用户头像时，删除已有头像
        if ($old_pic_url != "") {
            $old_big_path = str_replace(base_url(), './', $old_pic_url);
            if (file_exists($old_big_path)) {
                unlink($old_big_path);
            }
            if (file_exists(str_replace("big", "middle", $old_big_path))) {
                unlink(str_replace("big", "middle", $old_big_path));
            }
            if (file_exists(str_replace("big", "small", $old_big_path))) {
                unlink(str_replace("big", "small", $old_big_path));
            }
        }

        /* 头像保存的目录，如果不存在则需要新建 */
        $small = $path_prefix . 'small/' . $pic_name;
        $middle = $path_prefix . 'middle/' . $pic_name;
        $big = $path_prefix . 'big/' . $pic_name;
        if (!file_exists($path_prefix . 'big/')) {
            mkdir(($path_prefix . 'big/'), 0755, true);
        }
        if (!file_exists($path_prefix . 'middle/')) {
            mkdir(($path_prefix . 'middle/'), 0755, true);
        }
        if (!file_exists($path_prefix . 'small/')) {
            mkdir(($path_prefix . 'small/'), 0755, true);
        }

        /** 存储大头像 */
        $this->load->library("picture");
        $this->picture->get_pic_info($pic_url);
        $this->picture->dest_image($big);
        $this->picture->cut_type(1);
        $this->picture->cut_size($crop_left, $crop_top, $IMAGE_BIG_SIZE, $IMAGE_BIG_SIZE, $crop_width, $crop_height);
        $this->picture->cut();

        /** 存储中等头像 */
        $this->load->library("picture");
        $this->picture->get_pic_info($pic_url);
        $this->picture->dest_image($middle);
        $this->picture->cut_type(1);
        $this->picture->cut_size($crop_left, $crop_top, $IMAGE_MIDDLE_SIZE, $IMAGE_MIDDLE_SIZE, $crop_width, $crop_height);
        $this->picture->cut();


        /** 存储小头像 */
        $this->load->library("picture");
        $this->picture->get_pic_info($pic_url);
        $this->picture->dest_image($small);
        $this->picture->cut_type(1);
        $this->picture->cut_size($crop_left, $crop_top, $IMAGE_SMALL_SIZE, $IMAGE_SMALL_SIZE, $crop_width, $crop_height);
        $this->picture->cut();

        /** 更新头像session **/
        $this->load->library("session");
        $user = $this->session->userdata("user");
        $user->big_headshot = str_replace("./","",$big);
        $user->middle_headshot = str_replace("./","",$middle);
        $user->small_headshot = str_replace("./","",$small);
        $this->session->set_userdata("user",$user);

        $result = $this->user_model->update_user_photo_by_user_id($uid, str_replace("./resource", "resource", $big), str_replace("./resource", "resource", $middle), str_replace("./resource", "resource", $small));
        $big = str_replace("./", base_url(), $big);
        $middle = str_replace("./", base_url(), $middle);
        $small = str_replace("./", base_url(), $small);

        $this->load->view("ajax/upload_cut_picture.php", array("result" => $result, "big" => $big, "middle" => $middle, "small" => $small));
    }

    function test(){
        $this->mark_model->get_mark_detail(44);
    }   

}


?>
