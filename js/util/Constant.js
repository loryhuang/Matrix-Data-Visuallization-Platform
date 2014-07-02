define(function () {
    "use strict";
    var
        localDebugMode = false,
        URL_TEST_SERVER = "http://115.156.216.95/HM_S/",
        URL_TEST_NODE_SERVER = "http://localhost:3000",
        URL_NODE_SERVER = "http://115.156.216.95:3000",

        urlServer = localDebugMode ? URL_TEST_SERVER : "",
        urlNodeServer = localDebugMode ? URL_TEST_NODE_SERVER : URL_NODE_SERVER;

    return {
        //是否是本地DEBUG模式
        //开启本地DEBUG模式后，与服务器端R模块的交互采用跨域JSONP请求
        LOCAL_DEBUG: localDebugMode,
        AJAX_DATA_TYPE: localDebugMode ? "jsonp" : "json",

        HEATMAP_UNIT_SIZE:16,

        URL_R_RECLUSTER: urlServer + "R/reclust",
        URL_NO_CLUSTER: urlServer + "R/no_cluster",
        URL_R_TESTDESC: urlServer + "R/testdesc",
        URL_R_PARSE_CDT: urlServer + "R/parse_cdt",
        URL_R_MREGE_TESTDESC:urlServer + "R/merge_testdesc",
        URL_TRANS_PNG_TIFF: urlServer + "index.php/sga/png2tiff",
        URL_IMAGICK: urlServer + "index.php/sga/imagick",
        URL_GET_GENE: urlServer + "index.php/sga/get_gene_items",
        URL_GETSCORE: urlServer + "index.php/sga/get_score",
        URL_LOG_IMAGE: urlServer + "index.php/sga/log_image_info",
        URL_UPDATE_CDT: "index.php/sga/update_cdt_file",
        URL_ADD_MARK: "index.php/mark/insert",
        URL_DEL_MARK:"index.php/mark/del_mark",
        URL_GET_MARK: "index.php/mark/get_mark",
        URL_GET_CREATER_MARK: "index.php/mark/get_usermake_mark",
        URL_GET_TOP_MARK: "index.php/mark/get_hotest_mark",
        URL_GET_LATEST_MARK: "index.php/mark/get_latest_mark",
        URL_GET_ALL_MARK: "index.php/mark/get_all_mark",
        URL_ADD_COLLECT: "index.php/mark/add_collect",
        URL_SEND_MAIL: "index.php/sga/send_email",

        URL_SHOW_IMAGICK: "index.php/sga/show_imagick",
        URL_SHOW_RECLUST: "index.php/sga/show_reclust",
        
        URL_ENTER_ROOM: URL_TEST_NODE_SERVER + "room",
        URL_NODE_SERVER: urlNodeServer,
        
        BASE_URL : urlServer,
        TEMP_IMG_URL:urlServer + "tmp/",
        DATA_PATH_URL:URL_TEST_SERVER + "data/",
        IIPSERVER_URL: "/fcgi-bin/iipsrv.fcgi",
        IIPSERVER_CREDIT: "&copy; copyright or information message"
    };
});
