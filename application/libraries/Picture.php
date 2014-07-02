<?php

/**
 * Description of Picture2
 *
 * @author GGCoke
 * 2012-2-29 12:57:36
 */
class Picture {

    /**
     * 图片基本信息
     */
    var $PICTURE_URL;           // 要处理的图片
    var $PICTURE_TYPE;          // 图片的类型(jpg, jpeg, gif, png)
    var $PICTURE_MIME;          // 输出的头部
    var $PICTURE_EXT;           // 图片扩展名
    var $PICTURE_DEST;          // 生成目标图片位置
    var $PICTURE_CREATE;        // 原图片的句柄
    var $PICTURE_TRUE_COLOR;    // 新建一个真彩图象
    var $PICTURE_WIDTH;         // 原图片宽度
    var $PICTURE_HEIGHT;        // 原图片高度

    /**
     * 图片缩放相关参数
     */
    var $ZOOM_TYPE = 1;         // 缩放类型, 0为按比例缩放，1为按尺寸缩放
    var $ZOOM_MULTIPLE = 1;     // 缩放比例
    var $ZOOM_WIDTH = 100;      // 缩放宽度
    var $ZOOM_HEIGHT = 100;     // 缩放高度

    /**
     * 裁切，按比例和固定长度、宽度
     */
    var $CUT_TYPE = 0;          // 裁切类型, 0为按比例裁切, 1为按尺寸裁切
    var $CUT_MULTIPLE = 1;      // 裁切的比例
    var $CUT_X = 0;             // 裁切的横坐标
    var $CUT_Y = 0;             // 裁切的纵坐标
    var $CUT_WIDTH = 100;       // 裁切的宽度
    var $CUT_HEIGHT = 100;      // 裁切的高度
    var $ORI_CUT_WIDTH = 0;     // 在原图上裁切的宽度
    var $ORI_CUT_HEIGHT = 0;    // 在原图上裁切的高度

    /**
     * 水印相关属性
     * $WATER_IMAGE 和 $WATER_TEXT 不可以同时使用，选其中之一即可，优先使用 $WATER_IMAGE。
     * 当$WATER_IMAGE有效时，参数$WATER_TEXT、$WATER_FONT_COLOR、$WATER_FONT_SIZE 均不生效
     */
    var $WATER_POSTION = 0;                 // 水印位置，有10种状态，0为随机位置；1为顶端居左，2为顶端居中，3为顶端居右；4为中部居左，5为中部居中，6为中部居右；7为底端居左，8为底端居中，9为底端居右
    var $WATER_TEXT = "";                   // 文字水印，即把文字作为为水印，支持ASCII码，支持中文
    var $WATER_IMAGE = "";                  // 图片水印，即作为水印的图片，只支持GIF,JPG,PNG格式
    var $WATER_FONT_SIZE = 12;              // 文字水印的字体大小，默认为12
    var $WATER_FONT_COLOR = '#CCCCCC';      // 文字水印文字颜色，值为十六进制颜色值，默认为#CCCCCC(白灰色)
    var $WATER_FONT_FILE = './msyh.ttf';    // ttf字体文件，即用来设置文字水印的字体。默认是当前目录下msyh.ttf
    var $WATER_OFFSET_X;                    // 水平偏移量，即在默认水印坐标值基础上加上这个值，默认为0，如果你想留给水印留出水平方向上的边距，可以设置这个值,如：2 则表示在默认的基础上向右移2个单位,-2 表示向左移两单位
    var $WATER_OFFSET_Y;                    // 垂直偏移量，即在默认水印坐标值基础上加上这个值，默认为0，如果你想留给水印留出垂直方向上的边距，可以设置这个值,如：2 则表示在默认的基础上向下移2个单位,-2 表示向上移两单位
    var $WATER_IMAGE_HANDLER;               // 图片水印的句柄
    var $WATER_IMAGE_WIDTH;                 // 图片水印的宽度
    var $WATER_IMAGE_HEIGHT;                // 图片水印的高度
    var $WATERMARK_WIDTH;                   // 水印的宽度
    var $WATERMARK_X;                       // 水印左上角的X值
    var $WATERMARK_Y;                       // 水印左上角的Y值
    var $IS_WATER_IMAGE = false;            // 是否为图片水印
    /**
     * 错误信息
     */
    var $ERROR = array(
          '指定的图片不存在'
        , '不支持的图片格式，只支持jpg, gif, png格式'
        , '新图片的高度或宽度为0'
        , '需要加水印的图片的长度或宽度小于水印图片或文字区域，无法生成水印'
        , '字体文件不存在'
        , '水印文字颜色格式不正确'
    );

