<base href="<?php echo base_url(); ?>"/>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="https://www.dropbox.com/static/api/2/dropins.js" id="dropboxjs" data-app-key="pgl0jaa1au451x0"></script>
        <link rel="stylesheet" type="text/css" href="./css/social.css"/>
        <link rel="stylesheet" type="text/css" href="./style/heatmap_index.css"/>
    </head>
    <body>
        <?php
        //$this->load->view($include_header, array("dropdown_options" => array("Logout" => "index.php/user/logout")));
        ?>
        <?php
        $result = json_decode($result);
        $result = $result[0];
        ?>
        <form id="data_form" style=" margin:0;padding:0; display:none;">
            <input type="hidden" name="userid" value="<?php echo $userid ?>"/>
            <input type="hidden" name="filenum" value="<?php echo count($datafile_list) ?>"/>
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
                <h1>My Heatmaps</h1>
                <p id="file_type_tip">
                    <a>File Type</a>
                </p>
                <div id="fetch_file_box">
                    <div id="upload_file_btn">
                        <a>Upload Data File </a>
                    </div>
                    <div id="dropbox_chooser_btn">
                        <a>Choose From Dropbox </a>
                    </div>
                </div>
            </div>

            <div id="content">
                <?php
                if (count($datafile_list) > 0 ) {
                    $count = 0 ;
                    foreach ($datafile_list as $df) {
                        $count++;
                        $hm_url = site_url("sga/file_present") . "/" . $df->id;
                        ?>
                        <div class="list" id="<?php echo 'item'.$df->id ?>">
                            <div class="list_item">
                                <p class="size">
                                    size : <?php echo $df->size ?>
                                </p>
                                <p class="title">
                                    <a href="<?= $hm_url ?>"><?= $df->title == "" ? $df->origin_filename . "(No title)" : $df->title ?></a>
                                </p>
                                <p class="description">
                                    <?php echo $df->description ?>
                                </p>
                                <p class="index">#<?php echo $count; ?></p>
                                <p class="time">
                                    <?php echo $df->TIME ?>
                                </p>
                            </div>
                            <div class="list_tool">
                                <input type="hidden" value="<?= $df->id ?>" />
                                <a class="delbtn" title="delete the data file"> </a>
                                <a class="shrbtn" title="copy and share the link"></a>
                            </div>
                        </div>
                <?php 
                    } 
                }else{ ?>
                    <div id="no-content">
                        <h4>Instructions</h4>
                        <p> 
                            You have not uploaded any data file yet ,please click the button above to upload data from <strong>local </strong> or <strong> Dropbox </strong>.
                        </p>
                        <p> 
                            Only files in <strong> .txt </strong> and <strong> .cdt </strong> format can be uploaded.
                        </p>
                        <P>
                            For the file format detail, please refer to the <a class="file_type_link"> File Type </a> icon right top corner. 
                        </p>
                        <p>
                            When txt data files are uploaded , the data will be clustered by the R heatmap.2 function and then be visualized as a heatmap.
                            When cdt data files are uploaded , the data will be directly visualized <strong>without</strong> being clustered .
                        <p>
                            Be clear that when upload big txt files , it may take <strong> quite a long time </strong> to get the result. So we suggest you firstly
                            get the txt file clustered into a cdt file by R console , then upload .   
                        </p>
                        <p> Every registered user can upload <strong>10 </strong> files at most.</p>
                        
                    </div>
                <?php } ?>
            </div>
        </div>

        <div id="footer"> 
             <p> Copy right &copy; 2014 ,All rights reserved.</p>
        </div>


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
                <input type='text' name='textfield' id='textfield' disabled="disabled" value="" />
                <input type="file" name="file" onchange="if(this.value) {document.getElementById('textfield').value = this.value; if(this.value.substr(-4) != '.txt' && this.value.substr(-4) != '.cdt'){ alert('File type error, please select a cdt or txt file!'); } }"/>
                <label for="title">Title</label>
                <input type="text" name="title" class="input_title"/>
                <label for="description">Description</label>
                <textarea name="description"></textarea>
           
                <div class="button-group">
                    <div class="span12">
                        <a type="button" class="cancel_create_btn btn btn-m"> Cancel </a>
                        <a type="button" class="submit_create_btn btn btn-m"> Upload </a>
                    </div>
                </div>
             </div>
             <div class="upload_shade"></div>
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
                     <input type="button" class="submit_create_btn btn btn-m" value="Upload"/>
                </div>
            </div>
            <div class="upload_shade"></div>
        </form>

        <div id="conform_box" class="box">
            <div class="box_content">
                <a class="close_tag"></a>
                <div class="button-group">
                    <p> Are you sure to delete data file <i><span id="del_file_name"></span></i> ?</p> 
                    <div class="conform_btn">
                        <input type="button" class="del_cancel_btn btn btn-m" value="Cancel" />
                        <input type="button" class="del_conform_btn btn btn-m" value="OK" />
                    </div>
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

        <script data-main="./js/main/heatmap_index.js" src="./js/require.js"></script>
    </body>
</html>
