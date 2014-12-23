require.config({
    baseUrl: './js',
    paths: {
        jquery: 'lib/jquery-1.7.2.min'
    }
});

define(['jquery'], function ($) {
    "use strict";

    /**
     * 载入右侧子页面
     */
    var loadSocialPage = function () {
        $(function () {
            var fileid = $("input[name='fileid']").val();
            $.ajax({
                type: 'POST',
                url: 'index.php/pin/get_minepage',
                data: {
                    'fileid': fileid
                },
                complete: function (data) {
                    var result = data.responseText;
                    if (data.status != 200) {

                    } else {
                        $(".right-wrapper").append(result);
                        var height = ($(window).height() - 60) < 708 ? 708 : ($(window).height() - 60);
                        var min_height = height - 285;
                        $(".right-wrapper").css('height', height);
                        $(".left-wrapper").css('height', height);
                        $("#minepage").find(".auto-flow").css({'height': min_height, 'overflow-y': 'scroll'});
                        $("#userInfo").show();
                        $("#view_container").show();
                        $("#imagick").show();

                        //子页面加载完毕后，初始化DOM的方法
                        getAllFunc();
                        bindCreateNewRoom();
                        $("#create_new_room").click(function () {
                            loadRoomPage('create');
                        });
                    }
                }
            });
        });
    };

    /**
     * 载入房间页面
     */
    var loadRoomPage = function (type, hash) {
        if (!(type === 'create' || type === 'enter')) {
            console.error('载入房间参数错误');
            return;
        }

        //初始化页面，供ajax成功调用
        var initRoomPage = function (responseData) {
            var result = responseData.responseText;
            if (responseData.status != 200) {
                alert('Server error!');
            } else {
                //房间hash验证错误
                if (result === "Room hash error") {
                    window.location.hash = "";
                } else {
                    $(".right-content").hide();
                    $(".right-wrapper").append(result);
                    $("#roompage").show();

                    //启动socket.io
                    require('process/chat').startSocketIO();
                }
            }
        };

        //创建房间
        var createRoom = function () {
            var userId = $("input[name=userid]").attr("value"),
                fileId = $("input[name=fileid]").attr("value");

            $.ajax({
                type: 'POST',
                url: "index.php/room/create_room",
                data: {
                    'datafile_id': fileId
                },
                complete: initRoomPage
            });
        };

        //进入房间
        var enterRoom = function () {
            $.ajax({
                type: 'POST',
                url: "index.php/room/enter_room",
                data: {
                    'hash': hash
                },
                complete: initRoomPage
            });
        };

        //e.data.type表明是创建房间还是进入房间
        type === 'create' ? createRoom() : enterRoom();
    };

    var getAllFunc = function () {

        var base_url = "http://localhost/heatmap2/";
        //窗口大小变化时调整框架基本高度和auto-flow高度
        $(window).resize(function () {
            var ex_height = $(".left-wrapper").height();
            var cu_height = $(window).height() - 60;
            var length = $(".right-content").length;
            var obj = $(".right-content").first();
            var type;
            for (var i = 0; i < length; i++) {
                type = obj.attr("id").split("-")[0];
                if ($("#" + type).is(":visible")) {
                    break;
                } else {
                    obj = obj.next();
                }
            }
            if (cu_height > ex_height) {
                var offset = get_offset(type,"creator");
                var min_cu_height = cu_height + 60 - offset;
                $(".left-wrapper").css('height', cu_height);
                $(".right-wrapper").css('height', cu_height);
                $("#" + type).find(".auto-flow").css('height', min_cu_height);
            }
        });

        //计算每个小页面auto-flow的高度
        function get_offset(id,subid) {
            var offset;
            switch (id) {
                case "minepage":
                    switch(subid){
                        case "creator":
                            offset = 345;
                            break;
                        default:
                            offset = 260;
                            break;
                    }
                    break;
                case "commentpage":
                    offset = 262;
                    break;
                case "roompage":
                    offset = 473;
                    break;
                default :
                    offset = 345;
            }
            return offset;
        }

        //页面加载后对滚动部分设置高度
        function set_height(type,subtype) {
            var height = $(window).height() > 768 ? $(window).height() : 768;
            var offset = get_offset(type,subtype);
            var real_height = height - 60;
            var auto_height = height - offset;
            $(".left-wrapper").css('height', real_height);
            $(".right-wrapper").css('height', real_height);
            $("#" + type).find(".auto-flow").css('height', auto_height);
        }

        //主页面切换导航功能
        $(".nav-pills li").click(function () {
            var obj = $(this);
            var navitype = obj.find("a").html().toLowerCase();
            var fileid = $("input[name='fileid']").val();
            var cupage = 1;
            var color = get_mark_color(navitype);
            $.ajax({
                type: 'POST',
                url: 'index.php/pin/get_navi',
                dataType:'Json',
                data: {
                    "navitype" : navitype,
                    "fileid" : fileid,
                    "cupage" : cupage
                },
                complete: function (data) {
                    var result = eval("(" + data.responseText + ")");
                    $("#minepage").find(".result-wrapper").html("");
                    if(navitype == "creator"){
                        var user_info = "<div class='row-fluid intro-box clearfix'>" +
                            "<div class='row-fluid'><img src='" + base_url + result[0].middle_headshot +"'/></div>" +
                            "<div class='row-fluid'><p><a href='javascript:void(0)'>" + result[0].nickname + "</a></p>" +
                            "<p>" + result[0].user_desc+ "</p></div></div>";
                        $("#minepage").find(".result-wrapper").append(user_info);
                    }
                    $("#minepage").find(".result-wrapper").append("<div class='auto-flow'></div>")
                    $.each(result, function(key, value) {
                        var marktype = value.type == 0 ? 'pin': 'area';
                        var comment_num = value.num == null ? 0 : value.num;
                        if(navitype != 'creator') {
                            var creator_info = " ——By &nbsp; <a href='javascript:void(0)'>" + value.nickname + "</a>"
                        } else {
                            creator_info = '';
                        }
                        var content = "<div class='row-fluid item-box clearfix'>" +
                            " <input type='hidden' class='markid' value='" + value.mark_id + "'/>" +
                            "<i class='icon-"+marktype+"-"+color+"'></i>" +
                            "<p><a href='javascript:void(0)'>"+ value.title +"</a>&nbsp;"+creator_info+"</p>" +
                            "<p>" + value.mark_desc  +"</p>" +
                            "<p class='pull-left ft-color1'>" + value.time + "</p>" +
                            "<p class='pull-right ft-color1 to-comment'><b class='icon-comment'></b>" + comment_num +
                            "</div>";
                        $("#minepage").find(".auto-flow").append(content);
                    })
                    set_height("minepage",navitype);
                    $(".nav-pills").find("li").removeClass("active");
                    obj.addClass("active");
                }
            })
        })

        //根据类型区分每个导航栏下面pin和mark的颜色
        function get_mark_color(type) {
            var color;
            switch(type) {
                case 'creator':
                    color = 'blue';
                    break;
                case 'top':
                    color = 'red';
                    break;
                case 'latest':
                    color = 'yellow';
                    break;
                case 'mine':
                    color = 'green';
                    break;
                default:
                    color = 'blue';
            }
            return color;
        }

        $(".to-comment").live('click', function () {
            var pagetype = $("#pagetype").val();
            var markid = $(this).parent().find(".markid").val();
            $.ajax({
                type: 'POST',
                url: 'index.php/comment/commentpage',
                data: {
                    "markid": markid
                },
                complete: function (data) {
                    if (data.status != 200) {
                        alert("网络连接错误！");
                    } else {
                        var result = data.responseText;
                        if (result == "not_exist") {
                            $("#feedback").html("Sorry, The page you request is not existed. Please try again later. ");
                            calculate($("#feedback"));
                            $("#feedback").fadeIn('normal', function () {
                                setTimeout(function () {
                                    $("#feedback").fadeOut('normal')
                                }, 1200);
                            })
                        } else {
                            $(".right-content").hide();
                            $(".right-wrapper").append(result);
                            set_height('commentpage','');
                            document.getElementById("commentflow").scrollTop = document.getElementById("commentflow").scrollHeight;
                        }
                    }
                }
            })
        })

        $(".reply-trigger").live('click',function() {
            if($(this).parent().attr("class")=="sub-comment"){
                var parentid = $(this).parent().parent().parent().parent().parent().attr("id");
                var replyto = $(this).parent(".sub-comment").parent(".sub-comment-box ").find(".replyto").val();
                var replytoname = $(this).parent(".sub-comment").find(".replytoname").html();
            } else {
                parentid = $(this).parent().parent().attr("id");
                replyto = $(this).parent().find(".replyto").first().val();
                replytoname = $(this).parent().find(".replytoname").first().html();

            }
            $("#replyto").val(replyto);
            $("#parentid").val(parentid);
            $("textarea").focus();
            $("textarea").val("to "+replytoname + " :");

        })

        //清空事件
        $("textarea").live('keyup',function(){
            if($(this).val() == ""){
                $("#replyto").val("");
                $("#parentid").val("");
            }
        })
        //回车发送评论事件
        $("textarea").live('keydown', function(event) {
            if(event.ctrlKey && event.keyCode==13){
                send_comment();
            }
        })

        //点击发送评论事件
        $("#send_comment").live('click',function() {
            send_comment();
        })

        //发送评论
        function send_comment(){
            var text = $("textarea").val();
            var index = text.indexOf(":")+1;
            text = text.substr(index);
            var markid = $("#markid").val();
            var replyto = $("#replyto").val() == "" ? 0 : $("#replyto").val();
            var parentid = $("#parentid").val() == "" ? 0 : $("#parentid").val();
            if(text != ""){
                $.ajax({
                    type: 'POST',
                    url: 'index.php/comment/add_comment',
                    data: {
                        'markid' : markid,
                        'replyto' : replyto,
                        'parentid' : parentid,
                        'text' : text
                    },
                    complete : function (data) {
                        if(data.status != 200){

                        }else{
                            var  result = data.responseText;
                            if(result != ''){
                                 result = eval("("+ result + ")");
                                $.each(result, function(key, value){
                                    var content = '';
                                    var img_url = '';
                                    var reply_info = '';
                                    if(parentid == 0){
                                        img_url = base_url + value.middle_headshot;
                                        content = "<div class='comment-box clearfix' id='" + value.commentid +  "'>" +
                                            "<a href='javascript:void(0)' class='pull-left'><img src='" + img_url + "'/></a>" +
                                            "<div class='comment'>" +
                                            "<input type='hidden' class='replyto' value='" + value.user_id + "'/>" +
                                            "<p><a href='javascript:void(0)' class='replytoname'>" + value.nickname + "</a></p>" +
                                            "<p>" +  value.text + "</p>" +
                                            "<p class='pull-left'>" + value.time + "</p>" +
                                            "<b class='icon-comment pull-right reply-trigger'></b></div>" +
                                           "</div>";

                                        $(".auto-flow").append(content);
                                    }else{
                                        img_url = base_url + value.small_headshot;
                                        reply_info =   replyto == 0? '' :( "&nbsp;To&nbsp:<a href='javascript:void(0)'>" + value.reply_nickname + "</a>" );
                                        if($("#"+parentid).find(".sub-comment-wrapper").length == 0){
                                            $("#"+parentid).find(".comment").append("<div class='sub-comment-wrapper'></div>");
                                        }
                                        content = "<div class='sub-comment-box clearfix'>" +
                                            "<input type='hidden' class='replyto' value='" + value.user_id +"'/>" +
                                            "<a href='javascript:void(0)' class='pull-left'><img src='"+ img_url + "'/></a>" +
                                            "<div class='sub-comment'><p><a href='javascript:void(0)' class='replytoname'>" + value.nickname + "</a>" +
                                            reply_info + "</p>" +
                                            "<p>" + value.text + "</p>" +
                                            "<p class='pull-left'>" + value.time + "</p>" +
                                            "<b class='icon-comment pull-right reply-trigger'></b>" +
                                            "</div></div>";
                                        $("#"+parentid).find(".sub-comment-wrapper").append(content);

                                    }
                                })
                                $("textarea").val("");
                                $("#replyto").val("");
                                $("#parentid").val("");
                                set_height('commentpage','');
                                document.getElementById("commentflow").scrollTop = document.getElementById("commentflow").scrollHeight;
                            }

                        }
                    }
                })
            }else{

            }
        }


        //关闭页面时的处理
        $(".pageclose").live('click', function () {
            var pagetype = $(this).attr("id").split("-")[0];
            if (pagetype != "minepage") {
                $("#" + pagetype).remove();
                $(".right-wrapper").find(".right-content").last().show();
                var type = $(".right-wrapper").find(".right-content").last().attr("id");
                var subtype = '';
                if(type == "minepage"){
                    subtype = $(".nav-pills").find(".active").find("a").html().toLowerCase();
                }
                set_height(type,subtype);
            }
        })

        //计算提示框的显示位置
        function calculate(obj) {
            var top = ($('.left-wrapper').height() - obj.height()) / 2 - 30;
            var left = ($(window).width() - obj.width()) / 2 - 100;
            obj.css({'left': left, 'top': top});
        }
    };

    return {
        loadSocialPage: loadSocialPage,
        loadRoomPage: loadRoomPage,
        getAllFunc: getAllFunc
    };
});