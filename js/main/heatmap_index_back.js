require.config({
    baseUrl: './js',
    paths: {
        jquery: 'lib/jquery-1.7.2.min',
        bootstrap: 'lib/bootstrap-dropdown',
        jquery_zclip: 'lib/jquery.zclip.min',
        jquery_imgareaselect: 'lib/jquery.imgareaselect'
    },
    shim:{
        "bootstrap": {
            deps: ["jquery"],
            exports: "bootstrap"
        },
        "jquery_zclip": {
            deps: ["jquery"]
        },
        "jquery_imgareaselect": {
            deps: ["jquery"]
        }
    }
});

require([
    'jquery',
    'bootstrap',
    'jquery_zclip',
    'jquery_imgareaselect'
    ], function ($) {
        "use strict";
        //计算提示框的显示位置
        var calculate = function (obj) {
            var top = ($(window).height() - obj.height()) / 2 - 30;
            var left = ($(window).width() - obj.width()) / 2 - 100;
            obj.css({
                'left': left, 
                'top': top
            });
        };

        var showInforead = function () {
            $("[class^='info_edit']").hide();
            $("[class^='info_read']").show();
        };

        var goPersonalPage =function (obj) {
            var active = obj.find('a').html().toLowerCase();
            var userId = $("#data_form input[name='userid']").val();
            if(active == "logout"){
                window.location.href="index.php/user/logout";
            }
        };

        //验证文件格式
        function checkFile() {
            var extensions = 'jpg,jpeg,gif,png';
            var path = $("#uploadPicture").val();
            var ext = getExt(path);
            var re = new RegExp("(^|\\s|,)" + ext + "($|\\s|,)", "ig");
            if (extensions != '' && (re.exec(extensions) == null || ext == '')) {
                alert("sorry, only jpg,jpeg,gif,png  are allowed ")
                return false;
            }
            return true;
        }

        function getExt(path) {
            return path.lastIndexOf('.') == -1 ? '' : path.substr(path.lastIndexOf('.') + 1, path.length).toLowerCase();
        }

        function showimageblock() {
            initblocksize("show");
            personpageonload();
            $(window).resize(function () {
                initblocksize("resize");
                personpageonload();
            });
        }

        function initblocksize(type) {
            var bH = $("body").height();
            var bW = $("body").width();
            var objWH = getObjWh("#image_edit_block");
            var tbT = objWH.split("|")[0];
            var tbL = objWH.split("|")[1];
            tbT = tbT + "px";
            tbL = tbL + "px";
            if (type == "show") {
                $("#image_edit_shade").css({
                    "display": "block", 
                    width: bW, 
                    height: bH, 
                    "position": "absolute", 
                    "top": "0px", 
                    "left": "0px"
                });
                $("#image_edit_block").css({
                    "display": "block", 
                    "position": "absolute", 
                    "top": tbT, 
                    "left": tbL
                });
            }
            if (type == "resize") {
                $("#image_edit_shade").css({
                    width: bW, 
                    height: bH, 
                    "position": "absolute", 
                    "top": "0px", 
                    "left": "0px"
                });
                $("#image_edit_block").css({
                    "position": "absolute", 
                    "top": tbT, 
                    "left": tbL
                });
            }
        }

        function getObjWh(obj) {
            //兼容chrome浏览器对document.documentElement.scrollTop以及document.documentElement.scrollLeft的识别误差
            var st;
            var sl;
            if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat' && navigator.userAgent.indexOf("Chrome") == -1) {
                st = $('html').scrollTop();
                sl = $('html').scrollLeft();
            }
            else if (typeof document.body != 'undefined') {
                st = document.body.scrollTop;
                sl = document.body.scrollLeft;
            }
            var ch = $(window).height();
            var cw = $(window).width();
            var objH = $(obj).height();
            var objW = $(obj).width();
            var objT = Math.round(st + (ch - objH) / 2);
            var objL = Math.round(sl + (cw - objW) / 2);
            return objT + "|" + objL;
        }

        //截取头像预览
        function preview(img, selection) {
            $('#crop_left').val(selection.x1);
            $('#crop_top').val(selection.y1);
            $('#crop_width').val(selection.width);
            $('#crop_height').val(selection.height);
        }


        //截取头像
        function personpageonload() {
            if ($("#image_edit_shade").css("display") == "block") {
                var width = $("#ImageDrag").width();
                var height = $("#ImageDrag").height();
                var size = width < height ? width/2 : height/2;
                var x1 = width/2-size/2;
                var y1 = height/2-size/2;
                $('#crop_left').val(x1);
                $('#crop_top').val(y1);
                $('#crop_width').val(size);
                $('#crop_height').val(size);
                $('#ImageDrag').imgAreaSelect({
                    aspectRatio: '1:1',
                    x1: x1,
                    y1: y1,
                    x2: x1+size,
                    y2: y1+size,
                    minHeight: size,
                    minWidth: size,
                    handles: true,
                    zIndex: 4000,
                    onSelectChange: preview
                });
            }
        }
        
        //设置footer的位置
        function setFootPos(){
            if($(".container-center").height() < $(window).height() - $("#userInfo").height() - 80){
                $(".footer").css({
                    position:"fixed",
                    margin:"0px",
                    bottom:"0px"
                });
            }
            $(".footer").show();       
        }
        
        $(function () {
            
            //获取当前上传的文件数
            var uploadFileNum = $("#data_form input[name='filenum']").val();
            
            //404页面高度设置
            var height = $(window).height() > 768 ? $(window).height() :768;   
            height =(height - 60 - 669)/2;
            $(".not-found").parent().css('padding',height+' 0');
            
            //设置footer的位置
            setFootPos();
            /*
            if($(".container-center").height() < $(window).height() - $("#userInfo").height() - 80){
                $(".footer").css({
                    position:"fixed",
                    margin:"0px",
                    bottom:"0px"
                });
            }
            $(".footer").show();
           */

            //初始化header里面的下拉框
            $(".dropdown-menu li").click(function () {
                goPersonalPage($(this));
            });

            //初始化上传heatmap按钮
            $("#upload_heatmap").click(function () {
                if(uploadFileNum >= 10){
                    alert("Files you uploaded have reached the limit,please delete some files first!");
                    return;
                }
                calculate($("#upload_box"));
                $("#shade").show();
                $("#upload_box").show();
            });

            $("#upload_dropbox").click(function(){
                 var options = {
                        linkType: "direct",
                        multiselect: false,
                        success: function(files) {
                            // Required. Called when a user selects an item in the Chooser
                            //alert("Here's the file link:" + files[0].link)
                            //alert(files[0].link);
                            var filename = files[0].name;
                            var fileUrl = files[0].link;
                            $("#name").text(filename);
                            $("#dropbox_box").find("input[name='filename']").val(filename);
                            $("#dropbox_box").find("input[name='fileurl']").val(fileUrl);
                            calculate($("#dropbox_box"));
                            $("#shade").show();
                            $("#dropbox_box").show();
                        },
                        cancel:  function() {
                            // Called when the user closes the dialog
                            // without selecting a file and does not include any parameters.
                        }
                    }; 
                    Dropbox.choose(options);
            });


            $("#to_create").click(function () {
                $("#shade").hide();
                $("#upload_box").hide();
                $("#upload_box").find("input").val("");
                $("#upload_box").find("textarea").val("");

            });

            //取消上传heatmap
            $(".cancel_create").click(function () {
                $("#shade").hide();
                $("#dropbox_box").hide();
                $("#upload_box").hide();
            });

            //显示/隐藏“change”
            $("#head_portrait").hover(
                function () {
                    $("#portrait_shade").css('display', 'inline');
                    $("#image_edit").css("display", "inline");
                },
                function () {
                    $("#portrait_shade").css('display', 'none');
                    $("#image_edit").css("display", "none");
                }
                )

            //显示/隐藏“change”下拉菜单
            $(".toggle_image_edit").click(function () {
                $(".image-box").toggle();
                $("#image_edit").addClass("open");
            });

            $("#image_edit ul").click(function (e) {
                e = e || window.event;
                if (window.event) {
                    e.cancelBubble = true;
                }
                else {
                    e.stopPropagation();
                }
            })

            document.body.onclick = function (e) {
                e = e || window.event;
                var target = e.target || e.srcElement;
                if (target.parentNode.id === "image_edit") return;
                $("#image_edit").removeClass("open");
                $(".image-box").hide();
            };

            //点击上传头像
            $("#uploadAction").click(function () {
                $("#uploadPicture").click();
            });

            //点击删除头像
            $("#removeHeadPortrait").click(function () {
                var big_headshot = $(".head_portrait_big").attr("src");
                $.ajax({
                    type: "POST",
                    url: 'index.php/user/remove_person_headshot',
                    data: {
                        'bigpic_url': big_headshot
                    },
                    complete: function (data) {
                        var result = data.responseText;
                        if (result != "0") {
                            alert("remove success.");
                            var path = result.split(",");
                            $(".head_portrait_big").attr("src", path[1]);
                            $(".head_portrait_middle").attr("src", path[2]);
                            $(".head_portrait_small").attr("src", path[3]);
                        }
                    }
                })
            });

            $("#uploadPicture").change(function () {
                if (checkFile()) {
                    $("#pictureForm").submit();
                }
            });

            //显示截图工作区
            $("#showCutArea").click(function () {
                $(".image-box").toggle();
                $("#image_edit").addClass("open");
                showimageblock();
            });

            //绑定截图区save,cancel按钮
            $("#image_edit_block a").click(function () {
                var action = $(this).html().toLowerCase();
                if (action == "save") {
                    $("#uploadCutPicture").submit();
                }
                $("#image_edit_shade").hide();
                $("#image_edit_block").hide();
                $("#uploadPicture").val("");
                $("[class^='imgareaselect']").hide();
            });

            //编辑Profile
            $('#btn-edit').click(function () {
                $(".info_edit_col1").find("input").css("width", $(".item-box-bottom").width() - $(".td-title").width() - 14);
                $(".info_edit_col2").find("textarea").css("width", $(".item-box-bottom").width() - 14);
                $("[class^='info_read']").hide();
                $("[class^='info_edit']").show();
                var size = $("#personDescription").val().length;
                var left = 200 - size;
                $("#desSize").html(left);
                if (left < 0) {
                    $("#savebutton").attr("disabled", true);
                } else {
                    $("#savebutton").attr("disabled", false);
                }
            });

            //取消编辑Profile
            $('#btn-cancel').click(function () {
                showInforead();
            });

            //保存Profile
            $('#btn-save').click(function () {
                if (!$("#savebutton").attr("disabled")) {
                    var userId = $("#data_form input[name='userid']").val();
                    var personName = $("#personName").val();
                    var personEmail = $("#personEmail").val();
                    var personCompany = $("#personCompany").val();
                    var personDescription = $("#personDescription").val();
                    personDescription = personDescription.replace(/[\n]/g, '<br/>');
                    if(personName == null || personName == ""){
                        alert("Please input Name.");
                        return false;
                    }
                    if(personEmail == null || personEmail == ""){
                        alert("Please input Email.");
                        return false;
                    }
                    $.ajax({
                        type: "POST",
                        url: 'index.php/user/update_person_info',
                        data: {
                            'uid': userId,
                            'nickname': personName,
                            'email': personEmail,
                            'company': personCompany,
                            'description': personDescription
                        },
                        complete: function (data) {
                            var result = data.responseText;
                            if (result == "1") {
                                $(".personName_read").html(personName);
                                $(".personEmail_read").html(personEmail);
                                $(".personCompany_read").html(personCompany);
                                $(".personDescription_read").html(personDescription);
                            }
                            showInforead();
                        }
                    })
                }
            });
        
        
           $("#del_conform_btn").live("click",function(){  
                var file_id = $(".conform_box").attr("id");
                $.ajax({
                    type: "POST",
                    url: 'index.php/sga/delete_file',
                    data: {
                        'id': file_id
                    },
                    success:function(data){
                        console.log(data);
                        $(".datalist").find("."+file_id).remove();
                        uploadFileNum-- ;
                        setFootPos();
                        console.log("delete success");
                    }
                });
                $(".conform_box").hide();
           });
           
           $("#del_cancel_btn").live("click",function(){
                $(".conform_box").hide();
           });
           
           $(".delbtn").live("click",function(){
                var file_id = $(this).find("a").attr("value");
                $(".conform_box").css({
                    left:$(this).offset().left,
                    top:$(this).offset().top -$(this).height()
                }).show();
                
                $(".conform_box").attr("id", file_id );
                /*
                var conformation = confirm("Are you sure to delete this map ?");  
                if(conformation){
                    var file_id = $(this).find("a").attr("value");
                    var _this = this ;
                    $.ajax({
                        type: "POST",
                        url: 'index.php/sga/delete_file',
                        data: {
                            'id': file_id
                        },
                        success:function(){
                            $(_this).parent().parent().hide().remove();
                            uploadFileNum-- ;
                            setFootPos();
                            console.log("delete success");
                        }
                    });
                }
                */
            });
                   
            $(".shrbtn a").zclip({
                path:'./js/lib/extends/ZeroClipboard.swf',
                copy:function(){
                    var host = window.location.href;
                    var lastindex = host.lastIndexOf("/"); 
                    host = host.substring(0,lastindex);
                    var url =  host + "/birds_view/" + $(this).attr("value");
                    var insertHtml = '<iframe width=500 height=500 src = "' + url + '" ></iframe>';
                    return insertHtml;
                },
                beforeCopy:function(){
                    
                }  
            });
        });

    });
