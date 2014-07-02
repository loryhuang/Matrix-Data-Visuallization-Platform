<base href="<?php echo base_url(); ?>"/>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title> heatmap -- login </title>
        <link rel="stylesheet" type="text/css" href="./css/normalize.css"/>
        <link rel="stylesheet" type="text/css" href="./css/furatto.css"/>
        <style>
            body {
                height: 100%;
                margin: 0px;
                padding: 0px;
                background-color: #EDF0F0;
            }

            .row {
                margin-left: 0px;
            }
            .login-form {
                /* 
                width: 25%;
                */
                width: 420px;
                text-align: center;
            }

            .login-header {
                height: 60px;
                background: url("./image/signup_logo.jpg") center center no-repeat;
            }

            .form-box input[type] {
                margin-bottom: 20px;
                border-radius: 4px;
            }

            .btn-primary {
                background-color: #5FBFCD;
            }

            .btn-primary:hover, .btn-primary:focus {
                background-color: #5DD0E1;
            }
            .nav_tips {
                width: 100%;
                text-align: center;
            }

            .nav_tips span{
                color: #666;
            }

            .nav_tips .register-link {
                color: #5FBFCC;
            }

            #btn-login{
                color: #FFF;
            }
            .login-form strong {
                color: #f39c12;
                font-size: 40px;
            }
            .login-form .login-header {
                font-size: 40px;
            }
            .login-form .furatto-login-icon {
                margin-left: 0px
            }
            .login-form input[type="text"] {
                width: 100%;
            }
            .login-form input[type="password"] {
                width: 100%;
            }
            .form-box {
                padding-top: 45px;
            }
            .warning {
                height: 25px;
                margin-top: 25px;
            }
            #footer {
                width: 100%;
                height: 32px;
                margin: 50px auto; 
                margin-top: 80px;
            }
            #footer p{
                margin: 0px auto;
                color: #BBB;
                line-height: 32px;
                text-align: center;
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

                <h1 class="login-header">
                   <!-- HeatMap <strong>2</strong> -->
                </h1>
            </div>
            <div class="row form-box">  
                <!--<h3>Login</h3>-->
                <input type="text" name="username" class="error" placeholder="Username">
                <input type="password" name="pwd" placeholder="Password">
                <input type="button" id="btn-login" value="Sign In" class="btn btn-primary btn-block btn-large ">
                <div class="nav_tips">
                    <span>New here? </span>
                    <a class="register-link" href="index.php/user/register_form">Create an Account.</a>
                </div>
            </div>
            <div class="error help-hint"></div>
            <div class="warning help-hint"></div>
            <div id="footer"> 
              <p> Copy right &copy; 2014 ,All rights reserved.</p>
            </div>
        </form>
        
        <script src="./js/lib/jquery-1.7.2.min.js"></script>
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
