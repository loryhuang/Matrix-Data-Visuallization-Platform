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
           parent.$('body').find('.head_portrait_big').attr("src","");
           parent.$('body').find('.head_portrait_middle').attr("src","");
           parent.$('body').find('.head_portrait_small').attr("src","");

           parent.$('body').find('.head_portrait_big').attr("src","<?php echo $big;?>");
           parent.$('body').find('.head_portrait_middle').attr("src","<?php echo $middle;?>");
           parent.$('body').find('.head_portrait_small').attr("src","<?php echo $small;?>");

           parent.$('body').find('#oldPictureUrl').val("<?php echo $big;?>");
       }
    </script>
</head>
<body onload="test()">
</body>
</html>