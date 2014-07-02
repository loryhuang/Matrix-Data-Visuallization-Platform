<base href="<?php echo base_url(); ?>"/>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Heatmap of the data file</title>
    <meta charset="utf-8"/>

    <link rel="stylesheet" type="text/css" href="./css/imgareaselect-default.css"/>
    <link rel="stylesheet" type="text/css" media="all" href="./css/iip.css"/>
    <!--[if lt IE 9]>
    <link rel="stylesheet" type="text/css" media="all" href="iipmooviewer2/css/ie.css"/>
    <![endif]-->

    
    <link rel="stylesheet" type="text/css" href="./css/social.css"/>
    <link rel="stylesheet" type="text/css" href="./css/main.css"/>

    <!-- <link rel="stylesheet" type="text/css" href="./css/heatmap2.css"/> -->
    <!--[if lt IE 7]>
    <script src="http://ie7-js.googlecode.com/svn/version/2.1(beta4)/IE7.js">IE7_PNG_SUFFIX = ".png";</script>
    <![endif]-->
    <script type="text/javascript" src="https://www.dropbox.com/static/api/2/dropins.js" id="dropboxjs" data-app-key="pgl0jaa1au451x0"></script>
</head>
<body>
<form id="data_form" style=" margin: 0;padding: 0; display:none; ">
    <input type="hidden" name="userid" value="<?php echo $userid ?>"/>
    <input type="hidden" name="username" value="<?php echo $username ?>"/>
    <input type="hidden" name="headshot" value="<?php echo $headshot ?>"/>
    <input type="hidden" name="fileid" value="<?php echo $fileid ?>"/>
    <input type="hidden" name="heatmap_title" value="<?php echo $heatmap_title ?>"/>
    <input type="hidden" name="heatmap_description" value="<?php echo $heatmap_description ?>"/>
    <input type="hidden" name="heatmap_size" value="<?php echo $heatmap_size ?>"/>
    <input type="hidden" name="heatmap_zoom" value="<?php echo $heatmap_zoom ?>"/>
    <input type="hidden" name="heatmap_creator" value="<?php echo $heatmap_creator ?>"/>
    <input type="hidden" name="creator_id" value="<?php echo $creator_id ?>"/>
    <input type="hidden" name="create_time" value="<?php echo $create_time ?>"/>
    <input type="hidden" name="filename" value="<?php echo $filename ?>"/>
    <input type="hidden" name="imagename" value="<?php echo $imagename ?>"/>
    <input type="hidden" name="cluster_type" value="<?php echo $cluster_type ?>"/>
    <input type="hidden" name="color_type" value="<?php echo $color_type ?>"/>
    <!-- <input type="hidden" name="room_hash" value="<?php echo $room_hash ?>"/> -->
</form>

<div id="pageLoading">
    <h2>Loading... 
        <?php if ($message != "" && !is_null($message)) {
            echo ", this may take ".$message;
        } ?> 
        , please wait.
    </h2>
</div>

<div id="shade"></div>

<div id="conform_box" class="box">
    <div class="box_content">
        <a class="close_tag"></a>
        <div class="button-group">
            <p> Are you sure to delete the <span id="del_type"> mark </span> <i><span id="del_mark_name"></span></i> ?</p> 
            <div class="conform_btn">
                <input type="button" class="del_cancel_btn btn btn-m" value="Cancel" />
                <input type="button" class="del_conform_btn btn btn-m" value="OK" />
            </div>
        </div>
    </div>
</div>

<div id="alert_box" class="box" style="display:none">
    <div class="box_content">
        <a class="close_tag"></a>
        <div class="button-group">
            <p></p> 
            <input type="button" class="alert_tips_btn btn btn-m" value="OK" />
        </div>
    </div>
</div>

<div id="view_container">
    <div id="head" class="navbar">
        <div class="nav-logo">
            <a class="logo vartical-middle" href="<?php echo base_url() .'index.php/sga/heatmap_index';?>"></a>
        </div>
        <div class="nav-info">
            <h3><?php echo $heatmap_title ?></h3>
            <div class="user-icon">
                <p><?php echo "by  ".$heatmap_creator ?></p>
            </div>
            <div class="size-icon"> 
                <p>Size:<?php echo $heatmap_size ?>&nbsp;;&nbsp;Time:<?php echo $create_time ?></p>
                <a class="share_link">Share Link</a>
            </div>
        </div>
        
        <div class="nav-right">
            <ul class="nav pull-right">
            <li><a class="vartical-middle no-padding personName_read" href="javascript:void(0)"><?php echo $username ?></a></li>
            <li class="dropdown">
                <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown">
                    <img class="head_portrait_small"
                             src="./image/user-icon_blue.png"/>
                    <b class="caret bottom-up"></b>
                </a>
                <ul class="dropdown-menu">
                    <li><a href="index.php/sga/heatmap_index"> Home </a></li>
                    <li><a href="index.php/sga/download_image/<?php echo $fileid ?>" > Download Image </a></li>
                    <li><a href="javascript:void(0)" class="save_dropbox" > Export Image to Dropbox </a></li>
                    <li class="divider"></li>
                    <li><a href="<?php echo base_url().'index.php/user/logout'?>" >Logout </a></li>
                </ul>
            </li>
            </ul>
        </div>
    </div>

    <div class="container min-width">
        <div class="row min-height">
            <div id="view" class="left-wrapper">
                <div id="viewer">
<!--                    <div class="mark-box" id="mark_box_16" l_r="0.412667" t_r="0.64625" w_r="0" h_r="0" style="left: 496.0005px; top: 393px; display: block;">-->
<!--                        <input type="hidden" class="markid" value="16">-->
<!--                        <input type="hidden" class="roomid" value="16">-->
<!--                        <div class="row offset15">-->
<!--                            <p class="title">ds</p>-->
<!--                            <p class="description">sdfs</p>-->
<!--                        </div>-->
<!--                        <div class="basic-info">-->
<!--                            <a href="javascript:void(0)" class="row pull-left">-->
<!--                                <img src="http://115.156.216.95/sga_lss/resource/image/user/small/small30.jpg">-->
<!--                            </a>-->
<!--                            <div class="row-fluid">-->
<!--                                <p><a href="javascript:void(0)" title="">David nick</a></p>-->
<!--                                <p>Introduction</p>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                        <p class="to-comment operate-btn"><b class="icon-comment"></b>0<em>comment</em></p>-->
<!--                        <p class="to-collect operate-btn"><b class="icon-collect"></b><em>collect</em></p>-->
<!--                        <p class="to-at operate-btn"><b class="icon-at" title="Quote this to room-chat"></b><em>add to chat</em></p>-->
<!--                    </div>-->
                </div>
            </div>
        </div>
    </div>
</div>
<script data-main="./js/main/present_image.js" src="./js/require.js"></script>
</body>
</html>