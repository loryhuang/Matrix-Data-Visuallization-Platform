require.config({
    baseUrl: './js',
    paths: {
        jquery: 'lib/jquery-1.7.2.min',
        jquery_imgareaselect: 'lib/jquery.imgareaselect',
        jquery_zclip: 'lib/jquery.zclip.min'
    },
    shim: {
        "jquery_imgareaselect": {
            deps: ["jquery"]
        },
        "jquery_zclip": {
            deps: ["jquery"]
        }
    }
});

define([
    'jquery',
    'util/Constant',
    'jquery_imgareaselect',
    'jquery_zclip',
    'modules/chat'
], function ($, Const) {
    "use strict";

    var base_url = Const.BASE_URL;
    //计算每个小页面auto-flow的高度
    function get_offset(id, subid) {
        var offset;
        var pagetype = id.split("-")[0];
        switch (pagetype) {
            case "minepage":
                switch (subid) {
                    case "creator":
                        offset = 260;
                        break;
                    case "mine":
                        offset = 260;
                        break;
                    default:
                        offset = 260;
                        break;
                }
                break;
            case "commentpage":
                offset = 60 + $("#"+id).find(".item-box").height() + 30 + $("#"+id).find(".send-box").height();
//                262
                break;
            case "roompage":
//                offset = 650;
                offset = 60 + $("#"+id).find(".room-header").height() + 20 + $("#"+id).find(".room-member").height() + 50 + 137;
                break;
            default :
                offset = 260;
        }
        return offset;
    }

    //页面加载后对滚动部分设置高度
    function set_height(type, subtype) {
        var height = $(window).height() > 768 ? $(window).height() : 768;
        var offset = get_offset(type, subtype);
        var real_height = height - 60;
        var auto_height = height - offset;
        $(".left-wrapper").css('height', real_height);
        $(".right-wrapper").css('height', real_height);
        $("#" + type).find(".auto-flow").css('height', auto_height);
    }

    //加载新页面后处理标记的位置和选中样式
    function set_tab_height(type, length) {
//      var length = $(".right-content").length;
        var top = (length - 1) * 50 + (length - 1) * 5 + 20;
//      $(".tab").removeClass("tabactive");
        $("#" + type + "-tab").css("top", top);
//      $("#"+type + "-tab").addClass("tabactive");
    }


    //关闭页面时的处理
    $(".pageclose").live('click', function () {
        var pagetypetmp = $(this).attr("id").split("-");
        var pagetype = "";
        if (pagetypetmp.length == 3) {
            pagetype = pagetypetmp[0] + "-" + pagetypetmp[1];
        } else {
            pagetype = pagetypetmp[0];
        }
        var type = $("#" + pagetype).prevAll(".right-content").first().attr("id");
        var length = $(".right-content").length - 1;
        var nextlength = $("#" + pagetype).nextAll(".right-content").length;
        var obj = $("#" + pagetype).nextAll(".right-content").first();
        $("#" + pagetype).remove();
        $("#" + pagetype + "-tab").remove();
        var tabid = "";
        var objid = "";
        var position = "";
        for (var i = 0; i < nextlength; i++) {
            objid = obj.attr("id");
            tabid = objid + "-tab";
            position = length - nextlength + i + 1;
            set_tab_height(objid, position);
            obj = obj.nextAll(".right-content").first();
        }
        $(".tab").removeClass("tabactive");
        $("#" + type + "-tab").addClass("tabactive");
        $("#" + type).show();
        var subtype = '';
        if (type == "minepage") {
            subtype = $(".nav-pills").find(".active").find("a").html().toLowerCase();
        }
        set_height(type, subtype);
    });

    function input_limit(obj) {
        obj.live('keyup', function () {

        })
    }

    /**
     * 载入标记页面
     */
    var loadMarkPage = function () {
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
                    //alert(result);
                    if (data.status != 200) {

                    } else {
                        $(".right-wrapper").append(result);
                        set_height('minepage', '');
                        set_tab_height('minepage', 1);
                        $("#minepage").css({'right':'0',position:'absolute',top:'0'});
                        $("#minepage").show();
//                        var height = ($(window).height() - 60) < 708 ? 708 : ($(window).height() - 60);
//                        var min_height = height - 285;
//                        var min_height = height - 200;
//                        $(".right-wrapper").css('height', height);
//                        $(".left-wrapper").css('height', height);
//                        $("#minepage").find(".auto-flow").css({'height': min_height, 'overflow-y': 'scroll'});
//                        $("#userInfo").show();
//                        $("#view_container").show();
//                        $("#imagick").show();
                        initDOMEvent();
                        $(".nav-right .pull-right .dropdown-menu li").first().click();
                        initscroll();
                    }
                }
            });
        });

        //根据类型区分每个导航栏下面pin和mark的颜色
        function get_mark_color(type) {
            var color;
            switch (type) {
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

        var scrollnum = 0;
        var initscroll = function () {
            $(".auto-flow").scroll(function () {
                var limit = 10;
                var auto_flow = $(this);
                var obj = auto_flow.parent(".result-wrapper").parent(".right-content");
                var type = obj.attr("id");
                var navitype = "";
                var cupage = obj.find(".cupage").val();
                var tocount = obj.find(".tocount").val();
                var datafile_id = $("#data_form input[name='fileid']").val();
                if (type == "minepage") {
                    navitype = obj.find(".active").find("a").html().toLowerCase();
                    var color = get_mark_color(navitype);
                    if (auto_flow.scrollTop() + auto_flow.height() >= auto_flow.get(0).scrollHeight - 10 && scrollnum == 0) {
                        if (cupage * limit < tocount) {
                            scrollnum = 1;
                            $(".loading").show();
                            $.ajax({
                                type: "POST",
                                url: "index.php/pin/get_more_mark",
                                dataType: "JSON",
                                data: {
                                    'fileid': datafile_id,
                                    'navitype': navitype,
                                    'cupage': cupage
                                },
                                success: function (data) {
                                    $(".loading").hide();
                                    $.each(data, function (key, value) {
                                        var marktype = value.type == 0 ? 'pin' : 'area';
                                        var comment_num = value.num == null ? 0 : value.num;
                                        if (navitype != 'creator' && navitype != 'mine') {
                                            var creator_info = " ——By &nbsp; <a href='javascript:void(0)' class='nickname'>" + value.nickname + "</a>"
                                        } else {
                                            creator_info = '';
                                        }
                                        var content = "<div class='row-fluid item-box clearfix'>" +
                                            " <input type='hidden' class='markid' value='" + value.mark_id + "'/>" +
                                            "<i class='icon-" + marktype + "-" + color + "'></i>" +
                                            "<p><a href='javascript:void(0)'  class='marktitle'>" + value.title + "</a>&nbsp;" + creator_info + "</p>" +
                                            "<p>" + value.mark_desc + "</p>" +
                                            "<p class='pull-left ft-color1'>" + value.time + "</p>" +
                                            "<p class='pull-right ft-color1 to-comment'><b class='icon-comment'></b>" + comment_num +
                                            "</div>";
                                        $("#minepage").find(".auto-flow").append(content);
                                    })
                                    scrollnum = 0;
                                    cupage = parseInt(cupage) + 1;
                                    obj.find(".cupage").val(cupage);
                                    set_height("minepage", navitype);
                                }
                            })
                        }
                    }
                } else if (type.split("-")[0] == "commentpage") {
                    var markid = $("#" + type).find(".markid").val();
                    if (auto_flow.scrollTop() < 10 && scrollnum == 0) {
                        if (cupage > 1) {
                            $(".loading").show();
                            scrollnum = 1;
                            var position = auto_flow.find(".comment-box").first();
                            $.ajax({
                                type: 'POST',
                                url: 'index.php/comment/get_more_comment',
                                dataType: 'JSON',
                                data: {
                                    'markid': markid,
                                    'cupage': cupage
                                },
                                success: function (data) {
                                    $(".loading").hide();
                                    var headshot = "";
                                    var content = "";
                                    var img_url = "";
                                    var reply_info = "";
                                    var parentid = "";
                                    $.each(data, function (key, value) {
                                        parentid = value.commentid;
                                        var date = new Date(value.time.replace(/-/g, '/')).getTime();
                                        headshot = value.middle_headshot == "" ? "resource/image/user/middle/middle50.jpg" : value.middle_headshot;
                                        img_url = base_url + headshot;
                                        content = "<div class='comment-box clearfix' id='" + parentid + "'>" +
                                            "<a href='javascript:void(0)' class='pull-left'><img src='" + img_url + "'/></a>" +
                                            "<div class='comment'>" +
                                            "<input type='hidden' class='replyto' value='" + value.user_id + "'/>" +
                                            "<p><a href='javascript:void(0)' class='replytoname nickname'>" + value.nickname + "</a></p>" +
                                            "<p>" + value.text + "</p>" +
                                            "<p class='pull-left'>" + value.time + "</p>" +
                                            "<b class='icon-comment pull-right reply-trigger'></b></div>" +
                                            "</div>";
                                        position.before(content);
                                        if (value.hasOwnProperty('child')) {
                                            headshot = value.small_headshot == "" ? "resource/image/user/small/small30.jpg" : value.small_headshot;
                                            img_url = base_url + headshot;
                                            reply_info = value.reply_to_user_id == 0 ? '' : ( "&nbsp;To&nbsp:<a href='javascript:void(0)' class='nickname'>" + value.reply_nickname + "</a>" );
                                            $("#" + parentid).find(".comment").append("<div class='sub-comment-wrapper'></div>");
                                            $.each(value.child, function (key, value) {
                                                content = "<div class='sub-comment-box clearfix'>" +
                                                    "<input type='hidden' class='replyto' value='" + value.user_id + "'/>" +
                                                    "<a href='javascript:void(0)' class='pull-left'><img src='" + img_url + "'/></a>" +
                                                    "<div class='sub-comment'><p><a href='javascript:void(0)' class='replytoname nickname'>" + value.nickname + "</a>" +
                                                    reply_info + "</p>" +
                                                    "<p>" + value.text + "</p>" +
                                                    "<p class='pull-left'>" + value.time + "</p>" +
                                                    "<b class='icon-comment pull-right reply-trigger'></b>" +
                                                    "</div></div>";
                                                $("#" + parentid).find(".comment").append(content);
                                            })
                                        }
                                    })
                                    scrollnum = 0;
                                    cupage = parseInt(cupage) - 1;
                                    obj.find(".cupage").val(cupage);
                                    set_height('commentpage', '');
                                }
                            })
                        }
                    }
                }

            })
        }

        //绑定该页面各个DOM的事件方法
        var initDOMEvent = function () {

            //计算提示框的显示位置
            var calculate = function (obj) {
                var top = ($('.left-wrapper').height() - obj.height()) / 2 - 30;
                var left = ($(window).width() - obj.width()) / 2 - 100;
                obj.css({'left': left, 'top': top});
            };

            //窗口大小变化时调整框架基本高度和auto-flow高度
            $(window).resize(function () {
                var ex_height = $(".left-wrapper").height();
                var cu_height = $(window).height() - 60;
                if ($("a.tabactive").length == 0) {
                    return;
                }
                var target = $("a.tabactive").attr("id").split("-");
                var type = "";
                if (target.length == 3) {
                    type = target[0] + '-' + target[1];
                } else {
                    type = target[0];
                }
                if (cu_height > ex_height) {
                    var offset = get_offset(type, '');
                    var min_cu_height = cu_height + 60 - offset;
                    $(".left-wrapper").css('height', cu_height);
                    $(".right-wrapper").css('height', cu_height);
                    $("#" + type).find(".auto-flow").css('height', min_cu_height);
                }
            });

            //每个页面的导航切换
            $(".tab").live('click', function () {
                if ($(this).hasClass("tabactive")) {

                } else {
                    $(".tab").removeClass("tabactive");
                    $(".right-content").hide();
                    $(this).addClass("tabactive");
                    var id = $(this).attr("id").split("-");
                    var objid = "";
                    if (id.length == 2) {
                        objid = id[0];
                    } else {
                        objid = id[0] + "-" + id[1];
                    }
                    $("#" + objid).show();
                }
            })

            //初始化创建房间按钮
            $("#create_new_room").click(function () {
                calculate($("#create_room_box"));
                $("#shade").show();
                $("#create_room_box").show();
            });

            $(".get-preivew").click(function () {
                $.ajax({
                    type: "POST",
                    url: "index.php/embed/get_datafile_token",
                    data: {
                        "datafile_id": $('#data_form input[name=fileid]').val()
                    },
                    complete: function (data) {
                        var token = data.responseText;
                        var script = "<script>window.hm2 = window.hm2 || {}; hm2.token = '" + token + "';"+
                            "hm2.containerId = 'hehe';</script>\n" +
                            "<script src='http://115.156.216.95/sga_lss/js/static/embed.js'></script>";
                        console.log(script);
                    }
                });
            });

            $("#to_create").click(function () {
                var title = $("#create_room_box input[name='title']").val(),
                    desc = $("#create_room_box textarea[name='description']").val();
                if (title.trim() === "" || desc.trim() === "") {
                    alert("The room title or description can't be empty.");
                } else {
                    $("#shade").hide();
                    $("#create_room_box").hide();
                    $("#create_room_box").find("input").val("");
                    $("#create_room_box").find("textarea").val("");
                    loadRoomPage('create');
                }
            });


            $("#cancel_create").click(function () {
                $("#shade").hide();
                $("#create_room_box").hide();
            });

            function generate_html(navitype, wrapper, data) {
                var color = get_mark_color(navitype);
                var headshot = "";
                var img_url = "";
                var marktype = "";
                var comment_num = "";
                var creator_info = "";
                var content = "";
                if (data != null) {
                    $.each(data, function (key, value) {
                        headshot = value.middle_headshot == "" ? "/resource/image/user/middle/middle50.jpg" : value.middle_headshot;
                        img_url = base_url + headshot;
                        marktype = value.type == 0 ? 'pin' : 'area';
                        comment_num = value.num == null ? 0 : value.num;
                        if (navitype != 'creator' && navitype != 'mine') {
                            creator_info = " ——By &nbsp; <a href='javascript:void(0)' class='nickname'>" + value.nickname + "</a>";
                        } else {
                            creator_info = '';
                        }
                        content = "<div class='row-fluid item-box clearfix'>" +
                            " <input type='hidden' class='markid' value='" + value.mark_id + "'/>" +
                            "<i class='icon-" + marktype + "-" + color + "'></i>" +
                            "<p><a href='javascript:void(0)'  class='marktitle'>" + value.title + "</a>&nbsp;" + creator_info + "</p>" +
                            "<p>" + value.mark_desc + "</p>" +
                            "<p class='pull-left ft-color1'>" + value.time + "</p>" +
                            "<p class='pull-right ft-color1 to-comment'><b class='icon-comment'></b>" + comment_num +
                            "</div>";
                        wrapper.append(content);
                    });
                } else {
                    if(navitype != "mine") {
                        wrapper.append("<div class='tips'>No mark</div>");
                    } else if(wrapper.hasClass("create-wrapper")) {
                        wrapper.append("<div class='tips'>You haven't create any mark yet.</div>");
                    } else {
                        wrapper.append("<div class='tips'>You haven't collect any mark yet.</div>");
                    }
                }
            }

            //creator、top、latest、mine的导航栏切换
            $(".nav-pills li").live('click', function () {
                var obj = $(this);
                var navitype = obj.find("a").html().toLowerCase();
                var fileid = $("input[name='fileid']").val();
                var cupage = 1;
                $.ajax({
                    type: 'POST',
                    url: 'index.php/pin/get_navi',
                    dataType: 'json',
                    data: {
                        "navitype": navitype,
                        "fileid": fileid,
                        "cupage": cupage
                    },
                    success: function (data) {
                        $("#minepage").find(".result-wrapper").find(".tips").remove();
                        $("#minepage").find(".result-wrapper").html("");
                        $("#minepage").find(".result-wrapper").append("<input type='hidden' class='tocount' value='" + data.tocount + "'/>");
                        $("#minepage").find(".result-wrapper").append("<input type='hidden' class='cupage' value='2'/>");
                        $("#minepage").find(".result-wrapper").append("<div class='auto-flow'></div>");

                        var wrapper =$("#minepage").find(".auto-flow");
                        var headshot = "";
                        var img_url = "";
                        if (navitype == "creator" || navitype == "mine") {
                            headshot = data.user_info[0].middle_headshot == "" ? "/resource/image/user/middle/middle50.jpg" : data.user_info[0].middle_headshot;
                            img_url = base_url + headshot;
                            var user_info = "<div class='row-fluid intro-box'>" +
                                "<div class='row-fluid pull-left'><img src='" + base_url + img_url + "'/></div>" +
                                "<div class='row-fluid'><p><a href='javascript:void(0)' class='nickname'>" + data.user_info[0].nickname + "</a></p>" +
                                "<p>" + data.user_info[0].description + "</p></div></div>";
                            wrapper.append(user_info);
                        }
                        if(navitype == "mine") {
                            wrapper.append("<div class='row create-container'><a class='container-title show-create' title='fold'>Which I create</a><div class='create-wrapper'></div></div>");
                            wrapper = $(".create-wrapper");
                        }
                        generate_html(navitype, wrapper, data.list);
                        if(navitype == "mine") {
                            if(data.tocount > 3) {
                                wrapper.append("<a class='show-all' type='create'>show all</a>");
                            }
                            $("#minepage").find(".auto-flow").append("<div class='row collect-container'><a class='container-title show-collect' title='fold'>Which I Collect</a> <div class='row collect-wrapper'></div></div>");
                            wrapper = $(".collect-wrapper");
                            generate_html(navitype, wrapper, data.list_collect);
                            if(data.tocount_collect > 3) {
                                wrapper.append("<a class='show-all' type='collect'>show all</a>");
                            }
                        }
                        scrollnum = 0;
                        set_height("minepage", navitype);
                        //$("#minepage").find(".tips").css('line-height',$("#minepage").find(".auto-flow").height()-30+'px');
                        $(".nav-pills").find("li").removeClass("active");
                        obj.addClass("active");
                        initscroll();
                    }
                });
            });

            //点击显示更多
            $(".show-all").live('click', function() {
                var type = $(this).attr("type");
                var fileid = $("input[name='fileid']").val();
                var wrapper = "";
                if(type == "create") {
                    wrapper = $(".create-wrapper");
                } else {
                    wrapper = $(".collect-wrapper");
                }
                $.ajax({
                    type: 'POST',
                    url: 'index.php/pin/show_all',
                    dataType: 'json',
                    data: {
                        "type": type,
                        "fileid": fileid
                    },
                    success: function(data) {
                        wrapper.find(".show-all").remove();
                        generate_html('mine', wrapper, data);
                        set_height("minepage", "mine");
                        if(type == 'collect') {
                            var scrolltop = $("#minepage").find(".collect-container").get(0).offsetTop-200;
                            $("#minepage").find(".auto-flow").animate({ scrollTop: scrolltop + "px" }, 500);
                        }
                    }
                });
            });

            $(".show-create").live('click',function() {
                if ($(".create-wrapper").is(":hidden")) {
                    $(this).attr("title",'fold');
                    $(".create-wrapper").show();
                    set_height("minepage", "mine");
                    var scrolltop = $("#minepage").find(".create-container").get(0).offsetTop-200;
                    $("#minepage").find(".auto-flow").animate({ scrollTop: scrolltop + "px" }, 500);
                } else {
                    $(this).attr("title",'unfold');
                    $(".create-wrapper").slideUp("slow");
                    set_height("minepage", "mine");
                    $("#minepage").find(".auto-flow").animate({ scrollTop: "0px" }, 500);
                }
            })

            //点击显示which i collect 内容
            $(".show-collect").live('click', function() {
                var color = 'green';
                var fileid = $("input[name='fileid']").val();
                if($(".collect-wrapper").html() == "") {
                    $.ajax({
                        type: 'POST',
                        url: 'index.php/pin/show_collect',
                        dataType: 'json',
                        data : {
                          'fileid' : fileid
                        },
                        success: function(data) {
                            if(data != null) {
                                $.each(data, function (key, value) {
                                    var marktype = value.type == 0 ? 'pin' : 'area';
                                    var comment_num = value.num == null ? 0 : value.num;
                                    var creator_info = " ——By &nbsp; <a href='javascript:void(0)' class='nickname'>" + value.nickname + "</a>";
                                    var content = "<div class='row-fluid item-box clearfix'>" +
                                        " <input type='hidden' class='markid' value='" + value.mark_id + "'/>" +
                                        "<i class='icon-" + marktype + "-" + color + "'></i>" +
                                        "<p><a href='javascript:void(0)'  class='marktitle'>" + value.title + "</a>&nbsp;" + creator_info + "</p>" +
                                        "<p>" + value.mark_desc + "</p>" +
                                        "<p class='pull-left ft-color1'>" + value.time + "</p>" +
                                        "<p class='pull-right ft-color1 to-comment'><b class='icon-comment'></b>" + comment_num +
                                        "</div>";
                                    $(".collect-wrapper").append(content);
                                });
                            } else {
                                $(".collect-wrapper").append("<div class='tips'>You haven't collect any mark yet.</div>");
                            }
                            $(".collect-wrapper").show();
                            set_height("minepage", "mine");
                            var scrolltop = $("#minepage").find(".collect-container").get(0).offsetTop-200;
                            $("#minepage").find(".auto-flow").animate({ scrollTop: scrolltop + "px" }, 500);
                        }
                    });
                } else if ($(".collect-wrapper").is(":hidden")) {
                    $(this).attr("title",'fold');
                    $(".collect-wrapper").show();
                    set_height("minepage", "mine");
                    var scrolltop = $("#minepage").find(".collect-container").get(0).offsetTop-200;
                    $("#minepage").find(".auto-flow").animate({ scrollTop: scrolltop + "px" }, 500);
                } else {
                    $(this).attr("title",'unfold');
                    $(".collect-wrapper").slideUp("slow");
                    set_height("minepage", "mine");
                    $("#minepage").find(".auto-flow").animate({ scrollTop: "0px" }, 500);
                }
            });

            //点击跳转到评论页面
            $(".to-comment").live('click', function () {
                var markid = $(this).parent().find(".markid").val();
                if ($(".commentpage").length != 0) {
                    $(".commentpage").find(".pageclose").click();
                }
                if ($("#commentpage-" + markid).length == 0) {
                    var objid = "commentpage-" + markid;
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
                                    scrollnum = 0;
                                    $(".tab").removeClass("tabactive");
                                    $(".right-content").hide();
                                    $(".right-wrapper").append(result);
                                    set_tab_height(objid, $(".right-content").length);
                                    $("#" + objid + "-tab").addClass("tabactive");
                                    $("#" + objid).animate({right: '0',opacity: 'show'}, "slow", function(){
                                        $("#" + objid).css({'position':'absolute','top':'0'});
                                        set_height(objid, '');
                                        if( $("#" + objid).find(".auto-flow").find(".tips").length == 1) {
                                            var height = $("#" + objid).find(".auto-flow").height() + 'px';
                                            $(".tips").css('line-height', height);
                                        }
                                        var scrolltop = $("#" + objid).find(".auto-flow").get(0).scrollHeight - $("#" + objid).find(".auto-flow").height();
//                                        $("#" + objid).find(".auto-flow").scrollTop(scrolltop);
                                        $("#" + objid).find(".auto-flow").animate({ scrollTop: scrolltop + "px" }, 500);
                                    });
                                    initscroll();
                                }
                            }
                        }
                    });
                }
            });

            $(".to-at").live('click', function () {
                var markid = $(this).parent().find(".markid").val();
                var roomid = $(this).parent().find(".roomid").val();
                var marktitle = $(this).siblings(".row").find(".title").html();
                var markInfo = {
                    mark_id: markid,
                    title: marktitle
                };
                var roomPageId = "";
                var targetpage = $(".tabactive").attr("id").split("-");
                if (targetpage[0] == "roompage") {
                    roomPageId = "#roompage-" + targetpage[1];
                    require('modules/chat').atMark(roomPageId, markInfo);
                } else {
                    alert("The room is closed. Please open it first.");
                }
            });


            //点击回复
            $(".reply-trigger").live('click', function () {
                var target = $(this).parents(".right-content").attr("id");
                if ($(this).parent().attr("class") == "sub-comment") {
                    var parentid = $(this).parent().parent().parent().parent().parent().attr("id");
                    var replyto = $(this).parent(".sub-comment").parent(".sub-comment-box ").find(".replyto").val();
                    var replytoname = $(this).parent(".sub-comment").find(".replytoname").html();
                } else {
                    parentid = $(this).parent().parent().attr("id");
                    replyto = $(this).parent().find(".replyto").first().val();
                    replytoname = $(this).parent().find(".replytoname").first().html();
                }
                $("#" + target).find(".send-box").find("input.replyto").val(replyto);
                $("#" + target).find(".send-box").find("input.parentid").val(parentid);
                $("#" + target).find("textarea.commenttext").focus();
                $("#" + target).find("textarea.commenttext").val("to " + replytoname + " :");
            });

            //清空事件
            $("textarea.commenttext").live('keyup', function () {
                if ($(this).val() == "") {
                    $(this).parent(".send-box").find("input.replyto").val("");
                    $(this).parent(".send-box").find("input.parentid").val("");
                }
            });

            //Ctrl+回车发送评论事件
            $("textarea.commenttext").live('keydown', function (event) {
                if (event.ctrlKey && event.keyCode == 13) {
                    var targetpageid = $(this).parents(".right-content").attr("id");
                    send_comment(targetpageid);
                }
            });

            //点击发送评论事件
            $(".send_comment").live('click', function () {
                var targetpageid = $(this).parents(".right-content").attr("id");
                send_comment(targetpageid);
            });

            //发送评论
            function send_comment(objid) {
                var text = $("#" + objid).find("textarea").val();
                var index = text.indexOf(":") + 1;
                text = text.substr(index);
                var markid = $("#" + objid).find(".send-box").find("input.markid").val();
                var replyto = $("#" + objid).find(".send-box").find("input.replyto").val() == "" ? 0 : $("#" + objid).find(".send-box").find("input.replyto").val();
                var parentid = $("#" + objid).find(".send-box").find("input.parentid").val() == "" ? 0 : $("#" + objid).find(".send-box").find("input.parentid").val();
                var destid = "";
                if (text != "") {
                    $.ajax({
                        type: 'POST',
                        url: 'index.php/comment/add_comment',
                        data: {
                            'markid': markid,
                            'replyto': replyto,
                            'parentid': parentid,
                            'text': text
                        },
                        dataType: 'json',
                        success: function (data) {
                            $("#" + objid).find(".auto-flow").find(".tips").remove();
                            var headshot = "";
                            var content = '';
                            var img_url = '';
                            var reply_info = '';
                            $.each(data, function (key, value) {
                                if (parentid == 0) {
                                    headshot = value.middle_headshot == "" ? "/resource/image/user/middle/middle50.jpg" : value.middle_headshot;
                                    img_url = base_url + headshot;
                                    content = "<div class='comment-box clearfix' id='" + value.commentid + "'>" +
                                        "<a href='javascript:void(0)' class='pull-left'><img src='" + img_url + "'/></a>" +
                                        "<div class='comment'>" +
                                        "<input type='hidden' class='replyto' value='" + value.user_id + "'/>" +
                                        "<p><a href='javascript:void(0)' class='replytoname nickname'>" + value.nickname + "</a></p>" +
                                        "<p>" + value.text + "</p>" +
                                        "<p class='pull-left'>" + value.time + "</p>" +
                                        "<b class='icon-comment pull-right reply-trigger'></b></div>" +
                                        "</div>";

                                    $("#" + objid).find(".auto-flow").append(content);
                                    destid = value.commentid;
                                } else {
                                    headshot = value.small_headshot == "" ? "/resource/image/user/small/small30.jpg" : value.small_headshot;
                                    img_url = base_url + headshot;
                                    reply_info = replyto == 0 ? '' : ( "&nbsp;To&nbsp:<a href='javascript:void(0)' class='nickname'>" + value.reply_nickname + "</a>" );
                                    if ($("#" + parentid).find(".sub-comment-wrapper").length == 0) {
                                        $("#" + parentid).find(".comment").append("<div class='sub-comment-wrapper'></div>");
                                    }
                                    content = "<div class='sub-comment-box clearfix'>" +
                                        "<input type='hidden' class='replyto' value='" + value.user_id + "'/>" +
                                        "<a href='javascript:void(0)' class='pull-left'><img src='" + img_url + "'/></a>" +
                                        "<div class='sub-comment'><p><a href='javascript:void(0)' class='replytoname nickname'>" + value.nickname + "</a>" +
                                        reply_info + "</p>" +
                                        "<p>" + value.text + "</p>" +
                                        "<p class='pull-left'>" + value.time + "</p>" +
                                        "<b class='icon-comment pull-right reply-trigger'></b>" +
                                        "</div></div>";
                                    $("#" + parentid).find(".sub-comment-wrapper").append(content);
                                    destid = parentid;

                                }
                            })
                            $("#" + objid).find("textarea.commenttext").val("");
                            $("#" + objid).find(".send-box").find("input.replyto").val("");
                            $("#" + objid).find(".send-box").find("input.parentid").val("");
                            set_height(objid, '');
                            var scrolltop = ($("#" + destid).get(0).offsetTop - 200) < 0 ? 0 : ($("#" + destid).get(0).offsetTop - 200);
//                            var scrolltop =  $("#"+objid).find(".auto-flow").get(0).scrollHeight - $("#"+objid).find(".auto-flow").height();
                            $("#" + destid).css({"background-color":"#FFDB66"});
                            $("#" + objid).find(".auto-flow").animate({ scrollTop: scrolltop + "px" }, 500);
//                            $("#" + objid).find(".auto-flow").scrollTop(scrolltop);
                            setTimeout(function(){
                                $("#" + destid).css({"background-color":"transparent"});
                            },1000);
                            if ($("#mark_box_" + markid).length != 0) {
                                var comment_tocount = parseInt($("#mark_box_" + markid).find(".to-comment").html().substr(28)) + 1;
                                $("#mark_box_" + markid).find(".to-comment").html("<b class='icon-comment'></b>" + comment_tocount + "<em>comment</em>");
                            }
                        },
                        error: function (a, b, c) {
                            alert(b);
                            alert(c);
                        }
                    })
                } else {

                }
            }
        };
    };

    /**
     * 载入房间页面
     * @param {String} type 进入房间的类型，只可以是'create'或'enter'
     * @param {String} [hash] 房间的哈希值
     */
    var loadRoomPage = function (type, hash) {
        var userId = $("#data_form input[name='userid']").val();
        var roomPageId = "#roompage-";
        var hash = hash || $('#data_form input[name=room_hash]').val();

        if (!(type === 'create' || type === 'enter')) {
            console.error('载入房间参数错误');
            return;
        }

        //初始化页面，供ajax成功调用
        var initDOMEvent = function (responseData) {
            var result = responseData.responseText;
            roomPageId += result.slice(0, result.indexOf('<!--'));
            result = result.slice(result.indexOf('<!'));
            //房间hash验证错误
            if (result === "Room hash error") {
                window.location.hash = "";
            } else {
                if($(roomPageId+"-tab").length != 0) {
                    $(roomPageId+"-tab").click();
                } else {
                    var chat = require('modules/chat');
                    $(".right-content").hide();
                    $(".right-wrapper").append(result);
                    var targetpageid = $(".right-content").last().attr("id");
                    var length = $(".right-content").length;
                    $(".tab").removeClass("tabactive");
                    $("#" + targetpageid + "-tab").addClass("tabactive");
                    set_tab_height(targetpageid, length);
                    $("#" + targetpageid).animate({right: '0',opacity: 'show'}, "slow", function(){
                        $("#" + targetpageid).css({'position':'absolute','top':'0'});
                        set_height(targetpageid, '');
                    });
                }

//                $("#minepage").hide();
//                $("#roompage").show();

                if (type === "enter") {
                    //显示聊天记录
                    var chatRecords = JSON.parse($(roomPageId + " input[name=chat_record]").val()) || [];
                    var i;
                    for (i = 0; i < chatRecords.length; i++) {
                        var cr = chatRecords[i];
                        chat.showMessage(roomPageId, cr.nickname,
                            cr.small_headshot, cr.text, cr.speaker_id !== userId, cr.time);
                    }
                    chat._setHeight(roomPageId);
                }

                $("textarea.send_msg").live('keydown', function (evt) {
                    if (evt.keyCode == 13 && evt.ctrlKey && $(this).val() != "") {
                        $(this).parent().find('.btn_send_msg').focus().click();
                    }
                });

                $(roomPageId + ' .btn_send_msg').click(function () {
//                    chat.sendText($('#send_content').val());
                    chat.sendText(roomPageId, $(roomPageId + ' .send_msg').val());
                });

                $(roomPageId).find(".pageclose-room").click(function () {
                    var targetobj = $(this);
                    if (confirm('Are you sure to leave the room?')) {
                        var pagetypetmp = targetobj.attr("id").split("-");
                        var pagetype = pagetypetmp[0] + "-" + pagetypetmp[1];
                        var type = $("#" + pagetype).prevAll(".right-content").first().attr("id");
                        var length = $(".right-content").length - 1;
                        var nextlength = $("#" + pagetype).nextAll(".right-content").length;
                        var obj = $("#" + pagetype).nextAll(".right-content").first();
                        $("#" + pagetype).remove();
                        $("#" + pagetype + "-tab").remove();
                        var tabid = "";
                        var objid = "";
                        var position = "";
                        for (var i = 0; i < nextlength; i++) {
                            objid = obj.attr("id");
                            tabid = objid + "-tab";
                            position = length - nextlength + i + 1;
                            set_tab_height(objid, position);
                            obj = obj.nextAll(".right-content").first();
                        }
                        $(".tab").removeClass("tabactive");
                        $("#" + type + "-tab").addClass("tabactive");
                        $("#" + type).show();
                        var subtype = '';
                        if (type == "minepage") {
                            subtype = $(".nav-pills").find(".active").find("a").html().toLowerCase();
                        }
                        set_height(type, subtype);
                        chat.endSocketIO(roomPageId);
                    }
                });

                //设置进入房间的URL，供复制
                $(roomPageId + ' .room-enter-url').val(
                    window.location.origin + window.location.pathname +
                        '?room=' + $(roomPageId + ' input[name=hash]').attr('value'));

                //绑定粘贴到剪贴板的控件
                setTimeout(function () {
                    $(roomPageId + ' .copy-button').zclip({
                        path: './js/lib/extends/ZeroClipboard.swf',
                        copy: $(roomPageId + ' .room-enter-url').val(),
                        afterCopy: function () {
                            alert('The room url has been copied to clipboard.');
                        }
                    });
                }, 500);

                //启动socket.io
                chat.startSocketIO(roomPageId);
            }
        };

        //创建房间
        var createRoom = function () {
            var fileId = $("#data_form input[name='fileid']").val(),
                title = $("#create_room_box input[name='title']").val(),
                desc = $("#create_room_box textarea[name='description']").val();

            $.ajax({
                type: 'POST',
                url: "index.php/room/create_room",
                data: {
                    'datafile_id': fileId,
                    'title': title,
                    'description': desc
                },
                complete: initDOMEvent
            });
        };

        //进入房间
        var enterRoom = function () {
            if (hash === '0' || hash === '-1') {
                return;
            }
            $.ajax({
                type: 'POST',
                url: "index.php/room/enter_room",
                data: {
                    'hash': hash
                },
                complete: initDOMEvent
            });
        };

        //e.data.type表明是创建房间还是进入房间
        type === 'create' ? createRoom() : enterRoom();
    };

    /**
     * 载入个人信息页面
     */
    var loadPersonInfoPage = function () {
        $(".nav-right .pull-right .dropdown-menu li").click(function () {
            goPersonalPage($(this));
        });
        //获取个人页面
        function goPersonalPage(obj) {
            var active = obj.find('a').html().toLowerCase();
            var userId = $("#data_form input[name='userid']").val();
            if (active == "logout") {
                window.location.href = "index.php/user/logout";
            } else {
                if ($("#personpage").val() == null) {
                    $.ajax({
                        type: "POST",
                        url: 'index.php/user/get_person_page',
                        data: {
                            'active': active,
                            'uid': userId
                        },
                        complete: function (data) {
                            showResult(data);
                            activeCss(active);
                            var length = $(".right-content").length;
                            set_tab_height("personpage", length);
                            $("#personpage").css({'position':'absolute','top':'0','right':'0'});
                            initDOMEvent();
                            personInfoHeight();
                        }
                    })
                } else {
                    $("#personpage-tab").click();
                    $(".right-content").hide();
                    $("#personpage").show();
                    activeCss(active);
                }
            }
        }

        function showResult(data) {
            if (data.status != 200) {
                return;
            }
            var result = data.responseText;
//            $(".right-content").hide();
            $(".right-wrapper").append(result);
        }

        //获取个人信息后，对该页面的元素进行方法绑定
        var initDOMEvent = function () {
            headPortrait();
            $("#personpage .nav-pills li").click(function () {
                goPersonalPage($(this));
            });

            $("#personpage #person_profile p a").click(function () {
                var button = $(this).html().toLowerCase();
                if (button == "edit") {
                    editProfile();
                }
                if (button == "cancel") {
                    cancelProfile();
                }
                if (button == "save") {
                    saveProfile();
                }
            });

            $("#personDescription").keyup(function () {
                checkLength();
            });

            $(".toggle_image_edit").click(function () {
                toggleImageBox();
            });

            $("#uploadAction").click(function () {
                $("#uploadPicture").click();
            });

            $("#removeHeadPortrait").click(function () {
                removePicture();
            });

            $("#uploadPicture").change(function () {
                uploadPicture();
            });

//            $("#personpage>.close-back").click(function () {
//                back("personpage")
//            });

            $("#image_edit_block >.close-back").click(function () {
                back("imageblock");
            });

            $("#image_edit_block a").click(function () {
                var action = $(this).html().toLowerCase();
                if (action == "save") {
                    saveCutPicture();
                }
                if (action == "cancel") {
                    back("imageblock");
                }
            });

            $("#showCutArea").click(function () {
                    toggleImageBox();
                    showimageblock();
            });

            //room访问
            $("#personpage .personpage-item-name").each(function () {
                $(this).click(function () {
                    var room_hash = $(this).parent().find($(".room_hash")).val();
                    //等待shoushou。。。
                    loadRoomPage("enter", room_hash);
                })
            });

            $("#personpage .item-box-bottom .personpage-item-name").each(function () {
                $(this).hover(
                    function(){
                        $(this).css("color","rgb(48, 119, 230)");
                    },
                    function(){
                        $(this).css("color","#333")
                    }
                )
            });
            //heatmap,room删除绑定
            $("#personpage .item-box-bottom").each(function () {
                $(this).hover(
                    function () {
                        $(this).find($(".delete_heatmap")).css("display", "inline");
                        $(this).find($(".delete_room")).css("display", "inline");
                    },
                    function () {
                        $(this).find($(".delete_heatmap")).css("display", "none");
                        $(this).find($(".delete_room")).css("display", "none");
                    }
                )
            });

            $("#personpage .delete_heatmap").each(function () {
                $(this).click(function () {
                    var current_id = $("input[name='fileid']").val();
                    var heatmap_id = $(this).parent().find($(".delete_id")).val();
                    var r;
                    if(current_id == heatmap_id) {
                         r = confirm("This heatmap is your current heatmap. if delete, you will leave this page. Are you sure delete this heatmap?");
                    }else{
                        r = confirm("Are you sure delete this heatmap?");
                    }
                    if (r == true) {
                        var obj = $(this);
                        $.ajax({
                            type: "POST",
                            url: "index.php/user/delete_heatmap",
                            data: {
                                "heatmapId": heatmap_id
                            },
                            complete: function (data) {
                                var result = data.responseText;
                                if (result === "1") {
                                    if(current_id == heatmap_id) {
                                        window.location.href="index.php/sga/datafile_list";
                                    } else {
                                        obj.parent().parent().remove();
                                    }
                                    $("#personpage .heatmap_id").each(function(){
                                        if($(this).val() == heatmap_id) {
                                            $(this).parent().remove();
                                        }
                                    })
                                }
                                if (result === "0") {
                                    alert("delete failed");
                                }
                            }
                        });
                    }
                })
            });

            $("#personpage .delete_room").each(function () {
                $(this).click(function () {
                    var r = confirm("Are you sure delete this room?");
                    if (r == true) {
                        var obj = $(this);
                        var room_id = $(this).parent().find($(".delete_id")).val();
                        $.ajax({
                            type: "POST",
                            url: "index.php/user/delete_room",
                            data: {
                                "roomId": room_id
                            },
                            complete: function (data) {
                                var result = data.responseText;
                                if (result == "1") {
                                    obj.parent().parent().remove();
                                    var num = parseInt($('#create_room_number').html());
                                    $('#create_room_number').html(num - 1);
                                }
                                if (result == "0") {
                                    alert("delete failed");
                                }
                            }
                        })
                    }
                });
            });
            $(window).resize(function(){
//                personInfoHeight();
            });
        }

        function activeCss(active) {
            $("#personpage").find($(".nav-pills")).find("li").each(function () {
                $(this).removeClass("active");
                var type = $(this).find("a").html().toLowerCase();
                if (type == active) {
                    $(this).addClass("active");
                }
            })
            $(".person-type").hide();
            $("#person_" + active).show();
        }

        //根据其他元素的高度，调整person_page页面中profile,heatmap,以及room中内容列表区域的高度
        function personInfoHeight() {
            var height = $(window).height() > 768 ? $(window).height() : 768;
            var h_userinfo = $("#userInfo").height();
            var h_personinfo = $("#personpage .personInfo").height() > 100 ? ($("#personpage .personInfo").height()+80) :180;
            var h_row = $("#personpage .row .navbar-inner").height() > 60 ? $("#personpage .row .navbar-inner").height() : 60;
            $("#personpage .result-wrapper").css('height',height-h_userinfo-h_personinfo-h_row);
        }

        //头像修改及其弹出框相关方法
        function headPortrait() {
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
                    x1: x1,y1: y1,x2: x1+size,y2: y1+size,
                    minHeight: size,
                    minWidth: size,
                    handles: true,
                    zIndex: 4000,
                    onSelectChange: preview
                });
            }
        }

        function back(source) {
            if (source == "imageblock") {
                $("#image_edit_shade").hide();
                $("#image_edit_block").hide();
                $("#uploadPicture").val("");
                $("[class^='imgareaselect']").hide();
            } else {
                $("#personpage").remove();
                $(".right-wrapper .right-content").last().show();
            }
        }

        function uploadPicture() {
            if (checkFile()) {
                $("#pictureForm").submit();
            }
        }

        function removePicture() {
            var r = confirm("Are you sure remove this picture?");
            if(r == true){
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
                            var path = result.split(",");
                            $(".head_portrait_big").attr("src", path[1]);
                            $(".head_portrait_middle").attr("src", path[2]);
                            $(".head_portrait_small").attr("src", path[3]);
                        } else {
                            alert("remove failed");
                        }
                    }
                })
            }
        }

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
            var rT = $(".navbar-inner").height();
            var rL = bW - $(".right-wrapper").width();
            var objWH = getObjWh("#image_edit_block");
            var tbT = objWH.split("|")[0];
            var tbL = objWH.split("|")[1];
            tbT = (tbT - rT) + "px";
            tbL = (tbL - rL) + "px";
            if (type == "show") {
                $("#image_edit_shade").css({"display": "block", width: bW, height: bH, "position": "absolute", "top": "-" + rT + "px", "left": "-" + rL + "px"});
                $("#image_edit_block").css({"display": "block", "position": "absolute", "top": tbT, "left": tbL});
            }
            if (type == "resize") {
                $("#image_edit_shade").css({width: bW, height: bH, "position": "absolute", "top": "-" + rT + "px", "left": "-" + rL + "px"});
                $("#image_edit_block").css({"position": "absolute", "top": tbT, "left": tbL});
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

        function toggleImageBox() {
            $(".image-box").toggle();
            $("#image_edit").addClass("open");
        }

        function editProfile() {
            $(".info_edit_col1").find("input").css("width", $(".item-box-bottom").width() - $(".td-title").width() - 14);
            $(".info_edit_col2").find("textarea").css("width", $(".item-box-bottom").width());
            $("[class^='info_read']").hide();
            $("[class^='info_edit']").show();
            checkLength();
        }

        function showInforead() {
            $("[class^='info_edit']").hide();
            $("[class^='info_read']").show();
        }

        function cancelProfile() {
            showInforead();
        }

        function saveProfile() {
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
                            personInfoHeight();
                        }
                        showInforead();
                    }
                })
            }
        }

        //检查profile中description长度是否超过200，超过save失效
        function checkLength() {
            var size = $("#personDescription").val().length;
            var left = 200 - size;
            $("#desSize").html(left);
            if (left < 0) {
                $("#savebutton").attr("disabled", true);
            } else {
                $("#savebutton").attr("disabled", false);
            }
        }

        function saveCutPicture() {
            $("#uploadCutPicture").submit();
            back("imageblock");
        }
    };

    return {
        loadMarkPage: loadMarkPage,
        loadRoomPage: loadRoomPage,
        loadPersonInfoPage: loadPersonInfoPage
    };
});