    function __construct() {
    }

    function get_pic_info($pic_url) {
        // 检查指定图片是否存在，不存在则提示错误，并退出
        @$INFO = getimagesize($pic_url);
        if (!$INFO) {
            die($this->ERROR[0]);
        }
        // 获取图片基本信息
        $this->PICTURE_MIME = $INFO['mime'];
        $this->PICTURE_WIDTH = $INFO[0];
        $this->PICTURE_HEIGHT = $INFO[1];
        // 图片类型
        switch ($INFO[2]) {
            case IMAGETYPE_GIF:
                $this->PICTURE_CREATE = imagecreatefromgif($pic_url);
                $this->PICTURE_TYPE = "imagegif";
                $this->PICTURE_EXT = "gif";
                break;
            case IMAGETYPE_JPEG:
                $this->PICTURE_CREATE = imagecreatefromjpeg($pic_url);
                $this->PICTURE_TYPE = "imagejpeg";
                $this->PICTURE_EXT = "jpg";
                break;
            case IMAGETYPE_PNG:
                $this->PICTURE_CREATE = imagecreatefrompng($pic_url);
                $this->PICTURE_TYPE = "imagepng";
                $this->PICTURE_EXT = "png";
                break;
        }
    }

    function dest_image($dest) {
        $this->PICTURE_DEST = $dest;
    }

    function zoom_type($zoom_type) {
        $this->ZOOM_TYPE = $zoom_type;
    }

    function zoom_multiple($zoom_multiple) {
        $this->ZOOM_MULTIPLE = $zoom_multiple;
    }

    function zoom_size($width, $height) {
        $this->ZOOM_WIDTH = $width;
        $this->ZOOM_HEIGHT = $height;
    }

    function cut_type($cut_type) {
        $this->CUT_TYPE = $cut_type;
    }

    function cut_multiple($cut_multiple) {
        $this->CUT_MULTIPLE = $cut_multiple;
    }

    function cut_size($cut_x, $cut_y, $cut_width, $cut_height, $ori_cut_width, $ori_cut_height) {
        $this->CUT_X = $cut_x;
        $this->CUT_Y = $cut_y;
        $this->CUT_WIDTH = $cut_width;
        $this->CUT_HEIGHT = $cut_height;
        $this->ORI_CUT_WIDTH = $ori_cut_width;
        $this->ORI_CUT_HEIGHT = $ori_cut_height;
    }

    /**
        * @brief   合成缩略图
        *
        * @param $markImage 原图
        * @param $xoffset x偏移百分比
        * @param $yoffset y偏移百分比
        *
        * @return 
     */
    function set_mark($markImage, $mark_list){
        $this->MARK_IMAGE = $markImage;
        $mark_info = getimagesize($markImage);
        $this->MARK_IMAGE_WIDTH = $mark_info[0];
        $this->MARK_IMAGE_HEIGHT = $mark_info[1];
        $pic_w = 640;
        $pic_h = 640;
        switch ($mark_info[2]) { 
        case IMAGETYPE_GIF:$this->MARK_IMAGE_HANDLER = imagecreatefromgif($markImage);
        break;
        case IMAGETYPE_JPEG:$this->MARK_IMAGE_HANDLER = imagecreatefromjpeg($markImage);
        break;
        case IMAGETYPE_PNG:$this->MARK_IMAGE_HANDLER = imagecreatefrompng($markImage);
        break;
        default: die($this->ERROR[1]);
        }
        $this->PICTURE_TRUE_COLOR = imagecreatetruecolor($pic_w, $pic_h);
        imagecopyresampled($this->PICTURE_TRUE_COLOR, $this->PICTURE_CREATE, 0, 0, 0, 0, $pic_w, $pic_h,$this->PICTURE_WIDTH,$this->PICTURE_HEIGHT); 
        foreach($mark_list as $row){
            $this->MARK_OFFSET_X = $row["x"] * $pic_w;
            $this->MARK_OFFSET_Y = $row["y"] * $pic_h;
            // imagecopyresampled($this->PICTURE_CREATE, $this->MARK_IMAGE_HANDLER, $this->MARK_OFFSET_X, $this->MARK_OFFSET_Y, 0, 0,$this->PICTURE_WIDTH/15, $this->PICTURE_HEIGHT/15, $this->MARK_IMAGE_WIDTH, $this->MARK_IMAGE_HEIGHT);
            imagecopy($this->PICTURE_TRUE_COLOR, $this->MARK_IMAGE_HANDLER, $this->MARK_OFFSET_X, $this->MARK_OFFSET_Y, 0, 0,$this->MARK_IMAGE_WIDTH, $this->MARK_IMAGE_HEIGHT);
        }
        imagepng($this->PICTURE_TRUE_COLOR, $this->PICTURE_DEST);
    }

