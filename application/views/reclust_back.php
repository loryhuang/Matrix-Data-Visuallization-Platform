<base href="<?php echo base_url(); ?>"/>
<!DOCTYPE html>
<html>
<head>
   <title>recluster of selected heatmap area.</title>
   <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
   <link rel="stylesheet" type="text/css" href="./css/heatmap.css" />
 </head>
<body>

<div class="imgLoading" style="clear:both;display:none">
</div>

<div id="reclust_content">
  
</div>
<script src="./js/lib/jquery-1.7.2.min.js"></script>
<script src="./js/lib/raphael.js"></script>

<script type="text/javascript">
	var data = {};
	data.color_key = "<?= $color_key ?>";
	data.col_image = "<?= $col_image ?>";
	data.row_image = "<?= $row_image ?>";
	data.image_path = "<?= $image_path ?>";
	data.filename = "<?= $filename ?>";
	data.rows = "<?= $rows ?>";
	data.cols = "<?= $cols ?>";
	data.step = 16;

	data.server = 'http://115.156.216.95/HM_S/';
        data.URL_GETSCORE = data.server + 'index.php/sga/get_score';

	$(function () {
		var imagick_html = '<div id="main_container"><div id="left"><div id="colorkey"><img src="' + 
		data.server + data.color_key + '" alt="colorkey"/></div><div id="ll">' +
		'<img src="' + data.server + data.col_image + '" alt="colImage"/></div></div><div id="l_"><div id="tt"><img src="' 
		+ data.server + data.row_image + '" alt="rowImage"/></div>' +
		'<div id="heatmap"><img src="' + data.server + data.image_path + 
		'" alt="heatmap"/></div><div id="t_"></div></div>' +
		'<div id="sr_"><div id="s_"><div class="ss_loading"></div></div><div id="r_"></div></div></div>';
		$('#reclust_content').append(imagick_html);
		$.getScript("./js/process/recluster.js");
	});

</script>

<!-- <script src="./js/process/recluster.js"></script> -->

</body>
</html>
