<base href="<?php echo base_url(); ?>"/>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="./css/imgareaselect-default.css"/>
        <link rel="stylesheet" type="text/css" href="./css/normalize.css"/>
        <link rel="stylesheet" type="text/css" href="./css/furatto.css"/>
        <link rel="stylesheet" type="text/css" href="./css/social.css"/>
        <link rel="stylesheet" type="text/css" href="./css/personinfo.css"/>
        <link rel="stylesheet" type="text/css" href="./css/heatmap2.css"/>
        <script type="text/javascript" src="https://www.dropbox.com/static/api/2/dropins.js" id="dropboxjs" data-app-key="pgl0jaa1au451x0"></script>
    </head>
    <body>
        <?php
        $this->load->view($include_header, array("dropdown_options" => array("Logout" => "index.php/user/logout")));
        ?>

        <?php
        $result = json_decode($result);
        $result = $result[0];
        ?>
        <form id="data_form" style=" margin: 0;padding: 0; display:none;">
            <input type="hidden" name="userid" value="<?php echo $userid ?>"/>
            <input type="hidden" name="filenum" value="<?php echo count($datafile_list) ?>"/>
        </form>

        <div class="container-center">
            <div class="row-fluid">
                <div class="span12">
                    <div class="span8">
                        <h3>My Heatmap</h3>
                        <ul class="datalist">
                            <?php
                            foreach ($datafile_list as $df) {
                                $hm_url = site_url("sga/file_present") . "/" . $df->id;
                                ?>
                                <li class="<?= $df->id ?>">
                                    <h4 class="heatmap-name">
                                        <a href="<?= $hm_url ?>"><?= $df->title == "" ? $df->origin_filename . "(No title)" : $df->title ?></a> 
                                        <span class="delbtn"><a class="btn btn-link" value="<?= $df->id ?>">delete</a></span>
                                        <span class="shrbtn"><a class="btn btn-link" value="<?= $df->id ?>">copy link</a></span>
                                    </h4>
                                    <p class="heatmap-desc"><?php echo $df->description ?></p>
                                </li>
                            <?php } ?>
                        </ul>
                    </div>
                    <div class="span4" id="profile-box">

                        <!--<a id="upload_heatmap" class="btn btn-xlarge btn-block btn-upload">Upload Heatmap</a>-->
                        <p id="upload_heatmap" class="text-center font-big btn-block btn-upload">Upload Data File</p>
                        <p id="upload_dropbox" class="text-center font-big btn-block btn-upload">Get File From dropbox</p>
                        <div class="form-box">
                            <div class="form-body">
                                <div class="result-wrapper row-fluid">
                                    <div id="file_instruct" >
                                        <p><span class="font-title">Allowed File Type</span></p>
                                        <div class="instruct_text item-box-bottom">
                                            <p class="it_title"><i> TXT File </i></p>
                                            <p>Plain text file with the .txt file extension contains the data matrix ,the first row are the column names ,the first column are the row names,
                                                all names are with double quotation marks ,names and scores are seperated with tabs ,so the first line is one less 
                                                than other lines.
                                            </p>
                                        </div>
                                        <div class="instruct_text item-box-bottom">
                                            <p class="it_title"><i> CDT File </i></p>
                                            <p> Generalized CDT file is a tab-delimitted text file with the .cdt file extension. 
                                                The leftmost column and topmost row are reserved for headers. The file must contain at 
                                                least two columns followed by a column with the header GWEIGHT, and at least one row followed 
                                                by a row with the header EWEIGHT. Any rows and columns before the EWEIGHT and GWEIGHT are treated 
                                                as annotation kept in string form, and any after are treated as data. 
                                            </p>
                                        </div>
                                        <div style="height:25px;"></div>
                                        <p><span class="font-title">File Number Limit</span></p>
                                        <div class="instruct_text item-box-bottom">  
                                            <p>
                                                Restricted by the capacity of our server, we limit every user to upload <b> 10 </b> files most, if you want to upload new files,
                                                you can delete some files previously uploaded .
                                            </p>
                                        </div>
                                    </div>           
                                </div>
                            </div>
                        </div>       
                    </div>
                </div>
            </div>

        </div>
        <div class="footer">
            <p>Copy right 2014 </p>
        </div> 

        <div id="shade"></div>

        <form id="upload_box" class="file-box" action="<?= site_url(); ?>/sga/upload" method="POST" enctype="multipart/form-data">
            <a class='btn btn-m' href="javascript:void(0)">Select file</a>
            <input type='text' name='textfield' id='textfield'/>
            <input type="file" name="file" onchange="if(this.value) { document.getElementById('textfield').value = this.value; if(this.value.substr(-4) != '.txt' && this.value.substr(-4) != '.cdt'){ alert('File type error, please select a cdt or txt file!'); } }"/>
            <label for="title">Title</label>
            <input type="text" name="title" id="input_title"/>
            <label for="description">Description</label>
            <textarea name="description"></textarea>

            <div class="row-fluid" id="button-group">
                <div class="span12">
                    <input type="submit" class="span6 btn" value="Submit"/>
                    <input type="button" class="span6 btn cancel_create" value="Cancel" id="cancel_create"/>
                </div>
            </div>
        </form>

        <form id="dropbox_box" class="file-box" action="<?= site_url(); ?>/sga/upload" method="POST" enctype="multipart/form-data">
            <p>Set description of <b id="name"></b></p>
            <input type="hidden" name = "filename" value="" />
            <input type="hidden" name = "fileurl" value="" />
            <label for="title">Title</label>
            <input type="text" name="title" id="input_title"/>
            <label for="description">Description</label>
            <textarea name="description"></textarea>

            <div class="row-fluid" id="button-group">
                <div class="span12">
                    <input type="submit" class="span6 btn" value="Submit"/>
                    <input type="button" class="span6 btn cancel_create" value="Cancel" id="cancel_create"/>
                </div>
            </div>
        </form>

        <div class="conform_box">
            <div class="row-fluid button-group">
                <div class="span12">
                     <p> Are you sure to delete this data file ?</p>
                    <input id="del_conform_btn" type="button" class="span6 btn" value="Ok" />
                    <input id="del_cancel_btn" type="button" class="span6 btn" value="Cancel" />
                </div>
            </div>
        </div>

        <div id="image_edit_shade"></div>
        <div id="image_edit_block">
            <a href="javascript:void(0);" class="close-back"></a>

            <p id="upload-title" class="font-big">Cut your picture</p>

            <form name="uploadCutPicture" id="uploadCutPicture" method="POST"
                  action="index.php/user/upload_cut_picture" enctype="multipart/form-data" target="uploadCutIframe">
                <div id="uncutPicture">
                    <img id="ImageDrag"/>
                </div>
                <a class="btn pull-right btn-m offset5">Cancel</a>
                <a class="btn pull-right btn-m offset5">Save</a>

                <div style = "display:none">
                    <input name="crop_top" type="text" value="100" id="crop_top"/>
                    <input name="crop_left" type="text" value="100" id="crop_left"/>
                    <input name="crop_width" type="text" value="100" id="crop_width"/>
                    <input name="crop_height" type="text" value="100" id="crop_height"/>
                    <input type="hidden" name="cutPictureId" id="cutPictureId" value="<?php echo $userid; ?>"/>
                    <input type="hidden" name="cutPictureUrl" id="cutPictureUrl"/>
                    <input type="hidden" name="oldPictureUrl" id="oldPictureUrl" value="<?php
                            if ($result->big_headshot == null) {
                                echo "";
                            } else {
                                echo base_url() . $result->big_headshot;
                            }
                            ?>"/>
                </div>
            </form>
            <iframe name="uploadCutIframe" id="uploadCutIframe" style = "display:none;"></iframe>
        </div>
        <script data-main="./js/main/heatmap_index.js" src="./js/require.js"></script>
    </body>
</html>
