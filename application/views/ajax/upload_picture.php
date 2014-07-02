<?php
/**
 * Created by youjuzi.
 * Date: 13-8-15
 * Time: 下午2:21
 */
//session_start();
?>

<html>
<head>
    <script>
       function test(){
               if("<?php echo $result;?>"=="true"){
                   parent.$('body').find('#uncutPicture').html("<img id='ImageDrag' width='<?php echo $width;?>' height='<?php echo $height;?>' src='<?php echo $file;?>'/>");
<!--                   parent.$('body').find('#ImageDrag').attr("src","--><?php //echo $file;?><!--");-->
                   parent.$('body').find('#cutPictureUrl').val("<?php echo $file;?>");
                   parent.$('body').find('#showCutArea').click();
               }else{
                   if("<?php echo $msg;?>" == ""){
                       alert("<?php echo $msg;?>");
                   }else{
                       alert("upload failed. Please upload a smaller picture.");
                   }
               }
        }
    </script>
</head>
<body onload="test()">
</body>
</html>