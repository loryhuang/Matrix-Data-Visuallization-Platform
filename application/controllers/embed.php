<?php
class Embed extends CI_Controller
{
    private $TOKEN_CREATE_KEY = 'jiulouban';
    private $SPLIT_CHAR = '#';
    var $SMALL_IMAGE_URL = '/var/www/sga_lss/';
    public function __construct()
    {
        parent::__construct();
        $this->load->model("mark_model");
        $this->load->model("datafile_model");
        $this->is_logged_in();
    }

    var $base_url = "/var/www/sga_lss/data/";

    function is_logged_in(){
        $is_logged_in = $this->session->userdata("user");
        if (!isset($is_logged_in) || $is_logged_in != TRUE) {
            $url_this = "http://" . $_SERVER ['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
            redirect('user/login_form?ret_url=' . urlencode($url_this));
        }
    }

    public function preview()
    {
        //解析token，返回一个带有目标链接和图片URL的JSON
        $token = $_REQUEST['token'];
        $origin_info = base64_decode($token);
        if (!strstr($origin_info, $this->TOKEN_CREATE_KEY)) {
            echo 'Token error';
        } else {
            list($datafile_id, $token_create_key, $img_file) = explode($this->SPLIT_CHAR, $origin_info);
            $result = array(
                'imgUrl' => base_url() . 'data/preview/' . $img_file,
                'targetUrl' => base_url() . 'index.php/sga/file_present/' . $datafile_id
            );
            if (array_key_exists('callback', $_GET)) {
                header('Content-Type: text/javascript; charset=utf8');
                header('Access-Control-Allow-Origin: http://www.example.com/');
                header('Access-Control-Max-Age: 3628800');
                header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
                $callback = $_GET['callback'];
                echo $callback . '(' . json_encode($result) . ');';
            }
        }
    }
    public function get_datafile_token()
    {
        $datafile_id = $_REQUEST['datafile_id'];
        $mark_list = $this->mark_model->get_all_mark_by_datafile_id($datafile_id, 0, 16);
        $image_list = $this->datafile_model->get_imagename_by_datafile_id($datafile_id);
        $imagename = "";
        if(count($image_list) != 0){
            $imagename = $image_list->filename;
            $imagename = substr($imagename, 0, strlen($imagename) - 4);
        }
        $img_file = $imagename . '_small.png';
        $image_url = $this->SMALL_IMAGE_URL . 'data/' . $imagename . '.png';
        $file_url = $this->SMALL_IMAGE_URL . 'images/ico_pin.png';
        $file = $this->SMALL_IMAGE_URL . 'data/preview/' . $img_file;
        $this->load->library("picture");
        $this->picture->dest_image($file);
        $this->picture->get_pic_info($image_url);
        $this->picture->set_mark($file_url, $mark_list);

        //TODO: 这里调用Library的方法，根据datafile_id生成缩略图png
        //存放在base_url() . 'data/preview' 文件夹下
        //$img_file的文件名例子：'xxxxx.png'
        //下面会根据datafile_id, KEY, img_file加密组成一个token，发送给客户端

        $token = base64_encode($datafile_id . $this->SPLIT_CHAR .
        $this->TOKEN_CREATE_KEY . $this->SPLIT_CHAR . $img_file);
        echo $token;
    }

    public function xml2json($source) { 
        if(is_file($source)){               
            $xml_array = simplexml_load_file($source);  
        }else{  
            $xml_array = simplexml_load_string($source);  
        }  
        $json = json_encode($xml_array);    
        return $json;  
    }  

    function test(){
        $source = $this->base_url . "deepzoom";
    }
}
?>
