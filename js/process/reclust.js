require.config({
    baseUrl: './js'
});

define([
    'util/Constant',
    'util/Cache',
    ], function (Const, Cache) {
        "use strict";
 
        var showHeatMap = function () {
            
            var data = Cache.getData("reclust_data");   
            
            $('#l_').width(480);//初始化外围区域的大小
            $('#heatmap').height(480);
            $('#r_').height(480);
            $('#ll').height(480);
            //var hm_rows=$('#rname').text().split(' ');
            //var hm_cols=$('#cname').text().split(' ');
            //var hm_rows = Cache.getData('row_parts');
            //var hm_cols = Cache.getData('col_parts');
            var hm_rows = data.rows.split(" ");
            var hm_cols = data.cols.split(" ");
            makeGeneLists(hm_rows, hm_cols);
            var step = data.step;
            //var step=16;                                //每个单元的size
            var hm_row = parseInt($('#r_').height() / step);     //每次显示的行列
            var hm_col = parseInt($('#t_').width() / step);
            var scrollWidth = parseInt($('#heatmap').get(0).offsetWidth - $('#heatmap').get(0).clientWidth);  //滚动条的宽度
            var extra_n = parseInt(scrollWidth / step);
            $('#r_ p').show();
            $('#t_ .col').show();
            $('#r_ p:gt(' + parseInt(hm_row - extra_n) + ')').hide();          //初始显示的行列数，除去滚动条对应的那一行
            $('#t_ .col:gt(' + parseInt(hm_col - extra_n) + ')').hide();
            var instance_3;
            var instance_4;
            $('#heatmap').scroll(function () {
                var rows = parseInt($('#r_').height() / step);     //每次显示的行列数
                var cols = parseInt($('#t_').width() / step);
                var top = this.scrollTop;
                var left = this.scrollLeft; //获取滚动条移动的距离
                var _this = this;
                clearTimeout(instance_3);          //清除上次的生成
                instance_3 = setTimeout(function () {  //两次触发时间间隔超过一定值才执行
                    //var row=parseInt($('#r').height()/step); //每次显示的行列数
                    //var col=parseInt($('#t').width()/step);
                    //$('#r p:gt('+parseInt(row-1)+')').hide();
                    //$('#t span:gt('+parseInt(col-1)+')').hide();
                    var scrollWidth = parseInt(_this.offsetWidth) - parseInt(_this.clientWidth);//滚动条的宽度
                    var extra_n = parseInt(scrollWidth / step);
                    var rows_n = Math.round(top / step);
                    var cols_n = Math.round(left / step);
                    $('#r_ p').show();              //设置显示与隐藏的行与列
                    $('#r_ p:lt(' + rows_n + ')').hide();
                    $('#r_ p:gt(' + parseInt(rows + rows_n - extra_n) + ')').hide();
                    $('#t_ .col').show();
                    $('#t_ .col:lt(' + cols_n + ')').hide();
                    $('#t_ .col:gt(' + parseInt(cols + cols_n - extra_n) + ')').hide();
                    if (top != rows_n * step) {           //调整滚动条位置，为整数个小区域
                        $(_this).scrollTop(rows_n * step);
                    }
                    if (left != cols_n * step) {
                        $(_this).scrollLeft(cols_n * step);
                    }
                    $('#ll').scrollTop(_this.scrollTop);
                    $('#tt').scrollLeft(_this.scrollLeft);
                }, 20);//延迟20ms执行
            });

            $('#tt').scroll(function () {
                //var top=this.scrollTop;
                var left = this.scrollLeft; //获取滚动条移动的距离
                $('#heatmap').scrollLeft(left);
            //$('#heatmap').scrollTop(top);
            });
            $('#ll').scroll(function () {
                var top = this.scrollTop;
                //var left=this.scrollLeft; //获取滚动条移动的距离
                //$('#heatmap').scrollLeft(left);
                $('#heatmap').scrollTop(top);
            });
            $('#heatmap').live('click', function (e) {
                var _this = this;
                clearTimeout(instance_4);          //清除上次的生成
                instance_4 = setTimeout(function () {  //两次触发时间间隔超过一定值才执行
                    var pointer_X = e.clientX || (e.pageX + (document.documentElement.scrollLeft || document.body.scrollLeft));
                    var pointer_Y = e.clientY || (e.pageY + (document.documentElement.scrollTop || document.body.scrollTop));
                    //alert('e.clientX : '+pointer_X +'  e.clientY : '+ pointer_Y);         //鼠标位置
                    var x = pointer_X - $(_this).offset().left + _this.scrollLeft;
                    var y = pointer_Y - $(_this).offset().top + _this.scrollTop;                  //相对左上角的偏移
                    var scrollWidth = parseInt(_this.offsetWidth) - parseInt(_this.clientWidth);//滚动条的宽度
                    var w = $('#heatmap').width();
                    var h = $('#heatmap').height();      //显示框的高度
                    if ((_this.scrollLeft + w - x <= scrollWidth) || (_this.scrollTop + h - y <= scrollWidth)) {
                        //alert('No action!!');           //鼠标移至滚动条上面时无动作
                        return;
                    }
                    var index_x = Math.floor(x / step);
                    var index_y = Math.floor(y / step);
                    var target_x = 16 * parseInt(x / 16) + 7;
                    var target_y = 16 * parseInt(y / 16) + 7;
                    clear_Style();
                    $(_this).append('<div id="line_x" class="target_line"></div>');
                    $(_this).append('<div id="line_y" class="target_line"></div>');
                    $('#line_x').width($('#heatmap img').width());
                    $('#line_x').css('top', target_y);
                    $('#line_x').css('left', 0);

                    $('#ll').append('<div id="ll_line_x" class="target_line"></div>');
                    $('#ll_line_x').css('top', target_y);
                    $('#ll_line_x').css('left', 0);
                    $('#ll_line_x').width($('#ll img').width());
                    //$('#line_x').css('left',this.scrollLeft);
                    $('#line_y').height($('#heatmap img').height());
                    $('#line_y').css('left', target_x);
                    $('#line_y').css('top', 0);

                    $('#tt').append('<div id="tt_line_y" class="target_line"></div>');
                    $('#tt_line_y').height($('#tt img').height());
                    $('#tt_line_y').css('top', 0);
                    $('#tt_line_y').css('left', target_x);
                    //$('#line_y').css('top',this.scrollTop);
                    if (!+[1, ]) {//IE browser
                        $("#t_ .col:eq(" + index_x + ")").css({
                            "font-weight": "bold",
                            color: "#6495ED"
                        });
                        var array = $("#t_ .col:eq(" + index_x + ")").text();
                    } else {   //Other browsers
                        $("#t_ .col:eq(" + index_x + ")").find("text").css({
                            "font-weight": "bold",
                            fill: "#6495ED"
                        });
                        var array = $("#t_ .col:eq(" + index_x + ")").find("text").text();
                    }
                    $("#r_ p:eq(" + index_y + ")").css({
                        "font-weight": "bold",
                        color: "#6495ED"
                    });
                    var query = $("#r_ p:eq(" + index_y + ")").text();
                    $('#s_ .score').remove();
                    $('.ss_loading').show();
                    var htm = '<div class="score"><b>query : </b>' + query.split('_')[0] + '<br/><b>array : </b>' + array.split('_')[0] + '<br/><b>score : </b>' + getScore(query, array) + '</div>';
                    $('#s_').append(htm);
                    $('.ss_loading').hide();
                }, 20);//延迟30ms执行
            });

            $('#r_ p').live('click', function () {//  点击右边的条目，变色，加线
                var i = $(this).index();
                var top = $('#heatmap').get(0).scrollTop;
                //var left=$('#heatmap').get(0).scrollLeft;
                var index = i - parseInt(top / step);
                clear_Style();
                $("#r_ p:eq(" + i + ")").css({
                    "font-weight": "bold",
                    color: "#6495ED"
                });
                $('#heatmap').append('<div id="line_x" class="target_line"></div>');
                $('#ll').append('<div id="ll_line_x" class="target_line"></div>');
                $('#line_x,#ll_line_x').css('top', top + 16 * index + 7);
                $('#line_x,#ll_line_x').css('left', 0);
                $('#line_x').width($('#heatmap img').width());
                $('#ll_line_x').width($('#ll img').width());
            });

            //对选中的两个列名画两条线
            $('#t_').live('mouseup', function () {
                var text = $.trim(getSelectedText());
                console.log(text);
                if (text != '' && text) {
                    var genes = [];
                    var lists = text.split('\n');
                    $.each(lists, function (i, e) {
                        var term = $.trim(e);
                        if (term && term != '') {
                            //var item=$.trim(e.split('_')[0]);
                            genes.push(term);
                            //alert(e);
                        }
                    });
                    var hm_cols = data.cols.split(" ");
                    var pos = {
                        previous: 0,
                        afterwards: 0,
                        start: -1,
                        end: -1
                    };
                    var len = hm_cols.length;
                    var genesLength = genes.length;
                
                    for (var m = 1; m >= 0; m--) {
                        var n1;
                        if (m == 1) {
                            for (n1 = 0; n1 < len; n1++) {
                                if (genes[m] == hm_cols[n1]) {
                                    pos.start = n1;
                                    break;
                                }
                            }
                        }
                        if (m == 0) {
                            for (n1 = 0; n1 < len; n1++) {
                                if (genes[m] == hm_cols[n1]) {
                                    pos.start = n1;
                                    break;
                                }
                            }
                            if (n1 == len) {
                                pos.previous = 1
                            }
                        }

                    }
                    for (var m = genesLength - 2; m < genesLength; m++) {
                        var n2;
                        if (m == genesLength - 2) {
                            for (n2 = 0; n2 < len; n2++) {
                                if (genes[m] == hm_cols[n2]) {
                                    pos.end = n2;
                                    break;
                                }
                            }
                        }
                        if (m == genesLength - 1) {
                            for (n2 = 0; n2 < len; n2++) {
                                if (genes[m] == hm_cols[n2]) {
                                    pos.end = n2;
                                    break;
                                }
                            }
                            if (n2 == len) {
                                pos.afterwards = 1
                            }
                        }

                    }
                    if (pos.previous == 1) {
                        pos.start = pos.start - 1
                    }
                    if (pos.afterwards == 1) {
                        pos.end = pos.end + 1
                    }
                    var left = $('#heatmap').get(0).scrollLeft;
                    var index1 = pos.start - parseInt(left / step);
                    var index2 = pos.end - parseInt(left / step);
                    clear_Style();
                    $('#heatmap').append('<div id="line_y1" class="target_line"></div><div id="line_y2" class="target_line"></div>');
                    $('#tt').append('<div id="tt_line_y1" class="target_line"></div>');
                    $('#tt').append('<div id="tt_line_y2" class="target_line"></div>');
                    $('#line_y1,#tt_line_y1').css('left', left + 16 * index1 + 7);
                    $('#line_y2,#tt_line_y2').css('left', left + 16 * index2 + 7);
                    $('#line_y1,#line_y2,#tt_line_y1,#tt_line_y2').css('top', 0);
                    $('#line_y1,#line_y2').height($('#heatmap img').height());
                    $('#tt_line_y1,#tt_line_y2').height($('#tt img').height());
                }
            });

            //对选中的行名画两条线
            $('#r_').live('mouseup', function () {
                var text = $.trim(getSelectedText());
                if (text != '' && text) {
                    var genes = [];
                    var lists = text.split('\n');
                    $.each(lists, function (i, e) {
                        var term = $.trim(e);
                        if (term && term != '') {
                            //var item=$.trim(e.split('_')[0]);
                            genes.push(term);
                        //alert(e);
                        }
                    });
                    var hm_rows = data.rows.split(" ");
                    var pos = {
                        previous: 0,    //前面是否还有
                        afterwards: 0,  //后面是否还有
                        start: -1,      //起始位置
                        end: -1         //结束位置
                    };
                    var len = hm_rows.length;
                    var genesLength = genes.length;
                
                    for (var m = 1; m >= 0; m--) {
                        var n1;
                        if (m == 1) {
                            for (n1 = 0; n1 < len; n1++) {
                                if (genes[m] == hm_rows[len - 1 - n1]) {
                                    pos.start = n1;
                                    break;
                                }
                            }
                        }
                        if (m == 0) {
                            for (n1 = 0; n1 < len; n1++) {
                                if (genes[m] == hm_rows[len - 1 - n1]) {
                                    pos.start = n1;
                                    break;
                                }
                            }
                            if (n1 == len) {
                                pos.previous = 1 //第一个元素未找到，第二个元素找到，则说明之前还有一个元素
                            }
                        }

                    }
                    for (var m = genesLength - 2; m < genesLength; m++) {
                        var n2;
                        if (m == genesLength - 2) {
                            for (n2 = 0; n2 < len; n2++) {
                                if (genes[m] == hm_rows[len - 1 - n2]) {
                                    pos.end = n2;
                                    break;
                                }
                            }
                        }
                        if (m == genesLength - 1) {
                            for (n2 = 0; n2 < len; n2++) {
                                if (genes[m] == hm_rows[len - 1 - n2]) {
                                    pos.end = n2;
                                    break;
                                }
                            }
                            if (n2 == len) {
                                pos.afterwards = 1  //倒数第二个元素找到，倒数第一个元素未找到，则说明之后还有一个元素
                            }
                        }

                    }
                    if (pos.previous == 1) {
                        pos.start = pos.start - 1
                    }
                    if (pos.afterwards == 1) {
                        pos.end = pos.end + 1
                    }
                    var top = $('#heatmap').get(0).scrollTop;
                    var index1 = pos.start - parseInt(top / step);
                    var index2 = pos.end - parseInt(top / step);
                    clear_Style();
                    $('#heatmap').append('<div id="line_x1" class="target_line"></div><div id="line_x2" class="target_line"></div>');
                    $('#ll').append('<div id="ll_line_x1" class="target_line"></div>');
                    $('#ll').append('<div id="ll_line_x2" class="target_line"></div>');
                    $('#line_x1,#ll_line_x1').css('top', top + 16 * index1 + 7);
                    $('#line_x2,#ll_line_x2').css('top', top + 16 * index2 + 7);
                    $('#line_x1,#line_x2,#ll_line_x1,#ll_line_x2').css('left', 0);
                    $('#line_x1,#line_x2').width($('#heatmap img').width());
                    $('#ll_line_x1,#ll_line_x2').width($('#ll img').width());
                    //alert('start : '+pos[0]+' --  end : '+pos[pos.length-1]);
                    //alert(genes.length);
                }
            });

            $('#t_ .col').live('click', function () {
                var i = $(this).index();
                //var top=$('#img').get(0).scrollTop;
                var left = $('#heatmap').get(0).scrollLeft;
                var index = i - parseInt(left / step);
                clear_Style();
                if (!+[1, ]) {//IE browser
                    $("#t_ .col:eq(" + i + ")").css({
                        "font-weight": "bold",
                        color: "#6495ED"
                    });
                } else {  //Other browsers
                    $("#t_ .col:eq(" + i + ")").find("text").css({
                        "font-weight": "bold",
                        fill: "#6495ED"
                    });
                }
                $('#heatmap').append('<div id="line_y" class="target_line"></div>');
                $('#tt').append('<div id="tt_line_y" class="target_line"></div>');
                $('#line_y').height($('#heatmap img').height());
                $('#tt_line_y').height($('#tt img').height());
                $('#line_y,#tt_line_y').css('top', 0);
                $('#line_y,#tt_line_y').css('left', left + 16 * index + 7);
            });

            function makeGeneLists(hm_rows, hm_cols) {
                var rowHtml = '';
                var rowsLength = hm_rows.length;
                var colsLength = hm_cols.length;
                /*
                if (16 * colsLength < $('#l_').width()) {
                    $('#l_').width(16 * colsLength + 5);
                }
                if (16 * rowsLength < $('#heatmap').height()) {
                    $('#heatmap,#r_,#ll').height(16 * rowsLength + 15);
                }
              */
                var currentHeight = $(window).height() - $('#tt').height() - $('#t_').height();
                var currentWidth = $(window).width() - $('#left').width() - $('#sr_').width();
                if ( 16 * rowsLength > currentHeight) {
                    $('#heatmap,#r_,#ll').height(currentHeight - 20);
                }else{
                    $('#heatmap,#r_,#ll').height(16 * rowsLength + 20);
                }
                if ( 16 * colsLength > currentWidth) {
                    $('#l_').width(currentWidth - 20);
                }else{
                    $('#l_').width(16 * colsLength + 20);
                }

                $('#reclust_content').width($('#l_').width() + $('#ll').width() + $('#r_').width() + 5);
        
                for (var i = 0; i < colsLength; i++) {
                    var d = $.trim(hm_cols[i]);
                    var colHtml;
                    if (!+[1, ]) {//IE浏览器
                        colHtml = '<div class="col" id="text_' + d + '"  style="overflow:visible;">' + d + '</div>';
                        $('#t_').append(colHtml);
                    } else {    //非IE浏览器
                        d = d.replace(".","-");
                        colHtml = '<div class="col" id="text_' + d + '"  style="overflow:visible;"></div>';
                        $('#t_').append(colHtml);
                        Raphael("text_" + d).text(0, 5, d).transform("r-60");
                    }
                }
                for (var j = rowsLength - 1; j >= 0; j--) { //输出的genelist是倒序的
                    rowHtml += '<p>' + $.trim(hm_rows[j]) + '</p>';
                }
                $('#r_').append(rowHtml);
            }

            function clear_Style() {
                $('.target_line').remove();
                $("#t_ .col").find("text").css({
                    "font-weight": "normal",
                    fill: "#333"
                });
                $("#t_ .col").css({
                    "font-weight": "normal",
                    color: "#333"
                });
                $("#r_ p").css({
                    "font-weight": "normal",
                    color: "#333"
                });
            }
    
            function getScore(query, array) {
                var score = '0';
                $.ajax({
                    type: 'get',
                    url: Const.URL_GETSCORE,
                    dataType: 'json',
                    data: {
                        query: query,
                        array: array,
                        filename: data.filename
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
    
            function getSelectedText() {
                if (window.getSelection) {
                    return window.getSelection().toString();
                } else if (document.selection) {
                    return document.selection.createRange().text;
                }
                return '';
            }   
        };
        
        return {
            showHeatMap: showHeatMap
        };
        
    });

