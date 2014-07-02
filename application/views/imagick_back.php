<base href="<?php echo base_url(); ?>"/>
<!DOCTYPE html>
<html>
    <head>
        <title>detail of heatmap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="./css/imagick.css" />
    </head>
    <body>

        <div class="imgLoading" style="clear:both;display:none"></div>
        <div id="east-content">
            <div id="l">                 
                <div id="t"></div>
                <div id="img">
                    <img src="<?= $imagename ?>" alt="Imagick"/>
                </div>
            </div>
            <div id="sr">
                <div id="s"><div class="s_loading"></div></div>
                <div id="r"></div>                     
            </div>

            <script src="./js/lib/jquery-1.7.2.min.js"></script>
            <script src="./js/lib/raphael.js"></script>
            <script type="text/javascript">

                var publicData = {};
                publicData.server = "http://115.156.216.95/HM_S/";
                publicData.imageUrl =  publicData.server + "tmp/" + "<?= $imagename ?>";
                publicData.URL_GETSCORE = publicData.server + "index.php/sga/get_score";

                var instance_1,instance_2;
                var step = 16;
    
                $(function(){

                    //接收传过来的数据
                    var rows = "<?= $rows ?>";
                    publicData.rows = rows.split(' ');
                    publicData.row_num = publicData.rows.length;

                    var cols = "<?= $cols ?>";
                    publicData.cols = cols.split(' ');
                    publicData.col_num = publicData.cols.length;

                    var x = "<?= $x ?>";
                    var y = "<?= $y ?>";
                    var w = "<?= $w ?>";
                    var h = "<?= $h ?>";

                    publicData.filename = "<?= $filename ?>";
                    $("#img img").attr("src", publicData.imageUrl);
                    //生成横列基因
                    getGeneItems(x, y, w, h);

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

                //图像点击事件
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

                //点击右边的条目，变色，加线
                $('#r p').live('click', function () { 
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

                //点击上边的条目，变色，加线
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

                //点击后先清除样式
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


                //获取截取区域对应的横纵列的基因并生成HTML
                function getGeneItems(x, y, w, h) {
                    $('#t').empty();
                    $('#r').empty();
        
                    //获取原图片高度
                    var initialHeight = publicData.row_num * 2;
                    var initialWidth = publicData.col_num * 2;
        
                    //var _rows=$.trim(getText('data/rows.txt')).split('\n');
                    //var _cols=$.trim(getText('data/cols.txt')).split('\n');
                    var geneColNames = publicData.cols;
                    var geneRowNames = publicData.rows;

                    var colStartIndex = Math.round(x / 2);
                    var colLength = Math.round(w / 2);
                    var rowStartIndex = Math.round(y / 2);
                    var rowLength = Math.round(h / 2);
        
                    var rowHtml = '';
                    for (var i = colStartIndex; i < colStartIndex + colLength; i++) {
                        var d = geneColNames[i];
                        d = d.replace(".","-");
                        var colHtml;
                        if (!+[1, ]) { //IE浏览器
                            colHtml = '<div class="col" id="text_' + d + '"  style="overflow:visible;">' + d + '</div>';
                            $('#t').append(colHtml);
                        } else { 	  //非IE浏览器
                            colHtml = '<div class="col" id="text_' + d + '"  style="overflow:visible;"></div>';
                            $('#t').append(colHtml);
                            Raphael("text_" + d).text(0, 50, d).transform("r-60");
                        }
                    }
                    for (var j = rowStartIndex; j < rowStartIndex + rowLength; j++) {
                        rowHtml += '<p>' + geneRowNames[j] + '</p>';
                    }
                    $('#r').append(rowHtml);


                    //超出窗口就缩小,否则按实际大小
                    if ((8*w + $('#sr').width() + 25) > $(window).width()){
                        $('#l').width($(window).width() - $('#sr').width() - 45);
                    }else{
                        $('#l').width(8 * w + 25);
                    }

                    if(($('#t').height() + 8 * h + 25) > $(window).height()){
                        $('#img,#r').height($(window).height() - $('#t').height() - 25);
                    }else{
                        $('#img,#r').height(8 * h + 25);
                    }
                    
                    //小于指定区域就缩小
                    /*
                    if (8 * w < $('#l').width()) {
                        $('#l').width(8 * w + 25);
                    }
                    if (8 * h < $('#img').height()) {
                        $('#img,#r').height(8 * h + 25);
                    }
                 */
	
                    var row = parseInt($('#r').height() / step); //每次显示的行列数
                    var col = parseInt($('#t').width() / step);
                    var scrollWidth = parseInt($('#img').get(0).offsetWidth - $('#img').get(0).clientWidth); //滚动条的宽度
                    var extra_n = parseInt(scrollWidth / step);
                    $('#r p').show();
                    $('#t .col').show();
                    $('#r p:gt(' + parseInt(row - 1 - extra_n) + ')').hide(); //初始显示的行列数，除去滚动条对应的那一行
                    $('#t .col:gt(' + parseInt(col - 1 - extra_n) + ')').hide();
                }

                //获取某个基因在横列中的位置
                function getPos(gene, arrs) { 
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

                function getScore(query, array) {
                    var score = '0';
                    $.ajax({
                        type: 'get',
                        url: publicData.URL_GETSCORE,
                        dataType: 'json',
                        data: {
                            query: query,
                            array: array, 
                            filename: publicData.filename
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
            </script>           
    </body>
</html>
