<base href="<?php echo base_url(); ?>"/>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script src="./js/lib/jquery-1.7.2.min.js"></script>
        <link rel="stylesheet" type="text/css" href="./css/normalize.css"/>
        <link rel="stylesheet" type="text/css" href="./css/furatto.css"/>
        <link rel="stylesheet" type="text/css" href="./css/heatmap2.css"/>
        <!--[if IE]>
        <![endif]-->
        <style>
            #login_form{
                 margin-left: 200px;
                margin-right: 200px;
            }
            #tips_form{
                 margin-left: 150px;
                margin-right: 150px;
                height: 30px;
            }
            #btn-login{
                color: #FFF;
            }
        </style>
    </head>
    <body>
        <!--[if IE]>
        <script type="text/javascript">
            document.location.href = "browser_not_support";
        </script>
        <![endif]-->
        <form action="<?= site_url(); ?>/user/login" class="login-form centered-form" method="post" accept-charset="utf-8">
            <input type="hidden" name="ret_url" value="<?= $ret_url; ?>" />
            <div class="furatto-login-icon">
                <img src="./images/customize-icon1502.png" alt="">

                <h1 class="login-header">HeatMap <strong>2</strong></h1>
            </div>
            <div class="row form-box">
                    <div id="login_form" class="row">
                        <h3>Login</h3>
                        <input type="text" name="username" class="error" placeholder="username">
                        <input type="password" name="pwd" placeholder="password">
                        <input type="button" id="btn-login" value="Login" class="btn btn-primary btn-block btn-large ">
                    </div> 
                    <div id="tips_form" class="row">
                        <div class="span6">
                            <span>New here? </span>
                            <a class="register-link" href="index.php/user/register_form">Create an Account.</a>
                        </div>
                    </div>
                
            </div>

            <div class="error help-hint"></div>
            <div class="warning help-hint"></div>
        </form>
        <script>
            $(document).ready(function () {
                $(document).keydown(function (e) {
                    if (e.keyCode == 13) {
                        $('#btn-login').click();
                    }
                });
                $('#btn-login').click(function () {
                    var username = $('input[name=username]').val();
                    var pwd = $('input[name=pwd]').val();
                    var ret_url = $('input[name=ret_url]').val();
                    if (username === '' || pwd === '') {
                        $('.error').empty();
                        $('.warning').html('Please input the username and password.');
                        return;
                    } else {
                        $.ajax({
                            type: 'POST',
                            url: 'index.php/user/login',
                            data: {
                                'username': username,
                                'pwd': pwd,
                                'ret_url' : ret_url
                            },
                            complete: function (data) {
                                var result = data.responseText;
                                if (result === '1') {
                                    $('.warning').empty();
                                    $('.error').html('Username is not exist!');
                                } else if (result === '2') {
                                    $('.warning').empty();
                                    $('.error').html('Password error!');
                                } else {
                                    window.location.href = $('input[name=ret_url]').val();
                                }
                            }
                        });
                    }
                });
            });
        </script>
    </body>
</html>
