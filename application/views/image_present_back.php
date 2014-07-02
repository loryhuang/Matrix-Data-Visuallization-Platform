<base href="<?php echo base_url(); ?>"/>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>cluster interaction profiles of genes</title>
    <meta charset="utf-8"/>
    <link rel="stylesheet" type="text/css" media="all" href="./css/iip.css"/>
    <link rel="stylesheet" type="text/css" href="./css/imgareaselect-default.css"/>
    <!--[if lt IE 9]>
    <link rel="stylesheet" type="text/css" media="all" href="iipmooviewer2/css/ie.css"/>
    <![endif]-->
    <link rel="stylesheet" type="text/css" href="./css/jquery.atwho.css"/>
    <link rel="stylesheet" type="text/css" href="./css/jquery.ui.all.css"/>
    <link rel="stylesheet" type="text/css" href="./css/jquery.ui.tabs.css"/>
    <link rel="stylesheet" type="text/css" href="./css/main.css"/>
    <link rel="stylesheet" type="text/css" href="./css/social.css"/>
    <link rel="stylesheet" type="text/css" href="./css/personinfo.css"/>
    <link rel="stylesheet" type="text/css" href="./css/heatmap2.css"/>
    <!--[if lt IE 7]>
    <script src="http://ie7-js.googlecode.com/svn/version/2.1(beta4)/IE7.js">IE7_PNG_SUFFIX = ".png";</script>
    <![endif]-->
</head>
<body>
<form id="data_form" style=" margin: 0;padding: 0; display:none; ">
    <input type="hidden" name="userid" value="<?php echo $userid ?>"/>
    <input type="hidden" name="username" value="<?php echo $username ?>"/>
    <input type="hidden" name="headshot" value="<?php echo $headshot ?>"/>
    <input type="hidden" name="fileid" value="<?php echo $fileid ?>"/>
    <input type="hidden" name="heatmap_title" value="<?php echo $heatmap_title ?>"/>
    <input type="hidden" name="heatmap_description" value="<?php echo $heatmap_description ?>"/>
    <input type="hidden" name="heatmap_creator" value="<?php echo $heatmap_creator ?>"/>
    <input type="hidden" name="creator_id" value="<?php echo $creator_id ?>"/>
    <input type="hidden" name="create_time" value="<?php echo $create_time ?>"/>
    <input type="hidden" name="filename" value="<?php echo $filename ?>"/>
    <input type="hidden" name="imagename" value="<?php echo $imagename ?>"/>
    <input type="hidden" name="room_hash" value="<?php echo $room_hash ?>"/>
</form>

<div id="pageLoading"><h2>Loading...,this may take a few minutes, please wait.</h2></div>
<div id="feedback"></div>
<div id="shade"></div>
<div id="create_room_box">
    <label for="title">Room Name</label><input type="text" name="title"/>
    <label for="description">Room Description</label><textarea name="description"></textarea>
    <a class="btn pull-right btn-m" href="javascript:void(0)" id="cancel_create">Cancel</a>
    <a class="btn pull-right btn-m offset5" href="javascript:void(0)" id="to_create">Create</a>
</div>

<div id="view_container">
    <?php
    $this->load->view($include_header,
        array("dropdown_options" => array("Home" => "index.php/sga/datafile_list" , "Logout" => "index.php/user/logout")));
    ?>
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
<!--        <div id="imagick" class="right-wrapper bg-color1">

            </div>-->
        </div>
    </div>
</div>
<script data-main="./js/main/present_image.js" src="./js/require.js"></script>
</body>
</html>
