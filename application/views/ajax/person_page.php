<?php
/**
 * Created by youjuzi
 * Date: 13-8-10
 * Time: 上午11:21
 */
$result = json_decode($result);
$result = $result[0];
?>
<a class="tab" href="javascript:void(0)" id="personpage-tab"><b class="icon-tab-person"></b></a>
<!--<img src ="--><?php //echo base_url() .$result->small_headshot;?><!--"/>-->
<div id="personpage" class="right-content">
<input type="hidden" id="showCutArea"/>
<input type="hidden" id="active" value="<?php echo $active; ?>"/>
<a class="btn btn-m pageclose" href="javascript:void(0)" id="personpage-close">Close</a>
<!--<a href="javascript:void(0);" class="close-back"/>-->
<div class="row personInfo">
    <div class="float-left" id="head_portrait">
        <img class="head_portrait_big" src="<?php
        if ($result->big_headshot == null) {
            echo IMAGE_URL_PREFIX . "images/default_headshot_big.jpg";
        } else {
            echo IMAGE_URL_PREFIX . $result->big_headshot;
        }
        ?>"/>

        <p id="image_edit" class="dropdown">
            <a class="toggle_image_edit" href="javascript:void(0);">change</a>

        <ul class="image-box dropdown-menu">
                <li>
                    <form name="pictureForm" id="pictureForm" method="POST" action="index.php/user/upload_picture"
                          enctype="multipart/form-data" target="uploadIframe">
                        <input type="hidden" id="pictureId" name="pictureId" value="<?php echo $userId; ?>"/>
                        <input name="uploadPicture" type="file" id="uploadPicture"/>
                    </form>
                    <iframe name="uploadIframe" id="uploadIframe" style="display:none"></iframe>
                    <a id="uploadAction" href="javascript:void(0);">upload a picture</a>
                </li>
                <li><a id="removeHeadPortrait" href="javascript:void(0);">remove</a></li>
                <li><a class="toggle_image_edit" href="javascript:void(0);">cancel</a></li>
            </ul>
        </p>
    </div>

    <div class="row-fluid float-left" id="head_description">
        <p class="font-big personName_read margin-b10">
            <?php echo $result->nickname; ?>
        </p>
    </div>
</div>
<div class="row">
    <div class="navbar">
        <div class="navbar-inner bg-color2">
            <div class="container">
                <ul class="nav-pills">
                    <li><a href="javascript:void(0);">Profile</a></li>
                    <li><a href="javascript:void(0);">Heatmap</a></li>
                    <?php if ($userId == $selfId) { ?>
                        <li><a href="javascript:void(0);">Room</a></li>
                    <?php } ?>
                </ul>
            </div>
        </div>
    </div>
