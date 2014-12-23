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
    'jquery_zclip'
    ], function ($) {
        "use strict";

        $(function(){

            setFootPos();
            setTimeout(function(){
                $(".zclip").each(function(i,e){
                    $(e).attr("title","copy and share the image link ");
                });
            },1000);
            
            
            //Data File Count
            var uploadFileNum = $("#data_form input[name='filenum']").val();


            //Calculate position of pop-up box AND show pop-ups
            function popupBox(obj) {
                var top = ($(window).height() - obj.height()) / 2 - 30;
                var left = ($(window).width() - obj.width()) / 2 ;
                obj.css({
                    'left': left, 
                    'top': top
                });
                $("#shade").height($("body").height()).show();
                $(obj).show();  
            }; 

            //Check number of file ,if more than 10 , alert
            function checkFileNum () {
                if(uploadFileNum >= 10){
                    var tips = "Files you uploaded have reached the limit,please delete some files first!" ;
                    $("#alert_box").find("p").text(tips);
                    popupBox($("#alert_box"));
                    return false; 
                }
                return true;
            }

            //When all files are deleted
            function showNoContent(){
                var html='<div id="no-content"><h4>Instructions</h4>'+
                        '<p>You have not uploaded any data file yet ,please click the button above to upload data from <strong>local </strong> or <strong> Dropbox </strong>.</p>'+
                        '<p>Only files in <strong> .txt </strong> and <strong> .cdt </strong> format can be uploaded.'+
                        '</p>'+
                        '<P>For the file format detail, please refer to the <a class="file_type_link"> File Type </a> icon right top corner.</p>'+
                        '<p>When txt data files are uploaded , the data will be clustered by the R heatmap.2 function and then be visualized as a heatmap.When cdt data files are uploaded , the data will be directly visualized <strong>without</strong> being clustered .'+
                        '<p>Be clear that when upload big txt files , it may take <strong> quite a long time </strong> to get the result. So we suggest you firstlyget the txt file clustered into a cdt file by R console , then upload.'+
                        '</p>'+
                        '<p> Every registered user can upload <strong>10 </strong> files at most.</p>'+
                        '</div>';
                $("#content").append(html);
            }

            //Check footer position
            function setFootPos(){
                if($("#container").height() < $(window).height() - $("#head").height() - $("#footer").height() - 80){
                    $("#container").height($(window).height() - $("#head").height() - $("#footer").height() - 80);
                }     
            }

            //Upload button
            $("#upload_file_btn").click(function(){
                if(checkFileNum()){
                    popupBox($("#upload_box"));
                };     
            });


            //limit the input length of title
            $('input[name="title"]').keydown(function(){
                var str = $(this).val();
                if(str.length > 50){
                    $(this).val(str.substr(0,50));
                    return false;
                }
            });

            //limit the input length of description
            $('textarea[name="description"]').keydown(function(){
                var str = $(this).val();
                if(str.length > 250){
                    $(this).val(str.substr(0,250));
                    return false;
                }
            });


            //Dropbox chooser
            $("#dropbox_chooser_btn").click(function(){
                if(!checkFileNum()){
                    return false
                };
                var options = {
                    linkType: "direct",
                    extensions: ['.cdt','.txt'],
                    multiselect: false,
                    success: function(files) {
                        //console.log("Here's the file link:" + files[0].link)
                        var fileName = files[0].name;
                        var fileUrl = files[0].link;
                        $("#name").text(fileName);
                        $("#dropbox_box").find("input[name='filename']").val(fileName);
                        $("#dropbox_box").find("input[name='fileurl']").val(fileUrl);
                        popupBox($("#dropbox_box"));
                        
                    },
                    cancel:  function() {
                        // Called when the user closes the dialog
                        // without selecting a file and does not include any parameters.
                    }
                }; 
                Dropbox.choose(options);
            });


            // show tips
            $("#file_type_tip,.file_type_link").live("click",function(){
                popupBox($("#tips_box"));
            });

            //close box
            $(".close_tag").click(function(){
                $(this).parents(".box").hide();
                $("#shade").hide();
            });

            //cpoy button
            $(".shrbtn").zclip({
                path:'./js/lib/extends/ZeroClipboard.swf',
                copy:function(){
                    var host = window.location.href;
                    var lastindex = host.lastIndexOf("/"); 
                    host = host.substring(0,lastindex);
                    var url =  host + "/birds_view/" + $(this).parent().find("input[type='hidden']").val();
                    //var insertHtml = '<iframe width=500 height=500 src = "' + url + '" ></iframe>';
                    //return insertHtml;
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

            //del button
             $(".delbtn").live("click",function() {
                var file_id = $(this).parent().find('input[type="hidden"]').val();
                var file_name = $("#item"+file_id).find(".title").text();
                $("#del_file_name").text(file_name);
                $("#conform_box").attr("file_id", file_id);
                popupBox($("#conform_box")); 
            });
            
             //delete data file
            $(".del_conform_btn").click(function(){  
                var file_id = $("#conform_box").attr("file_id");
                $.ajax({
                    type: "POST",
                    url: 'index.php/sga/delete_file',
                    data: {
                        'id': file_id
                    },
                    success:function(data){
                        //console.log(data);
                        $("#content").find("#item"+file_id).remove();
                        uploadFileNum-- ;
                        if (uploadFileNum == 0) {
                            showNoContent();
                        };
                        setFootPos();
                        console.log("delete success");
                    }
                });
                $("#conform_box,#shade").hide();
           });
           
           //cancel delete
           $(".del_cancel_btn").click(function(){
                $("#conform_box,#shade").hide();
           });

           //Cancel upload ,clear the input values
           $(".cancel_create_btn").click(function(){
                var box = $(this).parents(".box");
                box.find("input[name],textarea[name]").val("");
                box.hide();
                $("#shade").hide();
            });

           //upload button event
            $(".submit_create_btn").click(function(){
                var title = $('input[name="title"]').val();
                var description = $('textarea[name="description"]').val();
                if(title.length > 50){
                    alert("title can not be more than 50 characters!");
                    return;
                }
                if(description.length > 250){
                    alert("description can not be more than 250 characters!");
                    return;
                }
                $(this).parents("form").submit();
                $(this).parents(".box").find(".upload_shade").show();
            });

            //Alert Box
            $(".alert_tips_btn").click(function(){
                $(this).parents(".box").hide();
                $("#shade").hide();
            });
        });

    });