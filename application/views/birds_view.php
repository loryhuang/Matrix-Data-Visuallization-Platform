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

    <link rel="stylesheet" type="text/css" href="./css/social.css"/>
    <link rel="stylesheet" type="text/css" href="./css/main.css"/>
    <!--[if lt IE 7]>
    <script src="http://ie7-js.googlecode.com/svn/version/2.1(beta4)/IE7.js">IE7_PNG_SUFFIX = ".png";</script>
    <![endif]-->
</head>
<body>
    <form id="data_form" style=" margin: 0;padding: 0; display:none; ">
        <input type="hidden" name="fileid" value="<?php echo $fileid ?>"/>
        <input type="hidden" name="heatmap_title" value="<?php echo $heatmap_title ?>"/>
        <input type="hidden" name="heatmap_description" value="<?php echo $heatmap_description ?>"/>
        <input type="hidden" name="heatmap_size" value="<?php echo $heatmap_size ?>"/>
        <input type="hidden" name="heatmap_zoom" value="<?php echo $heatmap_zoom ?>"/>
        <input type="hidden" name="heatmap_creator" value="<?php echo $heatmap_creator ?>"/>
        <input type="hidden" name="create_time" value="<?php echo $create_time ?>"/>
        <input type="hidden" name="filename" value="<?php echo $filename ?>"/>
        <input type="hidden" name="imagename" value="<?php echo $imagename ?>"/>
    </form>

    <div id="pageLoading"><h2>Loading.....</h2></div>
    <div id="view_container">
        <div class="container">
            <div id="view" class="left-wrapper">
                <div id="viewer">
                </div>
            </div>
        </div>
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

    <script data-main="./js/main/birds_view.js" src="./js/require.js"></script>
</body>
</html>