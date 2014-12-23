<base href="<?php echo base_url(); ?>"/>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title> heatmap -- get password </title>
        <link rel="stylesheet" type="text/css" href="./css/normalize.css"/>
        <link rel="stylesheet" type="text/css" href="./css/furatto.css"/>
        <style>
            body {
                height: auto;
                min-height: 850px;
                margin: 0px;
                padding: 0px;
                background-color: #EDF0F0;
            }

            .row {
                margin-left: 0px;
            }
            .login-form {
                width: 420px;
                height: 100%;
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

            .form-box p {
                text-align: justify;
                margin-bottom: 25px;
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
                width: 50px;
                text-align: center;
                color: #999;
            }

            .nav_tips .register-link {
                color: #5FBFCC;
            }

            .nav_tips .getpwd-link {
                color: #5FBFCC;
            }

            #btn-getpwd{
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
            <div class="furatto-login-icon">
                <img src="./images/customize-icon1502.png" alt="">

                <h1 class="login-header">
                   <!-- HeatMap <strong>2</strong> -->
                </h1>
            </div>
            <div class="row form-box">  
                <h5>Get password</h5>
                <p>Please input your username and email address , we will send the password to you via your registerd email</p>
                <input type="text" name="username" class="error" placeholder="Username" />
                <input type="text" name="email" placeholder="Email"/>
                <input type="button" id="btn-getpwd" value="Submit" class="btn btn-primary btn-block btn-large " />
                <div class="nav_tips">
                    <!-- <span>New here? </span> -->
                    <!-- <a class="register-link" href="index.php/user/register_form">Sign Up</a>
                    <span>&nbsp;|&nbsp;</span>
                    <a class="getpwd-link" href="index.php/user/register_form">Forget password</a> -->
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
                        $('#btn-getpwd').click();
                    }
                });
                $('#btn-getpwd').click(function () {
                    var username = $('input[name=username]').val();
                    var email = $('input[name=email]').val();
                   
                    if (username === '' || email === '') {
                        $('.error').empty();
                        $('.warning').html('Please input the username and email.');
                        return;
                    } else {
                        $.ajax({
                            type: 'POST',
                            url: 'index.php/user/check_email',
                            data: {
                                'username': username,
                                'email': email
                            },
                            complete: function (data) {
                                var result = data.responseText;
                                //console.log(result);
                                if (result === '0') {
                                    $('.warning').empty();
                                    $('.error').html('Username is not exist!');
                                } else if (result === '-1') {
                                    $('.warning').empty();
                                    $('.error').html('Email is not right!');
                                }else if(result == "1"){
                                     $.ajax({
                                        type: 'POST',
                                        url: 'index.php/sga/send_pwd',
                                        data: {
                                            'username': username,
                                            'email': email
                                        },
                                        success: function (data) {
                                            window.location.href = "index.php/user/login_form";
                                            //console.log(data);
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            });
        </script>
    </body>
</html>
