<?php

class Sga extends CI_Controller {

    public $doc_root = "/var/www/HM_S";
    private $dropbox_params = array();
    private $R_create_image = "HM_S/R/testdesc";

    public function __construct() {
        parent::__construct();
        $this->load->model("datafile_model");
        $this->load->model("room_model");
        $this->load->model("user_model");
        //$this->is_logged_in();
    }

    function is_logged_in() {
        $is_logged_in = $this->session->userdata("user");
        if (!isset($is_logged_in) || $is_logged_in != TRUE) {
            $url_this = "http://" . $_SERVER ['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
            redirect('user/login_form?ret_url=' . urlencode($url_this));
        }
    }

    function not_existed() {
        $user = $this->session->userdata("user");
        $data["include_header"] = "header";
        $data["userid"] = $user->id;
        $data["username"] = $user->nickname;
        $data["headshot"] = $user->small_headshot;
        $this->load->vars($data);
        $this->load->view("404page");
    }

    /**
     * @brief  通过jsonp调用时，在返回的json数据外面套一个callback( .. )
     *
     * @param $str json数据
     *
     * @return
     */
    function callback_wrap($str) {
        if (isset($_GET['callback'])) {
            return $_GET["callback"] . "(" . $str . ");";
        } else {
            return $str;
        }
    }

    function upload_form() {
        $user = $this->session->userdata('user');
        if (is_null($user) || $user == '') {
            redirect("user/login_form");
        }
        $data["username"] = $user->username;
        $this->load->view("upload", $data);
    }

    /**
     * @brief  上传文件的处理函数
     *
     * @return
     */
    function upload() {
        $user = $this->session->userdata("user");
        $allowed_file_type = array(
            'text/plain',
            'application/octet-stream'
        );
        
        $heatmap_title = $_POST["title"];
        $heatmap_desc = $_POST["description"];
        
        // FILE FROM DROPBOX
        if (isset($_POST["filename"]) && isset($_POST["fileurl"])) {
           $filename = time()."_".$_POST["filename"];
           $fileurl = $_POST["fileurl"];

           //set saved path
           $save_path = $this->doc_root . "/data/" . $filename;

           //copy file  to server 
           $bytes = file_put_contents($save_path,fopen($fileurl, "rb"));
           
           //check file content
           $file_type = substr($filename,-3,3);

           if($file_type == "txt"){
               $checkStatus = $this->check_txt_data($save_path); 
           }else if($file_type == "cdt"){
               $checkStatus = $this->check_cdt_data($save_path);
           }

           if(!$checkStatus){
                unlink($save_path);
                $line = $checkStatus["line"];
                $this->session->set_userdata('message', 'line '. $line . " is not right , please check the data.");
                redirect("sga/file_process/error");
           }

           //log to database
           if($bytes > 0){
              $size = explode("x", $checkStatus["size"]);
              $row_size = $size[0];
              $col_size = $size[1]; 
              //GET ZOOM LEVEL
              if(min($row_size,$col_size) < 50 || max($row_size,$col_size) < 300 ){
                 $zoom = 8 ;
              }else{
                 $zoom = 1 ;
              }
              //GET ALL POINTS
              $points = $col_size * $row_size;

              //BIG TXT FILE WILL NOT BE PROCESSED (more than 1500x1500)
              if($points > 2250000 && $file_type == "txt"){
                $this->session->set_userdata('message', 'the txt file is too big and will take too long to be visualized, so we suggest you transfer it to cdt file by R first !');
                redirect("sga/file_process/error");
              }

              //INSERT
              $fileid = $this->datafile_model->upload_file($user->id, $filename,$_POST["filename"], $heatmap_title, $heatmap_desc ,$checkStatus["size"],$zoom);

              //GET TIME TIPS
              if( ($points < 1000000 && $file_type == "txt") || ($points < 25000000 && $file_type == "cdt") ){
                  $message = " a few minutes";
              }else{
                  $message = " dozens of minutes";
              }
              //SAVE TIPS INFO
              $this->session->set_userdata('message',$message);
              $this->session->set_userdata('file_type',$file_type);

              redirect("sga/file_process/" . $fileid);

           }else{
              $this->session->set_userdata('message', 'the file you get from dropbox is empty!');
              redirect("sga/file_process/error");  
           }

        //FILE FROM UPLOAD
        }else if(isset($_FILES["file"])){

            $filename = time() . "_" . $_FILES['file']['name'];
            $save_path = $this->doc_root . "/data/" . $filename;
            
            if (in_array($_FILES['file']['type'], $allowed_file_type) && move_uploaded_file($_FILES['file']['tmp_name'], $save_path)) {
                
                if($_FILES['file']['type'] == "text/plain"){
                     $checkStatus = $this->check_txt_data($save_path);
                }else if($_FILES['file']['type'] == "application/octet-stream"){
                     $checkStatus = $this->check_cdt_data($save_path);
                }

                if($checkStatus["isCorrect"]){

                      $file_type = $checkStatus["type"]; 
                      $size = explode("x", $checkStatus["size"]);

                      $row_size = $size[0];
                      $col_size = $size[1];
                      //GET ZOOM LEVEL
                      if(min($row_size,$col_size) < 50 || max($row_size,$col_size) < 300 ){
                         $zoom = 8 ;
                      }else{
                         $zoom = 1 ;
                      }

                      $points =  $col_size * $row_size ;

                      //BIG TXT FILE WILL NOT BE PROCESSED (more than 1500x1500)
                      if($points > 2250000 && $file_type == "txt"){
                        $this->session->set_userdata('message', 'the txt file is too big and will take too long to be visualized, so we suggest you transfer it to cdt file by R first !');
                        redirect("sga/file_process/error");
                      }

                      //在数据库中添加一条文件的记录
                      $fileid = $this->datafile_model->upload_file(
                              $user->id, $filename, $_FILES['file']['name'], $heatmap_title, $heatmap_desc ,$checkStatus["size"] , $zoom);
                      /* 调用local2dropbox上传data文件到dropbox
                       * * 通过get的方式传递参数
                       * * userid 为用户id
                       * * filename 为本地保存的文件名
                       */
                      //redirect("sga/local2dropbox?userid=" . $user->id . "&filename=" . $filename);
                      //redirect("sga/file_present/" . $fileid);
  
                      //GET TIME TIPS
                      if( ($points < 1000000 && $file_type == "txt") || ($points < 10000000 && $file_type == "cdt") ){
                          $message = " a few minutes";
                      }else{
                          $message = " dozens of minutes";
                      }

                      //SAVE TIPS INFO
                      $this->session->set_userdata('message',$message);  
                      $this->session->set_userdata('file_type',$file_type);

                      redirect("sga/file_process/" . $fileid);

                }else {
                     unlink($save_path);
                     $line = $checkStatus["line"];
                     $this->session->set_userdata("message", "line ". $line . " is not right , please check the data.");
                     redirect("sga/file_process/error");
                }
            } else {
                $this->session->set_userdata('message', 'No file has been uploaded!');
                redirect("sga/file_process/error");
            }
        }
    }

    /*
     * *@brief 提示文件错误信息，上传前设置R的相关参数
     *
    */

    function file_process($fileid) {
        $this->is_logged_in();
        $user = $this->session->userdata('user');

        if($fileid == "error") {
            $data["file_id"] = "";
            $data["filename"] = "";
            $data["username"] = $user->username;
            $data["message"] = $this->session->userdata('message') ;
            $this->load->view("process_index", $data);
        }
        
        if ($fileid > 0) {
            $file = $this->datafile_model->get_file_by_id($fileid);
            $data["file_id"] = $fileid;
            $data["filename"] = $file->filename;
            $data["heatmap_title"] = $file->title;
            $data["heatmap_description"] = $file->description;
            $data["username"] = $user->username;
            $data["file_type"] = $this->session->userdata('file_type');
            $data["include_header"] = "header";
            $data["message"] = $this->session->userdata('message');
            $this->load->view("process_index", $data);
        }
    }

    /**
     * @brief  更新cdt文件对应的txt文件名
     *
     * @return
     */
    function update_cdt_file() {
        $fileId = $_GET["fileId"];
        $fileName = $_GET["fileName"];
        $this->datafile_model->update_cdt_file($fileId, $fileName);
    }

    function test_path() {
        echo base_url();
    }

    /**
     * @brief  个人主页，文件列表 ，上传入口
     *
     * @return
     */

    function heatmap_index(){

        $this->is_logged_in();
        $user = $this->session->userdata("user");
        if (is_null($user) || $user == '') {
            redirect("user/login_form");
        }
        //获取heatmap列表
        $datafile_list = $this->datafile_model->get_datafile_list_by_userid($user->id);

        $result = json_encode($this->user_model->get_user_by_user_id($user->id));
        $data["userid"] = $user->id;
        $data["username"] = $user->username;
        //$data["username"] = $user->nickname;
        $data["headshot"] = $user->small_headshot;
        $data["datafile_list"] = $datafile_list;
        $data["include_header"] = "header";
        $data["result"] = $result;

        $this->load->vars($data); 
        $this->load->view("heatmap_index");
    }

    /**
      * show data files , same as heatmap_index
      *
    **/

    function datafile_list() {
        $user = $this->session->userdata("user");
        if (is_null($user) || $user == '') {
            redirect("user/login_form");
        }
        //获取heatmap列表
        $datafile_list = $this->datafile_model->get_datafile_list_by_userid($user->id);
        /*
          $datafile_list = $this->room_model->get_heatmap_rooms_by_user_id($user->id);
          foreach ($datafile_list as $datafile) {
          $room_list = $datafile->room_list;
          for ($i = 0; $i < count($room_list); $i++) {
          $datafile_id = $room_list[$i]["datafile_id"];
          $room_id = $room_list[$i]["id"];
          $create_time = $room_list[$i]["time"];
          $hash_content = $datafile_id . "_" . $this->room_model->room_hash_key .
          "_" . strval($room_id) . "_" . $create_time;
          $room_list[$i]["hash"] = base64_encode($hash_content);
          }
          $datafile->room_list = $room_list;
          }
         */
        //获取每个Heatmap相关的room，并添加hash
        //$heatmap_room_list = $this->room_model->get_heatmap_room_by_user_id($user->id);

        $result = json_encode($this->user_model->get_user_by_user_id($user->id));
        $data["userid"] = $user->id;
        $data["username"] = $user->username;
        //$data["username"] = $user->nickname;
        $data["headshot"] = $user->small_headshot;
        $data["datafile_list"] = $datafile_list;
        $data["include_header"] = "header";
        $data["result"] = $result;

        $this->load->vars($data);
        $this->load->view("heatmap_index");
    }

    /**
     * @brief 静态的显示单张图片
     *
     * @param $fileid
     *
     * @return
     */
    function file_present($fileid) {
        $this->is_logged_in();
        $user = $this->session->userdata("user");
        $user_new = $this->user_model->get_user_by_username($user->username);
        if (is_null($user) || $user == '') {
            redirect("user/login_form");
        }
        $file = $this->datafile_model->get_file_by_id($fileid);
        if ($file == null) {
            redirect("sga/not_existed");
        }
        $creator = $this->user_model->get_user_by_user_id($file->userid);
        $images = $this->datafile_model->get_image_by_id($fileid);
        $imagename = "";
        if (0 != count($images)) {
            $imagename = $images[0]->filename;
            $imagename = substr($imagename, 0, strlen($imagename) - 4);
        }

        //默认房间hash为0，为公共区域
        $room_hash = 0;
        //判断是否请求进入房间（room参数是否存在）
        if (isset($_GET["room"])) {
            $room_hash = $_GET["room"];
            $hash_content = base64_decode($room_hash);
            if (!strstr($hash_content, $this->room_model->room_hash_key)) {
                $room_hash = -1;
            }
        }
        //R参数
        if(isset($_POST["cluster_type"])){
           $clusterType = $_POST["cluster_type"];
        }else{
           $clusterType = "both";
        }
        if(isset($_POST["color"])){
           $colorType = $_POST["color"];
        }else{
           $colorType = "redgreen";
        }

        //预计时间
        $message = $this->session->userdata("message");

        $params = array(
            "userid" => $user->id,
            "username" => $user->username,
            // "headshot" => $user->small_headshot,
            // "userimage" => $user_new->small_headshot,
            "fileid" => $file->id,
            "filename" => $file->filename,
            "heatmap_title" => $file->title,
            "heatmap_description" => $file->description,
            "heatmap_size" => $file->size,
            "heatmap_zoom"=> $file->zoom,
            "heatmap_creator" => $creator[0]["username"],
            "creator_id" => $file->userid,
            "create_time" => $file->TIME,
            "imagename" => $imagename,
            "color_type" => $colorType,//Passed by process_index
            "cluster_type" => $clusterType,
            "message" => $message,
            "include_header" => "header");
        $this->load->view("image_present", $params);
    }

    /**
     * @brief 静态的显示单张图片
     *
     * @param $fileid
     *
     * @return
     */

    function birds_view($fileid) {

        //$user = $this->session->userdata("user");
        //$user_new = $this->user_model->get_user_by_username($user->username);
        //if (is_null($user) || $user == '') {
        //     redirect("user/login_form");
        //}
        $file = $this->datafile_model->get_file_by_id($fileid);
        if ($file == null) {
            redirect("sga/not_existed");
        }
        $creator = $this->user_model->get_user_by_user_id($file->userid);
        $images = $this->datafile_model->get_image_by_id($fileid);
        $imagename = "";
        if (0 != count($images)) {
            $imagename = $images[0]->filename;
            $imagename = substr($imagename, 0, strlen($imagename) - 4);
        }
        $params = array(
            "fileid" => $file->id,
            "filename" => $file->filename,
            "heatmap_title" => $file->title,
            "heatmap_description" => $file->description,
            "heatmap_size" => $file->size,
            "heatmap_zoom" => $file->zoom,
            "heatmap_creator" => $creator[0]["username"],
            "create_time" => $file->TIME,
            "creator_id" => $file->userid,
            "imagename" => $imagename,
            "include_header" => "header");
        $this->load->view("birds_view", $params);
    }

    /**
     * @brief  发送邮件
     *
     * @return
    */

    function send_email(){
       $file_id = $_POST["file_id"];
       $email = $_POST["email"];
       $mark_title = $_POST["title"];
       $file = $this->datafile_model->get_file_by_id($file_id);
       $file_title = $file->title;
       $user_id = $file->userid;
       $creator = $this->user_model->get_user_by_user_id($user_id);
       $ower_email = $creator[0]["email"];
       $url = "http://" . $_SERVER ['HTTP_HOST']."/HM_S/index.php/sga/file_present/".$file_id;
       $to = $ower_email ;
       $subject = "Someone adds new mark on your heatmap";
       $message = $email .' has added a mark "'. $mark_title .'"" on your heatmap "' . $file_title . '", please go to check it. url : ' . $url;
       mail($to,$subject,$message);
       echo $ower_email;
    }

    /**
     * @brief  把文件及对应的图片删除
     *
     * @return
    */

    function download_image($file_id) {
        //$data_file = $this->datafile_model->get_file_by_id($file_id);
        $image_file = $this->datafile_model->get_imagename_by_datafile_id($file_id);
        $file_names = explode(".", $image_file->filename);
        $image_name = $file_names[0];
        $file = $this->doc_root . "/data/" . $image_name . ".png";;
        if (file_exists($file)) {
            header('Content-Description: File Transfer');
            header('Content-Type: image/png');
            header('Content-Disposition: attachment; filename='.basename($file));
            header('Expires: 0');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Pragma: public');
            header('Content-Length: ' . filesize($file));
            if(ini_get('zlib.output_compression')) 
               ini_set('zlib.output_compression', 'Off');
            ob_clean();
            flush();
            readfile($file);
            exit;
        }
    }

    /**
     * @brief  把文件及对应的图片删除
     *
     * @return
    */

    function delete_file() {
        $file_id = $_POST['id'];
        $user = $this->session->userdata("user");
        $user_id = $user->id;
        $data_file = $this->datafile_model->get_file_by_id($file_id);

        $origin_file = $data_file->origin_filename;
        $file_type = substr($origin_file, -3 , 3); //cdt or txt
        
        //CDT TYPE HAS 6 FILES , TXT HAS 5 FILES
        $file_text = $data_file->filename;
        if($file_type == "cdt" ){
          $file_name = substr($file_text, 0 , strlen($file_text) - 4);
          $cdt_file = $this->doc_root . "/data/".$file_name.".cdt";
        }else{
          $cdt_file = "";
        }

        $file1 = $this->doc_root . "/data/" . $file_text;
        $file2 = $this->doc_root . "/data/cluster_" . $file_text;
        $image_file = $this->datafile_model->get_imagename_by_datafile_id($file_id);
        $file_names = explode(".", $image_file->filename);
        $image_name = $file_names[0];
        $file3 = $this->doc_root . "/data/" . $image_name . ".png";
        $file4 = $this->doc_root . "/data/" . $image_name . ".tif";
        $image_r_names = explode("_", $image_name);
        $image_r_name = $image_r_names[0] . "_r";
        $file5 = $this->doc_root . "/data/" . $image_r_name . ".png";
        $file_array = array($cdt_file ,$file1, $file2, $file3, $file4, $file5);
        $ret = $this->datafile_model->delete_heatmap_by_id($file_id, $user_id);
        if ($ret == 1) {
            //DELETE THE FILES ONE BY ONE
            foreach ($file_array as $file) {
                if (is_file($file)) {
                     unlink($file);
                }
            }
        }
    }

    /**
     * @brief  把本地文件上传到dropbox对应的文件夹
     *
     * @return
     */
    function local2dropbox() {
        $dropbox_params = $this->session->userdata("dropbox_params");

        //检测是否已经登录dropbox
        if (!isset($dropbox_params['access'])) {
            $url_this = "http://" . $_SERVER ['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
            $this->dropbox_auth($url_this);
        } else {
            $this->load->library('dropbox', $dropbox_params);
            $ret = $this->dropbox->add("/data", $this->doc_root . "/data/" . $_GET["filename"]);
            print_r($ret);
        }
    }

    /**
     * @brief  在数据图上添加标记
     *
     * @param x y w h标记的坐标比例
     * @param title 标记的文本
     * @param description 标记的文本
     * @param userid 标记者id
     * @param fileid 标记的数据文件id
     */
    function mark_image() {
        $this->datafile_model->mark_image($_REQUEST["fileid"], $_REQUEST["userid"], $_REQUEST["title"], $_REQUEST["description"], $_REQUEST["x"], $_REQUEST["y"], $_REQUEST["w"], $_REQUEST["h"]);
        echo "0";
    }

    /**
     * @brief  获取数据文件的相关标记
     *
     * @param fileid
     *
     * @return
     */
    function get_mark() {
        $marks = $this->datafile_model->get_mark_by_fileid($_REQUEST["fileid"]);
        echo json_encode($marks);
    }

    /**
     * @brief  成功生成图片后将其信息添加到数据库中
     *
     * @return
     */
    function log_image_info() {
        $this->datafile_model->log_image_info($_GET["fileid"], $_GET["imagename"]);
        echo "0";
    }

    /**
     * @brief  dropbox认证，针对未登录dropbox状态的处理
     *
     * @param $ret_url 返回的处理url
     *
     * @return
     */
    function dropbox_auth($ret_url) {

        $dropbox_params['key'] = 'fcdl8o04bsgeea0';
        $dropbox_params['secret'] = 'cfpokp4xvqkfncg';
        $this->session->set_userdata("dropbox_params", $dropbox_params);
        $this->load->library('dropbox', $dropbox_params);

        $data = $this->dropbox->get_request_token(site_url("sga/dropbox_access") . "?ret_url=" . urlencode($ret_url));
        $this->session->set_userdata('token_secret', $data['token_secret']);
        redirect($data['redirect']);
    }

    /**
     * @brief  获取access_token，不需要直接调用
     *
     * @return
    */

    function dropbox_access() {
        $dropbox_params = $this->session->userdata("dropbox_params");
        $this->load->library('dropbox', $dropbox_params);

        $oauth = $this->dropbox->get_access_token($this->session->userdata('token_secret'));
        $dropbox_params['access'] = array();
        $dropbox_params['access']['oauth_token'] = $oauth['oauth_token'];
        $dropbox_params['access']['oauth_token_secret'] = $oauth['oauth_token_secret'];
        $this->session->set_userdata("dropbox_params", $dropbox_params);
        redirect($_GET["ret_url"]);
    }

    function chat_room() {
        $this->load->view("chat_room", array());
    }

    function png2tiff() {
        $name = $_GET["name"];
        exec('/usr/local/vips/bin/vips im_vips2tiff ' . $this->doc_root . '/data/' . $name . ' ' . $this->doc_root . '/data/' . str_replace("png", "tif", $name) . ':none,tile:256x256,pyramid', $output, $s);
        echo $this->callback_wrap($s);
    }

    //切图放大的显示函数，导入视图
    function show_imagick() {
        $imagename = "new_" . $_POST["imagename"] . ".png";
        $data['imagename'] = $imagename;
        $data['filename'] = $_POST["filename"];
        $data['rows'] = $_POST["rows"];
        $data['cols'] = $_POST["cols"];
        $data['x'] = $_POST["x"];
        $data['y'] = $_POST["y"];
        $data['w'] = $_POST["w"];
        $data['h'] = $_POST["h"];
        $this->load->view("imagick", $data);
    }

    function show_reclust() {
        $data['rows'] = $_POST["rows"];
        $data['cols'] = $_POST["cols"];
        $data['col_image'] = $_POST["x"];
        $data['row_image'] = $_POST["y"];
        $data['color_key'] = $_POST["w"];
        $data['image_path'] = $_POST["h"];
        $data['filename'] = $_POST["filename"];
        $this->load->view("reclust", $data);
    }

    //切图放大的处理函数，返回数据
    function imagick() {
        $this->load->library("imagick_lib");
        $startX = $_GET['x'];
        $startY = $_GET['y'];
        $width = $_GET['w'];
        $height = $_GET['h'];
        $user = $_GET['user']; //获取用户名
        $name = $_GET['name']; //获取文件名
        $zoom = $_GET['zoom']; //原图放大的参数，1为没放大
        $image = new imagick_lib();
        $path = $this->doc_root . '/data/' . $name . '.png';

        $image->open($path); //裁剪的是png文件
        $image->crop($startX, $startY, $width, $height);

        $random = rand(10, 10000);
        $t = time();
        $url = $t . '_' . $random;
        $imageFile = $this->doc_root . '/tmp/' . 'new_' . $url . '.png';
        $image->save_to($imageFile);
        if($zoom == 1){ //原始图像没放大时则截取的图像放大8倍
            $cmd = '/usr/local/jdk/bin/java -Xmx1024m -cp ResizeImg.jar ResizeImg "' . $imageFile . '" "' . $imageFile . '" "JPEG" "8"';
            exec($cmd, $output);
        }
        echo $this->callback_wrap(json_encode($url));
    }

    function get_gene_items() {

        $filename = $_GET['filename'];
        $file = fopen($this->doc_root . '/data/' . $filename, 'r');
        if ($file === FALSE) {
            echo "Open  file error .<br/>";
            exit(0);
        }
        $first_line = fgets($file);
        $cols_array = explode("\t", $first_line);
        $rows_array = array();
        while (!feof($file)) {
            $line = fgets($file);
            $line_array = explode("\t", $line);
            if (count($line_array) > 1) {
                array_push($rows_array, $line_array[0]);
            }
        }
        fclose($file);
        $result = array();
        $result['cols'] = $cols_array;
        $result['rows'] = $rows_array;
        echo $this->callback_wrap(json_encode($result));
    }

    function get_score() {
        $queryname = $_GET['query'];
        $arrayname = $_GET['array'];
        //$user = $_GET['user'];
        $filename = $_GET['filename'];
        $queryname = '"' . trim($queryname) . '"';
        $arrayname = '"' . trim($arrayname) . '"';

        $file = fopen($this->doc_root . '/data/' . $filename, 'r');
        if ($file === FALSE) {
            echo "Open  file error .<br/>";
            exit(0);
        }
        $first_line = fgets($file);
        $array_line = explode(' ', $first_line);
        while (!feof($file)) {
            $line = fgets($file);
            $scoreArray = explode(' ', $line);
            if (trim($scoreArray[0]) == $queryname) {
                for ($i = 0; $i < count($array_line); $i++) {
                    if (trim($array_line[$i]) == $arrayname) {
                        $score = $scoreArray[$i + 1];
                        echo $score;
                        break;
                    }
                }
                break;
            }
        }
        fclose($file);
    }

    /*
     * * 检查上传数据的可靠性 
    */

    function check_txt_data($file) {
        $fh = fopen($file, 'r');
        $delimiter = " ";//先假定分隔符为空格
        $line = fgets($fh);
        $line_array = explode($delimiter, $line);
        $col_num = count($line_array);
        if($col_num == 1){//再假设分隔符为tab
          $delimiter = "\t";
          $line_array = explode($delimiter, $line);
          $col_num = count($line_array);
        }
        $count = 1;
        $isCorrect = TRUE ;
        while ($line = fgets($fh)) {
            $count++;
            $line_array = explode($delimiter, $line);
            $line_num  = count($line_array);
            if($line_num != ($col_num + 1) ){
                $isCorrect = FALSE;
                break;
            }
        }
        fclose($fh);
        $data["type"] = "txt";
        $data["line"] = $count;
        $data["isCorrect"] = $isCorrect;
        $data["size"] = ($count - 1)."x".$col_num;
        return $data;
    }

    function check_cdt_data($file) {
        $fh = fopen($file, 'r');
        $delimiter = "\t";
        $line = fgets($fh);

        //获取第一行的元素数目
        $line_array = explode($delimiter, $line);
        $col_num = count($line_array);
        
        //获取实际的列数
        $gweight_index = array_search("GWEIGHT", $line_array);
        $column = $col_num - $gweight_index - 1 ;

        //实际元素的行数
        $eweight_index = 0 ;
        $row_num = 0 ;

        //实际行数
        $count = 1;
        $isCorrect = TRUE ;
        while ($line = fgets($fh)) {
            $count++;
            $line_array = explode($delimiter, $line);
            $line_num  = count($line_array);

            if($line_array[0] == "EWEIGHT"){
              $eweight_index = $count;
            }

            if($line_num != $col_num){
                $isCorrect = FALSE;
                break;
            }
        }
        fclose($fh);

        $row_num = $count - $eweight_index;
        $data["type"] = "cdt";
        $data["line"] = $count;
        $data["isCorrect"] = $isCorrect;
        $data["size"] = $row_num."x".$column;
        return $data;
    }

    function test() {
        /*
          $this->load->driver('cache', array('adapter'=>'memcached'));
          $this->cache->memcached->save("abc", "123");
          echo $this->cache->memcached->get("abc");
        */
        print_r($this->user_model->test());
    }

    function dropbox_upload(){
        $url = $_POST["url"];
        return $url;
    }
}

?>
