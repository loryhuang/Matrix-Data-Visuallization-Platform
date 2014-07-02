/* HeatMap 2.0项目的JS全局命名空间 */
var HeatMap2 = (function () {
    "use strict";

    /**
     * 在Heatmap2全局变量之下创建一个命名空间
     * 用法：HeatMap2.namespace("HeatMap2.util");
     * @param ns_string 命名空间字符串
     * @returns {*|{}} 新创建的命名空间
     */
    var namespace = function (ns_string) {
        var parts = ns_string.split('.'),
            parent = HeatMap2,
            i;

        //剥离最前面的冗余全局变量
        if (parts[0] === "HeatMap2") {
            parts = parts.slice(1);
        }

        for (i = 0; i < parts.length; i++) {
            //如果不存在，就创建一个属性
            if (parent[parts[i]] === undefined) {
                parent[parts[i]] = {};
            }
            parent = parent[parts[i]];
        }
        return parent;
    };

    /**
     * 同步加载javascript文件
     * @param url 加载文件的url地址
     * @param callback [可选]加载完成后的回调函数
     */
    var require = function (url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        //IE
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    if (callback) {
                        callback();
                    }
                }
            };
        } else {
            script.onload = function () {
                if (callback) {
                    callback();
                }
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    };

    var requireSync = function (url) {
        // get some kind of XMLHttpRequest
        var xhrObj = new XMLHttpRequest();
        // open and send a synchronous request
        xhrObj.open('GET', url, false);
        xhrObj.send('');
        // add the returned content to a newly created script tag
        var se = document.createElement('script');
        se.type = "text/javascript";
        se.text = xhrObj.responseText;
        document.getElementsByTagName('head')[0].appendChild(se);

        console.log(url);
    };

//    requireSync("./js/util/Constant.js");

//    requireSync("./js/lib/jquery-1.7.2.min.js");
//    requireSync("./js/lib/jquery.layout-latest.js");


    //库文件的基本URL
    var LIB_BASE_URL = "./js/lib/",
    //库文件列表
        libList = [
            "jquery-1.7.2.min.js",
            "jquery.layout-latest.js",
            "jquery-ui-1.8.17.custom.min.js",
            "jquery.imgareaselect.js",
            "underscore-min.js",
            "mootools-core-1.3.2-full-nocompat.js",
            "mootools-more-1.3.2.1.js",
            "protocols.js",
            "raphael.js",
            "iipmooviewer-2.0.js"
        ];

    var i, len;
//    for (i = 0, len = libList.length; i < len; i++) {
//        libList[i] = LIB_BASE_URL + libList[i];
//        requireSync(libList[i]);
//    }


    /**
     * jQuery的全局引用
     * @type {*}
     */
    var $ = jQuery.noConflict();

    return {
        namespace: namespace,
        require: require,
        requireSync: requireSync,
        $: $
    };
}());
