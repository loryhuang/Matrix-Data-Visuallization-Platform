<base href="<?php echo base_url(); ?>"/>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" type="text/css" href="./css/normalize.css"/>
    <link rel="stylesheet" type="text/css" href="./css/social.css"/>
</head>
<body>
<?php
$this->load->view($include_header,
    array("dropdown_options" => array("Logout")));
?>

    <div class="container-center">
        <div class="row bg-color3">
            <div class="span12">
                <div class="not-found"></div>
            </div>
        </div>
    </div>
<script data-main="./js/main/heatmap_index.js" src="./js/require.js"></script>
</body>
</html>