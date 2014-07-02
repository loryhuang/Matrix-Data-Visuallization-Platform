<div id="userInfo" class="navbar">
    <div class="navbar-inner min-width">
        <div class="row">
            <div class="nav-left">
                <a class="brand vartical-middle" href="<?php echo base_url() .'index.php/sga/heatmap_index';?>"></a>
            </div>
            <div class="nav-right">
                <ul class="nav pull-right">
                    <li><a class="vartical-middle no-padding personName_read" href="javascript:void(0)"><?php echo $username ?></a></li>
                    <li class="dropdown">
                        <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown">
                            <img class="head_portrait_small"
                                     src="<?php echo IMAGE_URL_PREFIX .('/images/default_headshot_small.jpg'); ?>"/>
<!--                            <span class="icon-heatmap"></span>-->
                            <b class="caret bottom-up"></b>
                        </a>
                        <ul class="dropdown-menu">
                            <?php
//                            foreach ($dropdown_options as $value) {
//                                if ($value == "Logout" && count($dropdown_options) > 1) {
//                                    echo '<li class="divider"></li>';
//                                }
//                                echo '<li><a href="javascript:void(0);">' . $value . '</a></li>';
//                            }
                           foreach ($dropdown_options as $key => $value) {
                                if ($key == "Logout" && count($dropdown_options) > 1) {
                                    echo '<li class="divider"></li>';
                                }
                                echo '<li><a href="'. base_url().$value .'">' . $key . '</a></li>';
                            }
                            ?>
<!--                            <li><a href="javascript:void(0);">Profile</a></li>-->
<!--                            <li><a href="javascript:void(0);">Heatmap</a></li>-->
<!--                            <li><a href="javascript:void(0);">Room</a></li>-->
<!--                            <li class="divider"></li>-->
<!--                            <li><a href="javascript:void(0);">--><?php //echo $dropdown_options[0]; ?><!--</a></li>-->
                        </ul>
                    </li>
                    <!-- <li>
                        <img class="vartical-middle notify-icon" src="images/icon-notify.png"/>
                    </li> -->
                </ul>
            </div>
        </div>
    </div>
</div>
