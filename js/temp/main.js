var isMouseDown; //标记鼠标是否按下
var step = 16; //每个单元的size
var _rows, _cols; //存放两个横列的基因数目
//var interval=0;
//var excutime=0;
var _top = 0,
    _left = 0;
var instance_1, instance_2;
var Layout;
console.log("now main.js");

var $j = jQuery.noConflict();

$j(function() {
    $j('#view_container').height($j(window).height() - 12);
    Layout = $j('#view_container').layout({//页面布局，east初始隐藏
            east__size: 675
        //,east__maxSize:   675
          , east__minSize: 400,
            east__resizable: true,
            east__initClosed: true,
            east__onresize: function() {
                sizeImagick();
                sizeImageArea();
            },
            east__onclose: function() {
                reSizeImagick();
            },
            east__onopen: function() {
                sizeImagick();
            }
    });


    $j('#getImagick').live('click', function() {

            var timeout;
            if (Layout.state.east.isClosed) {
            timeout = 250;
            } else {
            timeout = 0;
            }
            $j('#east-content,#east-content-2').hide();
            $j('.s_loading').hide();
            $j('.imgLoading').show();
            Layout.show("east");
            Layout.open("east");
            Layout.sizePane('east', 675);
            $j('#imagick').css('z-index', 15);
            $j('#imagick').show();
            $j('#east-content-2,#t,#r').empty();
            $j('.imgareaselect-selection').parent().hide();
            $j('.imgareaselect-outer,.imgareaselect-selection').hide();
            $j('#s p').remove();
            //Layout.close("west");
            $j('#viewer').width($j(window).width() - $j('#imagick').width() - $j('#navbar').width());
            var pos = $j('.canvas').attr('d'); //取出截取位置的坐标
            var x = parseInt(pos.split('_')[0]);
            var y = parseInt(pos.split('_')[1]);
            var w = parseInt(pos.split('_')[2]);
            var h = parseInt(pos.split('_')[3]);
            //初始化外围区域的大小
            $j('#l').width(480);
            $j('#img').height(640);
            $j('#r').height(640);
            //标示截取区域
            $j('.selected_area').remove();
            var div = '<div class="selected_area"></div>';
            $j('#viewer').append(div);
            var d1 = parseFloat($j('.imgareaselect-selection').parent().width() / parseInt($j('.canvas').css('width'))); //储存宽度比例
            var d2 = parseFloat($j('.imgareaselect-selection').parent().height() / parseInt($j('.canvas').css('height'))); //储存高度比例
            var left_gap = parseInt($j('.imgareaselect-selection').parent().css('left'))- parseInt($j('.canvas').css('left'));
            var top_gap = parseInt($j('.imgareaselect-selection').parent().css('top')) - parseInt($j('.canvas').css('top')); //获取初始相对位移
            var current_radio = $j('.canvas').attr('r'); //记录canvas的初当前缩放比例
            //console.log('l_'+left_gap+' t_'+top_gap);
            $j('.selected_area').attr('wr', d1);
            $j('.selected_area').attr('hr', d2);
            $j('.selected_area').attr('c_r', current_radio);
            $j('.selected_area').attr('left_gap', left_gap);
            $j('.selected_area').attr('top_gap', top_gap); //数据存储
            $j('#viewer .selected_area').css({
                width: $j('.imgareaselect-selection').parent().width() - 2,
                height: $j('.imgareaselect-selection').parent().height() - 2,
                left: parseInt($j('.imgareaselect-selection').parent().css('left')),
                top: parseInt($j('.imgareaselect-selection').parent().css('top'))
            });
            $j('#viewer .selected_area').show();
            //alert(x+'_'+y+'_'+w+'_'+h);
            setTimeout(function() { //to make the loading image show,so there is time out
                $j.ajax({
                    type: 'GET',
                    url: 'http://115.156.216.95/sga_lss/index.php/sga/imagick',
                    dataType: 'jsonp',
                    async: false,
                    data: {
                        x: x,
                        y: y,
                        w: w,
                        h: h,
                        user:SGA.userName,
                        name:(SGA.imageName.split("_"))[0] + "_r"
                    },
                    success: function(data) {
                        $j('#img .target_line').remove();
                        $j('#imagick').show();
                        $j('#east-content').show();
                        $j('.imgLoading').hide();
                        var src = 'http://115.156.216.95/sga_lss/data/' + 'new_' + data + '.png';
                        $j('#img img').attr('src', src);
                        getGeneItems(x, y, w, h); //产生横纵基因信息         
                        $j('#img img').css('width', 8 * w); //图片区域设置为实际大小的8倍
                        $j('#img img').css('height', 8 * h);
                        if (8 * w < $j('#l').width()) {
                            $j('#l').width(8 * w + 25);
                        }
                        if (8 * h < $j('#img').height()) {
                            $j('#img,#r').height(8 * h + 25);
                        }
                        if ($j(window).height() - $j('#t').height() < 8 * h) {
                            $j('#img,#r').height($j(window).height() - $j('#t').height() - 25);
                        }
                        $j('#east-content').width($j('#l').width() + $j('#sr').width() + 5);
                        if ($j('#east-content').width() < Layout.state.east.size + 30) {
                            Layout.sizePane('east', $j('#east-content').width() + 30);
                        }
                        //var step=16;                                //每个单元的size     
                        var row = parseInt($j('#r').height() / step); //每次显示的行列数
                        var col = parseInt($j('#t').width() / step);
                        var scrollWidth = parseInt($j('#img').get(0).offsetWidth - $j('#img').get(0).clientWidth); //滚动条的宽度
                        var extra_n = parseInt(scrollWidth / step);
                        $j('#r p').show();
                        $j('#t .col').show();
                        $j('#r p:gt(' + parseInt(row - 1 - extra_n) + ')').hide(); //初始显示的行列数，除去滚动条对应的那一行
                        $j('#t .col:gt(' + parseInt(col - 1 - extra_n) + ')').hide();
                        $j('#matrix').show();
                    }
                });
            }, timeout);
    });


    $j('#reCluster').live('click', function() {
        var timeout;
        if (Layout.state.east.isClosed) {
            timeout = 250;
        } else {
            timeout = 0;
        }
        var row1 = parseInt($j('#matrixBtn #r1').val());
        var row2 = parseInt($j('#matrixBtn #r2').val());
        var col1 = parseInt($j('#matrixBtn #c1').val());
        var col2 = parseInt($j('#matrixBtn #c2').val());
        //var row1 = 10;
        //var row2 = 460;
        //var col1 = 20;
        //var col2 = 320;
        $j('.imgareaselect-selection').parent().hide();
        $j('.imgareaselect-outer,.imgareaselect-selection').hide();
        $j('#east-content,#east-content-2').hide();
        $j('.s_loading').hide();
        $j('.imgLoading').show();
        Layout.show("east");
        Layout.open("east");
        Layout.sizePane('east', 875);
        $j('#east-content-2').width(800);
        //标示截取区域
        $j('.selected_area').remove();
        var div = '<div class="selected_area"></div>';
        $j('#viewer').append(div);
        var d1 = parseFloat($j('.imgareaselect-selection').parent().width() / parseInt($j('.canvas').css('width'))); //储存宽度比例
        var d2 = parseFloat($j('.imgareaselect-selection').parent().height() / parseInt($j('.canvas').css('height'))); //储存高度比例
        var left_gap = parseInt($j('.imgareaselect-selection').parent().css('left')) - parseInt($j('.canvas').css('left'));
        var top_gap = parseInt($j('.imgareaselect-selection').parent().css('top')) - parseInt($j('.canvas').css('top')); //获取初始相对位移
        var current_radio = $j('.canvas').attr('r'); //记录canvas的初当前缩放比例
        //console.log('l_'+left_gap+' t_'+top_gap);
        $j('.selected_area').attr('wr', d1);
        $j('.selected_area').attr('hr', d2);
        $j('.selected_area').attr('c_r', current_radio);
        $j('.selected_area').attr('left_gap', left_gap);
        $j('.selected_area').attr('top_gap', top_gap); //数据存储
        $j('#viewer .selected_area').css({
            width: $j('.imgareaselect-selection').parent().width() - 2,
            height: $j('.imgareaselect-selection').parent().height() - 2,
            left: parseInt($j('.imgareaselect-selection').parent().css('left')),
            top: parseInt($j('.imgareaselect-selection').parent().css('top'))
        });
        $j('#viewer .selected_area').show();
        //加载重新生成的图
        setTimeout(function() { //to make the loading image show,so there is time out
            $j.ajax({
                type: 'GET',
                dataType: "jsonp",
                url: 'http://115.156.216.95/sga_lss/R/testdesc',
                data: {
                    r1: row1,
                    r2: row2,
                    c1: col1,
                    c2: col2,
                    user:SGA.userName,
                    matrix:SGA.fileName
                },
                async: false,
                success: function(data) {
                    //alert(data);
                    $j('#east-content-2,#t,#r').empty();
                    $j('.imgLoading').hide();
                    $j('#imagick').show();
                    var server='http://115.156.216.95/sga_lss/';
                    var imagick_html='<div id="main_container"><div id="left"><div id="colorkey"><img src="'+server+data.color_key+'" alt="colorkey"/></div><div id="ll">'+
                        '<img src="'+server+data.col_image+'" alt="colImage"/></div></div><div id="l_"><div id="tt"><img src="'+server+data.row_image+'" alt="rowImage"/></div>'+ 
                        '<div id="heatmap"><img src="'+server+data.image_path+'" alt="heatmap"/></div><div id="t_"></div></div>'+
                        '<div id="sr_"><div id="s_"><div class="ss_loading"></div></div><div id="r_"></div></div></div>';
                    $j('#east-content-2').append(imagick_html);
                    SGA.row_parts=data.col_names;
                    SGA.col_parts=data.row_names;
                    $j.getScript("./js/heatmap.js");
                    $j('#east-content-2').show();
                },
                error: function() {}
            });
        }, timeout);

        if ($j('#east-content-2').width() < Layout.state.east.size + 30) {
                setTimeout(function() {
                        Layout.sizePane('east', $j('#east-content-2').width() + 30);
                }, 50);
        }
    });


     $j('#img').scroll(function() {
            var top = this.scrollTop;
            var left = this.scrollLeft; //获取滚动条移动的距离  
            var _this = this;
            clearTimeout(instance_1); //清除上次的生成
            instance_1 = setTimeout(function() { //两次触发时间间隔超过一定值才执行
                //excutime+=1;
                //$j('#pointer_2').text(excutime); 
                var row = parseInt($j('#r').height() / step); //每次显示的行列数
                var col = parseInt($j('#t').width() / step);
                //$j('#r p:gt('+parseInt(row-1)+')').hide();
                //$j('#t span:gt('+parseInt(col-1)+')').hide();
                var scrollWidth = parseInt(_this.offsetWidth) - parseInt(_this.clientWidth); //滚动条的宽度
                var extra_n = parseInt(scrollWidth / step);
                var rows_n = Math.round(top / step);
                var cols_n = Math.round(left / step);
                $j('#r p').show(); //设置显示与隐藏的行与列
                $j('#r p:lt(' + rows_n + ')').hide();
                $j('#r p:gt(' + parseInt(row + rows_n - 1 - extra_n) + ')').hide();
                $j('#t .col').show();
                $j('#t .col:lt(' + cols_n + ')').hide();
                $j('#t .col:gt(' + parseInt(col + cols_n - 1 - extra_n) + ')').hide();
                if (top != rows_n * step) { //调整滚动条位置，为整数个小区域
                    $j(_this).scrollTop(rows_n * step);
                }
                if (left != cols_n * step) {
                    $j(_this).scrollLeft(cols_n * step);
                }
            }, 50);
        });


        $j('#img').live('click', function(e) {
            var _this = this;
            clearTimeout(instance_2); //清除上次的生成
            var pointer_X = e.clientX || (e.pageX + (document.documentElement.scrollLeft || document.body.scrollLeft));
            var pointer_Y = e.clientY || (e.pageY + (document.documentElement.scrollTop || document.body.scrollTop));
            //alert('e.clientX : '+pointer_X +'  e.clientY : '+ pointer_Y);         //鼠标位置       
            var x = pointer_X - $j(_this).offset().left + _this.scrollLeft;
            var y = pointer_Y - $j(_this).offset().top + _this.scrollTop; //相对左上角的偏移
            var scrollWidth = parseInt(_this.offsetWidth) - parseInt(_this.clientWidth); //滚动条的宽度
            var w = $j('#img').width();
            var h = $j('#img').height(); //显示框的高度
            if ((_this.scrollLeft + w - x <= scrollWidth) || (_this.scrollTop + h - y <= scrollWidth)) {
                //alert('No action!!');           //鼠标移至滚动条上面时无动作
                return;
            }
            var index_x = Math.floor(x / step);
            var index_y = Math.floor(y / step);
            var target_x = 16 * parseInt(x / 16) + 7;
            var target_y = 16 * parseInt(y / 16) + 7;
            clearStyle();
            $j(_this).append('<div id="line_x" class="target_line"></div>');
            $j(_this).append('<div id="line_y" class="target_line"></div>');
            $j('#line_x').width($j('#img img').width());
            $j('#line_x').css('top', target_y);
            $j('#line_x').css('left', 0);
            //$j('#line_x').css('left',this.scrollLeft);
            $j('#line_y').height($j('#img img').height());
            $j('#line_y').css('left', target_x);
            $j('#line_y').css('top', 0);
            //$j('#line_y').css('top',this.scrollTop);                        
            if (!+[1, ]) { //IE browser
                $j("#t .col:eq(" + index_x + ")").css({
                        "font-weight": "bold",
                        color: "#6495ED"
                });
            } else { //Other browsers
                $j("#t .col:eq(" + index_x + ")").find("text").css({
                        "font-weight": "bold",
                        fill: "#6495ED"
                });
            }
            $j("#r p:eq(" + index_y + ")").css({
                    "font-weight": "bold",
                    color: "#6495ED"
            });
            instance_2 = setTimeout(function() { //两次触发时间间隔超过一定值才执行  
                if (!+[1, ]) { //IE browser
                    var array = $j("#t .col:eq(" + index_x + ")").text();
                } else {
                    var array = $j("#t .col:eq(" + index_x + ")").find("text").text();
                }
                var query = $j("#r p:eq(" + index_y + ")").text();
                //alert(query+'_'+array);
                $j('#s p').remove();
                $j('.s_loading').show();

                //TODO: getScore待处理
                var htm = '<p><b>query : </b>' + query.split('_')[0] + '<br/><b>array : </b>' + 
                array.split('_')[0] + '<br/><b>score : </b>'+getScore(query, array)+'</p>';


                $j('#s').append(htm);
                $j('.s_loading').hide();
            }, 1000); //延迟1000ms执行
    });

    $j('#r p').live('click', function() { //  点击右边的条目，变色，加线
        var i = $j(this).index();
        var top = $j('#img').get(0).scrollTop;
        //var left=$j('#img').get(0).scrollLeft;
        var index = i - parseInt(top / step);
        clearStyle();
        $j("#r p:eq(" + i + ")").css({
            "font-weight": "bold",
            color: "#6495ED"
            });
        $j('#img').append('<div id="line_x" class="target_line"></div>');
        $j('#line_x').css('top', top + 16 * index + 7);
        $j('#line_x').css('left', 0);
        $j('#line_x').width($j('#img img').width());
    });

    $j('#t .col').live('click', function() {
        var i = $j(this).index();
        //var top=$j('#img').get(0).scrollTop;
        var left = $j('#img').get(0).scrollLeft;
        var index = i - parseInt(left / step);
        clearStyle();
        if (!+[1, ]) { //IE browser
            $j("#t .col:eq(" + i + ")").css({
                "font-weight": "bold",
                color: "#6495ED"
            });
        } else { //Other browsers
            $j("#t .col:eq(" + i + ")").find("text").css({
                "font-weight": "bold",
                fill: "#6495ED"
            });
        }

        $j('#img').append('<div id="line_y" class="target_line"></div>');
        $j('#line_y').height($j('#img img').height());
        $j('#line_y').css('top', 0);
        $j('#line_y').css('left', left + 16 * index + 7);
    });

});

