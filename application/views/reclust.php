<base href="<?php echo base_url(); ?>"/>
<!DOCTYPE html>
<html>
<head>
   <title>recluster of selected heatmap area.</title>
   <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
   <link rel="stylesheet" type="text/css" href="./css/heatmap.css" />
 </head>
<body>

<div class="imgLoading" style="clear:both;display:none"></div>

<form id="data_form" style="margin: 0;padding: 0; display:none;">  
    <input type="hidden" name="filename" value="<?php echo $filename ?>"/>
    <input type="hidden" name="image_path" value="<?php echo $image_path ?>"/>
    <input type="hidden" name="rows" value="<?php echo $rows ?>"/>
    <input type="hidden" name="cols" value="<?php echo $cols ?>"/>
    <input type="hidden" name="color_key" value="<?php echo $color_key ?>"/>
    <input type="hidden" name="col_image" value="<?php echo $col_image ?>"/>
    <input type="hidden" name="row_image" value="<?php echo $row_image ?>"/>
</form>

<div id="reclust_content"></div>

<script data-main="./js/main/show_reclust.js" src="./js/require.js"></script>

</body>
</html>
