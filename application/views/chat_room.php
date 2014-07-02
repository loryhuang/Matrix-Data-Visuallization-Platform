<?php echo $room_id?>
<!-- Room房间模板 -->
<!--room右边wrapper-->

<?php $middle_headshot = $user->middle_headshot == "" ? "resource/image/user/middle/middle50.jpg" : $user->middle_headshot;?>
<a class="img-m tab" href="javascript:void(0)" id="roompage-<?php echo $room_id?>-tab">
    <img class="img-tab" src="<?php echo base_url() .$middle_headshot; ?>"/>
</a>
<div id="roompage-<?php echo $room_id ?>" class="right-content">

    <form id="data_form" style=" margin: 0;padding: 0; display:none; ">-->
        <input type="hidden" name="room_id" value="<?= $room_id ?>"/>
        <input type="hidden" name="hash" value="<?= $hash ?>"/>
        <input type="hidden" name="user_id" value="<?= $user->id ?>"/>
        <input type="hidden" name="chat_record" value='<?=
        json_encode(isset($room_detail) ? $room_detail->conversation : "");
        ?>'/>
    </form>

    <!-- 关闭room按钮，事件在social.js中-->
    <a class="btn btn-m pageclose-room" href="javascript:void(0)" id="roompage-<?php echo $room_id ?>-close">Close</a>
    <!-- room介绍  包括房间名，描述，以及邀请链接，其中点击Copy按钮复制链接事件没有写-->
    <div class="row well room-header">
        <h2 class="title-m no-padding"><?php echo $room_detail->title; ?></h2>

        <p><?php echo $room_detail->description; ?></p>
        <strong>Would like to share the room? Click the 'Copy' button and send the url to your friend.</strong>

        <p>
            <input class="room-enter-url offset5" type="text" readonly="readonly" value="TEST_URL"/>
            <a class="copy-button btn btn-s" href="javascript:void(0)">Copy</a>
        </p>
    </div>
    <!-- 已加入的成员-->
    <div class="row pull-left room-member">
        <h2 class="title-m">Members</h2>

        <div class="row-fluid">
            <?php
            foreach($room_detail->member as $member) {
                ?>
            <a class="pull-left offset5 img-s" href="javascipt:void(0)">
                <img title="<?php echo $member->nickname; ?>"
                 src="<?php echo base_url() . $member->small_headshot; ?>"/>
            </a>
            <?php } ?>
        </div>
    </div>
    <!--聊天区 左边为他人发言样式，右边为自己发言样式-->
    <div class="result-wrapper">
        <h2 class="title-m">Talk board</h2>

        <div class="auto-flow talk_board">
        </div>
        <!-- 发送区-->
        <div class="row-fluid">
            <textarea type="text" class="send_msg"></textarea>
            <a class="btn_send_msg btn btn-b pull-right offset35" href="javascript:void(0)">Send</a>
        </div>
    </div>
</div>