function clearStyle() {
    $j('.target_line').remove();
    $j("#t .col").find("text").css({
        "font-weight": "normal",
        fill: "#333"
    });
    $j("#t .col").css({
        "font-weight": "normal",
        color: "#333"
    });
    $j("#r p").css({
        "font-weight": "normal",
        color: "#333"
    });
}


function getPos(gene, arrs) { //获取某个基因在横列中的位置
    var name = getStandardName(gene);
    for (var i = 0; i < arrs.length; i++) {
        var arr = $j.trim(arrs[i]).split('_')[0];
        if (name == arr) {
            return i;
            break;
        }
    }
    return -1;
}


function getGeneItems(x, y, w, h) { //获取截取区域对应的横纵列的基因并生成HTML
    $j('#t').empty();
    $j('#r').empty();
    //var initialWidth=7817;

    //TODO: 此处需要获取原图片高度，待添加
    var initialHeight = SGA.row_num*2;
    var rows_num = SGA.row_num;

    //var cols_num=3841;        //基因的横列数目

    //var _rows=$j.trim(getText('data/rows.txt')).split('\n');
    //var _cols=$j.trim(getText('data/cols.txt')).split('\n');
    var geneColNames = SGA.cols.split(' ');
    var geneRowNames = SGA.rows.split(' ');

    var colStartIndex = Math.round(x / 2) - 2;
    var colLength = Math.round(w / 2);
    var rowStartIndex = Math.round(y / 2) - 2;
    var rowLength = Math.round(h / 2);
    $j('#r_1').val(rowStartIndex + 1);
    $j('#r_2').val(rowStartIndex + rowLength);
    $j('#c_1').val(colStartIndex + 1);
    $j('#c_2').val(colStartIndex + colLength);
    var rowHtml = '';
    for (var i = colStartIndex; i < colStartIndex + colLength; i++) {
        var d = geneColNames[i];
        var colHtml;
        if (!+[1, ]) { //IE浏览器
            colHtml = '<div class="col" id="text_' + d + '"  style="overflow:visible;">' + d + '</div>';
            $j('#t').append(colHtml);
        } else { //非IE浏览器
            colHtml = '<div class="col" id="text_' + d + '"  style="overflow:visible;"></div>';
            $j('#t').append(colHtml);
            Raphael("text_" + d).text(0, 50, d).transform("r-60");
        }
    }
    for (var j = rowStartIndex; j < rowStartIndex + rowLength; j++) {
        rowHtml += '<p>' + geneRowNames[j] + '</p>';
    }
    $j('#r').append(rowHtml);
}


