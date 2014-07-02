require.config({
    baseUrl: './js'
});

require([
    'process/present'//,
    //'modules/page'
], function (present) {
    "use strict";
    present.getImage();
   
    //载入标记和房间信息页面
    /*
    page.loadMarkPage();
    setTimeout(function () {
        page.loadRoomPage('enter');
        
    }, 500);
    */

    //若URL带hash，则默认是为进入房间，在服务器端验证hash
//    if (window.location.hash !== "") {
//        var hash = window.location.hash.substr(1);
//        page.loadRoomPage('enter', hash);
//    } else {
//        page.loadMarkPage();
//    }

    //page.loadPersonInfoPage();
    //$(".nav-right .pull-right .dropdown-menu li").eq(1).trigger("click");

    setTimeout(function () {
        present.showImage();
    }, 50);

});
