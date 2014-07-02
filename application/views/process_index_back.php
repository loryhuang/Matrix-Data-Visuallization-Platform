<base href="<?php echo base_url(); ?>"/>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="./css/imgareaselect-default.css"/>
        <link rel="stylesheet" type="text/css" href="./css/normalize.css"/>
        <link rel="stylesheet" type="text/css" href="./css/bootstrap.min.css"/>
        <link rel="stylesheet" type="text/css" href="./css/furatto.css"/>
        <link rel="stylesheet" type="text/css" href="./css/social.css"/>
        <link rel="stylesheet" type="text/css" href="./css/personinfo.css"/>
        <link rel="stylesheet" type="text/css" href="./css/heatmap2.css"/>
        <link rel="stylesheet" type="text/css" href="./css/process_index.css"/>
    </head>
    <body>
        <?php
        $this->load->view($include_header, array("dropdown_options" => array("Home" => "index.php/sga/datafile_list", "Logout" => "index.php/user/logout")));
        ?>

        <form id="data_form" style="margin: 0;padding: 0; display:none;">
            <input type="hidden" name="userid" value="<?php echo $userid ?>"/>
            <input type="hidden" name="file_id" value="<?php echo $fileid ?>"/>
        </form>

        <div class="container-center">
<!--            <div class="row-fluid">-->
                <div class="span12">
                    <p>Data has been successfully uploaded! </p>
                    <p>You can set the cluster premeters for the result maps.</p>
                    <p>According to the size of your data ,the clustering may take 5 minutes.</p>
                    <form id="upload_box" class="file-box form-horizontal" action="<?= site_url(); ?>/sga/file_present/<?php echo $fileid; ?>" method="POST" enctype="multipart/form-data">
                        <h3> Set cluster premeters </h3>
                        <div class="control-group">
                            <label class="control-label" for="cluster">Clustering type</label>
                            <div class="controls">
                                <select id="cluster" name="cluster">
                                    <option>  Row  </option>
                                    <option> Col </option>
                                </select>
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" for="color">Coloring type</label>
                            <div class="controls">
                                <select id="cluster" name="color">
                                    <option>  Red  </option>
                                    <option> Green </option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="control-group">
                            <label class="control-label" for="func">Coloring hclustfun</label>
                            <div class="controls">
                                <select id="func" name ="func">
                                    <option>  hclust </option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="sbmBtn">
                            <button type="submit" class="btn btn-center">Submit</button>
                        </div>
                                       
                    </form>
                </div> 
<!--            </div>-->
        </div>

        <div class="footer">
            <p>Copy right 2014 </p>
        </div> 

        <script data-main="./js/main/heatmap_index.js" src="./js/require.js"></script>
    </body>
</html>