function getText(url) { //获取txt文本      
    var txt;
    $j.ajax({
        type: 'POST',
        url: url,
        dataType: "text",
        async: false,
        success: function(d) {
            txt = d;
        }
    });
    return txt;
}

function getStandardName(id) {
    var name = '';
    $j.ajax({
        type: 'POST',
        url: 'ajax_get_standardName.php',
        dataType: "JSON",
        data: {
            id: id
        },
        async: false,
        success: function(data) {
            name += data;
        }
    });
    return name;
}

function getScore(query, array) {
    var score='0';
    $j.ajax({
        type: 'get',
        url: 'http://115.156.216.95/sga_lss/index.php/sga/get_score',
        dataType: "jsonp",
        data: {
            query: query,
            array: array,
            user:SGA.userName,
            filename:SGA.fileName
        },
        async: false,
        success: function(data) {
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

function sizeImagick() {
    $j('#viewer').width($j(window).width() - $j('#imagick').width() - $j('#navbar').width() - 25);
}

function reSizeImagick() {
    $j('#viewer').width($j(window).width() - $j('#navbar').width() - 25);
}

function sizeImageArea() {
    if ($j('#east-content').css('display') != 'none') {
        if ($j('#img img').width() <= $j('#l').width() - 15) {
            return;
        }
        var currentWidth = Layout.state.east.size - 50 - $j('#sr').width();
        currentWidth = (currentWidth / 16) * 16;
        $j('#l').width(currentWidth);
        $j('#east-content').width(Layout.state.east.size - 30);
        $j('#img').trigger('scroll');
    } else if ($j('#east-content-2').css('display') != 'none') {
        if ($j('#heatmap img').width() <= $j('#l_').width() - 15) {
            return;
        }
        var currentWidth = Layout.state.east.size - 50 - $j('#left').width() - $j('#sr_').width();
        currentWidth = (currentWidth / 16) * 16;
        $j('#l_').width(currentWidth);
        $j('#east-content-2').width(Layout.state.east.size - 15);
        $j('#main_container').width(Layout.state.east.size - 15);
        $j('#heatmap').trigger('scroll');
    }
}

function resizeViewer() {
    if ($('#viewer').width() < $('#view').width() - 15) {
        $('#viewer').width($('#view').width());
    }
}
