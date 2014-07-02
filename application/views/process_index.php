<base href="<?php echo base_url(); ?>"/>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        
        <!-- <link rel="stylesheet" type="text/css" href="./css/normalize.css"/> -->
        <!-- <link rel="stylesheet" type="text/css" href="./css/furatto.css"/> -->
        <!-- <link rel="stylesheet" type="text/css" href="./css/furatto_3.0.css"/> -->
        <link rel="stylesheet" type="text/css" href="./css/social.css"/>
        <link rel="stylesheet" type="text/css" href="./style/heatmap_index.css"/>
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
                <!-- <h1>My Heatmaps</h1>
                <p id="file_type_tip">
                    <a>File Type</a>
                </p>
                <div id="fetch_file_box">
                    <div id="upload_file_btn">
                        <p><a>Upload Data File </a></p>
                    </div>
                    <div id="dropbox_chooser_btn">
                        <p><a>Choose From Dropbox </a></p>
                    </div>
                </div> -->
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

<!--
        <div id="tips_box" class="box">
            <a class="close_tag"></a>
            <div id="ftype">
               <div class="ftype_item">
                    <h3>TXT File</h3>
                    <p> 
                        Plain text file with the ".txt" file extension contains the data matrix ,the first row are the column names ,the first column are the row names, all names are with double quotation marks ,names and scores are seperated with tabs ,so the first line is one less than other lines. 
                    </p> 
               </div>
               <div class="ftype_item">
                    <h3>CDT File</h3>
                    <p>
                        Generalized CDT file is a tab-delimitted text file with the ".cdt" file extension. The leftmost column and topmost row are reserved for headers. The file must contain at least two columns followed by a column with the header GWEIGHT, and at least one row followed by a row with the header EWEIGHT. Any rows and columns before the EWEIGHT and GWEIGHT are treated as annotation kept in string form, and any after are treated as data.  
                    </p> 
               </div>
            </div>
            <div id="fnum">  
                <p>
                    Restricted by the capacity of our server, we limit every user to upload <strong class="emFont"> 10 files </strong> most, if you want to upload new files, you can delete some files previously uploaded . 
                </p>
            </div>
        </div>

    
        <form id="upload_box" class="file-box box" action="<?= site_url(); ?>/sga/upload" method="POST" enctype="multipart/form-data">
            <div class="box_header">
                <h3>Upload Data File</h3>
                 <a class="close_tag"></a>
            </div>
            <div class="box_content">
                <a class='btn btn-m' href="javascript:void(0)">Select file</a>
                <input type='text' name='textfield' id='textfield'/>
                <input type="file" name="file" onchange="if(this.value) { document.getElementById('textfield').value = this.value; if(this.value.substr(-4) != '.txt' && this.value.substr(-4) != '.cdt'){ alert('File type error, please select a cdt or txt file!'); } }"/>
                <label for="title">Title</label>
                <input type="text" name="title" class="input_title"/>
                <label for="description">Description</label>
                <textarea name="description"></textarea>
           
                <div class="button-group">
                    <div class="span12">
                        <input type="button" class="cancel_create_btn btn btn-m" value="Cancel"/>
                        <input type="submit" class="submit_create_btn btn btn-m" value="Upload"/>
                    </div>
                </div>
             </div>
        </form>

        <form id="dropbox_box" class="file-box box" action="<?= site_url(); ?>/sga/upload" method="POST" enctype="multipart/form-data">
            <div class="box_header">
                <h3>Upload Data File</h3>
                 <a class="close_tag"></a>
            </div>
            <div class="box_content">
                <p class="dp_tips"> You have choose the file <i id="name"></i> from Dropbox </p>
                <input type="hidden" name = "filename" value="" />
                <input type="hidden" name = "fileurl" value="" />
                <label for="title">Title</label>
                <input type="text" name="title" class="input_title"/>
                <label for="description">Description</label>
                <textarea name="description"></textarea>
            </div>
            <div class="button-group">
                <div class="span12">
                     <input type="button" class="cancel_create_btn btn btn-m" value="Cancel"/>
                     <input type="submit" class="submit_create_btn btn btn-m" value="Upload"/>
                </div>
            </div>
        </form>

        <div id="conform_box" class="box">
            <div class="box_content">
                <a class="close_tag"></a>
                <div class="button-group">
                    <p> Are you sure to delete data file <i><span id="del_file_name"></span><i> ?</p> 
                    <input type="button" class="del_cancel_btn btn btn-m" value="Cancel" />
                    <input type="button" class="del_conform_btn btn btn-m" value="OK" />
                </div>
            </div>
        </div>

        <div id="alert_box" class="box">
            <div class="box_content">
                <a class="close_tag"></a>
                <div class="button-group">
                    <p></p> 
                    <input type="button" class="alert_tips_btn btn btn-m" value="OK" />
                </div>
            </div>
        </div>
        <div id="shade"></div>
-->
        <script data-main="./js/main/process_index.js" src="./js/require.js"></script>
    </body>
</html>
