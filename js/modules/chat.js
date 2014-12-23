require.config({
    baseUrl: './js',
    paths: {
        jquery: 'lib/jquery-1.7.2.min',
        socket_io: 'http://115.156.216.95:3000/socket.io/socket.io.js',
        jquery_atwho: 'lib/jquery.atwho.min'
//        socket_io: 'http://localhost:3000/socket.io/socket.io.js'
    },
    shim: {
        "jquery_atwho": {
            deps: ['jquery']
        }
    }
});

define([
    'jquery',
    'util/Constant',
    'util/Tools',
    'util/Cache',
    'socket_io',
    'process/present',
    'jquery_atwho'
], function ($, Const, Tools, Cache, io, present, atwho) {
    "use strict";
    var socket;
    var roomId,
        roomHash,
        userId,
        username = $("#data_form input[name='username']").val();

    var atTextList = [];

    /**
     * 发送文字
     * @param {String} roomPageId 以#开头的tab唯一标识
     * @param {String} text 要发送的文字
     */
    var sendText = function (roomPageId, text) {
        var roomId = roomPageId.slice(roomPageId.indexOf('-') + 1);
        var roomHash = $(roomPageId + ' input[name=hash]').attr('value');
        if (!$.trim(text)) {
            return;
        } else {
            //将发送的文字提交到服务器数据库保存，
            //成功后再显示到页面上，并发送到socketIO服务器
            $.ajax({
                type: 'POST',
                url: 'index.php/room/add_conversation',
                data: {
                    'room_id': roomId,
                    'text': text,
                    'mark_id': 0
                },
                complete: function (data) {
                    var userhead = $('#userInfo .head_portrait_small').attr('src');
                    console.log('Added conversation id: ' + data.responseText);
                    //提交到socket.io
                    socket.emit('USER_MESSAGE', {
                        msg: text,
                        username: username,
                        userhead: userhead,
                        hash: roomHash
                    });
                    //在本地显示信息
                    showMessage(roomPageId, username, userhead, text, false);
                    var scrolltop = $(roomPageId).find(".auto-flow").get(0).scrollHeight - $(roomPageId).find(".auto-flow").height();
                    $(roomPageId).find(".auto-flow").animate({ scrollTop: scrolltop + "px" }, 500);
                }
            });
            $(roomPageId + ' .send_msg').val('');
            $(roomPageId + ' .send_msg').focus();
        }
    };

    /**
     * At一个mark，仅在文本框中填充文字
     * @param roomPageId
     * @param markInfo
     */
    var atMark = function (roomPageId, markInfo) {
        var $textarea = $(roomPageId + ' textarea');
        $textarea.val($textarea.val() + '#@' + markInfo.title + '# ');
    };

    var _setHeight = function (roomPageId) {
        var height = $(window).height() > 768 ? $(window).height() : 768;
        var offset = 473;
        var real_height = height - 60;
        var auto_height = height - offset;
        $(".left-wrapper").css('height', real_height);
        $(".right-wrapper").css('height', real_height);
        $(roomPageId + " .auto-flow").css('height', auto_height);
        var scrolltop = $(roomPageId + " .auto-flow").get(0).scrollHeight - auto_height;
        $(roomPageId + " .talk_board").animate({ scrollTop: scrolltop + "px" }, 500);
    };

    function text_cut(src, length) {
        if(src.length > length){
            return src .substr(0,length) + '...';
        } else {
            return src;
        }
    }

    /**
     * 显示消息
     * @param src 消息来源
     * @param msg 消息内容
     * @param userhead 用户头像路径
     * @param fromOthers 消息是否来自其他人
     */
    var showMessage = function (roomPageId, src, userhead, msg, fromOthers, dateStr) {
        //将发送的内容显示到页面上
//        msgHead = (src === 'Server' ? '[Server] ' : (src + ': ')),
        var i,
            msgHead = (src === 'Server' ? '[Server] ' : src),
            date = new Date(),
            dateStr = dateStr || date.toDateString() + ' ' + date.toTimeString().split(' ')[0],
            type = fromOthers ? 'row-chat-left' : 'row-chat-right',
            color_type = fromOthers ? 'chat_content_others' : 'chat_content_self',
            userheadHtml = userhead ?
                '<a class="userhead" href="javascript:void(0)">' +
                    '<img src="{0}" title="{1}"></a>'.format(userhead, src) : ' ';

        //建立所有mark的从@title到id的映射
        var allRoomMarkTitleToId = {},
            allMarkList = Cache.getData('allMarkList');
        for (i = 0; i < allMarkList.length; i++) {
            allRoomMarkTitleToId['@' + allMarkList[i].title] = allMarkList[i].mark_id;
        }
        //获取要发送的内容中，所有符合 #@...# 格式的字符串
        var filterRegexp = /#@[\w\d \u4E00-\u9FA5\uF900-\uFA2D]+#/g,
            atTextList = msg.match(filterRegexp) || [];
        //发送内容中，若存在和缓存中同名的标签，则将该标签替换为超链接
        for (i = 0; i < atTextList.length; i++) {
            var titleWithAt = atTextList[i].slice(1, -1);
            if (allRoomMarkTitleToId.hasOwnProperty(titleWithAt)) {
                var aTagId = 'mark_' + allRoomMarkTitleToId[titleWithAt],
                    aTagClass = 'chat-mark',
                    aTagContent = titleWithAt,
                    aTagHtml = '<a href="javascript:void(0)" id="{0}" class="{1}">{2}</a>'.format(
                        aTagId, aTagClass, aTagContent);
                msg = msg.replace(atTextList[i], aTagHtml);
            }
        }

        //过滤HTML
//        msg = msg.replace(/&(?!(\w+|\#\d+);)/g, '&amp;')
//            .replace(/</g, '&lt;')
//            .replace(/>/g, '&gt;')
//            .replace(/"/g, '&quot;');

        var html = '<div class="{0}">{1}<div class="chat_content {2}"><p><a href="javascript:void(0)">{3}: </a>{4}</p><p class="pull-right">{5}</p></div></div>'.format(
            type, userheadHtml, color_type, text_cut(msgHead,16), msg, dateStr);
        $(roomPageId + ' .talk_board').append(html);
    };

    function bindAtWho(roomPageId) {
        var $textarea =  $(roomPageId + ' textarea');

        //提取缓存中所有mark的列表中必要的信息，返回新的列表
        var availableMarks = $.map(Cache.getData('allMarkList'),
            function (value, i) {
                return {
                    'room_id': value.room_id,
                    'name': value.title,
                    'title': value.title,
                    'type': value.type === '0' ? 'at-icon-pin' : 'at-icon-region',
                    'class': value.type === '0' ? 'icon-pin-blue' : 'icon-area-blue'
                }
            }).filter(function (element) {  //根据房间号进行筛选
                return element.room_id === roomId || element.room_id === '0';
            });

        //创建@列表
        $textarea.atwho({
            at: "@",
            data: availableMarks,
            //${name}为填入文本框的值，${title}为显示在@列表里的值
            //注意：@的内容在此处增加了左右标记，即 <@ 内容 >，然后在textarea的input propertychange事件中提取
            tpl: "<li data-value='#@${name}#'><img class='at-icon' src='images/${type}.png' height='16'/><span class='at-item'>${title}</span></li>"
        });

//        $textarea.on("inserted.atwho", function (event, $li) {
//            triggerTextareaChange($textarea);
//        });
//
//        //在内存中存储<@ *** >特殊标记，但正常显示
//        $textarea.live('input propertychange', function(){
//            triggerTextareaChange($textarea);
//        });
    }

    function triggerTextareaChange($textarea) {
        var i,
            regexp = /#@[\w\d ]+#/g,
            originText = $textarea.val();

        console.log(originText);
        atTextList = originText.match(regexp) || [];

        for (i = 0; i < atTextList.length; i++) {
            atTextList[i] = atTextList[i].slice(2, -1);
        }
        //获取要发送的内容中，所有以@开头的单词（不可包含中文）
        $(this).val();
    }

    /**
     * 启动Socket.IO并开始通讯
     * @param roomId 房间id
     */
    var startSocketIO = function (roomPageId) {
        roomId = $(roomPageId + ' input[name=room_id]').attr('value');
        roomHash = $(roomPageId + ' input[name=hash]').attr('value');
        userId = $(roomPageId + ' input[name=user_id]').attr('value');

        bindAtWho(roomPageId);

        //定义Socket.io各通信事件
        socket = io.connect(Const.URL_NODE_SERVER, {'force new connection': true});
        console.log("Socket.io now connect " + Const.URL_NODE_SERVER);

        socket.emit('USER_ENTER_ROOM', {
            userId: userId,
            username: username,
            roomId: roomHash
        });

        socket.on('NOTIFY_USER_ENTER_ROOM', function (data) {
            showMessage(roomPageId, 'Server', null, data.username + ' enter the room!<br/>', true);
        });

        socket.on('NOTIFY_USER_LEAVE_ROOM', function (data) {
            showMessage(roomPageId, 'Server', null, data.username + ' leave the room!<br/>', true);
        });

        socket.on('NOTIFY_USER_MESSAGE', function (data) {
//            if (data.username !== username) {
            showMessage(roomPageId, data.username, data.userhead, data.msg, true);
//            }
        });

        socket.on('NOTIFY_USER_MARK', function (data) {
//            if (data.username !== username) {
            showMark(roomPageId, data.username, data.userhead, data.msg, true);
//            }
        });
    };

    /**
     * 断开socket.io连接
     * @param {String} roomPageId
     * @param {Function} callback 断开连接之后的回调函数
     */
    var endSocketIO = function (roomPageId, callback) {
        var roomId = parseInt($(roomPageId + ' input[name=room_id]').attr('value')),
            roomHash = $(roomPageId + ' input[name=hash]').attr('value'),
            userId = $(roomPageId + ' input[name=user_id]').attr('value');
        console.log("Socket.io now disconnected.");
        //提交用户离开房间事件
        socket.emit("USER_LEAVE_ROOM", {
            userId: userId,
            username: username,
            roomId: roomHash
        });
        if (callback) {
            callback();
        }
        window.location.hash = '';
    };

    return {
        startSocketIO: startSocketIO,
        endSocketIO: endSocketIO,
        sendText: sendText,
        showMessage: showMessage,
        atMark: atMark,
        _setHeight: _setHeight
    };
});
