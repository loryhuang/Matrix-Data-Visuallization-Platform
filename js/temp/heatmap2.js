require.config({
    baseUrl: './js',
    paths: {
        jquery: 'lib/jquery-1.7.2.min',
        jquery_layout: 'lib/jquery.layout',
        jquery_ui: 'lib/jquery-ui-1.8.17.custom.min',
        mootools: 'lib/mootools-core-1.3.2-full-nocompat',
        mootools_more: 'lib/mootools-more-1.3.2.1',
        protocols: 'lib/protocols',
        iipmooviewer: 'lib/iipmooviewer-2.0',
        iipmooviewer_extends: 'lib/extends/iipmooviewer.extends',
        raphael: 'lib/raphael'
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
        }
    }
});

define([
    'jquery',
    'util/Constant',
    'util/Cache',
    'process/recluster',
    'jquery_layout',
    'jquery_ui',
    'iipmooviewer',
    'iipmooviewer_extends'
    ], function ($, Const, Cache, Recluster) {
        "use strict";
        var publicData = {};

        var getImage = function () {
            $(function () {

                var transPng2Tiff = function () {
                    $.ajax({
                        type: 'GET',
                        url: Const.URL_TRANS_PNG_TIFF,
                        dataType: Const.AJAX_DATA_TYPE,
                        jsonp: 'callback',
                        data: {
                            name: publicData.imageName,
                            user: publicData.userName
                        },
                        async: false,
                        success: function (status) {
                            $('#pageLoading').hide();
                            $('#view_container').show();
                            if (status != 0) {
                                alert("image format transfer error!");
                            } else {
                                console.log("image format transfer success !");
                            }

                            var iipmooviewer = new IIPMooViewer("viewer", {
                                image: publicData.imageUrl,
                                server: Const.IIPSERVER_URL,
                                credit: Const.IIPSERVER_CREDIT,
                                prefix: "/sga_lss/images/",
                                scale: 20.0,
                                showNavWindow: true,
                                showNavButtons: true,
                                winResize: true,
                                protocol: 'iip'
                            });

                        }
                    });
                };

                var postRCalculate = function () {
                    $.ajax({
                        type: 'GET',
                        url: Const.URL_R_RECLUSTER,
                        dataType: Const.AJAX_DATA_TYPE,
                        jsonp: 'callback',
                        data: {
                            matrixUrl: publicData.fileName,
                            user: publicData.userName
                        },
                        async: false,
                        success: function (data) {
                            var imageUrl = data.image_path;
                            publicData.imageName = imageUrl.substr(imageUrl.lastIndexOf("/") + 1);
                            //console.log(publicData.imageName);
                            publicData.imageUrl = '/var/www/sga_lss/data/' + publicData.imageName.replace("png", "tif");

                            transPng2Tiff();

                            //publicData.rows = $.trim(data.split("||")[1);
                            //publicData.cols = $.trim(data.split("||")[2]);

                            var row_genes = data.row_names;
                            row_genes.reverse();
                            publicData.rows = row_genes.join(" ");
                            Cache.putData('row_num', row_genes.length);

                            var col_genes = data.col_names;
                            publicData.cols = col_genes.join(" ");
                            Cache.putData('col_num', col_genes.length);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert(XMLHttpRequest + ' | ' + textStatus + ' | ' + errorThrown);
                        }
                    });
                };

                publicData.fileName = 'data_400_400.txt';
                publicData.userName = 'yys';
                $('#view_container').hide();
                $('#pageLoading').show();
                postRCalculate();
            //disableRightClick();
            });
        };

        var isMouseDown; //标记鼠标是否按下
        var step = 16; //每个单元的size
        var _rows, _cols; //存放两个横列的基因数目
        //var interval=0;
        //var excutime=0;
        var _top = 0,
        _left = 0;
        var instance_1, instance_2;
        var Layout;

        var showImage = function () {
            $('#view_container').show();
            $('#view_container').attr('imagick',1);
            $('#view_container').height($(window).height() - 12);
            Layout = $('#view_container').layout({//页面布局，east初始隐藏
                north__size: 30,
                east__size: 675,
                //,east__maxSize:   675,
                east__minSize: 400,
                east__resizable: true,
                east__initClosed: true,
                east__onresize: function () {
                    sizeImagick();
                    sizeImageArea();
                },
                east__onclose: function () {
                    reSizeImagick();
                },
                east__onopen: function () {
                    sizeImagick();
                }
            });
        
            //右键提示添加标注
            $('.canvas').live('contextmenu',function(e){
                $('#contextmenu').remove();
                $('#viewer').append('<div id="contextmenu" style="display:block"><p><a id="add_mark">Add mark</a></p><p><a id="cancel_mark">Cancel</a></p></div>');
                var offsetX=$('#viewer').offset().left; console.log(offsetX);
                var offsetY=$('#viewer').offset().top;  console.log(offsetY);
                $('#contextmenu').css({
                    left:parseInt(e.clientX-offsetX),
                    top:parseInt(e.clientY-offsetY)
                });
                var left=e.clientX-offsetX-parseInt($('.canvas').css('left'));
                var top=e.clientY-offsetY-parseInt($('.canvas').css('top'));
                var l_r=parseFloat(left/$('.canvas').width());
                var t_r=parseFloat(top/$('.canvas').height());
                $('#contextmenu').attr('l_r',l_r);
                $('#contextmenu').attr('t_r',t_r);
                e.preventDefault();
                return false;
            });
        
        
            //添加标注
            $('#add_mark').live('click',function(){
                var left=parseInt($('#contextmenu').css('left'));
                var top=parseInt($('#contextmenu').css('top'));
                $('#contextmenu').hide();
                var id=$('.mark').length+1;
                var html='<div class="mark" id="mark_'+id+'"><span>input the title:</span><p><input id="title" type="text" value="" /><input id="add_title" type="button" value="ok" /></p></div>';
                $('#viewer').append(html);
                $('.mark').last().css({
                    left:left,
                    top:top
                }); 
                 
            });
            
            //添加标注标题
            $('#add_title').live('click',function(){
                var obj=$('.mark').last();
                var id=obj.attr('id').split('_')[1];
                var val=obj.find('#title').val();
                if(val==''){
                    obj.remove();
                }
                obj.empty();
                obj.html('<p><b>' + id + '</b>.' + val + '</p>');
                obj.attr('l_r',$('#contextmenu').attr('l_r'));
                obj.attr('t_r',$('#contextmenu').attr('t_r'));
                $('#contextmenu').remove();
            });
        
            //取消标注意图
            $('#cancel_mark').live('click',function(){
                $('#contextmenu').remove();
            });
        
        
        
            $('#getImagick').live('click', function () {
            
                var timeout;
                if (Layout.state.east.isClosed) {
                    timeout = 250;
                } else {
                    timeout = 0;
                }
                $('#east-content,#east-content-2').hide();
                $('.s_loading').hide();
                $('.imgLoading').show();
                Layout.show("east");
                Layout.open("east");
                Layout.sizePane('east', 675);
                $('#imagick').css('z-index', 15);
                $('#imagick').show();
                $('#east-content-2,#t,#r').empty();
                $('.imgareaselect-selection').parent().hide();
                $('.imgareaselect-outer,.imgareaselect-selection').hide();
                $('#s p').remove();
                //Layout.close("west");
                $('#viewer').width($(window).width() - $('#imagick').width());
                var pos = $('.canvas').attr('d'); //取出截取位置的坐标
                var x = parseInt(pos.split('_')[0]);
                var y = parseInt(pos.split('_')[1]);
                var w = parseInt(pos.split('_')[2]);
                var h = parseInt(pos.split('_')[3]);
                //初始化外围区域的大小
                $('#l').width(480);
                $('#img').height(640);
                $('#r').height(640);
                //标示截取区域
                $('.selected_area').remove();
                var div = '<div class="selected_area"></div>';
                $('#viewer').append(div);
                var d1 = parseFloat($('.imgareaselect-selection').parent().width() / parseInt($('.canvas').css('width'))); //储存宽度比例
                var d2 = parseFloat($('.imgareaselect-selection').parent().height() / parseInt($('.canvas').css('height'))); //储存高度比例
                var left_gap = parseInt($('.imgareaselect-selection').parent().css('left')) - parseInt($('.canvas').css('left'));
                var top_gap = parseInt($('.imgareaselect-selection').parent().css('top')) - parseInt($('.canvas').css('top')); //获取初始相对位移
                var current_radio = $('.canvas').attr('r'); //记录canvas的初当前缩放比例
                //console.log('l_'+left_gap+' t_'+top_gap);
                $('.selected_area').attr('wr', d1);
                $('.selected_area').attr('hr', d2);
                $('.selected_area').attr('c_r', current_radio);
                $('.selected_area').attr('left_gap', left_gap);
                $('.selected_area').attr('top_gap', top_gap); //数据存储
                $('#viewer .selected_area').css({
                    width: $('.imgareaselect-selection').parent().width() - 2,
                    height: $('.imgareaselect-selection').parent().height() - 2,
                    left: parseInt($('.imgareaselect-selection').parent().css('left')),
                    top: parseInt($('.imgareaselect-selection').parent().css('top'))
                });
                $('#viewer .selected_area').show();
                //alert(x+'_'+y+'_'+w+'_'+h);
                setTimeout(function () { //to make the loading image show,so there is time out
                    $.ajax({
                        type: 'GET',
                        url: Const.URL_IMAGICK,
                        dataType: Const.AJAX_DATA_TYPE,
                        async: false,
                        data: {
                            x: x,
                            y: y,
                            w: w,
                            h: h,
                            user: publicData.userName,
                            name: (publicData.imageName.split("_"))[0] + "_r"
                        },
                        success: function (data) {
                            $('#img .target_line').remove();
                            $('#imagick').show();
                            $('#east-content').show();
                            $('.imgLoading').hide();
                            var src = 'http://115.156.216.95/sga_lss/data/' + 'new_' + data + '.png';
                            $('#img img').attr('src', src);
                            getGeneItems(x, y, w, h); //产生横纵基因信息
                            $('#img img').css('width', 8 * w); //图片区域设置为实际大小的8倍
                            $('#img img').css('height', 8 * h);
                            if (8 * w < $('#l').width()) {
                                $('#l').width(8 * w + 25);
                            }
                            if (8 * h < $('#img').height()) {
                                $('#img,#r').height(8 * h + 25);
                            }
                            if ($('#view_container').height() - $('#t').height() < 8 * h) {
                                $('#img,#r').height($('#view_container').height() - $('#t').height() - 30);
                            }
                            $('#east-content').width($('#l').width() + $('#sr').width() + 5);
                            if ($('#east-content').width() < Layout.state.east.size - 30) {
                                Layout.sizePane('east', $('#east-content').width() + 30);
                            }
                            //var step=16;                                //每个单元的size
                            var row = parseInt($('#r').height() / step); //每次显示的行列数
                            var col = parseInt($('#t').width() / step);
                            var scrollWidth = parseInt($('#img').get(0).offsetWidth - $('#img').get(0).clientWidth); //滚动条的宽度
                            var extra_n = parseInt(scrollWidth / step);
                            $('#r p').show();
                            $('#t .col').show();
                            $('#r p:gt(' + parseInt(row - 1 - extra_n) + ')').hide(); //初始显示的行列数，除去滚动条对应的那一行
                            $('#t .col:gt(' + parseInt(col - 1 - extra_n) + ')').hide();
                            $('#matrix').show();
                        }
                    });
                }, timeout);
            });


            $('#reCluster').live('click', function () {
                var timeout;
                if (Layout.state.east.isClosed) {
                    timeout = 250;
                } else {
                    timeout = 0;
                }
                var row1 = parseInt($('#matrixBtn #r1').val());
                var row2 = parseInt($('#matrixBtn #r2').val());
                var col1 = parseInt($('#matrixBtn #c1').val());
                var col2 = parseInt($('#matrixBtn #c2').val());
                //var row1 = 10;
                //var row2 = 460;
                //var col1 = 20;
                //var col2 = 320;
                $('.imgareaselect-selection').parent().hide();
                $('.imgareaselect-outer,.imgareaselect-selection').hide();
                $('#east-content,#east-content-2').hide();
                $('.s_loading').hide();
                $('.imgLoading').show();
                Layout.show("east");
                Layout.open("east");
                Layout.sizePane('east', 875);
                $('#east-content-2').width(800);
                //标示截取区域
                $('.selected_area').remove();
                var div = '<div class="selected_area"></div>';
                $('#viewer').append(div);
                var d1 = parseFloat($('.imgareaselect-selection').parent().width() / parseInt($('.canvas').css('width'))); //储存宽度比例
                var d2 = parseFloat($('.imgareaselect-selection').parent().height() / parseInt($('.canvas').css('height'))); //储存高度比例
                var left_gap = parseInt($('.imgareaselect-selection').parent().css('left')) - parseInt($('.canvas').css('left'));
                var top_gap = parseInt($('.imgareaselect-selection').parent().css('top')) - parseInt($('.canvas').css('top')); //获取初始相对位移
                var current_radio = $('.canvas').attr('r'); //记录canvas的初当前缩放比例
                //console.log('l_'+left_gap+' t_'+top_gap);
                $('.selected_area').attr('wr', d1);
                $('.selected_area').attr('hr', d2);
                $('.selected_area').attr('c_r', current_radio);
                $('.selected_area').attr('left_gap', left_gap);
                $('.selected_area').attr('top_gap', top_gap); //数据存储
                $('#viewer .selected_area').css({
                    width: $('.imgareaselect-selection').parent().width() - 2,
                    height: $('.imgareaselect-selection').parent().height() - 2,
                    left: parseInt($('.imgareaselect-selection').parent().css('left')),
                    top: parseInt($('.imgareaselect-selection').parent().css('top'))
                });
                $('#viewer .selected_area').show();
                //加载重新生成的图
                setTimeout(function () { //to make the loading image show,so there is time out
                    $.ajax({
                        type: 'GET',
                        url: Const.URL_R_TESTDESC,
                        dataType: Const.AJAX_DATA_TYPE,
                        data: {
                            r1: row1,
                            r2: row2,
                            c1: col1,
                            c2: col2,
                            user: publicData.userName,
                            matrix: publicData.fileName
                        },
                        async: false,
                        success: function (data) {
                            //alert(data);
                            $('#east-content-2,#t,#r').empty();
                            $('.imgLoading').hide();
                            $('#imagick').show();
                            var server = 'http://115.156.216.95/sga_lss/';
                            var imagick_html = '<div id="main_container"><div id="left"><div id="colorkey"><img src="' + server + data.color_key + '" alt="colorkey"/></div><div id="ll">' +
                            '<img src="' + server + data.col_image + '" alt="colImage"/></div></div><div id="l_"><div id="tt"><img src="' + server + data.row_image + '" alt="rowImage"/></div>' +
                            '<div id="heatmap"><img src="' + server + data.image_path + '" alt="heatmap"/></div><div id="t_"></div></div>' +
                            '<div id="sr_"><div id="s_"><div class="ss_loading"></div></div><div id="r_"></div></div></div>';
                            $('#east-content-2').append(imagick_html);

                            Cache.putData('user', publicData.userName);
                            Cache.putData('filename', publicData.fileName);

                            Cache.putData('row_parts', data.col_names);
                            Cache.putData('col_parts', data.row_names);
                            //$.getScript("./js/heatmap.js");
                            Recluster.reclusterHeatMap();
                            $('#east-content-2').show();
                        },
                        error: function () {
                        }
                    });
                }, timeout);

                if ($('#east-content-2').width() < Layout.state.east.size - 30) {
                    setTimeout(function () {
                        Layout.sizePane('east', $('#east-content-2').width() + 25);
                    }, 50);
                }
            });


            $('#img').scroll(function () {
                var top = this.scrollTop;
                var left = this.scrollLeft; //获取滚动条移动的距离
                var _this = this;
                clearTimeout(instance_1); //清除上次的生成
                instance_1 = setTimeout(function () { //两次触发时间间隔超过一定值才执行
                    //excutime+=1;
                    //$('#pointer_2').text(excutime);
                    var row = parseInt($('#r').height() / step); //每次显示的行列数
                    var col = parseInt($('#t').width() / step);
                    //$('#r p:gt('+parseInt(row-1)+')').hide();
                    //$('#t span:gt('+parseInt(col-1)+')').hide();
                    var scrollWidth = parseInt(_this.offsetWidth) - parseInt(_this.clientWidth); //滚动条的宽度
                    var extra_n = parseInt(scrollWidth / step);
                    var rows_n = Math.round(top / step);
                    var cols_n = Math.round(left / step);
                    $('#r p').show(); //设置显示与隐藏的行与列
                    $('#r p:lt(' + rows_n + ')').hide();
                    $('#r p:gt(' + parseInt(row + rows_n - 1 - extra_n) + ')').hide();
                    $('#t .col').show();
                    $('#t .col:lt(' + cols_n + ')').hide();
                    $('#t .col:gt(' + parseInt(col + cols_n - 1 - extra_n) + ')').hide();
                    if (top != rows_n * step) { //调整滚动条位置，为整数个小区域
                        $(_this).scrollTop(rows_n * step);
                    }
                    if (left != cols_n * step) {
                        $(_this).scrollLeft(cols_n * step);
                    }
                }, 50);
            });


            $('#img').live('click', function (e) {
                var _this = this;
                clearTimeout(instance_2); //清除上次的生成
                var pointer_X = e.clientX || (e.pageX + (document.documentElement.scrollLeft || document.body.scrollLeft));
                var pointer_Y = e.clientY || (e.pageY + (document.documentElement.scrollTop || document.body.scrollTop));
                //alert('e.clientX : '+pointer_X +'  e.clientY : '+ pointer_Y);         //鼠标位置
                var x = pointer_X - $(_this).offset().left + _this.scrollLeft;
                var y = pointer_Y - $(_this).offset().top + _this.scrollTop; //相对左上角的偏移
                var scrollWidth = parseInt(_this.offsetWidth) - parseInt(_this.clientWidth); //滚动条的宽度
                var w = $('#img').width();
                var h = $('#img').height(); //显示框的高度
                if ((_this.scrollLeft + w - x <= scrollWidth) || (_this.scrollTop + h - y <= scrollWidth)) {
                    //alert('No action!!');           //鼠标移至滚动条上面时无动作
                    return;
                }
                var index_x = Math.floor(x / step);
                var index_y = Math.floor(y / step);
                var target_x = 16 * parseInt(x / 16) + 7;
                var target_y = 16 * parseInt(y / 16) + 7;
                clearStyle();
                $(_this).append('<div id="line_x" class="target_line"></div>');
                $(_this).append('<div id="line_y" class="target_line"></div>');
                $('#line_x').width($('#img img').width());
                $('#line_x').css('top', target_y);
                $('#line_x').css('left', 0);
                //$('#line_x').css('left',this.scrollLeft);
                $('#line_y').height($('#img img').height());
                $('#line_y').css('left', target_x);
                $('#line_y').css('top', 0);
                //$('#line_y').css('top',this.scrollTop);
                if (!+[1, ]) { //IE browser
                    $("#t .col:eq(" + index_x + ")").css({
                        "font-weight": "bold",
                        color: "#6495ED"
                    });
                } else { //Other browsers
                    $("#t .col:eq(" + index_x + ")").find("text").css({
                        "font-weight": "bold",
                        fill: "#6495ED"
                    });
                }
                $("#r p:eq(" + index_y + ")").css({
                    "font-weight": "bold",
                    color: "#6495ED"
                });
                instance_2 = setTimeout(function () { //两次触发时间间隔超过一定值才执行
                    if (!+[1, ]) { //IE browser
                        var array = $("#t .col:eq(" + index_x + ")").text();
                    } else {
                        var array = $("#t .col:eq(" + index_x + ")").find("text").text();
                    }
                    var query = $("#r p:eq(" + index_y + ")").text();
                    //alert(query+'_'+array);
                    $('#s p').remove();
                    $('.s_loading').show();

                    //TODO: getScore待处理
                    var htm = '<p><b>query : </b>' + query.split('_')[0] + '<br/><b>array : </b>' +
                    array.split('_')[0] + '<br/><b>score : </b>' + getScore(query, array) + '</p>';


                    $('#s').append(htm);
                    $('.s_loading').hide();
                }, 1000); //延迟1000ms执行
            });

            $('#r p').live('click', function () { //  点击右边的条目，变色，加线
                var i = $(this).index();
                var top = $('#img').get(0).scrollTop;
                //var left=$('#img').get(0).scrollLeft;
                var index = i - parseInt(top / step);
                clearStyle();
                $("#r p:eq(" + i + ")").css({
                    "font-weight": "bold",
                    color: "#6495ED"
                });
                $('#img').append('<div id="line_x" class="target_line"></div>');
                $('#line_x').css('top', top + 16 * index + 7);
                $('#line_x').css('left', 0);
                $('#line_x').width($('#img img').width());
            });

            $('#t .col').live('click', function () {
                var i = $(this).index();
                //var top=$('#img').get(0).scrollTop;
                var left = $('#img').get(0).scrollLeft;
                var index = i - parseInt(left / step);
                clearStyle();
                if (!+[1, ]) { //IE browser
                    $("#t .col:eq(" + i + ")").css({
                        "font-weight": "bold",
                        color: "#6495ED"
                    });
                } else { //Other browsers
                    $("#t .col:eq(" + i + ")").find("text").css({
                        "font-weight": "bold",
                        fill: "#6495ED"
                    });
                }

                $('#img').append('<div id="line_y" class="target_line"></div>');
                $('#line_y').height($('#img img').height());
                $('#line_y').css('top', 0);
                $('#line_y').css('left', left + 16 * index + 7);
            });


        };

        function clearStyle() {
            $('.target_line').remove();
            $("#t .col").find("text").css({
                "font-weight": "normal",
                fill: "#333"
            });
            $("#t .col").css({
                "font-weight": "normal",
                color: "#333"
            });
            $("#r p").css({
                "font-weight": "normal",
                color: "#333"
            });
        }


        function getPos(gene, arrs) { //获取某个基因在横列中的位置
            var name = getStandardName(gene);
            for (var i = 0; i < arrs.length; i++) {
                var arr = $.trim(arrs[i]).split('_')[0];
                if (name == arr) {
                    return i;
                    break;
                }
            }
            return -1;
        }


        function getGeneItems(x, y, w, h) { //获取截取区域对应的横纵列的基因并生成HTML
            $('#t').empty();
            $('#r').empty();
            //var initialWidth=7817;

            //TODO: 此处需要获取原图片高度，待添加
            //      var initialHeight = publicData.row_num * 2;
            //      var rows_num = publicData.row_num;

            //var cols_num=3841;        //基因的横列数目

            //var _rows=$.trim(getText('data/rows.txt')).split('\n');
            //var _cols=$.trim(getText('data/cols.txt')).split('\n');
            var geneColNames = publicData.cols.split(' ');
            var geneRowNames = publicData.rows.split(' ');

            var colStartIndex = Math.round(x / 2) - 2;
            var colLength = Math.round(w / 2);
            var rowStartIndex = Math.round(y / 2) - 2;
            var rowLength = Math.round(h / 2);
            $('#r_1').val(rowStartIndex + 1);
            $('#r_2').val(rowStartIndex + rowLength);
            $('#c_1').val(colStartIndex + 1);
            $('#c_2').val(colStartIndex + colLength);
            var rowHtml = '';
            for (var i = colStartIndex; i < colStartIndex + colLength; i++) {
                var d = geneColNames[i];
                var colHtml;
                if (!+[1, ]) { //IE浏览器
                    colHtml = '<div class="col" id="text_' + d + '"  style="overflow:visible;">' + d + '</div>';
                    $('#t').append(colHtml);
                } else { //非IE浏览器
                    colHtml = '<div class="col" id="text_' + d + '"  style="overflow:visible;"></div>';
                    $('#t').append(colHtml);
                    Raphael("text_" + d).text(0, 50, d).transform("r-60");
                }
            }
            for (var j = rowStartIndex; j < rowStartIndex + rowLength; j++) {
                rowHtml += '<p>' + geneRowNames[j] + '</p>';
            }
            $('#r').append(rowHtml);
        }


        function getText(url) { //获取txt文本
            var txt;
            $.ajax({
                type: 'POST',
                url: url,
                dataType: "text",
                async: false,
                success: function (d) {
                    txt = d;
                }
            });
            return txt;
        }

        function getStandardName(id) {
            var name = '';
            $.ajax({
                type: 'POST',
                url: 'ajax_get_standardName.php',
                dataType: "JSON",
                data: {
                    id: id
                },
                async: false,
                success: function (data) {
                    name += data;
                }
            });
            return name;
        }

        function getScore(query, array) {
            var score = '0';
            $.ajax({
                type: 'get',
                url: Const.URL_GETSCORE,
                dataType: Const.AJAX_DATA_TYPE,
                data: {
                    query: query,
                    array: array,
                    user: publicData.userName,
                    filename: publicData.fileName
                },
                async: false,
                success: function (data) {
                    if (data != null && data != '') {
                        score = data;
                    } else {
                        score = '0';
                    }
                }
            });
            if (score.length > 10) {
                score = score.substring(0, 10);
            }
            return score;
        }

        function disableRightClick(e) {  //当在图片上操作时 禁用右键点击功能
            if (!document.rightClickDisabled) {
                if (document.layers) {
                    document.captureEvents(Event.MOUSEDOWN);
                    document.onmousedown = disableRightClick;
                }
                else document.oncontextmenu = disableRightClick;
                return document.rightClickDisabled = true;
            }
            if (document.layers || (document.getElementById && !document.all)) {
                if (e.which == 2 || e.which == 3) {
                    return false;
                } else {
                    return true;
                }
            }
            else {
                return false;
            }
        }

        function sizeImagick() {
            $('#viewer').width($(window).width() - $('#imagick').width() - 15);
        }

        function reSizeImagick() {
            $('#viewer').width($(window).width() - 5);
        }

        function sizeImageArea() {
            if ($('#east-content').css('display') != 'none') {
                if ($('#img img').width() <= $('#l').width() - 15) {
                    return;
                }
                var currentWidth = Layout.state.east.size - $('#sr').width() - 50;
                currentWidth = (currentWidth / 16) * 16;
                $('#l').width(currentWidth);
                $('#east-content').width(Layout.state.east.size - 30);
                $('#img').trigger('scroll');
            } else if ($('#east-content-2').css('display') != 'none') {
                if ($('#heatmap img').width() <= $('#l_').width() - 15) {
                    return;
                }
                var currentWidth = Layout.state.east.size - $('#left').width() - $('#sr_').width() - 25;
                currentWidth = (currentWidth / 16) * 16;
                $('#l_').width(currentWidth);
                $('#east-content-2').width(Layout.state.east.size - 15);
                $('#main_container').width(Layout.state.east.size - 15);
                $('#heatmap').trigger('scroll');
            }
        }

        function resizeViewer() {
            if ($('#viewer').width() < $('#view').width()) {
                $('#viewer').width($('#view').width());
            }
        }

        return {
            getImage: getImage,
            showImage: showImage
        };
    });