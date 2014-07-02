require.config({
    baseUrl: './js'
});

define([
    'util/Constant',
    'util/Cache',
    'process/reclust',
    'lib/jquery-1.7.2.min',
    'lib/raphael'
], function (Const, Cache ,reclust) {
    "use strict";
   
    $(function () {
        
       //全局参数
       var data = {
                color_key : $("input[name='color_key']").val(),
                col_image : $("input[name='col_image']").val(),
                row_image : $("input[name='row_image']").val(),
                image_path : $("input[name='image_path']").val(),
                filename :  $("input[name='filename']").val(),
                rows : $("input[name='rows']").val(),
                cols : $("input[name='cols']").val(),
                step : 16
        };
        
        //保存在缓存中，传送到另一文件
        Cache.putData("reclust_data" , data);
        
        var server = Const.BASE_URL;
        
        //APPEND DOM
        var imagick_html = '<div id="main_container">'+
            '<div id="left"><div id="colorkey"><img src="' + server + data.color_key + '" alt="colorkey"/></div><div id="ll">' +
            '<img src="' + server + data.col_image +'" alt="colImage"/></div></div><div id="l_"><div id="tt"><img src="' + 
            server + data.row_image + '" alt="rowImage"/></div>' +
            '<div id="heatmap"><img src="' + server + data.image_path + '" alt="heatmap"/></div><div id="t_"></div></div>' +
            '<div id="sr_"><div id="s_"><div class="ss_loading"></div></div><div id="r_"></div></div></div>';
        $('#reclust_content').append(imagick_html);
        
        //RENDER DOM
        reclust.showHeatMap();
    });
});