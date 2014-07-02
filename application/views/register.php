<base href="<?php echo base_url(); ?>"/>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title> heatmap -- register </title>
    <link rel="stylesheet" type="text/css" href="./css/normalize.css"/>
    <link rel="stylesheet" type="text/css" href="./css/furatto.css"/>
    <style type="text/css">
        body {
                width: 100%;
                height: 100%;
                margin: 0px;
                padding: 0px;
                /*position: relative;*/
                background-color: #EDF0F0;
        }

        .row {
            margin-left: 0px;
        }
        .furatto-login-icon img {
            height: 120px;
        }

        .login-form {
            width: 420px;
            text-align: center;
            min-height: 750px;
        }

        .login-form input[type] {
            width: 100%;
            margin-bottom: 20px;
            border-radius: 4px;
        }

        .login-header {
            height: 60px;
            background: url("./image/signup_logo.jpg") center center no-repeat;
        }

        .login-form .furatto-login-icon {
            margin-left: 0px
        }

        .form-box {
            padding-top: 25px;
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

        #footer {
            width: 100%;
            height: 32px;
            margin: 50px auto;
            margin-top: 80px;
        }
        #footer p{
            margin: 0px auto;
            width:350px;
            color: #BBB;
            line-height: 32px;
            text-align: center;
        }

    </style>
</head>
<body>

<form action="<?= site_url(); ?>/user/register" class="login-form centered-form" method="post" enctype="multipart/form-data" accept-charset="utf-8">
    <div class="furatto-login-icon">
        <img src="./images/customize-icon1502.png" alt="" />
        <h1 class="login-header">
            
        </h1>
    </div>
    <div class="row form-box">
        <input type="text" name="username"  value="" placeholder="Username"/>
        <input type="password" name="pwd"  value="" placeholder="Password"/>
        <input type="password" name="pwd_confirm"  value="" placeholder="Password Confirm"/>
        <input type="text" name="email"  value="" placeholder="Email" />
        <input type="button" id="btn-register"  value="Sign Up" class="btn btn-block btn-primary btn-large"/>
        <div class="nav_tips">
            <span>Already have an account? </span>
            <a class="register-link" href="index.php/user/login_form">Sign in</a>
        </div>
    </div>
    <div class="error help-hint"></div>
    <div class="warning help-hint"></div>
    <div id="footer"> 
        <p> Copy right &copy; 2014 ,All rights reserved.</p>
    </div>
</form>



<script src="./js/lib/jquery-1.7.2.min.js"></script>
<script type="text/javascript">
    $(document).ready(function(){

        $(document).keydown(function (e) {
            if (e.keyCode == 13) {
                $('#btn-register').click();
            }
        });

        //检查用户名是否存在
        $('input[name="username"]').blur(function(){
            var username = $(this).val();
            if(username == ""){
                return;
            }
            if (username.length < 3 || username.length > 20) {
                $(".warning").text("");
                $(".error").text("Username length can only be 3 to 20 letters!");
                return;
            };

            $.ajax({
                type: 'POST',
                url: 'index.php/user/check_user_name',
                data: {
                    'username': username 
                },
                complete: function (data) {
                    var result = data.responseText;
                    if (result === '1') {
                        $('.warning').empty();
                        $('.error').html('Username already exists!');
                    }else{
                        $('.warning').empty();
                        $('.error').empty();
                    }
                }
            });
        });

        //提交注册按钮
        $("#btn-register").click(function(){
            var username = $(".form-box").find("input[name='username']").val();
            var password = $(".form-box").find("input[name='pwd']").val();
            var pwd_confirm = $(".form-box").find("input[name='pwd_confirm']").val();
            var email = $(".form-box").find("input[name='email']").val();
        
            if($.trim(username) == "") {
                $(".error").text("");
                $(".warning").text("Username can not be empty!");
                return false;
            }

            if(!checkChars(username)){
                $(".error").text("");
                $(".warning").text("Username can only be numbers ,letters and underline !");
                return false;
            }
            var usernameLnegth = getLen(username);
            if ( usernameLnegth > 20 || usernameLnegth < 3 ) {
                $(".error").text("");
                $(".warning").text("Username length can only be 3 to 20 letters!");
                return false;
            };

            if($.trim(password) == "") {
                $(".error").text("");
                $(".warning").text("Password can not be empty!");
                return false;
            }

            if (getLen(password) < 5) {
                $(".error").text("");
                $(".warning").text("Password length can not be less than 5 !");
                return false;
            };

            if($.trim(pwd_confirm) == "") {
                $(".error").text("");
                $(".warning").text("Password Conform can not be empty!");
                return false;
            }

            if(password !== pwd_confirm){
                $(".error").text("Pasword confirm is wrong !");
                $(".warning").text("");
                return false;
            }

            if($.trim(email) == "") {
                $(".error").text("");
                $(".warning").text("Email can not be empty!");
                return false;
            }

            if (!validate_email(email)) {
                return false;
            }

            $.ajax({
                type: 'POST',
                url: 'index.php/user/register',
                data: {
                    'username': username,
                    'pwd': password,
                    'pwd_confirm': pwd_confirm,
                    'email': email
                },
                complete: function (data) {
                    var result = data.responseText;
                    if (result === '1') {
                        $('.warning').empty();
                        $('.error').html('Username exists!');
                    } else if (result === '2') {
                        $('.warning').empty();
                        $('.error').html('Password Conform not correct!');
                    } else if (result === '0'){
                        window.location.href = "index.php/user/login_form";
                    }else{
                        $('.warning').empty();
                        $('.error').html('Register faliure!');
                    }
                }
            });

        });


        function validate_email(value){
            var atpos = value.indexOf("@")
            var dotpos = value.lastIndexOf(".")
            if (atpos < 1 || dotpos - atpos < 2) {
                $(".error").text(" Email format is not correct !");
                $(".warning").text("");
                return false
            }
            else {
                return true
            }         
        }

        function getLen (str){
            return str.length;
        }

        function checkChars(str){
            var reg =/^[0-9a-zA-Z_]+$/g;
            if (reg.test(str)){ 
                return true; 
            }else{
                return false;
            }
        }  
    });

</script>
</body>
</html>