    /**
     * 为图片添加水印 (水印支持图片或文字) 
     * @param type $waterPos 水印位置，有10种状态，0为随机位置:1为顶端居左，2为顶端居中，3为顶端居右，4为中部居左，5为中部居中，6为中部居右，7为底端居左，8为底端居中，9为底端居右
     * @param type $waterImage 图片水印，即作为水印的图片，暂只支持GIF,JPG,PNG格式
     * @param type $waterText 文字水印，即把文字作为为水印，支持中文
     * @param type $fontSize 文字大小，默认为12
     * @param type $textColor 文字颜色，值为十六进制颜色值，默认为#CCCCCC(白灰色)
     * @param type $fontfile ttf字体文件，即用来设置文字水印的字体，默认是当前目录下msyh.ttf
     * @param type $xOffset 水平偏移量，即在默认水印坐标值基础上加上这个值，默认为0，如果你想留给水印留出水平方向上的边距，可以设置这个值,如：2 则表示在默认的基础上向右移2个单位,-2 表示向左移两单位
     * @param type $yOffset 垂直偏移量，即在默认水印坐标值基础上加上这个值，默认为0，如果你想留给水印留出垂直方向上的边距，可以设置这个值,如：2 则表示在默认的基础上向下移2个单位,-2 表示向上移两单位
     * @return 成功返回true，否则返回对应错误信息
     */
    function set_watermark_params($waterPos=0, $waterImage='', $waterText='', $fontSize=12, $textColor='#CCCCCC', $fontfile='', $xOffset=0, $yOffset=0) {
        $this->WATER_POSTION = $waterPos;
        $this->WATER_IMAGE = $waterImage;
        $this->WATER_TEXT = $waterText;
        $this->WATER_FONT_SIZE = $fontSize;
        $this->WATER_FONT_COLOR = $textColor;
        $this->WATER_FONT_FILE = $fontfile;
        $this->WATER_OFFSET_X = $xOffset;
        $this->WATER_OFFSET_Y = $yOffset;

        // 如果水印类型为图片
        if (!empty($waterImage) && file_exists($waterImage)) {
            $this->IS_WATER_IMAGE = true;
            $water_info = getimagesize($waterImage);
            $this->WATER_IMAGE_WIDTH = $water_info[0]; //取得水印图片的宽 
            $this->WATER_IMAGE_HEIGHT = $water_info[1]; //取得水印图片的高 

            switch ($water_info[2]) {    //取得水印图片的格式  
                case IMAGETYPE_GIF:$this->WATER_IMAGE_HANDLER = imagecreatefromgif($waterImage);
                    break;
                case IMAGETYPE_JPEG:$this->WATER_IMAGE_HANDLER = imagecreatefromjpeg($waterImage);
                    break;
                case IMAGETYPE_PNG:$this->WATER_IMAGE_HANDLER = imagecreatefrompng($waterImage);
                    break;
                default: die($this->ERROR[1]);
            }
        }

        // 根据选择计算水印的位置
        $this->get_watermark_pos();
    }

