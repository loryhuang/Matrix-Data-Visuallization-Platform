<base href="<?php echo base_url(); ?>"/>
<!DOCTYPE html>
<html>
    <head>
        <title>detail of heatmap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="./css/imagick.css" />
    </head>
    <body>
        <form id="data_form" style="margin: 0;padding: 0; display:none;">  
            <input type="hidden" name="imagename" value="<?php echo $imagename ?>"/>
            <input type="hidden" name="filename" value="<?php echo $filename ?>"/>
            <input type="hidden" name="rows" value="<?php echo $rows ?>"/>
            <input type="hidden" name="cols" value="<?php echo $cols ?>"/>
            <input type="hidden" name="x" value="<?php echo $x ?>"/>
            <input type="hidden" name="y" value="<?php echo $y ?>"/>
            <input type="hidden" name="w" value="<?php echo $w ?>"/>
            <input type="hidden" name="h" value="<?php echo $h ?>"/>     
        </form>
        
        <div class="imgLoading" style="clear:both;display:none"></div>
        <div id="east-content">
            <div id="l">                 
                <div id="t"></div>
                <div id="img">
                    <img src="<?= $imagename ?>" alt="Imagick"/>
                </div>
            </div>
            <div id="sr">
                <div id="s"><div class="s_loading"></div></div>
                <div id="r"></div>                     
            </div>
            
            <script data-main="./js/main/show_imagick.js" src="./js/require.js"></script>
    </body>
</html>
