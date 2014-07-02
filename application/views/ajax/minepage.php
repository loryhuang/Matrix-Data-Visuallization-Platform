<?php
/**
 * Created by xigualzn.
 * Date: 13-8-14
 * Time: 下午11:51
 */
$user_name = $user_info->nickname;
$user_desc = $user_info->description;
$user_img = $user_info->middle_headshot;
$mark_list = json_decode($mark_list);
//var_dump($creator_about);
$is_creator = $creator_about->is_creator;
$tips = "There is no mark."
?>

<a class="tab tabactive" href="javascript:void(0)" id="minepage-tab"><b class="icon-tab-home"></b></a>
<div id="minepage" class="right-content">
    <div class="row well">
        <p id="create_new_room" class="text-center font-big">&nbsp;Creat a new room</p>

        <p class="get-preivew text-right fix-right">
            <a href="javascript:void(0)">Why create it?</a>
        </p>
    </div>
    <div class="row">
        <div class="navbar">
            <div class="navbar-inner bg-color2">
                <div class="container">
                    <ul class="nav-pills">
                        <?php if ($is_creator) {
                            $color = "green";?>
                            <li class="active"><a href="javascript:void(0)">Mine</a></li>
                            <li><a href="javascript:void(0)">Top</a></li>
                            <li><a href="javascript:void(0)">Latest</a></li>
                        <?php
                        } else {
                            $color = "blue";?>
                            <li class="active"><a href="javascript:void(0)">Creator</a></li>
                            <li><a href="javascript:void(0)">Top</a></li>
                            <li><a href="javascript:void(0)">Latest</a></li>
                            <li><a href="javascript:void(0)">Mine</a></li>
                        <?php } ?>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="result-wrapper">
        <input type="hidden" class="cupage" value="<?php echo $cupage; ?>"/>
        <input type="hidden" class="tocount" value="<?php echo $tocount; ?>"/>

        <div class="auto-flow">
            <div class="row-fluid intro-box">
                <div class="row-fluid pull-left"><img src="<?php echo IMAGE_URL_PREFIX . $user_img; ?>"/></div>
                <div class="row-fluid">
                    <p><a href="javascript:void(0)" class="nickname"><?php echo $user_name; ?></a></p>

                    <p><?php echo $user_desc ?></p>
                </div>
            </div>
            <?php if($is_creator) {
            $tips = "You haven't create any mark yet." ?>
            <div class="create-container">
                <a class="container-title show-create" title="fold">Which I create</a>
                <div class="create-wrapper">
            <?php } ?>
            <?php
            if($mark_list != null) {
            foreach ($mark_list as $mark_box) {
                $mark_id = $mark_box->mark_id;
                $mark_type = $mark_box->type == 0 ? 'pin' : 'area';
                $mark_title = $mark_box->title;
                $mark_desc = $mark_box->mark_desc;
                $mark_time = $mark_box->time;
                $mark_comment = $mark_box->num == null ? 0 : $mark_box->num;
                ?>
                <div class="row-fluid item-box clearfix">
                    <input type="hidden" class="markid" value="<?php echo $mark_id; ?>"/>
                    <i class="icon-<?php echo $mark_type . '-' . $color; ?>"></i>
                    <p><a href="javascript:void(0)" class="marktitle"><?php echo $mark_title; ?></a></p>
                    <p><?php echo $mark_desc; ?></p>
                    <p class="pull-left ft-color1"><?php echo $mark_time; ?></p>
                    <p class="to-comment pull-right ft-color1"><b class="icon-comment"></b><?php echo $mark_comment; ?></p>
                </div>
            <?php }
                } else { ?>
            <div class="tips"><?php echo $tips; ?></div>
            <?php }
            if($is_creator){
                if($tocount > 3) { ?>
                    <a class="show-all" type="create">show all</a>
                <?php } ?>
                </div>
            </div>
            <div class="row collect-container">
                <a class="container-title show-collect"  title="fold">Which I Collect</a>
                <div class="row collect-wrapper">
                <?php
                if(json_decode($creator_about->collect_list) != null) {
                foreach (json_decode($creator_about->collect_list) as $collect_box){
                    $collect_id = $collect_box->mark_id;
                    $collect_type = $collect_box->type == 0 ? 'pin' : 'area';
                    $collect_title = $collect_box->title;
                    $collect_desc = $collect_box->mark_desc;
                    $collect_time = $collect_box->time;
                    $collect_comment = $collect_box->num == null ? 0 : $collect_box->num;
                    $collect_owner = $collect_box->nickname;
                    ?>
                    <div class="row-fluid item-box clearfix">
                        <input type="hidden" class="markid" value="<?php echo $collect_id; ?>"/>
                        <i class="icon-<?php echo $collect_type . '-' . $color; ?>"></i>
                        <p>
                            <a href="javascript:void(0)" class="marktitle"><?php echo $collect_title; ?></a>
                            ——By &nbsp; <a href="javascript:void(0)" class="nickname"><?php echo $collect_owner; ?></a>
                        </p>
                        <p><?php echo $collect_desc; ?></p>
                        <p class="pull-left ft-color1"><?php echo $collect_time; ?></p>
                        <p class="to-comment pull-right ft-color1"><b class="icon-comment"></b><?php echo $collect_comment; ?></p>
                    </div>
                <?php }
                if($creator_about->collect_tocount > 3){ ?>
                    <a class="show-all" type="collect">show all</a>
                <?php } ?>
            <?php } else { ?>
                <div class="tips">You haven't collect any mark yet.</div>
            <?php } ?>
                </div>
            </div>
            <?php } ?>

        </div>
        <div class="loading-wrapper"><div class="loading"></div></div>
    </div>
</div>