    function make_watermark() {
        //设定图像的混色模式 
        imagealphablending($this->PICTURE_CREATE, true);
        if ($this->IS_WATER_IMAGE) {    //图片水印 
            imagecopy($this->PICTURE_CREATE, $this->WATER_IMAGE_HANDLER, $this->WATERMARK_X + $this->WATER_OFFSET_X, $this->WATERMARK_Y + $this->WATER_OFFSET_Y, 0, 0, $this->WATER_IMAGE_WIDTH, $this->WATER_IMAGE_HEIGHT); //拷贝水印到目标文件         
        } else {//文字水印
            if (!empty($this->WATER_FONT_COLOR) && (strlen($this->WATER_FONT_COLOR) == 7)) {
                $R = hexdec(substr($this->WATER_FONT_COLOR, 1, 2));
                $G = hexdec(substr($this->WATER_FONT_COLOR, 3, 2));
                $B = hexdec(substr($this->WATER_FONT_COLOR, 5));
            } else {
                die($this->ERROR[5]);
            }
            $temp = imagettfbbox($this->WATER_FONT_SIZE, 0, $this->WATER_FONT_FILE, $this->WATER_TEXT); //取得使用 TrueType 字体的文本的范围
            $h = $temp[3] - $temp[7];   // 获取文字的高度
            unset($temp);
            imagettftext($this->PICTURE_CREATE, $this->WATER_FONT_SIZE, 0, $this->WATERMARK_X + $this->WATER_OFFSET_X, $this->WATERMARK_Y + $h + $this->WATER_OFFSET_Y, imagecolorallocate($this->PICTURE_CREATE, $R, $G, $B), $this->WATER_FONT_FILE, $this->WATER_TEXT);
        }
        // 生成水印后的图片 
        switch ($this->PICTURE_TYPE) {
            case 'imagegif':
                imagegif($this->PICTURE_CREATE, $this->PICTURE_DEST);
                break;
            case 'imagejpeg':
                $hahah = imagejpeg($this->PICTURE_CREATE, $this->PICTURE_DEST, 100);
                break;
            case 'imagepng':
                imagepng($this->PICTURE_CREATE, $this->PICTURE_DEST);
                break;
            default:
                die($this->ERROR[1]);
                break;
        }
        return true;
    }

    function get_watermark_pos() {
        $w = $h = 0;
        if ($this->IS_WATER_IMAGE) { // 水印类型为图片
            $w = $this->WATER_IMAGE_WIDTH;
            $h = $this->WATER_IMAGE_HEIGHT;
        } else {    // 水印类型为文字
            if (!file_exists($this->WATER_FONT_FILE))
                die($this->ERROR[4]);
            $temp = imagettfbbox($this->WATER_FONT_SIZE, 0, $this->WATER_FONT_FILE, $this->WATER_TEXT); //取得使用 TrueType 字体的文本的范围 
            $w = $temp[2] - $temp[6];
            $h = $temp[3] - $temp[7];
            unset($temp);
        }

        // 水印大小比底图大，错误
        if (($this->PICTURE_WIDTH < $w) || ($this->PICTURE_HEIGHT < $h)) {
            die($this->ERROR[3]);
        }

        switch ($this->WATER_POSTION) {
            case 0://随机 
                $this->WATERMARK_X = rand(0, ($this->PICTURE_WIDTH - $w));
                $this->WATERMARK_Y = rand(0, ($this->PICTURE_HEIGHT - $h));
                break;
            case 1://1为顶端居左 
                $this->WATERMARK_X = 0;
                $this->WATERMARK_Y = 0;
                break;
            case 2://2为顶端居中 
                $this->WATERMARK_X = ($this->PICTURE_WIDTH - $w) / 2;
                $this->WATERMARK_Y = 0;
                break;
            case 3://3为顶端居右 
                $this->WATERMARK_X = $this->PICTURE_WIDTH - $w;
                $this->WATERMARK_Y = 0;
                break;
            case 4://4为中部居左 
                $this->WATERMARK_X = 0;
                $this->WATERMARK_Y = ($this->PICTURE_HEIGHT - $h) / 2;
                break;
            case 5://5为中部居中 
                $this->WATERMARK_X = ($this->PICTURE_WIDTH - $w) / 2;
                $this->WATERMARK_Y = ($this->PICTURE_HEIGHT - $h) / 2;
                break;
            case 6://6为中部居右 
                $this->WATERMARK_X = $this->PICTURE_WIDTH - $w;
                $this->WATERMARK_Y = ($this->PICTURE_HEIGHT - $h) / 2;
                break;
            case 7://7为底端居左 
                $this->WATERMARK_X = 0;
                $this->WATERMARK_Y = $this->PICTURE_HEIGHT - $h;
                break;
            case 8://8为底端居中 
                $this->WATERMARK_X = ($this->PICTURE_WIDTH - $w) / 2;
                $this->WATERMARK_Y = $this->PICTURE_HEIGHT - $h;
                break;
            case 9://9为底端居右 
                $this->WATERMARK_X = $this->PICTURE_WIDTH - $w;
                $this->WATERMARK_Y = $this->PICTURE_HEIGHT - $h;
                break;
            default://随机 
                $this->WATERMARK_X = rand(0, ($this->PICTURE_WIDTH - $w));
                $this->WATERMARK_Y = rand(0, ($this->PICTURE_HEIGHT - $h));
                break;
        }
    }

