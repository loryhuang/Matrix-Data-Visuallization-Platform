<?php
/**
 * Created by xigualzn.
 * Date: 13-8-13
 * Time: 下午4:36
 * To change this template use File | Settings | File Templates.
 */
$list_tmp = json_decode($list);
$markinfo_tmp = json_decode($markinfo);
$mark_type = $markinfo_tmp->type == 0 ? 'pin' : 'area';
$color = "blue";
//var_dump($markinfo);
?>
<a class="tab" href="javascript:void(0)" id="commentpage-<?php echo $markid?>-tab"><b class="icon-tab-comment"></b></a>
<div id="commentpage-<?php echo $markid;?>" class="right-content commentpage">
    <a class="btn btn-m pageclose" href="javascript:void(0)" id="commentpage-<?php echo $markid;?>-close">Close</a>
    <div class="row item-box">
        <input type="hidden" class="markid" value="<?php echo $markid; ?>"/>
        <h1>Comment box</h1>
        <p>
            <i class="icon-<?php echo $mark_type . '-' . $color; ?> reset-icon "></i>
            <a href="javascript:void(0)" class="marktitle" style="font-size: 16px;"><?php echo  $markinfo_tmp->title; ?></a></p>
<!--        <p>--><?php //echo $markinfo_tmp->description; ?><!--</p>-->
<!--        <a href="javascript:void(0)" class="row pull-left">-->
<!--            <img src="--><?php //echo base_url().$markinfo_tmp->small_headshot;?><!--"  style="height:30px">-->
<!--        </a>-->
<!--        <p class="display-inline"><a href="javascript:void(0)" title="">--><?php //echo $markinfo_tmp->nickname;?><!--</a></p>-->

<!--        <textarea  placeholder="Your oponion" class="area-b"></textarea>-->
<!--        <a class="btn btn-b" href="javascript:void(0)" id="send_comment">That's it!</a>-->
    </div>
    <div class="result-wrapper">
        <input type="hidden" class="cupage" value="<?php echo $cupage;?>"/>
        <input type="hidden" class="tocount" value="<?php echo $tocount;?>"/>
        <div class="auto-flow">
            <?php
            if($list_tmp != null){
            foreach($list_tmp as $list_box){
                $commentid = $list_box->commentid;
                $user_id = $list_box->user_id;
                $user_nickname = $list_box->nickname;
                $user_middle_image = $list_box->middle_headshot == "" ? "resource/image/user/middle/middle50.jpg" : $list_box->middle_headshot;
                $reply_to = $list_box->reply_to_user_id;
                $time = $list_box->time;
                $content = $list_box->text;
                $child = array_key_exists('child', $list_box) ? $list_box->child : array();
                ?>

            <div class="comment-box clearfix" id="<?php echo $commentid;?>">
                <a href="javascript:void(0)" class="pull-left"><img src="<?php echo base_url() .$user_middle_image;?>"/></a>
                <div class="comment">
                    <input type="hidden" class="replyto" value="<?php echo $user_id;?>"/>
                    <p><a href="javascript:void(0)" class="replytoname nickname"><?php echo $user_nickname;?></a></p>
                    <p><?php echo $content?></p>
                    <p class="pull-left"><?php echo $time;?></p>
                    <b class="icon-comment pull-right reply-trigger" title="reply"></b>
                    <?php if($child!= ''){?>
                    <div class="sub-comment-wrapper">
                        <?php foreach($child as $child_box){
                            $sub_user_id = $child_box->commentid;
                            $sub_user_id = $child_box->user_id;
                            $sub_user_nickname = $child_box->nickname;
                            $sub_user_image_s = $child_box->small_headshot == "" ? "/resource/image/user/small/small30.jpg" :  $child_box->small_headshot;
                            $sub_content = $child_box->text;
                            $sub_time = $child_box->time;
                            $sub_reply_to = $child_box->reply_to_user_id;
                            $sub_reply_name = $child_box->reply_nickname;

                            ?>
                            <div class="sub-comment-box clearfix">
                                <input type="hidden" class="replyto" value="<?php echo $sub_user_id;?>"/>
                                <a href="javascript:void(0)" class="pull-left"><img src="<?php echo base_url() . $sub_user_image_s;?>"/> </a>
                                <div class="sub-comment">
                                    <p><a href="javascript:void(0)" class="replytoname nickname"><?php echo $sub_user_nickname;?></a>
                                        <?php if($sub_reply_name != '' && $sub_reply_name != null){?>&nbsp; To &nbsp; <a href="javascript:void(0)" class="nickname"><?php echo $sub_reply_name;?></a><?php }?>
                                    </p>
                                    <p><?php echo $sub_content;?></p>
                                    <p class="pull-left"><?php echo $sub_time;?></p>
                                    <b class="icon-comment pull-right reply-trigger" title="reply"></b>
                                </div>
                            </div>
                        <?php }?>
                    </div>
                    <?php }?>
                </div>
            </div>
            <?php }
            } else{?>
                <div class="tips">No comment, leave the first one ?</div>
            <?php }?>
        </div>
        <div class="loading"></div>
        <div class="row-fluid send-box">
            <input type="hidden" class="parentid" value=""/>
            <input type="hidden" class="replyto" value=""/>
            <input type="hidden" class="markid" value="<?php echo $markid; ?>"/>
            <textarea  placeholder="Your opinion" class="area-b commenttext"></textarea>
            <a class="btn btn-b send_comment" href="javascript:void(0)">That's it!</a>
        </div>
    </div>
</div>
