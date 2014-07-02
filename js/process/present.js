require.config({
    baseUrl: './js',
    paths: {
        jquery: 'lib/jquery-1.7.2.min',
        jquery_zclip: 'lib/jquery.zclip.min',
        mootools: 'lib/mootools-core-1.3.2-full-nocompat',
        mootools_more: 'lib/mootools-more-1.3.2.1',
        protocols: 'lib/protocols',
        iipmooviewer: 'lib/iipmooviewer-2.0',
        iipmooviewer_extends: 'lib/extends/iipmooviewer.extends',
        raphael: 'lib/raphael',
        underscore: 'lib/underscore-min',
        bootstrap: 'lib/bootstrap-dropdown'
    },
    shim: {
        "mootools_more": {
            deps: ["mootools"],
            exports: "mootools_more"
        },
        "protocols": {
            deps: ["mootools"],
            exports: "protocols"
        },
        "iipmooviewer": {
            deps: ["mootools", "mootools_more", "protocols", "raphael"],
            exports: "iipmooviewer"
        },
        "bootstrap": {
            deps: ["jquery"],
            exports: "bootstrap"
        },
        "jquery_zclip": {
            deps: ["jquery"]
        },
        "underscore": {
            exports: "_"
        }
    }
});

define([
    'jquery',
    'util/Constant',
    'util/Cache',
    'underscore',
    'jquery_zclip',
    'iipmooviewer',
    'iipmooviewer_extends',
    'bootstrap'
    ], function($, Const, Cache, _ ) {

        "use strict";
        var publicData = {};
        
        var loadPage = function (){
            $(function(){
                //定义初始条件的大小
                var height = $(window).height() - 60;
                //var min_height = height - 315;
                $(".right-wrapper").css('height', height);
                $(".left-wrapper").css('height', height);

                $("#userInfo").show();
                $("#view_container").show();
                $('.navbuttons').parent().show();

                var hm_title = $("#data_form input[name='heatmap_title']").val();
                var hm_desc = $("#data_form input[name='heatmap_description']").val();
                var hm_size = $("#data_form input[name='heatmap_size']").val();
                var hm_creater = $("#data_form input[name='heatmap_creator']").val();
                var hm_time = $("#data_form input[name='create_time']").val();
                
                setTimeout(function(){
                    $('#info_title p').append(hm_title);
                    $('#info_desc p').append(hm_desc);
                    $('#info_size p').append(hm_size);
                    $('#info_creater p').append(hm_creater);
                    $('#info_time p').append(hm_time);                    
                },1000);
            });
        };

        var getImage = function() {
            $(function() {   
              //根据产生的数据，创建IIP IMAGE   
              var makeIIPImage = function(){
                     var iipmooviewer = new IIPMooViewer("viewer", {
                            image: publicData.imageUrl,
                            server: Const.IIPSERVER_URL,
                            credit: Const.IIPSERVER_CREDIT,
                            prefix: "/HM_S/images/",
                            scale: 20.0,
                            viewport: {
                                resolution: 0,
                                rotation: 0
                            },
                            showNavWindow: true,
                            showNavButtons: true,
                            winResize: true,
                            protocol: 'iip'
                    });
                    loadPage();
                 };

                // 存储文件名与图片的映射关系  
                var storeImagesRefer = function() {
                    $.ajax({
                        type: 'GET',
                        url: Const.URL_LOG_IMAGE,
                        dataType: 'text',
                        //jsonp: 'callback',
                        data: {
                            fileid: $("input[name='fileid']").val(),
                            imagename: publicData.imageName
                            //imagename: publicData.imageName.substring(0, publicData.imageName.lastIndexOf("."))
                        },
                        //async: false,
                        success: function(data) {
                            if (data == '0') {
                                makeIIPImage();
                                console.log('log image success!');
                            }
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                                console.log(XMLHttpRequest + ' | ' + textStatus + ' | ' + errorThrown);
                                alert("Failed to save the file to database!");
                                window.location.href = "index.php/sga/heatmap_index";
                        }
                    });
                };


                //transfer the image format and apply the iipmooviewer
                var transPng2Tiff = function() {
                    $.ajax({
                        type: 'GET',
                        url: Const.URL_TRANS_PNG_TIFF,
                        dataType: Const.AJAX_DATA_TYPE,
                        jsonp: 'callback',
                        data: {
                            name: publicData.imageFullName 
                        },
                        //async: false,
                        success: function(status) {
                            $('#pageLoading').hide();
                            $('#view_container').show();
                            if (status != 0) {
                                alert("image format transfer error!");
                                window.location.href = "index.php/sga/heatmap_index";
                            } else {
                                console.log("image format transfer success !");   
                            }
                            storeImagesRefer();
                            //makeIIPImage();
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                                console.log(XMLHttpRequest + ' | ' + textStatus + ' | ' + errorThrown);
                                alert("Failed to transfer the image format from png to tiff!");
                                window.location.href = "index.php/sga/heatmap_index";
                        }
                    });
                };


               //用R来生成图片
               var rMakeImage = function(calculateUrl){
                    $.ajax({
                        type: 'GET',
                        url: calculateUrl,
                        dataType: Const.AJAX_DATA_TYPE,
                        jsonp: 'callback',
                        data: {
                            matrixUrl: publicData.fileName,
                            color: publicData.colorType,
                            cluster_type:publicData.clusterType
                        },
                        //async: false,
                        success: function(data) {
                            var imageUrl = data.image_path;
                            //带后缀的文件名
                            publicData.imageFullName = imageUrl.substr(imageUrl.lastIndexOf("/") + 1);
                            //文件路径
                            publicData.imageUrl = '/var/www/HM_S/data/' + publicData.imageFullName.replace("png", "tif");
                            //不带后缀文件名
                            publicData.imageName = publicData.imageFullName.substring(0, publicData.imageFullName.lastIndexOf("."));

                            var row_genes = data.row_names;
                            //row_genes.reverse();
                            publicData.rows = row_genes.join(" ");
                            Cache.putData('row_num', row_genes.length);

                            var col_genes = data.col_names;
                            publicData.cols = col_genes.join(" ");
                            Cache.putData('col_num', col_genes.length);

                            transPng2Tiff();
                            //storeImagesRefer();

                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            console.log(XMLHttpRequest + ' | ' + textStatus + ' | ' + errorThrown);
                            alert("R create image error!");
                            window.location.href = "index.php/sga/heatmap_index";
                        }
                    });   
                };

                //将CDT文件解析为txt文件
                var parseCdt = function (matrix_name){    
                    var SIGNAL = true;
                    //transform cdt to txt
                    $.ajax({
                        type: 'GET',
                        url: Const.URL_R_PARSE_CDT,
                        dataType: Const.AJAX_DATA_TYPE,
                        jsonp: 'callback',
                        data: {
                            matrixUrl: publicData.fileName,
                            matrixName: matrix_name
                        },
                        //async: false,
                        success: function() {
                            console.log(" cdt parse success !");
                            //update to database        
                            $.ajax({
                                type: 'GET',
                                url: Const.URL_UPDATE_CDT,
                                dataType: Const.AJAX_DATA_TYPE,
                                jsonp: 'callback',
                                data: {
                                    fileId: publicData.fileId ,
                                    fileName:matrix_name + '.txt'
                                },
                                //async: false,
                                success: function() {
                                    console.log("cdt filename update success");
                                    publicData.fileName = matrix_name + '.txt';

                                    // When success ,Use R create image
                                    var calculateUrl = Const.URL_NO_CLUSTER;
                                    rMakeImage(calculateUrl);
                                },
                                error: function(XMLHttpRequest, textStatus, errorThrown) {
                                    console.log(XMLHttpRequest + ' | ' + textStatus + ' | ' + errorThrown);
                                    alert("cdt filename update error!");
                                    window.location.href = "index.php/sga/heatmap_index";
                                }
                            });                                         
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            console.log(XMLHttpRequest + ' | ' + textStatus + ' | ' + errorThrown);
                            alert("can not parse the cdt file ,please check the file format");
                            window.location.href = "index.php/sga/heatmap_index";
                        }
                    });
                    
                };
     
                //获取图片文件对应的行列基因
                var getGeneItems = function() {
                    var cluster_file_name = "cluster_" + publicData.fileName;
                    $.ajax({
                        type: 'GET',
                        url: Const.URL_GET_GENE,
                        dataType: Const.AJAX_DATA_TYPE,
                        jsonp: 'callback',
                        data: {
                            filename: cluster_file_name
                        },
                        async: true,
                        success: function(data) {
                            var rows = data.rows;
                            var rows_array = [];
                            $.each(rows, function(i, e) {
                                var gene_array = e.split("\"");
                                var gene = gene_array[1];
                                rows_array.push(gene);
                            });

                            publicData.rows = rows_array.join(' ');
                            Cache.putData('row_num', data.rows.length);
                            console.log("data rows length : " + data.rows.length);
                            var cols = data.cols;
                            var cols_array = [];

                            $.each(cols, function(i, e) {
                                var gene_array = e.split("\"");
                                var gene = gene_array[1];
                                cols_array.push(gene);
                            });

                            publicData.cols = cols_array.join(' ');
                            Cache.putData('col_num', data.cols.length);
                            console.log("data cols length : " + data.cols.length);

                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            console.log(XMLHttpRequest + ' | ' + textStatus + ' | ' + errorThrown);
                        }
                    });
                };
     
               publicData.fileId = $("#data_form input[name='fileid']").val();        //文件ID
               publicData.fileName = $("#data_form input[name='filename']").val();    //文件名
               publicData.userId = $("#data_form input[name='userid']").val();        //登陆用户ID
               publicData.userName = $("#data_form input[name='username']").val();    //登陆用户名
               publicData.creatorId = $("#data_form input[name='creator_id']").val();    //创建者ID
               publicData.creatorName = $("#data_form input[name='heatmap_creator']").val(); //创建者用户名
               publicData.imageName = $("#data_form input[name='imagename']").val();    //图片名
               publicData.colorType = $("#data_form input[name='color_type']").val();   //R 颜色参数
               publicData.clusterType = $("#data_form input[name='cluster_type']").val(); //R cluster参数
               publicData.imageZoom = $("#data_form input[name='heatmap_zoom']").val(); //图像相比原始2px放大的倍数

               Cache.putData("imageZoom",publicData.imageZoom);

               //初始化
               $('#view_container').hide();
               $('#pageLoading').show();
               Cache.putData('imagick', 0); //设置为不可执行选择区域操作
               Cache.putData("hasRegion", false);
               Cache.putData("addStatus",false);
               Cache.putData("isLogin",1);

              if (publicData.imageName == "") {
                   //初次进入，用R生成图片
                    var type = publicData.fileName.substr(-3);
                    var matrix_name = publicData.fileName.substr(0,publicData.fileName.length - 4);
                    var calculateUrl;
                    if(type == "cdt"){    
                        //解析CDT文件,调用R生成图片
                        parseCdt(matrix_name);  
                    }else{
                        calculateUrl = Const.URL_R_RECLUSTER;
                        //R生成图片
                        rMakeImage(calculateUrl);
                    } 
                } else {
                    //否则直接取图片        
                    $('#pageLoading').hide();
                    $('#view_container').show();
                    publicData.imageUrl = '/var/www/HM_S/data/' + publicData.imageName + '.tif';     
                    makeIIPImage(); 
                    //获取图像对应的行名与列名（基因)
                    getGeneItems();
                    setTimeout(function(){
                        getMarks('all');
                    },50);
                }
                /*
                //定义初始条件的大小
                var height = $(window).height() - 60;
                //var min_height = height - 315;
                $(".right-wrapper").css('height', height);
                $(".left-wrapper").css('height', height);
                */
                //loadPage();

            });
        };


        var showImage = function() {
            // $(".auto-flow").css({
            //      'height': min_height,
            //      'overflow-y': 'scroll'
            // });

            //Calculate position of pop-up box AND show pop-ups
            function popupBox(obj) {
                var top = ($(window).height() - obj.height()) / 2 - 30;
                var left = ($(window).width() - obj.width()) / 2 - 100;
                obj.css({
                    'left': left, 
                    'top': top
                });
                $("#shade").height($("body").height()).show();
                $(obj).show();
            };

            //send email to File owner
            function sendEmail(file_id,email,mark_title){
                $.ajax({
                    type: 'POST',
                    url: Const.URL_SEND_MAIL,
                    //dataType: 'json',
                    //jsonp: 'callback',
                    data: {
                        file_id: file_id,
                        email: email,
                        title:mark_title
                    },
                    async: true,
                    success: function(data) {
                        console.log(data);
                        console.log("success");
                    },
                    error:function(a,b,c){
                        console.log(a + "--" + b +"--"+ c);                    }
                });
            }
            
            //disable context menu
            $(".canvas,.region,.mark-box,.mark").on("contextmenu", function(evt) {evt.preventDefault();});

            //Alert Box
            $(".alert_tips_btn").click(function(){
                $(this).parents(".box").hide();
                $("#shade").hide();
            });

            //Share Link
            $(".share_link").zclip({
                path:'./js/lib/extends/ZeroClipboard.swf',
                copy:function(){
                    var host = window.location.href;
                    var url = host.replace("file_present","birds_view"); 
                    $(this).attr("url",url);
                    return url;
                },
                beforeCopy:function(){
                    
                },
                afterCopy:function(e){
                    var tips = "the shared link : <b>"+ $(this).attr("url") + "</b>  has been copied to your Clipboard!" ;
                    $("#alert_box").find("p").html(tips);
                    popupBox($("#alert_box"));
                }
            });

            //Save data to dropbox
            $(".save_dropbox").live('click',function(){

                var imagename = publicData.imageName;
                var image_path = Const.DATA_PATH_URL + imagename + ".png";
                var data_path = Const.DATA_PATH_URL + "cluster_"+publicData.fileName;
                var image_saved_name = publicData.creatorName + "_datafile_"+ publicData.fileId + "_ image.png";
                var data_saved_name = publicData.creatorName + "_datafile_"+ publicData.fileId + "_data.txt";
                var options = {
                    files: [
                        // You can specify up to 100 files.
                        {'url': data_path, 'filename': data_saved_name},
                        {'url': image_path, 'filename': image_saved_name},
                    ],

                    // Success is called once all files have been successfully added to the user's
                    // Dropbox, although they may not have synced to the user's devices yet.
                    success: function () {
                        console.log("save data and image success !");
                    },
                    // Progress is called periodically to update the application on the progress
                    // of the user's downloads. The value passed to this callback is a float
                    // between 0 and 1. The progress callback is guaranteed to be called at least
                    // once with the value 1.
                    progress: function (progress) {},
                    cancel: function () {},
                    error: function (errorMessage) {
                        alert("save to dropbox failed , " + errorMessage);
                    }
                };
                Dropbox.save(options);
            });


            //增加选择区域
            $('.addRegionBtn').live('click', function() {  
                var mark_box = $(this).parent().parent().parent();
                mark_box.hide();
                
                // 把当前区域坐标存入缓存
                Cache.putData("addStatus",true);
                Cache.putData("prePos",$(this).parent().attr("d"));
                
                $('#RegionBtn').trigger('click');
            });

            //限制title和description的输入
            $('input[name="title"]').live('keydown',function(event){
                var str = $(this).val();
                if(str.length > 30){
                    $(this).val(str.substr(0,30));
                    return false;
                }
            });

            $('textarea[name="description"]').live('keydown',function(){
                var str = $(this).val();
                if(str.length > 200){
                    $(this).val(str.substr(0,200));
                    return false;
                }
            });


            //添加pin 或者 region标注，pin保存标题及描述,region 保存位置
            $('.saveMarkBtn').live('click', function() {
                var _this = this;
                //获取mark-box对象
                var mark_box = $(this).parents(".mark-box");
                //获取类型，0为pin，1为region
                var type = mark_box.attr('type');

                //取得标注目标
                var mark = null,w = 0, h = 0;
                if (type == 0) {
                    mark = mark_box.prev('.pin');
                    var nav_pin_html = '<div class="nav_pin mine"></div>';
                    $('.navwin').append(nav_pin_html);
                    $('.nav_pin').last().css({
                        left:$('.navwin').width() * mark.attr('l_r') ,
                        top:$('.navwin').height() * mark.attr('t_r')
                    });
                     var title = mark_box.find('#mark_title').val();
                     var description = mark_box.find('#mark_description').val();

                } else if (type == 1) {
                    mark = mark_box.prev('.region');
                    w = mark.attr('w_r');
                    h = mark.attr('h_r');
                    var title = "";
                    var description = "";
                }

                //获取用户输入
                if(Cache.getData("isLogin") == 0){//未登录用户
                    var userid =  0;
                    var email = mark_box.find('#mark_email').val();
                    var reg=/^([a-zA-Z0-9]+[_|-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|-|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,3}$/gi;
                    if(!reg.test(email)){
                        alert("Your email is not right !");
                        return;
                    }
                    var username = email ;
                    mark_box.addClass("guest-mark-box");
                }else{ //登陆用户
                    var userid = $("input[name='userid']").val();
                    var username = $("input[name='username']").val() ;
                }
 
                //检查pin的输入情况是否正确
                if (type == 0){
                    if ($.trim(title) == '' || $.trim(description) == '') {
                        alert('No contents!');
                        return;
                    } else if (title.indexOf('@') >= 0 || title.indexOf('#') >= 0 || title.indexOf('<script>') >= 0) {
                        alert('Your input has Illegal character');
                        return;
                    }else if(description.indexOf('<script>') >= 0 || description.indexOf('#') >= 0 ){
                        alert('Your input has Illegal character');
                        return;
                    }
                    
                    var delMarkbtn = '<p class="delMarkbtn"><a class="btn btn-link">delete</a></p>';

                    //设置title
                    mark.attr('title', title);
               
                    //DOM 操作
                    var mark_html =
                    '<input type="hidden" class="markid" value=""/>' +
                    '<input type="hidden" class="creator_id" value="'+ userid +'"/>' +
                    //'<input type="hidden" class="roomid" value="' + room_id + '"/>' +
                    '<div class="row offset15"><p class="title">' + title + '</p>'+ delMarkbtn +'<p class="description">' + description + '</p></div>' +
                    //'<div class="basic-info"><a href="javascript:void(0)" class="row pull-left"><img src="' + Const.BASE_URL + headshot + '"/></a>' +
                    '<div class="row-fluid"><p><a>' + username + '</a></p><p class="mark_time">just added</p></div>' +
                    '</div>' ;//+
                    //'<p class="to-comment operate-btn"><b class="icon-comment"></b>0<em>comment</em></p>' +
                    //'<p class="to-collect operate-btn"><b class="icon-collect"></b>&nbsp;<em>collect</em></p>' +
                    //'<p class="to-at operate-btn"><b class="icon-at" title="Quote this to room-chat"></b>&nbsp;<em>add to chat</em></p>';
                    mark_box.empty();
                    mark_box.append(mark_html);

                }else if(type == 1 ){

                }
                
                mark_box.attr('type', type);
                mark_box.attr('l_r', mark.attr('l_r'));
                mark_box.attr('t_r', mark.attr('t_r'));
                mark_box.attr('w_r', w);
                mark_box.attr('h_r', h);

                if(Cache.getData("isLogin") == 0){
                   //未登录用户还要保存邮箱
                    description += "#" + username ;
                }

                var markInfo = {
                    creator_id: userid,
                    datafile_id: $("input[name='fileid']").val(),
                    title: title,
                    description: description,
                    x: mark.attr('l_r'),
                    y: mark.attr('t_r'),
                    w: w,
                    h: h,
                    type: type,
                    room_id: 0
                };

                //Database操作
                $.ajax({
                    type: 'GET',
                    url: Const.URL_ADD_MARK,
                    dataType: 'text',
                    //jsonp: 'callback',
                    data: markInfo,
                    async: false,
                    success: function(data) {
                        markInfo.mark_id = data;
                        if (markInfo.mark_id == 0) {
                            alert("the title already exists!");
                            mark_box.remove();
                            mark.remove();
                        }
                        else if(markInfo.mark_id == '#'){
                            alert("Don't input # in title!");
                            mark_box.remove();
                            mark.remove();
                        }
                        //设置mark的id
                        else {
                            mark.attr('id', data);
                            mark_box.attr('id', 'mark_box_' + data);
                            mark_box.find('.markid').val(data);
                            //mark_box.slideUp('slow');
                            
                            //改变按钮的文字和类型
                            if(type == 1){
                               $(_this).addClass("cancelMarkBtn").removeClass(".saveMarkBtn").text("Cancel").attr("title","click to hide this region ");
                            }

                            if(Cache.getData("isLogin") == 0){
                                //未登录用户,通过服务器给作者发送邮件
                                sendEmail(publicData.fileId,email,title);
                                //未登录用户,将email保存在cookie中，标示身份
                                cookieFunc().setCookie("email",email);

                            }
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        mark_box.remove();
                        mark.remove();
                        $('.nav_pin').last().remove();
                        alert(XMLHttpRequest + ' | ' + textStatus + ' | ' + errorThrown);
                    }
                });

            });

            //点击按钮删除region
            $(".region_close_icon").live("click",function(){
                var mark_id = $(this).parent().attr("id");
                if(mark_id === undefined ){
                    $(this).parent().next(".mark-box").remove();
                    $(this).parent().remove();
                }else{
                    $("#conform_box").attr("mark_id", mark_id);
                    $("#del_type").text("region");
                    $("#del_mark_name").text("");
                    popupBox($("#conform_box"));
                } 
            });
            

            //删除mark (pin)
            $(".delMarkbtn").live("click",function(){
                    
                var mark_box = $(this).parents(".mark-box");
                var mark_id = mark_box.find(".markid").val();
                var mark_title = mark_box.find(".title").text();
                $("#del_type").text("mark");
                $("#del_mark_name").text(mark_title);
                $("#conform_box").attr("mark_id", mark_id);
                popupBox($("#conform_box"));

                /*
                var conformation = confirm("Are you sure to delete this mark ?");
                if(conformation){
                    var mark_box = $(this).parents(".mark-box");
                    var mark_id = mark_box.find(".markid").val();
                    //Database操作
                    $.ajax({
                        type: 'GET',
                        url: Const.URL_DEL_MARK,
                        dataType: 'text',
                        //jsonp: 'callback',
                        data: {
                            id : mark_id
                        },
                        async: false,
                        success: function() {
                            mark_box.prev(".mark").remove();
                            mark_box.remove();
                        }
                    });
                }*/

            });

             //delete mark
            $(".del_conform_btn").click(function(){
                var mark_id = $("#conform_box").attr("mark_id");
                $.ajax({
                    type: 'GET',
                    url: Const.URL_DEL_MARK,
                    dataType: 'text',
                    //jsonp: 'callback',
                    data: {
                        id : mark_id
                    },
                    async: false,
                    success: function() {
                        $("#" + mark_id).remove();
                        $("#mark_box_" + mark_id).remove();
                        $("#conform_box,#shade").hide();
                    }
                });
                
           });
           
            //cancel delete
            $(".del_cancel_btn").click(function(){
                $("#conform_box,#shade").hide();
            });

            //close box
            $(".close_tag").click(function(){
                $(this).parents(".box").hide();
                $("#shade").hide();
            });

            //取消选择区域
            $('.cancelMarkBtn').live('click', function() {
                //获取类型，0 为pin，1 为reiogn
                var mark;
                var mark_box = $(this).parents(".mark-box");
                var type = mark_box.attr('type');
                if (type == 0) {
                    mark = mark_box.prev('.pin');
                } else if (type == 1) {  
                    mark = mark_box.prev('.region');
                }
                mark.remove();
                mark_box.remove();
            });

            //鼠标点击pin显示mark-box
            $('.pin').live('click', function() {
                var editStatus = $("#viewer").find(".saveMarkBtn").length;
                if (editStatus > 0) {
                    return; //尚未保存信息，点击无反应
                }
                var obj = $(this).next('.mark-box');
                if (obj.css('display') == 'none') {
                    $('.mark-box').hide();
                    obj.show();
                    adjustMarkboxPos(obj);
                } else {
                    obj.hide();
                }
            });

            //鼠标点击region显示mark-box
            $('.region').live('click', function() {
                if (Cache.getData('pin_status') == 'active') {
                    return;
                }
                var obj = $(this).next('.mark-box');
                if (obj.find('.saveMarkBtn').length > 0) {
                    return; //尚未保存信息，点击无反应
                }
                if (obj.css('display') == 'none') {
                    $('.mark-box').hide();
                    obj.show();
                    adjustMarkboxPos(obj);
                } else {
                    obj.hide();
                }
            });

            //Region 删除按钮的显示和隐藏
            $('.region').live("mouseover",function(){
                $(this).find(".region_close_icon").show();
            });

            $('.region').live("mouseout",function(){
                $(this).find(".region_close_icon").hide();
            });

            //点击区域外，mark-box隐藏
            $('.canvas').live('click', function() {
                if ($('#viewer').find('.saveMarkBtn').length > 0) {
                    return; //尚未保存信息，点击无反应
                }
                if (Cache.getData('onDrag') == 1) {
                    Cache.putData('onDrag', 0);
                    return; //拖拽，mark-box无反应
                }
                $('.mark-box').hide();
                //$('#find_box').hide();
                //$('FindBtn').removeClass('active');
            });

            //调整mark-box的位置
            function adjustMarkboxPos(obj) {
                var l = obj.width() + parseInt(obj.css('left'));
                //var t = obj.height() + parseInt(obj.css('top')) + 12;
                var t = obj.height() + parseInt(obj.css('top'));
                var width = $('#viewer').width();
                var height = $('#viewer').height();
                if (l > width) {
                    var offset_left = width - obj.width() - 5;
                    obj.css('left', offset_left);
                };
                if (t > height) {
                    var offset_top = height - obj.height() - 5;
                    obj.css('top', offset_top);
                };
            }

            //截取图片区域放大查看
            $('.detailMarkBtn').live('click', function() {
                var region = $(this).parents(".mark-box").prev(".region");
                region.addClass("active");
                
                var _this = this ;
                //取出截取位置的坐标
                var pos = $(this).parent().attr('d');
                var x = parseInt(pos.split('_')[0]);
                var y = parseInt(pos.split('_')[1]);
                var w = parseInt(pos.split('_')[2]);
                var h = parseInt(pos.split('_')[3]);    
                //console.log(x + '_' + y + '_' + w + '_' + h);
                
                $.ajax({
                    type: 'GET',
                    url: Const.URL_IMAGICK,
                    dataType: Const.AJAX_DATA_TYPE,
                    jsonp: 'callback',
                    async: true,
                    data: {
                        x: x,
                        y: y,
                        w: w,
                        h: h,
                        user: $("input[name='username']").val(),
                       //name: (publicData.imageName.split("_"))[0] + "_r"
                        name: publicData.imageName,
                        zoom: publicData.imageZoom
                    },
                    success: function(data) {
                        region.removeClass("active");
                        
                        //存储全局参数
                        $(_this).parent().find("input[name='imagename']").val(data);
                        $(_this).parent().find("input[name='rows']").val(publicData.rows);
                        $(_this).parent().find("input[name='cols']").val(publicData.cols);
                        $(_this).parent().find("input[name='filename']").val(publicData.fileName);
                        
                        //把路径分别存在x,y,w,h中
                        $(_this).parent().find("input[name='x']").val(x);
                        $(_this).parent().find("input[name='y']").val(y);
                        $(_this).parent().find("input[name='w']").val(w);
                        $(_this).parent().find("input[name='h']").val(h);
                        
                        //定位表单地址，并提交
                        $(_this).parent().attr('action', Const.URL_SHOW_IMAGICK);
                        $(_this).parent().submit();
                    },
                    error:function(a,b,c){
                        console.log(a + "--" + b + "--" + c);
                        region.removeClass("active");
                        alert("get details error!");
                    }
                });
            });

            //截取区域重新聚类
            $('.reclustMarkBtn').live('click', function() {
                
                var region = $(this).parents(".mark-box").prev(".region");
                region.addClass("active");
                
                var _this = this ;
                
                var imageZoom = publicData.imageZoom;
                var gridSize = imageZoom * 2 ;

                //取出截取位置的坐标
                var pos = $(this).parent().attr('d');
                var x = parseInt(pos.split('_')[0]);
                var y = parseInt(pos.split('_')[1]);
                var w = parseInt(pos.split('_')[2]);
                var h = parseInt(pos.split('_')[3]);
                
                //get the gene row and col index
                var colStartIndex = Math.round(x /gridSize) - 1;
                var colLength = Math.round(w / gridSize);
                var rowStartIndex = Math.round(y / gridSize) - 1;
                var rowLength = Math.round(h / gridSize);

                var row1 = rowStartIndex;
                var row2 = rowStartIndex + rowLength;
                var col1 = colStartIndex;
                var col2 = colStartIndex + colLength;

                //重新生成图
                var cluster_matrix = "cluster_" + publicData.fileName ;
                $.ajax({
                    type: 'GET',
                    url: Const.URL_R_TESTDESC,
                    dataType: Const.AJAX_DATA_TYPE,
                    data: {
                        r1: row1,
                        r2: row2,
                        c1: col1,
                        c2: col2,
                        matrix:cluster_matrix,
                        color:publicData.colorType
                    },
                    async: true,
                    success: function(data) {
                        
                        region.removeClass("active");
                        
                        //存储文件名
                        $(_this).parent().find("input[name='filename']").val(publicData.fileName);
                        
                        //返回的row和col是错位的                 
                        $(_this).parent().find("input[name='rows']").val(data.col_names.join(' '));
                        $(_this).parent().find("input[name='cols']").val(data.row_names.join(' '));
                        
                        //把图片路径分别存在x,y,w,h中
                        $(_this).parent().find("input[name='x']").val(data.col_image);
                        $(_this).parent().find("input[name='y']").val(data.row_image);
                        $(_this).parent().find("input[name='w']").val(data.color_key);
                        $(_this).parent().find("input[name='h']").val(data.image_path);

                        //表单提交
                        $(_this).parent().attr('action', Const.URL_SHOW_RECLUST);
                        $(_this).parent().submit();   
                    },
                    error: function(a,b,c) {
                        console.log(a + "--" + b + "--" + c);
                        region.removeClass("active");
                        alert("data reclust error , you can try another area!");
                    }
                });

            });
     
            $(".mergeMarkBtn").live("click",function(){
                
                var region = $(this).parents(".mark-box").prev(".region");
                region.addClass("active");
                
                var _this = this ;
                
                //获取前一个的区域的坐标
                var prePos = $(this).parent().attr("p_d").split("_");  
                var x1 = parseInt(prePos[0]);
                var y1 = parseInt(prePos[1]);
                var w1 = parseInt(prePos[2]);
                var h1 = parseInt(prePos[3]);
                //console.log(x1 + "-" + y1 + "-" + w1 + "-" + h1); 
                
                //获取当前位置的坐标
                var curPos = $(this).parent().attr("d").split("_"); 
                var x = parseInt(curPos[0]);       
                var y = parseInt(curPos[1]);
                var w = parseInt(curPos[2]);
                var h = parseInt(curPos[3]); 
                //console.log(x + "-" + y + "-" + w + "-" + h);
                
                var imageZoom = publicData.imageZoom;
                var gridSize = imageZoom * 2 ; 

                //取得合并后坐标的四种情况
                var pos;
                if(( x + w < x1) && !((y + h < y1) ||( y1 + h1 < y ))){  
                    pos = {      
                        type :"row",
                        x1 :  x/gridSize,
                        x2 : (x + w)/gridSize,
                        x3 :  x1/gridSize,
                        x4 : (x1 + w1)/gridSize,
                        y1 :  _.max([y1/gridSize,y/gridSize]),
                        y2 :  _.min([(y + h)/gridSize,(y1 + h1)/gridSize])
                    };                   
                }else if(( y + h < y1) && !((x + w < x1) ||( x1 + w1 < x ))){
                    pos = {
                        type :"col",
                        y1 :  y/gridSize,
                        y2 : (y + h)/gridSize,
                        y3 :  y1/gridSize,
                        y4 : (y1 + h1)/gridSize,
                        x1 :  _.max([x1/gridSize,x/gridSize]),
                        x2 :  _.min([(x + w)/gridSize,(x1+w1)/gridSize])
                    };  
                }else if(( x1 + w1 < x) && !((y1 + h1 < y) ||( y + h < y1 ))){  
                    pos = {      
                        type :"row",
                        x1 :  x1/gridSize,
                        x2 : (x1 + w1)/gridSize,
                        x3 :  x/gridSize,
                        x4 : (x + w)/gridSize,
                        y1 :  _.max([y/gridSize,y1/gridSize]),
                        y2 :  _.min([(y1 + h1)/gridSize,(y + h)/gridSize])
                    };                   
                }else if(( y1 + h1 < y) && !((x1 + w1 < x) ||( x + w < x1 ))){
                    pos = {
                        type :"col",
                        y1 :  y1/gridSize,
                        y2 : (y1 + h1)/gridSize,
                        y3 :  y/gridSize,
                        y4 : (y + h)/gridSize,
                        x1 :  _.max([x/gridSize,x1/gridSize]),
                        x2 :  _.min([(x + w)/gridSize,(x1 + w1)/gridSize])
                    };  
                }else{
                    alert("region not right ,please reselect");
                    $(this).parent().parent().parent().prev('.region').remove();
                    $(this).parent().parent().parent().remove();   
                    $('#RegionBtn').trigger('click');
                    return;
                }
                
                //POS为传入的参数对象
                pos.matrix = "cluster_" + publicData.fileName;
                pos.color = publicData.colorType;
                
                //重新生成图
                $.ajax({
                    type: 'GET',
                    url: Const.URL_R_MREGE_TESTDESC,
                    dataType: Const.AJAX_DATA_TYPE,
                    data: pos,
                    async: true,
                    success: function(data) {
                        region.removeClass("active");  
                        
                        //保存文件名
                        $(_this).parent().find("input[name='filename']").val(publicData.fileName);
                        
                        //返回的row和col是错位的
                        $(_this).parent().find("input[name='rows']").val(data.col_names.join(' '));
                        $(_this).parent().find("input[name='cols']").val(data.row_names.join(' '));

                        //把图片路径分别存在x,y,w,h中
                        $(_this).parent().find("input[name='x']").val(data.col_image);
                        $(_this).parent().find("input[name='y']").val(data.row_image);
                        $(_this).parent().find("input[name='w']").val(data.color_key);
                        $(_this).parent().find("input[name='h']").val(data.image_path);

                        //表单提交
                        $(_this).parent().attr('action', Const.URL_SHOW_RECLUST);
                        $(_this).parent().submit();
                    },
                    error: function(a,b,c) {
                        console.log(a + "--" + b + "--" + c);
                        region.removeClass("active");
                        alert("Merge reclust error, you can try by reselect an area.");
                    }
                });               
            });
        };

        /**
          * 根据筛选类型获取图片标记信息
          * @param {String} type 筛选类型
        */

        var getMarks = function(type) {
            var url, user_id, limit;
            if (type == 'creater') {
                url = Const.URL_GET_CREATER_MARK;
                user_id = $("#data_form input[name='creator_id']").val();
                limit = 50;
            } else if (type == 'top') {
                url = Const.URL_GET_TOP_MARK;
                limit = 10;
            } else if (type == 'latest') {
                url = Const.URL_GET_LATEST_MARK;
                limit = 10;
            } else if (type == 'mine') {
                url = Const.URL_GET_CREATER_MARK;
                user_id = $("input[name='userid']").val();
                limit = 50;
            } else if (type == 'all') {
                url = Const.URL_GET_ALL_MARK;
                limit = 50;
            }
            $.ajax({
                type: 'POST',
                url: url,
                dataType: 'json',
                //jsonp: 'callback',
                data: {
                    user_id: user_id,
                    datafile_id: $("input[name='fileid']").val(),
                    start: 0,
                    limit: limit
                },
                async: true,
                success: function(data) {
                    //if (data == null) {
                    //    return;
                    // }
                    data = data || [];
                    var allMarkList = Cache.getData('allMarkList') || [];
                    //var mark_ids = Cache.getData('mark_ids') || [];
                    $.each(data, function(index, element) {
                        //创建标记元素及信息框
                        makeMarkInfo(element);
                        //在缓存中查找不到对应的id，则插入新的mark信息
                        if (!_.find(allMarkList, function(markInfo) {
                            return element.mark_id === markInfo.mark_id;
                        })) {
                            allMarkList.push(element);
                        }
                        //mark_ids.push(element.mark_id);
                        //allMarks.push(element);
                    });
                    //存储不同的mark对象
                     Cache.putData('allMarkList', allMarkList);
                    //Cache.putData('mark_ids', mark_ids);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest + ' | ' + textStatus + ' | ' + errorThrown);
                }
            });

        };

        //加载生成pin或region对应的图标及隐藏的信息框
        var makeMarkInfo = function(data) {
            //每个mark数据单元的字段
            var type = data.type;
            var creator_id = data.creator_id;
            var id = data.mark_id;
            var title = data.title;
            var description = data.mark_desc;

            if(creator_id == 0){ //未注册用户的mark只能显示邮箱
                var desc_array = description.split("#");
                    description = desc_array[0];
                var nickname = desc_array[1];
            }else{ //登录用户的mark可显示用户名
                var nickname = data.username;
            }

            var time = data.time;
            var l_r = data.x;
            var t_r = data.y;
            var w_r = data.w;
            var h_r = data.h;
            var room_id = data.room_id;
           
            //图片相对于窗口的偏移
            var y = parseInt($('.canvas').css('top'));
            var x = parseInt($('.canvas').css('left'));

            //图片当前的尺寸
            var width = parseInt($('.canvas').css('width'));
            var height = parseInt($('.canvas').css('height'));

            //实际偏移
            var m_left = parseInt(x + width * parseFloat(l_r));
            var m_top = parseInt(y + height * parseFloat(t_r));

            //当前的实际尺寸,只对region有效
            var m_width = parseInt(width * parseFloat(w_r));
            var m_height = parseInt(height * parseFloat(h_r));

            //生成pin或者region图标
            if (type == 0) {
                var pin_html = '<div class="pin mark"></div>';
                $('#viewer').append(pin_html);
                $('.pin').last().attr('id', id);
                $('.pin').last().attr('title', title);
                $('.pin').last().attr('l_r', l_r);
                $('.pin').last().attr('t_r', t_r);
                $('.pin').last().css({
                    left: m_left - parseInt($('.pin').width() / 2),
                    top: m_top - $('.pin').height()
                });
                m_left = m_left - 70;
                var nav_pin_html = '<div class="nav_pin" id="nav_pin_'+ id +'"></div>';
                $('.navwin').append(nav_pin_html);
                $('.nav_pin').last().css({
                    left:$('.navwin').width() * l_r,
                    top:$('.navwin').height() * t_r
                });

            } else if (type == 1 && Cache.getData("isLogin") == 1 ) {//登录用户才显示region
                //region里面加入了一个关闭按钮
                var region_html = '<div class="region mark"><div class="region_close_icon"></div></div>';
                $('#viewer').append(region_html);
                $('.region').last().attr('id', id);
                $('.region').last().attr('title', title);
                $('.region').last().attr('l_r', l_r);
                $('.region').last().attr('t_r', t_r);
                $('.region').last().attr('w_r', w_r);
                $('.region').last().attr('h_r', h_r);
                $('.region').last().css({
                    left: m_left,
                    top: m_top,
                    width: m_width,
                    height: m_height
                });
                m_top = m_top + 5;
                m_left = m_left + parseInt(m_width / 2) - 70;
            };

            //生成信息框
            if(creator_id == 0){ //未注册用户的mark设置特殊样式
                var markboxClass = "guest-mark-box mark-box";
            }else{
                var markboxClass = "mark-box";
            }

            
            var delMarkbtn;
            //只有登陆用户才可删除自己的mark，图片的主人可删除任何mark
            if(Cache.getData("isLogin") == 1 && (publicData.creatorId == publicData.userId || creator_id == publicData.userId)){
                 delMarkbtn = '<p class="delMarkbtn"><a class="btn btn-link">delete</a></p>';
            }else{
                 delMarkbtn = '';
            }
            //非登陆用户别人的mark不显示删除按钮
            if(Cache.getData("isLogin") == 0){
                 delMarkbtn = '';
            }
            //非登陆用户自己的mark显示删除按钮
            console.log(cookieFunc().getCookie("hasVisited"));
            console.log(cookieFunc().getCookie("email"));
            if(Cache.getData("isLogin") == 0 && cookieFunc().getCookie("hasVisited") == "1" && cookieFunc().getCookie("email") == nickname ){
                console.log("checked");
                delMarkbtn = '<p class="delMarkbtn"><a class="btn btn-link">delete</a></p>';
            }

            //pin的评论框
            if(type == 0){
                var desc_html = '<div class="' + markboxClass + '">' +
                '<input type="hidden" class="markid" value="' + id + '"/>' +
                '<input type="hidden" class="creator_id" value="' + creator_id + '"/>' +
                '<input type="hidden" class="roomid" value="' + room_id + '">' +
                '<div class="row offset15"><p class="title">' + title + '</p>' + delMarkbtn + '<p class="description">' + description + '</p></div>' +
                //'<div class="basic-info"><a href="javascript:void(0)" class="row pull-left"><img src="' + Const.BASE_URL + headshot + '"/></a>' +
                '<div class="row-fluid"><p><a>' + nickname + '</a></p><p class="mark_time">' + time + '</p></div>' +
                '</div>' +
                //'<p class="to-comment operate-btn"><b class="icon-comment"></b>' + comment_num + '<em>comment</em></p>' +
                //'<p class="to-collect operate-btn"><b class="icon-collect"></b>&nbsp;<em>collect</em></p>' +
                //'<p class="to-at operate-btn"><b class="icon-at" title="Quote this to room-chat"></b>&nbsp;<em>add to chat</em></p>' +
                '</div>';
            //mark的评论框
            }else if( type == 1 && Cache.getData("isLogin") == 1){
                var formClass = "matrixOrigin"; 
                var reclustBtns = '<a class="reclustMarkBtn btn btn-m btn-s offset5" href="javascript:void(0)">Reclust</a>' + 
                                  '<a class="addRegionBtn btn btn-m btn-s offset5" href="javascript:void(0)">Add</a>';
                //增加添加评论框
                var desc_html = '<div class="mark-box">' +
                '<div class="input-box">' +
                '<form class="matrixBtn ' + formClass + '" method = "POST" action="" target= "_blank">' +
                '<a class="detailMarkBtn btn btn-m btn-s offset5" href="javascript:void(0)">Details</a>' +
                reclustBtns +
                //'<a class="saveMarkBtn btn btn-m btn-s offset5" href="javascript:void(0)">Save</a>' +
                '<a class="cancelMarkBtn btn btn-m btn-s offset5" href="javascript:void(0)"> Delete </a>' +
                '<input id="x" type="hidden" name="x" value="">' +
                '<input id="y" type="hidden" name="y" value="">' +
                '<input id="w" type="hidden" name="w" value="">' +
                '<input id="h" type="hidden" name="h" value="">' +
                '<input id="imagename" type="hidden" name="imagename" value="">' +
                '<input id="filename" type="hidden" name="filename" value="">' +
                '<input id="rows" type="hidden" name="rows" value="">' +
                '<input id="cols" type="hidden" name="cols" value="">' +
                '</form>' +
                '</div>' +
                '</div>';
            }
            //信息框暂时隐藏，点击时才显示
            $('#viewer').append(desc_html);

            $('.mark-box').last().attr('type', type);
            $('.mark-box').last().attr('id', 'mark_box_' + id);
            $('.mark-box').last().attr('l_r', l_r);
            $('.mark-box').last().attr('t_r', t_r);
            $('.mark-box').last().attr('w_r', w_r);
            $('.mark-box').last().attr('h_r', h_r);
            $('.mark-box').last().css({
                left: m_left,
                top: m_top + m_height + 5
            }).hide();

            if(type == 1 && Cache.getData("isLogin") == 1){ //给region设置参数
                var col_num = Cache.getData('col_num'),
                row_num = Cache.getData('row_num');
                var imageZoom = Cache.getData("imageZoom"); 

                var initialWidth = col_num * imageZoom * 2; //原图片的大小
                var initialHeight = row_num * imageZoom * 2;

                var x = parseInt(l_r * initialWidth);
                if (x % 2 == 1) {
                    x = x - 1; //起始横坐标设定为偶数
                }
                var y = parseInt(t_r * initialHeight);
                if (y % 2 == 1) { //纵坐标设定为起始值加偶数
                    y = y - 1;
                }
                //换算成实际高度
                var w = parseInt(w_r * initialWidth);
                if (w % 2 == 1) {
                    w = w + 1; //宽度和高度都设置为偶数
                }
                var h = parseInt(h_r * initialHeight);
                if (h % 2 == 1) {
                    h = h + 1;
                }

                if(imageZoom > 1){
                    x = parseInt(x/16) * 16 ;
                    y = parseInt(y/16) * 16 ;
                    w = parseInt(w/16) * 16 ;
                    h = parseInt(h/16) * 16 ;
                }
                var d = x + '_' + y + '_' + w + '_' + h;
                $('.mark-box').last().find("form").eq(0).attr("d",d);
            }
            
        };

        //Cookie操作函数集合
        var cookieFunc = function (){
            //写入cookie
            var setCookie = function(name,value){
                   var Days = 30; //此 cookie 将被保存 30 天
                   var expdate   = new Date();
                   expdate.setTime(expdate.getTime() + Days*24*60*60*1000); 
                   document.cookie = name + "="+ escape(value) +";expire*="+ expdate.toGMTString();
            };

            //读取cookie
            var getCookie = function(name){
               var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
               if(arr != null){
                  return unescape(arr[2]); 
               }
               return null;
            };

            //删除cookie
            var delCookie = function(name){
               var exp = new Date();
               exp.setTime(exp.getTime() - 1);
               var cval = getCookie(name);
               if(cval != null) {
                    document.cookie = name +"="+cval+";expire*=" + exp.toGMTString();
               }
            };

            return {
                setCookie:setCookie,
                getCookie:getCookie,
                delCookie:delCookie
            };
        };

        //获取鸟瞰视图
        var getBirdsView = function(){
            publicData.fileId = $("input[name='fileid']").val();
            publicData.fileName = $("input[name='filename']").val();
            $('#view_container').hide();
            $('#pageLoading').show();
            Cache.putData('imagick', 0); //设置为不可执行选择区域操作
            Cache.putData("hasRegion" , false);
            Cache.putData("addStatus", false);

            //设置为未登录状态
            Cache.putData("isLogin" , 0);

            cookieFunc().setCookie("hasVisited",1);

            publicData.imageName = $("input[name='imagename']").val();
            $('#pageLoading').hide();
            $('#view_container').show();
            $('#view_container').width($('#view_container').height());
            
            publicData.imageUrl = '/var/www/HM_S/data/' + publicData.imageName + '.tif';
            var iipmooviewer = new IIPMooViewer("viewer", {
                image: publicData.imageUrl,
                server: Const.IIPSERVER_URL,
                credit: Const.IIPSERVER_CREDIT,
                prefix: "/HM_S/images/",
                scale: 20.0,
                showNavWindow: true,
                showNavButtons: true,
                viewport: {
                    resolution: 0,
                    rotation: 0
                },
                winResize: true,
                protocol: 'iip'
            });
           
            setTimeout(function(){
                $(".userIcon").hide();
                $(".navbuttons").css({
                    position: "fixed",
                    left: 20 ,
                    top: 250
                });
                $("#InfoBtn").css({
                    position: "fixed",
                    left: 10,
                    top: 20
                }).show();
                
                $("#info_box").css("top",$("#InfoBtn").css("top"));
                
                $("#PinBtn").css({
                    position: "fixed",
                    left: 10,
                    top: 100
                }).show();
                
                getMarks('all');
                
            },300);
            loadPage();
        };

        return {
            getImage : getImage,
            showImage : showImage,
            getBirdsView : getBirdsView
        };
    });