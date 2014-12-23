<base href="<?php echo base_url(); ?>"/>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <link rel="stylesheet" type="text/css" href="./css/social.css"/>
        <link rel="stylesheet" type="text/css" href="./css/heatmap_index.css"/>
        <link rel="stylesheet" type="text/css" href="./css/process_index.css"/>
    </head>
    <body>
                
        <form id="data_form" style=" margin:0;padding:0; display:none;">
            <input type="hidden" name="file_id" value="<?php echo $file_id ?>"/>
            <input type="hidden" name="username" value="<?php echo $username ?>"/>
            <input type="hidden" name="filename" value="<?php echo $filename ?>"/>
        </form>

        <div id="head">
            <div id="head_nav">
                <div id="header"><a href="<?php echo base_url().'index.php/sga/heatmap_index' ?>" ></a></div>
                <div id="user_nav">
                    <div id="user_info" class="navbar">
                        <!-- <p><img src="./image/user-icon.png" /> <span><?php echo $username ?></span></p> -->
                            <ul class="nav pull-right">
                                <li class="dropdown_title"><a class="vartical-middle" href="javascript:void(0)"><?php echo $username ?></a></li>
                                <li class="dropdown">
                                    <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown">
                                        <img src="./image/user-icon.png"/>
                                        <b class="caret bottom-down"></b>
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li><a href="index.php/sga/heatmap_index" >Home</a></li>
                                        <li class="divider"></li>
                                        <li><a href="<?php echo base_url().'index.php/user/logout'?>" > Logout </a></li>
                                    </ul>
                                </li> 
                            </ul>
                    </div>
                </div>
            </div> 
        </div>

        <div id="container">
            <div id="neck">

            </div>

            <div id="content">
            <?php if($file_id != "error" && $file_id > 0 ){ ?>
            <div class="success_content process_content">
                    <div class="process_box">
                        <h3>Data <i><?php echo $filename; ?></i> has been successfully uploaded! </h3>
                        <p class="time_tip">According to the size of the data , the cluster process may take <span><?php echo $message; ?></span></p>
                        <p class="process_tip">You can set the premeters for clustering to get your desired result heatmaps.</p>
                        <form action="<?= site_url(); ?>/sga/file_present/<?php echo $file_id; ?>" method="post" accept-charset="utf-8">
                            
                            <?php if($file_type == "txt"){?>  
                                <p><b>Select Cluster Type </b>:</p>
                                <div class="cluster-group">
                                    <p>
                                        <input type="radio" name="cluster_type"  value="both" checked="checked"/> both
                                        <input type="radio" name="cluster_type"  value="row" /> row
                                        <input type="radio" name="cluster_type"  value="col" /> col  
                                        <input type="radio" name="cluster_type"  value="none" /> none
                                    </p>
                                </div>
                            <?php } ?>

                            <p><b>Select min-max Colors </b> :</p>

                            <div class="color-group">

                                <span class="btn-select-label">Min Color </span>
                                <a class="btn-select" id="btn_select_min">
                                    <span class="cur-select" style="background-color:red">red</span>
                                    <div class="options">
                                        <p class="red">red</p>
                                        <p class="green">green</p>
                                        <p class="blue">blue</p>
                                        <p class="white">white</p>
                                        <p class="yellow">yellow</p>
                                        <p class="aqua">aqua</p>
                                    </div>
                                </a>
                                <span class="btn-select-label">Max Color </span>
                                <a class="btn-select" id="btn_select_max">
                                    <span class="cur-select" style="background-color:green">green</span>
                                    <div class="options">
                                        <p class="red">red</p>
                                        <p class="green">green</p>
                                        <p class="blue">blue</p>
                                        <p class="white">white</p>
                                        <p class="yellow">yellow</p>
                                        <p class="purple">purple</p>
                                    </div>
                                </a>

                                <label class="reset-color"><a id="resetBtn"> Reset </a></label>
                                
                            </div>

                            <input type="hidden" name="color" value="redgreen"></input>

                            <p class="sbtn">
                                <button type="submit" class="btn btn-m">Submit</button>
                            </p>
                        </form>
                    </div>
                </div>
                <?php } else { ?>
                <div class="error_content process_content">
                    <div class="process_box">
                        <h3> File Upload Error </h3>
                        <p> The File you uploaded has some problem ;</p>
                        <p class="error_tips"> Error: <?php echo $message; ?> </p>
                        <p class="back_link"> <a href="index.php/sga/heatmap_index"> << Back </a></p>  
                    </div>  
                </div>
                <?php } ?>

            </div>
        </div>

        <div id="footer"> 
             <p> Copy right &copy; 2014 ,All rights reserved.</p>
        </div>

        <script data-main="./js/main/process_index.js" src="./js/require.js"></script>
    </body>
</html>
