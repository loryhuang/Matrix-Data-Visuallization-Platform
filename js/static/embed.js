/**
 * 提供给用户的页面绑定heatmap缩略图的方法
 * @author Ray Taylor Lin
 */

(function (hm2) {
    function loadScript(src, callback) {
        var s,
            r;
        r = false;
        s = document.createElement('script');
        s.type = 'text/javascript';
        s.charset = 'UTF-8';
        s.src = src;
        s.onload = s.onreadystatechange = function () {
            if (!r && (!this.readyState || this.readyState == 'complete')) {
                r = true;
                callback();
            }
        };
        (document.getElementsByTagName('head')[0]
            || document.getElementsByTagName('body')[0]).appendChild(s);
    }

    var jqueryUrl = 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js';
    loadScript(jqueryUrl, function () {
        var url = "http://115.156.216.95/sga_lss/index.php/embed/preview";
//        var url = "http://localhost/heatmap2/trunk/index.php/embed/preview";
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'jsonp',
            jsonp: 'callback',
            data: {token: hm2.token},
            success: function (result) {
                $('#' + hm2.containerId).append($('<a href="' + result.targetUrl + '">' +
                    '<img src="' + result.imgUrl + '" width="400" heigth="300"></a>'));
            }
        });
    });
})(window.hm2);
