<base href="<?php echo base_url(); ?>"/>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>file upload</title>
    <script type="text/javascript">
        var SGA = {};
    </script>

    <link rel="stylesheet" type="text/css" href="./css/normalize.css"/>
    <link rel="stylesheet" type="text/css" href="./css/furatto.css"/>
    <link rel="stylesheet" type="text/css" href="./css/social.css"/>
<!--    <link rel="stylesheet" type="text/css" href="./css/personinfo.css"/>-->
    <style type="text/css">
        #userInfo {
            display: block;
        }

        #view_container {
            display: block;
        }

        #main_box {
            width: 500px;
            height: auto;
            margin: 30px auto;
        }

        #form_box {
            height: 400px;
        }

        #form_box td {
            vertical-align: top;
        }

        #form_box td.l {
            text-align: right;
        }

        #form_box td.r {
            text-align: left;
        }

        #searchForm {
            width: 500px;
            height: 300px;
            padding: 25px;
            margin: 30px auto;
            border: 1px solid #CCC;
        }
    </style>
</head>
<body>
<div id="view_container">
    <div id="userInfo" class="navbar">
        <div class="navbar-inner min-width">
            <div class="row bg-color1">
                <div class="nav-left">
                    <a class="brand vartical-middle" href="javascript:void(0)">HeatMap Pin</a>

                    <form class="navbar-form pull-right vartical-middle">
                        <input type="text" class="search-query" placeholder="Search"/>
                    </form>
                </div>
                <div class="nav-right">
                    <ul class="nav pull-right">
                        <li><a class="vartical-middle" href="javascript:void(0)"><?php echo $username ?></a></li>
                        <li class="dropdown">
                            <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown">
                                <img class="head_portrait_small"
                                     src="<?php echo base_url(); ?>resource/image/user/small/small30.jpg"/>
                                <b class="caret bottom-up"></b>
                            </a>
                            <ul class="dropdown-menu">
                                <li><a href="javascript:void(0);">Profile</a></li>
                                <li><a href="javascript:void(0);">Heatmap</a></li>
                                <li><a href="javascript:void(0);">Room</a></li>
                                <li class="divider"></li>
                                <li><a>Logout</a></li>
                            </ul>
                        </li>
                        <li><a class="band vartical-middle" href="javascript:void(0)">通知图标</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="container min-width">

        <div id="main_box">
            <h2>Create your heatmap</h2>

            <div id="form_box">
                <form id="searchForm" name="searchForm" method="post" action="<?= site_url(); ?>/sga/upload"
                      enctype="multipart/form-data">
                    <input type="file" name="file" class="file" id="fileField"
                           onChange="if(this.value) SGA.uploadFileName = this.value;"/>
                    <input class="search_btn" type="submit" value="submit"/>
                </form>
                <table>
                    <tr>
                        <td class="l">Heatmap name :</td>
                        <td class="r"><input type="text" value=""/></td>
                    </tr>
                    <tr>
                        <td class="l">Heatmap description :</td>
                        <td class="r"><textarea cols="65" rows="40"></textarea></textarea></td>
                    </tr>
                </table>
            </div>
        </div>


    </div>

</div>
</body>
</html>