</div>
<div class="result-wrapper">
    <div id="person_profile" class="person-type">
        <div class="item-box-bottom clearfix">
            <p class="margin-b20"><span class="font-title">Basic Info</span>
                <a class="info_read_button btn pull-right btn-m margin-l5">Edit</a>
                <a class="info_edit_button btn pull-right btn-m margin-l5">Cancel</a>
                <a id="savebutton" class="info_edit_button btn pull-right btn-m margin-l5">Save</a>
            </p>
            <table class="margin-b15">
                <tr>
                    <td class="td-title ft-color1">Name</td>
                    <td class="info_read_col1 personName_read"><?php echo $result->nickname; ?></td>
                    <td class="info_edit_col1">
                        <input type="text" id="personName" value="<?php echo $result->nickname; ?>"/>
                    </td>
                </tr>
                <tr>
                    <td class="td-title ft-color1">Email</td>
                    <td class="info_read_col1 personEmail_read"><?php echo $result->email; ?></td>
                    <td class="info_edit_col1">
                        <input type="text" id="personEmail" value="<?php echo $result->email; ?>"/>
                    </td>
                </tr>
                <tr>
                    <td class="td-title ft-color1">Company</td>
                    <td class="info_read_col1 personCompany_read"><?php echo $result->company; ?></td>
                    <td class="info_edit_col1">
                        <input type="text" id="personCompany" value="<?php echo $result->company; ?>"/>
                    </td>
                </tr>
                <tr>
                    <td class="td-title ft-color1">Description</td>
                    <td class="info_edit" style="text-align: right;vertical-align: bottom;"><span
                            id="desSize"></span></td>
                </tr>
                <tr>
                    <td colspan="2"
                        class="info_read_col2 personDescription_read"><?php echo $result->description; ?></td>
                    <td colspan="2" class="info_edit_col2">
                        <textarea id="personDescription" class="textarea-style"><?php
                                $description = $result->description;
                                $description = str_replace("<br/>","\n",$description);
                            echo $description ?></textarea>
                    </td>
                </tr>
            </table>
        </div>
        <div class="item-box-bottom clearfix">
            <div class="padding-tb20 "><a class="font-title" href="javascript:void(0);">Facebook Connect</a></div>
        </div>
        <div class="item-box-bottom clearfix">
            <div class="padding-tb20"><a class="font-title" href="javascript:void(0);">LinkedIn Connect</a></div>
        </div>
    </div>
    <div id="person_heatmap" class="person-type">
        <div class="item-box-title font-title clearfix">My heatmaps</div>
        <div class="auto-flow-heatmap">
            <?php
			if(is_array($result->heatmap)) {
				foreach ($result->heatmap as $value) {
					?>
					<div class="item-box-bottom clearfix">
						<p class="margin-t20 margin-b15">
							<a class="personpage-item-name" href="<?=
							site_url("sga/file_present") .
							"/" . $value->id ?>"><?= $value->title == "" ? $value->filename . "(No title)" : $value->title ?></a>
							<a href="javascript:void(0)" class="delete_heatmap pull-right">delete</a>
							<input type="hidden" class="delete_id" value="<?php echo $value->id; ?>">
						</p>

						<p class="margin-b10 personpage-font-time">
                            <?php echo $value->TIME;  ?>
                        </p>
					</div>
				<?php
				} 
			}else{
				?>
                <div class="tips">No heatmap</div>\
				<?php 
				}?>
        </div>
    </div>
    <?php if ($userId == $selfId) { ?>
        <div id="person_room" class="person-type">
            <div class="room-type">
                <div class="item-box-title font-title clearfix">
                    Which I Create(<span id="create_room_number"><?php echo ($result->roomCreate == null) ? "0" : count($result->roomCreate) ?></span>)
                </div>
                <div class="auto-flow-room">
                    <?php
                    if(is_array($result->roomCreate)) {
                        foreach ($result->roomCreate as $value) {
                            ?>
                            <div class="item-box-bottom clearfix">
                                <input type="hidden" class="heatmap_id" value="<?php echo $value->datafile_id; ?>">
                                <p class="margin-t20 margin-b15">
                                    <a class="personpage-item-name" href="javascript:void(0);" class="visit_room"><?php echo $value->title; ?></a>
                                    <a href="javascript:void(0)" class="delete_room pull-right">delete</a>
                                    <input type="hidden" class="delete_id" value="<?php echo $value->id; ?>">
                                    <input type="hidden" class="room_hash" value="<?php echo $value->hash ?>">
                                </p>

                                <p class="margin-b10 personpage-font-time">
                                    <?php echo $value->time; ?>
                                </p>
                                <div style="position:absolute;right:0px;bottom:5px;">
                                    <?php
                                    if(is_array($value->member)){
                                        foreach($value->member as $roomperson){
                                            ?>
                                            <a class="margin-l5" href="javascript:void(0);">
                                                <img class="width-height-25" title="<?php echo $roomperson->username;?>" src="<?php echo IMAGE_URL_PREFIX.$roomperson->small_headshot ?>"/>
                                            </a>
                                        <?php
                                        }
                                    }
                                    ?>
                                </div>
                            </div>
                        <?php
                        }
                    } ?>
                </div>
            </div>
            <div class="room-type margin-t30">
                <div class="item-box-title font-title clearfix">
                    Which I Join(<?php echo ($result->roomJoin == null) ? "0" : count($result->roomJoin) ?>)
                </div>
                <div class="auto-flow-room">
                    <?php
                    if(is_array($result->roomJoin)) {
                        foreach ($result->roomJoin as $value) {
                            ?>
                            <div class="item-box-bottom clearfix">
                                <input type="hidden" class="heatmap_id" value="<?php echo $value->datafile_id; ?>">
                                <p class="margin-t20 margin-b15">
                                    <a class="personpage-item-name" href="javascript:void(0);" class="visit_room"><?php echo $value->title; ?></a>
                                    <a href="javascript:void(0)" class="delete_room pull-right">delete</a>
                                    <input type="hidden" class="delete_id" value="<?php echo $value->id; ?>">
                                    <input type="hidden" class="room_hash" value="<?php echo $value->hash ?>">
                                </p>

                                <p class="margin-b10 personpage-font-time">
                                    <?php echo $value->time;  ?>
                                </p>
                                <div style="position:absolute;right:0px;bottom:5px;">
                                    <?php
                                        if(is_array($value->member)){
                                            foreach($value->member as $roomperson){
                                            ?>
                                                <a class="margin-l5" href="javascript:void(0);">
                                                    <img class="width-height-25" title="<?php echo $roomperson->username?>" src="<?php echo IMAGE_URL_PREFIX.$roomperson->small_headshot ?>"/>
                                                </a>
                                    <?php
                                            }
                                        }
                                    ?>
                                </div>
                            </div>
                        <?php
                        }
                    } ?>
                </div>
            </div>
        </div>
    <?php } ?>
</div>
<div id="image_edit_shade"></div>
<div id="image_edit_block">
    <a href="javascript:void(0);" class="close-back"></a>

    <p id="upload-title" class="font-big">Cut your picture</p>

    <form name="uploadCutPicture" id="uploadCutPicture" method="POST" action="index.php/user/upload_cut_picture"
          enctype="multipart/form-data" target="uploadCutIframe">
        <div id="uncutPicture">
<!--            <img id="ImageDrag"/>-->
        </div>
        <a class="btn pull-right btn-m offset5">Cancel</a>
        <a class="btn pull-right btn-m offset5">Save</a>

        <div style="display:none">
            <input name="crop_top" type="text" value="100" id="crop_top"/>
            <input name="crop_left" type="text" value="100" id="crop_left"/>
            <input name="crop_width" type="text" value="100" id="crop_width"/>
            <input name="crop_height" type="text" value="100" id="crop_height"/>
            <input type="hidden" name="cutPictureId" id="cutPictureId" value="<?php echo $selfId; ?>"/>
            <input type="hidden" name="cutPictureUrl" id="cutPictureUrl"/>
            <input type="hidden" name="oldPictureUrl" id="oldPictureUrl" value="<?php
            if ($result->big_headshot == null) {
                echo "";
            } else {
                echo base_url() . $result->big_headshot;
            }
            ?>">
        </div>
    </form>
    <iframe name="uploadCutIframe" id="uploadCutIframe" style="display:none;"></iframe>
</div>
</div>