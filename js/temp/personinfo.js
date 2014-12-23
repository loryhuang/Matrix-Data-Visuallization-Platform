require.config({
    baseUrl: './js',
    paths: {
        jquery: 'lib/jquery-1.7.2.min',
        jquery_imgareaselect: 'lib/jquery.imgareaselect'
    }
});

define(['jquery','jquery_imgareaselect'],function($){
    "use strict";
    var getPersonPage = function(){
        $(".nav-right .pull-right .dropdown-menu li").click(function(){
            goPersonalPage($(this));
        })

        //获取个人页面
        function goPersonalPage(obj){
            var active = obj.find('a').html().toLowerCase();
            var userId = $("#data_form input[name='userid']").val();
            if($("#personpage").val() == null ){
                $.ajax({
                    type :"POST",
                    url:'index.php/user/get_person_page',
                    data :{
                        'active': active,
                        'uid':userId
                    },
                    complete :function(data){
                        showResult1(data);
                        activeCss(active);
                        afteronload();
                    }
                })
            }else{
                $(".right-content").hide();
                $("#personpage").show();
                activeCss(active);
            }
        }

        function showResult1(data){
            if (data.status != 200) {
                return;
            }
            var result = data.responseText;
            $(".right-content").hide();
            $(".right-wrapper").append(result);
        }

        //获取个人信息后，对该页面的元素进行方法绑定
        function afteronload(){
            personInfoHeight();
            headPortrait();
            $("#personpage .nav-pills li").click(function(){
                goPersonalPage($(this));
            })
            $("#personpage #person_profile p a").click(function(){
                var button = $(this).html().toLowerCase();
                if(button == "edit"){editprofile()};
                if(button == "cancel"){cancelprofile()};
                if(button == "save"){saveprofile()};
            })
            $("#personDescription").keyup(function(){checklength();})
            $(".toggle_image_edit").click(function(){toggleimagebox();})
            $("#uploadAction").click(function(){$("#uploadPicture").click();});
            $("#removeHeadPortrait").click(function(){removePicture();})
            $("#uploadPicture").change(function(){uploadPicture();});
            $("#personpage>.close-back").click(function(){back("personpage")})
            $("#image_edit_block >.close-back").click(function(){back("imageblock");})
            $("#image_edit_block a").click(function(){
                var action = $(this).html().toLowerCase();
                if(action == "save"){saveCutPicture();}
                if(action == "cancel"){back("imageblock");}
            })
            $("#showCutArea").click(function(){toggleimagebox(); showimageblock();});

            //room访问
            $("#personpage .visit_room").each(function(){
                $(this).click(function(){
                    var room_hash = $(this).parent().find($(".room_hash")).val();
                    //等待shoushou。。。
                    social.loadRoomPage("enter",room_hash);
                })
            })
            //heatmap,room删除绑定
            $("#personpage .item-box-bottom").each(function(){
                $(this).hover(
                      function(){
                          $(this).find($(".delete_heatmap")).css("display","inline");
                          $(this).find($(".delete_room")).css("display","inline");
                      },
                      function(){
                          $(this).find($(".delete_heatmap")).css("display","none");
                          $(this).find($(".delete_room")).css("display","none");
                      }
                )
            })
            $("#personpage .delete_heatmap").each(function(){
                $(this).click(function(){
                    var r=confirm("Are you sure delete this heatmap?");
                    if (r==true){
                        var obj = $(this);
                        var heatmap_id = $(this).parent().find($(".delete_id")).val();
                        $.ajax({
                            type:"POST",
                            url:"index.php/user/delete_heatmap",
                            data:{
                                "heatmapId":heatmap_id
                            },
                            complete: function(data){
                                var result = data.responseText;
                                if(result == "1"){
                                    alert("delete success");
                                    obj.parent().parent().remove();
                                }
                                if(result == "0"){
                                    alert("delete failed");
                                }
                            }
                        })
                    }
                })
            })
            $("#personpage .delete_room").each(function(){
                $(this).click(function(){
                    var r=confirm("Are you sure delete this room?");
                    if (r==true){
                        var obj = $(this);
                        var room_id = $(this).parent().find($(".delete_id")).val();
                        $.ajax({
                            type:"POST",
                            url:"index.php/user/delete_room",
                            data:{
                                "roomId":room_id
                            },
                            complete: function(data){
                                var result = data.responseText;
                                if(result == "1"){
                                    alert("delete success");
                                    obj.parent().parent().remove();
                                }
                                if(result == "0"){
                                    alert("delete failed");
                                }
                            }
                        })
                    }
                })
            });
        }

        function activeCss(active){
            $("#personpage").find($(".nav-pills")).find("li").each(function(){
                $(this).removeClass("active");
                var type = $(this).find("a").html().toLowerCase();
                if(type == active) {
                    $(this).addClass("active");
                }
            })
            $(".person-type").hide();
            $("#person_"+active).show();
        }

        //根据其他元素的高度，调整person_page页面中profile,heatmap,以及room中内容列表区域的高度
        function personInfoHeight(){
            var height = ($(window).height()<768) ? 768 : $(window).height();
//            var height1 = height-360;
//            $(".auto-flow-heatmap").css('height',height1);
//            var height2 = (height-300)/2;
//            $(".room-type").css('height',height2);
//            var height3 = height2-90;
//            $(".auto-flow-room").css('height',height3);
        }

        //头像修改及其弹出框相关方法
        function headPortrait(){
            $("#head_portrait").hover(
                function(){$("#portrait_shade").css('display', 'inline');$("#image_edit").css("display","inline");},
                function(){$("#portrait_shade").css('display', 'none');$("#image_edit").css("display","none");}
            )
            $("#image_edit ul").click(function(e){
                e = e || window.event;
                if(window.event){e.cancelBubble = true;}
                else {e.stopPropagation();}
            })
            document.body.onclick = function(e){
                e = e || window.event;
                var target = e.target || e.srcElement;
                if(target.parentNode.id === "image_edit") return;
                $("#image_edit").removeClass("open");
                $(".image-box").hide();
            };
        }

        //截取头像预览
        function preview(img, selection){
            $('#crop_left').val(selection.x1);
            $('#crop_top').val(selection.y1);
            $('#crop_width').val(selection.width);
            $('#crop_height').val(selection.height);
        }

        //截取头像
        function personpageonload(){
            if($("#image_edit_shade").css("display") == "block"){
                $('#uncutPicture').imgAreaSelect({
                    aspectRatio: '1:1',
                    x1: 100, y1: 100, x2: 200, y2: 200,
                    minHeight: 100,
                    minWidth: 100,
                    handles: true ,
                    zIndex:4000,
                    onSelectChange: preview
                });
            }
        }

        function back(source){
            if(source == "imageblock"){
                $("#image_edit_shade").hide();
                $("#image_edit_block").hide();
                $("#uploadPicture").val("");
                $("[class^='imgareaselect']").hide();
            } else{
                $("#personpage").remove();
                $(".right-wrapper .right-content").last().show();
            }
        }

        function uploadPicture(){
            if(checkFile()){
                $("#pictureForm").submit();
            }
        }

        function removePicture(){
            var big_headshot = $(".head_portrait_big").attr("src");
            $.ajax({
                type: "POST",
                url: 'index.php/user/remove_person_headshot',
                data:{
                    'bigpic_url': big_headshot
                },
                complete: function(data){
                    var result = data.responseText;
                    if(result =="1"){
                        alert("remove success.");
                        $(".head_portrait_big").attr("src","./resource/image/user/big/big100.jpg");
                        $(".head_portrait_middle").attr("src","./resource/image/user/middle/middle50.jpg");
                        $(".head_portrait_small").attr("src","./resource/image/user/small/small30.jpg");
                    }else{
                        alert("remove failed.");
                    }
                    toggleimagebox();
                }
            })
        }

        function checkFile(){
            var extensions = 'jpg,jpeg,gif,png';
            var path = $("#uploadPicture").val();
            var ext = getExt(path);
            var re = new RegExp("(^|\\s|,)" + ext + "($|\\s|,)", "ig");
            if(extensions != '' && (re.exec(extensions) == null || ext == '')) {
                alert("sorry, only jpg,jpeg,gif,png  are allowed ")
                return false;
            }
            return true;
        }

        function getExt(path) {
            return path.lastIndexOf('.') == -1 ? '' : path.substr(path.lastIndexOf('.') + 1, path.length).toLowerCase();
        }

        function showimageblock(){
            initblocksize("show");
            personpageonload();
            $(window).resize(function(){
                initblocksize("resize");
                personpageonload();
            });
        }

        function initblocksize(type){
            var bH=$("body").height();
            var bW=$("body").width();
            var rT = $(".navbar-inner").height();
            var rL = bW - $(".right-wrapper").width();
            var objWH=getObjWh("#image_edit_block");
            var tbT=objWH.split("|")[0];
            var tbL=objWH.split("|")[1];
            tbT = (tbT - rT)+"px";
            tbL = (tbL - rL)+"px";
            if(type=="show"){
                $("#image_edit_shade").css({"display":"block",width:bW,height:bH,"position":"absolute","top":"-"+rT+"px","left":"-"+rL+"px"});
                $("#image_edit_block").css({"display":"block","position":"absolute","top":tbT,"left":tbL});
            }
            if(type=="resize"){
                $("#image_edit_shade").css({width:bW,height:bH,"position":"absolute","top":"-"+rT+"px","left":"-"+rL+"px"});
                $("#image_edit_block").css({"position":"absolute","top":tbT,"left":tbL});
            }


        }

        function getObjWh(obj){
            //兼容chrome浏览器对document.documentElement.scrollTop以及document.documentElement.scrollLeft的识别误差
            var st;
            var sl;
            if(typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat' && navigator.userAgent.indexOf("Chrome") == -1 ) {
                st = $('html').scrollTop();
                sl = $('html').scrollLeft();
            }
            else if (typeof document.body != 'undefined') {
                st = document.body.scrollTop;
                sl = document.body.scrollLeft;
            }
            var ch=$(window).height();
            var cw=$(window).width();
            var objH=$(obj).height();
            var objW=$(obj).width();
            var objT=Math.round(st+(ch-objH)/2);
            var objL=Math.round(sl+(cw-objW)/2);
            return objT+"|"+objL;
        }

        function toggleimagebox(){
            $(".image-box").toggle();
            $("#image_edit").addClass("open");
        }

        function editprofile(){
            $(".info_edit_col1").find("input").css("width",$(".item-box-bottom").width()-$(".td-title").width()-14);
//            $(".info_edit_col2").find("textarea").css("width",$(".item-box-bottom").width()-14);
            $("[class^='info_read']").hide();
            $("[class^='info_edit']").show();
            checklength();
        }

        function showinforead(){
            $("[class^='info_edit']").hide();
            $("[class^='info_read']").show();
        }

        function cancelprofile(){
            showinforead();
        }

        function saveprofile(){
            if(!$("#savebutton").attr("disabled")){
                var userId = $("#data_form input[name='userid']").val();
                var personName = $("#personName").val();
                var personEmail = $("#personEmail").val();
                var personCompany = $("#personCompany").val();
                var personDescription = $("#personDescription").val();
                personDescription = document.getElementById("personDescription").value.replace(/[\n]/i, '<br/>');
                alert(personDescription);
                $.ajax({
                    type :"POST",
                    url:'index.php/user/update_person_info',
                    data :{
                        'uid': userId,
                        'nickname':personName,
                        'email':personEmail,
                        'company':personCompany,
                        'description':personDescription
                    },
                    complete :function(data){
                        var result = data.responseText;
                        if(result =="1"){
                            $(".personName_read").html(personName);
                            $(".personEmail_read").html(personEmail);
                            $(".personCompany_read").html(personCompany);
                            $(".personDescription_read").html(personDescription);
                        }
                        showinforead();
                    }
                })
            }
        }

        //检查profile中description长度是否超过200，超过save失效
        function checklength(){
            var size = $("#personDescription").val().length;
            var left = 200 - size;
            $("#desSize").html(left);
            if(left < 0){
                $("#savebutton").attr("disabled",true);
            }else{
                $("#savebutton").attr("disabled",false);
            }
        }

        function saveCutPicture(){
           $("#uploadCutPicture").submit();
           back("imageblock");
        }

    }
    return {
        getPersonPage: getPersonPage
    };
});