    function zoom() {
        if ($this->ZOOM_TYPE == 0) {
            $this->ZOOM_WIDTH = $this->PICTURE_WIDTH * $this->ZOOM_MULTIPLE;
            $this->ZOOM_HEIGHT = $this->PICTURE_HEIGHT * $this->ZOOM_MULTIPLE;
        }
        imagepng($this->PICTURE_CREATE, $this->PICTURE_DEST);

        // 创建一个目标大小的真彩图片
        $this->PICTURE_TRUE_COLOR = @imagecreatetruecolor($this->ZOOM_WIDTH, $this->ZOOM_HEIGHT);
        switch($this->PICTURE_TYPE){
            case "imagepng":
                $background = imagecolorallocate($this->PICTURE_TRUE_COLOR, 0, 0, 0);
                imagecolortransparent($this->PICTURE_TRUE_COLOR, $background);
                imagealphablending($this->PICTURE_TRUE_COLOR, false);
                imagesavealpha($this->PICTURE_TRUE_COLOR, true);
                break;
            case "imagegif":

                break;
        }
        imagecopyresampled($this->PICTURE_TRUE_COLOR, $this->PICTURE_CREATE, 0, 0, 0, 0, $this->ZOOM_WIDTH, $this->ZOOM_HEIGHT, $this->PICTURE_WIDTH, $this->PICTURE_HEIGHT);
        $this->_save();
    }

    function cut() {
        if ($this->CUT_TYPE == 0) {
            $this->CUT_WIDTH = $this->PICTURE_WIDTH * $this->CUT_MULTIPLE;
            $this->CUT_HEIGHT = $this->PICTURE_HEIGHT * $this->CUT_MULTIPLE;
        }
        $this->PICTURE_TRUE_COLOR = imagecreatetruecolor($this->CUT_WIDTH, $this->CUT_HEIGHT);
        switch($this->PICTURE_TYPE){
            case "imagepng":
                $background = imagecolorallocate($this->PICTURE_TRUE_COLOR, 0, 0, 0);
                imagecolortransparent($this->PICTURE_TRUE_COLOR, $background);
                imagealphablending($this->PICTURE_TRUE_COLOR, false);
                imagesavealpha($this->PICTURE_TRUE_COLOR, true);
                break;
            case "imagegif":

                break;
        }
        imagecopyresampled($this->PICTURE_TRUE_COLOR, $this->PICTURE_CREATE, 0, 0, $this->CUT_X, $this->CUT_Y, $this->CUT_WIDTH, $this->CUT_HEIGHT, $this->ORI_CUT_WIDTH, $this->ORI_CUT_HEIGHT);
        // imagecopy($this->PICTURE_TRUE_COLOR, $this->PICTURE_CREATE, 0, 0, $this->CUT_X, $this->CUT_Y, $this->CUT_WIDTH, $this->CUT_HEIGHT);
        $this->_save();
    }

    function _save() {
        
        switch ($this->PICTURE_TYPE) {
            case 'imagegif':
                imagegif($this->PICTURE_TRUE_COLOR, $this->PICTURE_DEST);
                break;
            case 'imagejpeg':
                imagejpeg($this->PICTURE_TRUE_COLOR, $this->PICTURE_DEST, 100);
                break;
            case 'imagepng':
                imagepng($this->PICTURE_TRUE_COLOR, $this->PICTURE_DEST);
                break;
            default:
                die($this->ERROR[1]);
                break;
        }
    }

    /**
     * 析构函数，释放资源
     */
    function __destruct() {
        /* 释放图片 */
        @imagedestroy($this->PICTURE_TRUE_COLOR);
        @imagedestroy($this->PICTURE_CREATE);
    }

}

// End of script
