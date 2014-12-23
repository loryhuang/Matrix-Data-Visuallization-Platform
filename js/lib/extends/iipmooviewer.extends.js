/* IIPMooViewer组件的扩展部分
 * @author HKG
 * */
require.config({
    baseUrl: './js',
    paths: {
        iipmooviewer: 'lib/iipmooviewer-2.0',
        jquery_imgareaselect: 'lib/jquery.imgareaselect',
        mootools: 'lib/mootools-core-1.3.2-full-nocompat'
    },
    shim: {
        "iipmooviewer": {
            deps: ["mootools"],
            exports: "iipmooviewer"
        }
    }
});

define([
    'util/Constant',
    'util/Cache',
    'jquery_imgareaselect',
    'iipmooviewer'
    ], function(Const, Cache) {
        "use strict";
        IIPMooViewer.implement({


            /*  Calculate some dimensions */
            calculateSizes: function() {

                var tx = this.max_size.w;
                var ty = this.max_size.h;
                var thumb_width;

                // Set up our default sizes
                var target_size = document.id(this.source).getSize();
                this.view.w = target_size.x;
                this.view.h = target_size.y;
                thumb_width = this.view.w * this.navWinSize;

                // For panoramic images, use a large navigation window
                if (tx > 5 * ty) thumb_width = this.view.w / 5;
                //changed by huang
                if((ty/tx)*thumb_width > this.view.h) thumb_width = Math.round( this.view.h * 0.95 * tx/ty );

                this.navWin.w = thumb_width;
                this.navWin.h = Math.round((ty / tx) * thumb_width);

                // Determine the image size for this image view
                this.view.res = this.num_resolutions;
                tx = this.max_size.w;
                ty = this.max_size.h;

                // Calculate our list of resolution sizes and the best resolution
                // for our window size
                this.resolutions = new Array(this.num_resolutions);
                this.resolutions.push({
                    w: tx,
                    h: ty
                });
                this.view.res = 0;
                for (var i = 1; i < this.num_resolutions; i++) {
                    tx = Math.floor(tx / 2);
                    ty = Math.floor(ty / 2);
                    this.resolutions.push({
                        w: tx,
                        h: ty
                    });
                    if (tx < this.view.w && ty < this.view.h) this.view.res++;
                }
                this.view.res -= 1;

                // Sanity check and watch our for small screen displays causing the res to be negative
                if (this.view.res < 0) this.view.res = 0;
                if (this.view.res >= this.num_resolutions) this.view.res = this.num_resolutions - 1;

                // We reverse so that the smallest resolution is at index 0
                this.resolutions.reverse();
                this.wid = this.resolutions[this.view.res].w;
                this.hei = this.resolutions[this.view.res].h;

            },

            /**
            * 覆盖原组件的createWindows方法,增加自定义的图标及鼠标动作
            */
            createWindows: function() {

                // Setup our class. Get it's current position as we will convert it to absolute positioning
                var container = document.id(this.source);
                var pos = container.getPosition();

                // Disable fullscreen mode if we are already at 100% size
                if (container.getStyle('width') == '100%' && container.getStyle('height') == '100%') {
                    this.enableFullscreen = false;
                }

                var size = container.getSize();
                container.addClass('iipmooviewer');
                container.setStyle('position', 'absolute');

                // Our modal information box ,revised by huang
            
                new Element('div', {
                    'id':'info_box',
                    'class':'info',
                    'styles': {
                        opacity: 0
                    },
                    'events': {
                        click: function() {
                            //this.fade(0);
                            //container.getElement('#info_arrow').fade(0);
                            //$('#info_arrow').hide();
                            //$('#InfoBtn').trigger('click');
                        }
                    },
                    'html': '<div id="info_title"><h3>Title</h3><p></p></div>'+
                    '<div id="info_desc"><h3>Description</h3><p></p></div>'+
                    '<div id="info_size"><h3>Size</h3><p></p></div>'+
                    '<div id="info_creater"><h3>Owner</h3><p></p></div>'+
                    '<div id="info_time"><h3>Upload Time</h3><p></p></div>'
                }).inject(container);
            
                //info的箭头
                new Element('div',{
                    'id':'info_arrow',
                    'class':'info'
                }).inject(container);

                // Use a lexical closure rather than binding to pass this to anonymous functions
                var _this = this;

                // Create our main window target div, add our events and inject inside the frame
                this.canvas = new Element('div', {
                    'class': 'canvas',
                    'morph': {
                        transition: Fx.Transitions.Quad.easeInOut,
                        onComplete: function() {
                            _this.requestImages();
                        }
                    }
                });


                // Create our main view drag object for our canvas
                this.touch = new Drag(this.canvas, {

                    //added by huang
                    onStart: function(el) {
                        //任何功能处于激活状态时，均不可使用drag
                        if ($('#InfoBtn').hasClass('active') || $('#PinBtn').hasClass('active') || $('#RegionBtn').hasClass('active') || $('#ReclustBtn').hasClass('active')) {
                            this.stop();
                        }
                        Cache.putData('onDrag', 1);
                    },
                    onDrag: this.zoomCallback.bind(this), //added by huang
                    onComplete: this.scroll.bind(this)
                });

                // Inject our canvas into the container, but events need to be added after injection 
                this.canvas.inject(container);
                this.canvas.addEvents({
                    'mousewheel:throttle(75)': this.zoom.bind(this),
                    'dblclick': this.zoom.bind(this),
                    'mousedown': function(e) {
                        //added
                        if ($('#InfoBtn').hasClass('active') || $('#PinBtn').hasClass('active') || $('#RegionBtn').hasClass('active')||$('#ReclustBtn').hasClass('active')) {
                            return;
                        }
                        var event = new Event(e);
                        if (event.event.button != 2) {
                        // event.stop();
                        }

                    },
                    'mouseover':this.zoomCallback.bind(this)
                });

                //$$('.region').addEvent('mousewheel',this.zoom.bind(this));


                // Display / hide our annotations if we have any
                if (this.annotations) {
                    this.canvas.addEvent('mouseenter', function() {
                        if (_this.annotationsVisible) {
                            if (Browser.ie && Browser.version < 9) {
                                _this.canvas.getElements('div.annotation').setStyle('visibility', 'visible');
                            } else _this.canvas.getElements('div.annotation').tween('opacity', [0, 1]);
                        }
                    });
                    this.canvas.addEvent('mouseleave', function() {
                        if (_this.annotationsVisible) {
                            if (Browser.ie && Browser.version < 9) {
                                _this.canvas.getElements('div.annotation').setStyle('visibility', 'hidden');
                            } else _this.canvas.getElements('div.annotation').tween('opacity', 0);
                        }
                    });
                }

                // Disable the right click context menu if requested and show our info window instead
                if (this.disableContextMenu) {
                //      container.addEvent( 'contextmenu', function(e){
                //             var event = new Event(e);
                //             event.stop();
                //             container.getElement('div.info').fade(0.95);
                //             return false;
                //           } )
                //container.addEvent("contextmenu", function(e){return false;}).mousemove(startSelection).mouseup(cancelSelection);
                }


                // Add an external callback if we have been given one
                if (this.targetclick) this.canvas.addEvent('click', this.targetclick.bind(this));

                // Add our keyboard events, but only when we are over the enclosing div
                // In order to add keyboard events to the div, we need to give it a tabindex and focus it
                container.set('tabindex', 0);
                container.focus();

                // Focus and defocus when we move into and out of the div,
                // get key presses and prevent default scrolling via mousewheel
                container.addEvents({
                    'keydown': this.key.bind(this),
                    'mouseover': function() {
                        container.focus();
                    },
                    'mouseout': function() {
                        container.blur();
                    },
                    'mousewheel': function(e) {
                        e.preventDefault();
                    }
                });

                // Add gesture support for mobile iOS and android
                if (Browser.Platform.ios || Browser.Platform.android) {

                    // Prevent dragging on the container div
                    container.addEvent('touchmove', function(e) {
                        e.preventDefault();
                    });

                    // Disable elastic scrolling and handle changes in orientation on mobile devices.
                    // These events need to be added to the document body itself
                    document.body.addEvents({
                        'touchmove': function(e) {
                            e.preventDefault();
                        },
                        'orientationchange': function() {
                            document.id(this.source).setStyles({
                                'width': '100%',
                                'height': '100%'
                            });
                            // Need to set a timeout the div is not resized immediately on some versions of iOS
                            this.reload.delay(500, this);
                        }.bind(this)
                    });

                    // Now add our touch canvas events
                    this.canvas.addEvents({
                        'touchstart': function(e) {
                            e.preventDefault();
                            // Only handle single finger events
                            if (e.touches.length == 1) {
                                // Simulate a double click with a timer
                                var t1 = _this.canvas.retrieve('taptime') || 0;
                                var t2 = Date.now();
                                _this.canvas.store('taptime', t2);
                                _this.canvas.store('tapstart', 1);
                                if (t2 - t1 < 500) {
                                    _this.canvas.eliminate('taptime');
                                    _this.zoomIn();
                                } else {
                                    var pos = _this.canvas.getPosition();
                                    _this.touchstart = {
                                        x: e.touches[0].clientX - pos.x,
                                        y: e.touches[0].clientY - pos.y
                                    };
                                }
                            }
                        },
                        'touchmove': function(e) {
                            // Only handle single finger events
                            if (e.touches.length == 1) {
                                _this.view.x = _this.touchstart.x - e.touches[0].clientX;
                                _this.view.y = _this.touchstart.y - e.touches[0].clientY;
                                // Limit the scroll
                                if (_this.view.x > _this.wid - _this.view.w) _this.view.x = _this.wid - _this.view.w;
                                if (_this.view.y > _this.hei - _this.view.h) _this.view.y = _this.hei - _this.view.h;
                                if (_this.view.x < 0) _this.view.x = 0;
                                if (_this.view.y < 0) _this.view.y = 0;
                                _this.canvas.setStyles({
                                    left: (_this.wid > _this.view.w) ? -_this.view.x : Math.round((_this.view.w - _this.wid) / 2),
                                    top: (_this.hei > _this.view.h) ? -_this.view.y : Math.round((_this.view.h - _this.hei) / 2)
                                });
                            }
                        },
                        'touchend': function(e) {
                            // Update our tiles and navigation window
                            if (_this.canvas.retrieve('tapstart') == 1) {
                                _this.canvas.eliminate('tapstart');
                                _this.requestImages();
                                _this.positionZone();
                            }
                        },
                        'gesturestart': function(e) {
                            e.preventDefault();
                            _this.canvas.store('tapstart', 1);
                        },
                        'gesturechange': function(e) {
                            e.preventDefault();
                        },
                        'gestureend': function(e) {
                            if (_this.canvas.retrieve('tapstart') == 1) {
                                _this.canvas.eliminate('tapstart');
                                // Handle scale
                                if (Math.abs(1 - e.scale) > 0.1) {
                                    if (e.scale > 1) _this.zoomIn();
                                    else _this.zoomOut();
                                }
                                // And rotation
                                else if (Math.abs(e.rotation) > 10) {
                                    if (e.rotation > 0) _this.orientation += 45 % 360;
                                    else _this.orientation -= 45 % 360;
                                    _this.rotate(_this.orientation);
                                }
                            }
                        }
                    });
                }

                // Add our logo and a tooltip explaining how to use the viewer
                /**
                *
                var info = new Element('img', {
                    'src': this.prefix + 'iip.32x32.png',
                    'class': 'logo',
                    'title': 'click for help',
                    'events': {
                        click: function() {
                            container.getElement('div.info').fade(0.95);
                        },
                        // Opacity changes to non-rectangular PNGs in IE don't work
                        mouseover: function() {
                            if (!(Browser.ie && Browser.version < 9)) this.fade(1);
                        },
                        mouseout: function() {
                            if (!(Browser.ie && Browser.version < 9)) this.fade(0.65);
                        },
                        // Prevent user from dragging image
                        mousedown: function(e) {
                            var event = new Event(e);
                            if (event.event.button != 2) {
                                event.stop();
                            }
                        }
                    }
                }).inject(container);
                */

                /**
                 *
                 * 增加用户定义的按钮
                 *
                 */

                //标记info,pin,region功能的状态
                Cache.putData('info_status', 'inactive');
                Cache.putData('pin_status', 'inactive');
                Cache.putData('region_status', 'inactive');
                Cache.putData('reclust_status', 'inactive');
                Cache.putData('find_status', 'inactive');


                //pin的鼠标姿势
                var pin_pointer = new Element('div', {
                    'id': 'pin_pointer',
                    'class': 'pointer',
                    'styles': {
                    //background: 'url(' + this.prefix + '49.ico) no-repeat center center'
                    },
                    'events': {
                        click: function() {}
                    }
                }).inject(container);



                //region的鼠标姿势
                var region_pointer = new Element('div', {
                    'id': 'region_pointer',
                    'class': 'pointer',
                    'styles': {
                    // background: 'url(' + this.prefix + 'region.jpg) no-repeat center center'
                    },
                    'events': {
                        click: function() {}
                    }
                }).inject(container);


                //reclust的鼠标姿势
                var reclust_pointer = new Element('div', {
                    'id': 'reclust_pointer',
                    'class': 'pointer',
                    'styles': {
                    //background: 'url(' + this.prefix + '49.ico) no-repeat center center'
                    },
                    'events': {
                        click: function() {}
                    }
                }).inject(container);



                //Info 功能
                var myAnchor1 = new Element('div', {
                    'id': 'InfoBtn',
                    'class': 'userIcon',
                    'title': 'Click to view the detailed information about heatmap',
                    'styles': {
                        top: '60px'//,
                    //background: 'url(' + this.prefix + 'info_bg.jpg) no-repeat center center'
                    },
                    'events': {
                        click: function() {
                            if (Cache.getData('info_status') == 'inactive') {

                                //先使其它功能失效
                                $.each($('.userIcon').filter('.active'), function(i, e) {
                                    $(e).removeClass('active').trigger('click');
                                });

                                Cache.putData('info_status', 'active');
                                $('#InfoBtn').addClass('active');
                                //$('#InfoBtn').css('background', 'url(' + _this.prefix + 'info_s_bg.jpg) no-repeat center center');
                                container.getElements('div.info').fade(0.95);


                            } else {

                                Cache.putData('info_status', 'inactive');
                                $('#InfoBtn').removeClass('active');
                                //$('#InfoBtn').css('background', 'url(' + _this.prefix + 'info_bg.jpg) no-repeat center center');
                                container.getElements('div.info').fade(0);
                            
                            }
                        },
                        mouseover: function() {
                        //if (!(Browser.ie && Browser.version < 9)) this.fade(1);
                        },
                        mouseout: function() {
                        //if (!(Browser.ie && Browser.version < 9)) this.fade(0.65);
                        },
                        mousedown: function(e) {
                            var event = new Event(e);
                            if (event.event.button != 2) {
                            //   event.stop();
                            }
                        }
                    }
                }).inject(container);

                //Pin 功能
                var myAnchor2 = new Element('div', {
                    'id': 'PinBtn',
                    'class': 'userIcon',
                    'title': 'Click to set a point mark on the heatmap',
                    'styles': {
                        top: '140px'//,
                    //background: 'url(' + this.prefix + 'pin_bg.jpg) no-repeat center center'
                    },
                    'events': {
                        click: function() {

                            if (Cache.getData('pin_status') == 'active') {

                                //$('#PinBtn').css('background', 'url(' + _this.prefix + 'pin_bg.jpg) no-repeat center center');
                                Cache.putData('pin_status', 'inactive');
                                $('#PinBtn').removeClass('active');
                                $('#pin_pointer').hide();

                            } else if (Cache.getData('pin_status') == 'inactive') {

                                //先使其它功能失效
                                $.each($('.userIcon').filter('.active'), function(i, e) {
                                    $(e).removeClass('active').trigger('click');
                                });

                                //$('#PinBtn').css('background', 'url(' + _this.prefix + 'pin_s_bg.jpg) no-repeat center center');

                                //pin功能激活
                                Cache.putData('pin_status', 'active');
                                $('#PinBtn').addClass('active');

                                //容器的偏移
                                var offsetX = $('#viewer').offset().left;
                                var offsetY = $('#viewer').offset().top;

                                //鼠标姿势
                                $('.canvas,.region,#pin_pointer').live('mousemove', function(e) {
                                    if (Cache.getData('pin_status') == 'active') {
                                        $('#pin_pointer').show();
                                        $('#pin_pointer').css({
                                            left: parseInt(e.clientX - offsetX) - parseInt($('#pin_pointer').width()/2),
                                            top: parseInt(e.clientY - offsetY) - $('#pin_pointer').height() - 5
                                        });
                                        $(this).css('cursor','default');
                                    }
                                });


                                //点击增加一个pin
                                $('.canvas,.region').live('click', function(e) {
                                    if (Cache.getData('pin_status') == 'active') {

                                        //增加pin图标
                                        var pin = new Element('div', {
                                            'class': 'pin mark mine',
                                            styles: {
                                                left: parseInt(e.clientX - offsetX) - (parseInt($('.pin').width()/2) || 12 ),
                                                top: parseInt(e.clientY - offsetY) - ($('.pin').height() || 38)
                                            //background: 'url(' + _this.prefix + '49.ico) no-repeat center center'
                                            },
                                            events: {
                                                click: function() {},
                                                mouseover: function() {}
                                            }
                                        }).inject(container);


                                        if(Cache.getData("isLogin") == 0 ){
                                            var email = '<label for="email">Email</label><input type="text" id="mark_email" name="email"/>' ;
                                        }else {
                                            var email = '';
                                        }

                                        //增加添加评论框
                                        var mark_box = '<div class="mark-box">' +
                                        '<div class="input-box">' +
                                        '<label for="title">Title</label><input type="text" id="mark_title" name="title"/>' +
                                        '<label for="description">Description</label><textarea id="mark_description" name="description"></textarea>' +
                                         email +
                                        '<a class="cancelMarkBtn btn pull-right btn-m offset20" href="javascript:void(0)">Cancel</a>' +
                                        '<a class="saveMarkBtn btn pull-right btn-m offset5" href="javascript:void(0)">Save</a>' +
                                        '</div>' +
                                        '</div>';
                                        $('#viewer').append(mark_box);

                                        //位置信息
                                        var left = e.clientX - offsetX - parseInt($('.canvas').css('left'));
                                        var l_r = parseFloat(left / $('.canvas').width());
                                        var top = e.clientY - offsetY - parseInt($('.canvas').css('top'));
                                        var t_r = parseFloat(top / $('.canvas').height());

                                        //设置type属性为0,代表Pin
                                        $('.mark-box').last().attr('type', 0);
                                        $('.mark-box').last().attr('l_r', l_r);
                                        $('.mark-box').last().attr('t_r', t_r);
                                        $('.mark-box').last().attr('w_r', 0);
                                        $('.mark-box').last().attr('h_r', 0);
                                        $('.mark-box').last().css({
                                            left: parseInt(e.clientX - offsetX) - 70 ,
                                            top: parseInt(e.clientY - offsetY) + 5
                                        });

                                        //调整mark-box的位置
                                        var obj = $('.mark-box').last();
                                        var l = obj.width() + obj.offset().left;
                                        var t = obj.height() + obj.offset().top;
                                        var width = $('#viewer').width();
                                        var height = $('#viewer').height();
                                        if (l > width) {
                                            var offset_left = width - obj.width() - 25;
                                            obj.css('left', offset_left);
                                        };
                                        if (t > height) {
                                            var offset_top = height - obj.height() - 25;
                                            obj.css('top', offset_top);
                                        };


                                        //存储pin的相对位置,需要操作数据库
                                        
                                        $(pin).attr('l_r', l_r);
                                        $(pin).attr('t_r', t_r);

                                        //pin指针消失,Pinbtn状态切换
                                        $('#pin_pointer').hide();
                                        $('#PinBtn').trigger('click');

                                    }
                                });
                            }
                        },
                        mouseover: function() {
                            $(pin_pointer).hide();
                        }
                    }
                }).inject(container);


                //Region 功能
                //var regionSelect = null;
                var myAnchor3 = new Element('div', {
                    'id': 'RegionBtn',
                    'class': 'userIcon',
                    'title': 'Drag around to set a region mark on the heatmap',
                    'styles': {
                        top: '220px'//, 
                        //background: 'url(' + this.prefix + 'region_bg.jpg) no-repeat center center'
                    },
                    'events': {
                        click: function() {
                            if (Cache.getData('region_status') == 'active') {

                                Cache.putData('region_status', 'inactive');
                                $('#RegionBtn').removeClass('active');
                                //$('#RegionBtn').css('background', 'url(' + _this.prefix + 'region_bg.jpg) no-repeat center center');
                                $('#region_pointer').hide();

                                //点击后禁止选择区域
                                if (_this.regionSelect != null) {
                                    //console.log('regionSelect exists');
                                    _this.regionSelect.setOptions({
                                        disable: true
                                    });
                                }
                            } else {

                                //先使其它功能失效
                                $.each($('.userIcon').filter('.active'), function(i, e) {
                                    $(e).removeClass('active').trigger('click');
                                });

                                //选择区域状态激活
                                Cache.putData('region_status', 'active');
                                $('#RegionBtn').addClass('active');
                               
                                //容器的偏移
                                var offsetX = $('#viewer').offset().left;
                                var offsetY = $('#viewer').offset().top;

                                //鼠标姿势
                                $('.canvas,.region,#region_pointer').live('mousemove', function(e) {
                                    if (Cache.getData('region_status') == 'active') {
                                        $('#region_pointer').show();
                                        $('#region_pointer').css({
                                            left: parseInt(e.clientX - offsetX) - 5 ,
                                            top: parseInt(e.clientY - offsetY) - $('#region_pointer').height() - 2
                                        });
                                        $(this).css('cursor','default');
                                    }
                                });

                                //标记区域
                                /*
                                //imgAreaSelect插件已存在，只需激活
                                if (_this.regionSelect != null) {
                                    //console.log('regionSelect exists');
                                    _this.regionSelect.setOptions({
                                        enable: true
                                    });
                                    return;
                                }
                                 */

                                //重新调用imgAreaSelect插件
                                //console.log('New imgAreaSelect');
                                _this.regionSelect = $('.canvas').imgAreaSelect({
                                    handles: true,
                                    fadeSpeed: 200,
                                    instance: true, //设置为可实例化
                                    maxHeight:parseInt(1000*$('.canvas').attr('r')),
                                    maxWidth:parseInt(1000*$('.canvas').attr('r')),
                                    onSelectStart: function() {
                                        $('#region_pointer').hide();
                                    },
                                    onSelectChange: function() {
                                        //resolve the bug of user-icon not be coverd
                                        $(".imgareaselect-outer").css("z-index",5);
                                    },
                                    onSelectEnd: function(img, getSelection) {
                                        //console.log(getSelection.x1+'_'+getSelection.y1+'_'+getSelection.width+'_'+getSelection.height);
                                        
                                        //容器自身的偏移
                                        var offsetX = $('#viewer').offset().left;
                                        var offsetY = $('#viewer').offset().top;

                                        //图片相对于容器viewer的偏移
                                        var y = parseInt($('.canvas').css('top'));
                                        var x = parseInt($('.canvas').css('left'));

                                        //图片当前的尺寸
                                        var width = parseInt($('.canvas').css('width'));
                                        var height = parseInt($('.canvas').css('height'));

                                        //选择区域的尺寸
                                        var region_width = $('.imgareaselect-selection').parent().width();
                                        var region_height = $('.imgareaselect-selection').parent().height();

                                        //选择区域相对于容器viewer的偏移
                                        var region_left = parseInt($('.imgareaselect-selection').parent().css('left')) - offsetX;
                                        var region_top = parseInt($('.imgareaselect-selection').parent().css('top')) - offsetY;

                                        //新建region
                                        var region = new Element('div', {
                                            'class': 'region mark mine',
                                            'styles': {
                                                width: region_width - 2,
                                                height: region_height - 2,
                                                left: region_left,
                                                top: region_top
                                            },
                                            'events': {
                                                'mousewheel:throttle(75)': _this.zoom.bind(_this),
                                                'dblclick': _this.zoom.bind(_this)
                                            }
                                        }).inject(container);

                                        var icon = new Element('div',{
                                            'class':'region_close_icon',
                                            'title':'delete this region'
                                        }).inject(region);

                                        //存储相对位置
                                        var wr = parseFloat(region_width / width); //储存宽度比例
                                        var hr = parseFloat(region_height / height); //储存高度比例
                                        var left_radio = parseFloat((region_left - x) / width);
                                        var top_radio = parseFloat((region_top - y) / height); //获取初始偏移的比例
                                        $(region).attr('w_r', wr);
                                        $(region).attr('h_r', hr);
                                        $(region).attr('l_r', left_radio);
                                        $(region).attr('t_r', top_radio); //数据存储
                                        $(region).show();
                                    
                                        //使region的mousewheel事件有效
                                        $('.canvas').trigger('mouseover');


                                        //取消选择状态
                                        _this.regionSelect.cancelSelection();
                                        _this.regionSelect.update();
                                        
                                        var reclustBtns;
                                        var formClass;
                                        if(Cache.getData("addStatus")){
                                            formClass = "matrixAdd";
                                            reclustBtns = '<a class="mergeMarkBtn btn btn-m btn-s offset5" href="javascript:void(0)" title="click to show the cluster result of the intersection">MergeClust</a>' ;         
                                        }else{
                                            formClass = "matrixOrigin"; 
                                            reclustBtns = '<a class="reclustMarkBtn btn btn-m btn-s offset5" href="javascript:void(0)" title="click to show cluster result of this area">Reclust</a>' + 
                                                          '<a class="addRegionBtn btn btn-m btn-s offset5" href="javascript:void(0)" title="click to add a area to get the intersection cluster result">Add</a>';
                                        }

                                        //增加添加评论框
                                        var mark_box = '<div class="mark-box">' +
                                        '<div class="input-box">' +
                                        '<form class="matrixBtn ' + formClass + '" method = "POST" action="" target= "_blank">' +
                                        '<a class="detailMarkBtn btn btn-m btn-s offset5" href="javascript:void(0)" title="click to show the details of the area">Details</a>' +
                                        reclustBtns +
                                        //'<a id="addRegionBtn" class="btn pull-right btn-m offset5" href="javascript:void(0)">Add</a>' +
                                        //'<a id="reclustMarkBtn" class="btn pull-right btn-m offset5" href="javascript:void(0)">Reclust</a>' +
                                        //'<a id="mergeMarkBtn" style="display:none" class="btn pull-right btn-m offset5" href="javascript:void(0)">MergeReclust</a>' +
                                        '<a class="saveMarkBtn btn btn-m btn-s offset5" href="javascript:void(0)" title="save this region to database" >Save</a>' +
                                        //'<a class="cancelMarkBtn btn btn-m btn-s offset5" href="javascript:void(0)">Cancel</a>' +
                                        '<input id="x" type="hidden" name="x" value="">' +
                                        '<input id="y" type="hidden" name="y" value="">' +
                                        '<input id="w" type="hidden" name="w" value="">' +
                                        '<input id="h" type="hidden" name="h" value="">' +
                                        '<input id="imagename" type="hidden" name="imagename" value="">' +
                                        '<input id="filename" type="hidden" name="filename" value="">' +
                                        '<input id="rows" type="hidden" name="rows" value="">' +
                                        '<input id="cols" type="hidden" name="cols" value="">' +
                                        '</form>' +
                                        '</div>' +
                                        '</div>';
                                        $('#viewer').append(mark_box);

                                        //设置type属性为1，代表region的信息框
                                        $('.mark-box').last().attr('type', 1);

                                        $('.mark-box').last().attr('l_r', left_radio);
                                        $('.mark-box').last().attr('t_r', top_radio);
                                        $('.mark-box').last().attr('w_r', wr);
                                        $('.mark-box').last().attr('h_r', hr);

                                        $('.mark-box').last().css({
                                            left: region_left + region_width / 2 - 70,
                                            top: region_top + region_height + 10
                                        });


                                        //调整mark-box的位置
                                        var obj = $('.mark-box').last();
                                        var l = obj.width() + obj.offset().left;
                                        var t = obj.height() + obj.offset().top;
                                        var v_width = $('#viewer').width();
                                        var v_height = $('#viewer').height();
                                        if (l > width) {
                                            var offset_left = v_width - obj.width() - 25;
                                            obj.css('left', offset_left);
                                        }
                                        if (t > height) {
                                            var offset_top = v_height - obj.height() - 25;
                                            obj.css('top', offset_top);
                                        }


                                        var col_num = Cache.getData('col_num'),
                                            row_num = Cache.getData('row_num');

                                        var imageZoom = Cache.getData("imageZoom");
                                        //console.log(imageZoom);

                                        var initialWidth = col_num * imageZoom * 2; //原图片的大小
                                        var initialHeight = row_num * imageZoom * 2;
                                        //var initialWidth = _this.max_size.w; //原图片的大小
                                        //var initialHeight = _this.max_size.h;
                                        var currentWidth = parseInt($('.canvas').css('width'));
                                        //var currentHeight=parseInt($('.canvas').css('height'));
                                        //var row_num=3652;       //基因的横列数目
                                        //var col_num=3841;
                                        var radio = parseFloat(initialWidth / currentWidth); //缩放倍数
                                        
                                        var x = Math.round(radio * parseInt(getSelection.x1)); //换算成实际起始坐标
                                        if (x % 2 == 1) {
                                            x = x - 1; //起始横坐标设定为偶数
                                        }
                                        var y = Math.round(radio * parseInt(getSelection.y1));
                                        if (y % 2 == 1) { //纵坐标设定为起始值加偶数
                                            y = y - 1;
                                        }
                                        //换算成实际高度
                                        var w = Math.round(radio * parseInt(getSelection.width));
                                        if (w % 2 == 1) {
                                            w = w + 1; //宽度和高度都设置为偶数
                                        }
                                        var h = Math.round(radio * parseInt(getSelection.height));
                                        if (h % 2 == 1) {
                                            h = h + 1;
                                        }

                                        if(imageZoom > 1){
                                            x = parseInt(x/16) * 16 ;
                                            y = parseInt(y/16) * 16 ;
                                            w = parseInt(w/16) * 16 ;
                                            h = parseInt(h/16) * 16 ;
                                        }

                                        var d = x + '_' + y + '_' + w + '_' + h;
                                        
                                        //console.log(x + ' '+ y +' '+ w + ' '+h);
                                         
                                        obj.find("form").eq(0).attr("d", d);
                                        if(Cache.getData("addStatus")){
                                            obj.find("form").eq(0).attr("p_d", Cache.getData("prePos"));
                                        }
                                        
                                        /*
                                        if(!Cache.getData("hasRegion")){
                                            var pos = {
                                                x:x,
                                                y:y,
                                                w:w,
                                                h:h 
                                            };
                                            Cache.putData("prePos",pos);
                                        }
                                        */

                                        //状态恢复
                                        Cache.putData("addStatus",false);
                                        $('#RegionBtn').trigger('click');
                                    }
                                });
                            }
                        },
                        mouseover: function() {

                        }
                    }
                }).inject(container);


                //Reclust Btn的功能 ,已被隐藏
                var myAnchor4 = new Element('div', {
                    'id': 'ReclustBtn',
                    'class': 'userIcon',
                    'title': 'Click to view the detailed information about heatmap',
                    'styles': {
                        top: '300px'//,       
                    //background: 'url(' + this.prefix + 'info_bg.jpg) no-repeat center center'
                    },
                    'events': {
                        click: function() {
                            if (Cache.getData('reclust_status') == 'inactive') {

                                //先使其它功能失效
                                $.each($('.userIcon').filter('.active'), function(i, e) {
                                    $(e).removeClass('active').trigger('click');
                                });

                                Cache.putData('reclust_status', 'active');
                                $('#ReclustBtn').addClass('active');
                                //$('#InfoBtn').css('background', 'url(' + _this.prefix + 'info_s_bg.jpg) no-repeat center center');
                                //container.getElement('div.info').fade(0.95);


                                //容器的偏移
                                var offsetX = $('#viewer').offset().left;
                                var offsetY = $('#viewer').offset().top;


                                //鼠标姿势
                                $('.canvas,.region').live('mousemove', function(e) {
                                    if (Cache.getData('reclust_status') == 'active') {
                                        $('#reclust_pointer').show();
                                        $('#reclust_pointer').css({
                                            left: parseInt(e.clientX - offsetX) ,
                                            top: parseInt(e.clientY - offsetY) - $('#reclust_pointer').height() - 2
                                        });
                                        $(this).css('cursor','default');
                                    }
                                });
                                
                                /**
                                * FOR TEST DETAIL AND RECLUSTER
                                */ 

                                _this.regionReclust = $('.canvas').imgAreaSelect({ //右键选择部分区域来进行更详细的显示
                                    handles: true,
                                    instance: true, //设置为可实例化
                                    fadeSpeed: 200,
                                    //maxHeight:parseInt(1000*$('.canvas').attr('r')),
                                    //maxWidth:parseInt(1000*$('.canvas').attr('r')),
                                    onSelectStart: function() {
                                        $('.selected_area').hide();
                                    },
                                    onSelectChange: function() {

                                    },
                                    onSelectEnd: function(img, getSelection) {
                                        //isMouseDown = false;
                                        var col_num = Cache.getData('col_num'),
                                        row_num = Cache.getData('row_num');
                                        var initialWidth = col_num * 2; //原图片的大小
                                        var initialHeight = row_num * 2;
                                        //var initialWidth = _this.max_size.w; //原图片的大小
                                        //var initialHeight = _this.max_size.h;
                                        var currentWidth = parseInt($('.canvas').css('width'));
                                        //var currentHeight=parseInt($('.canvas').css('height'));
                                        //var row_num=3652;       //基因的横列数目
                                        //var col_num=3841;
                                        var radio = parseFloat(initialWidth / currentWidth); //缩放倍数

                                        var x = Math.round(radio * parseInt(getSelection.x1)); //换算成实际起始坐标
                                        if (x % 2 == 1) {
                                            x = x - 1; //起始横坐标设定为偶数
                                        }
                                        var y = Math.round(radio * parseInt(getSelection.y1));
                                        if (y % 2 == 1) { //纵坐标设定为起始值加偶数
                                            y = y - 1;
                                        }
                                        //换算成实际高度
                                        var w = Math.round(radio * parseInt(getSelection.width));
                                        if (w % 2 == 1) {
                                            w = w + 1; //宽度和高度都设置为偶数
                                        }
                                        var h = Math.round(radio * parseInt(getSelection.height));
                                        if (h % 2 == 1) {
                                            h = h + 1;
                                        }
                                        var d = x + '_' + y + '_' + w + '_' + h;
                                        //alert(x + ' '+ y +' '+ w + ' '+h);
                                        $('.canvas').attr('d', d); //把当前的实际截取坐标储存在d属性里面
                                        // $('.imgareaselect-outer:eq(2) .toolbar').remove();
                                        // $('.imgareaselect-outer:eq(2) form').remove();
                                        $('.toolbar').remove();
                                        //var rUrl = Const.URL_R_TESTDESC;
                                        var btns = '<div class="toolbar" style="opacity:1;z-index:5">' +
                                        //'<form id="matrixBtn" method="GET" action="' + rUrl + '" target= "_blank">' +
                                        '<form id="matrixBtn" method="POST" action="" target= "_blank">' +
                                        '<input id="x" type="hidden" name="x" value="">' +
                                        '<input id="y" type="hidden" name="y" value="">' +
                                        '<input id="w" type="hidden" name="w" value="">' +
                                        '<input id="h" type="hidden" name="h" value="">' +
                                        '<input id="imagename" type="hidden" name="imagename" value="">' +
                                        '<input id="filename" type="hidden" name="filename" value="">' +
                                        '<input id="rows" type="hidden" name="rows" value="">' +
                                        '<input id="cols" type="hidden" name="cols" value="">' +
                                        '<input id="getImagick" type="button" value="Detail" /><br/>' +
                                        '<input id="reCluster" type="button" value="Recluster"/><br/>' +
                                        '<input id="cancelBtn" type="button" value="Cancel" /><br/>' +
                                        '</form></div>';
                                        //$('.imgareaselect-outer:eq(2)').append(btns);
                                        $('body').append(btns);
                                        $('.toolbar').css({
                                            position: "absolute",
                                            left: $('.imgareaselect-outer:eq(2)').offset().left,
                                            top: $('.imgareaselect-outer:eq(2)').height() + $('.imgareaselect-outer:eq(2)').offset().top - $('.imgareaselect-outer:eq(3)').height() - $('.toolbar').height() - 5
                                        }); 
                                        /*
                                        $('.imgareaselect-outer:eq(2) .toolbar').css({
                                            position: "absolute",
                                            left: 0,
                                            top: $('.imgareaselect-outer:eq(1)').height() + $('.imgareaselect-selection').height() - $('.imgareaselect-outer:eq(2) .toolbar').height() - 2
                                        });
                                        */
                                        //$('.imgareaselect-outer:eq(3)').css('overflow', 'visible');
        
                                        //$('.imgareaselect-outer').css('z-index', '5');
                                        $('#matrixBtn #x').val(x);
                                        $('#matrixBtn #y').val(y);
                                        $('#matrixBtn #w').val(w);
                                        $('#matrixBtn #h').val(h);
                                    
                                        //get the gene row and col index
                                        /*
                                        var colStartIndex = Math.round(x / 2) - 1;
                                        var colLength = Math.round(w / 2);
                                        var rowStartIndex = Math.round(y / 2) - 1;
                                        var rowLength = Math.round(h / 2);
                                        $('#matrixBtn #r1').val(rowStartIndex);
                                        $('#matrixBtn #r2').val(rowStartIndex + rowLength);
                                        $('#matrixBtn #c1').val(colStartIndex);
                                        $('#matrixBtn #c2').val(colStartIndex + colLength);
                                        */
                                        $('.selected_area').show();

                                        //状态恢复   
                                        $('#ReclustBtn').trigger('click');
                                    }

                                });

                                // var time = parseInt(1 / $('.canvas').attr('r'));
                                // if (time > 8) { //缩放1到3倍时才可以选择区域截取
                                //     _this.regionReclust.setOptions({
                                //         disable: true
                                //     });
                                // } else {
                                //     _this.regionReclust.setOptions({
                                //         enable: true
                                //     });
                                // }

                                $('#cancelBtn').live('click', function() {
                                    _this.regionReclust.cancelSelection(); //取消选择区域
                                    $('.selected_area').show();
                                    $('.toolbar').remove();
                                });

 

                            } else {

                                Cache.putData('reclust_status', 'inactive');
                                $('#ReclustBtn').removeClass('active');
                                //$('#InfoBtn').css('background', 'url(' + _this.prefix + 'info_bg.jpg) no-repeat center center');
                                //container.getElement('div.info').fade(0);
                                $('#reclust_pointer').hide();

                                //点击后禁止选择区域
                                if (_this.regionReclust != null) {
                                    //console.log('regionReclust exists');
                                    _this.regionReclust.setOptions({
                                        disable: true
                                    });
                                }

                            }
                        },
                        mouseover: function() {
                        //if (!(Browser.ie && Browser.version < 9)) this.fade(1);
                        },
                        mouseout: function() {
                        //if (!(Browser.ie && Browser.version < 9)) this.fade(0.65);
                        },
                        mousedown: function(e) {
                            var event = new Event(e);
                            if (event.event.button != 2) {
                            //   event.stop();
                            }
                        }
                    }
                }).inject(container);
  
                //container.addEvent('mouseover:relay(div.region)',this.zoom.bind(this));
                //$$('.region').addEvent('mousewheel:throttle(75)',this.zoom.bind(this));
            
                // Create nav buttons if requested 
                if (this.showNavButtons) {
                    var navbuttons = new Element('div', {
                        'class': 'navbuttons',
                        'styles': {
                    //top: '566px'
                    }
                    });

                    // Create our buttons as JPG with fallback to PNG
                    // var prefix = this.prefix;
                    // ['reset', 'zoomIn', 'zoomOut'].each(function(k) {
                    //     new Element('img', {
                    //         'src': prefix + k + '.jpg',
                    //         'class': k,
                    //         'title': k,
                    //         'events': {
                    //             'error': function() {
                    //                 this.removeEvents('error'); // Prevent infinite reloading
                    //                 this.src = this.src.replace('.jpg', '.png');
                    //             }
                    //         }
                    //     }).inject(navbuttons);
                    // });


                    // Create our buttons as JPG with fallback to PNG
                    var prefix = this.prefix;
                    ['reset', 'zoomIn', 'zoomOut'].each(function(k) {
                        new Element('div', {
                            //'src': prefix + k + '.jpg',
                            'class': k,
                            'title': k,
                            'events': {
                                'error': function() {
                                    this.removeEvents('error'); // Prevent infinite reloading
                                //this.src = this.src.replace('.jpg', '.png');
                                }
                            }
                        }).inject(navbuttons);
                    });


                    navbuttons.inject(container);

                    // Need to set this after injection
                    /*
                    navbuttons.set('slide', {
                        duration: 300,
                        transition: Fx.Transitions.Quad.easeInOut,
                        mode: 'vertical'
                     });
                    */

                    // Add events to our buttons
                    navbuttons.getElement('div.zoomIn').addEvent('click', function() {
                        IIPMooViewer.windows(this).each(function(el) {
                            el.zoomIn();
                        });
                        this.zoomIn();
                    }.bind(this));

                    navbuttons.getElement('div.zoomOut').addEvent('click', function() {
                        IIPMooViewer.windows(this).each(function(el) {
                            el.zoomOut();
                        });
                        this.zoomOut();
                    }.bind(this));

                    navbuttons.getElement('div.reset').addEvent('click', function() {
                        IIPMooViewer.windows(this).each(function(el) {
                            el.reload();
                        });
                        this.reload();
                    }.bind(this));

                }

                // For standalone iphone/ipad the logo gets covered by the status bar
                if (Browser.Platform.ios && window.navigator.standalone) info.setStyle('top', 15);

                // Add some information or credit

                /*NEED NO CREDIT
                if (this.credit) {
                    new Element('div', {
                        'class': 'credit',
                        'html': this.credit,
                        'styles': {
                            opacity: 0.65
                        },
                        'events': {
                            // We specify the start value to stop a strange problem where on the first
                            // mouseover we get a sudden transition to opacity 1.0
                            mouseover: function() {
                                this.fade([0.6, 0.9]);
                            },
                            mouseout: function() {
                                this.fade(0.6);
                            }
                        }
                    }).inject(container);
                }
                */

                // Add a scale if requested. Make it draggable and add a tween transition on rescaling
                if (this.scale) {
                    var scale = new Element('div', {
                        'class': 'scale',
                        'title': 'draggable scale',
                        'html': '<div class="ruler"></div><div class="label"></div>'
                    }).inject(container);
                    scale.makeDraggable({
                        container: container
                    });
                    scale.getElement('div.ruler').set('tween', {
                        transition: Fx.Transitions.Quad.easeInOut
                    });
                }


                // Calculate some sizes and create the navigation window
                this.calculateSizes();
                this.createNavigationWindow();
                this.createAnnotations();


                if (!(Browser.Platform.ios || Browser.Platform.android)) {
                    var tip_list = 'img.logo, div.toolbar, div.scale';
                    if (Browser.ie8 || Browser.ie7) tip_list = 'img.logo, div.toolbar'; // IE8 bug which triggers window resize
                    new Tips(tip_list, {
                        className: 'tip', // We need this to force the tip in front of nav window
                        onShow: function(tip, el) {
                            tip.setStyles({
                                visibility: 'hidden',
                                display: 'block'
                            }).fade([0, 0.9]);
                        },
                        onHide: function(tip, el) {
                            tip.fade('out').get('tween').chain(function() {
                                tip.setStyle('display', 'none');
                            });
                        }
                    });
                }

                // Set our initial viewport resolution if this has been set
                if (this.viewport && this.viewport.resolution != null) {
                    this.view.res = this.viewport.resolution;
                    this.wid = this.resolutions[this.view.res].w;
                    this.hei = this.resolutions[this.view.res].h;
                    this.touch.options.limit = {
                        x: Array(this.view.w - this.wid, 0),
                        y: Array(this.view.h - this.hei, 0)
                    };
                }

                // Center our view or move to initial viewport position
                if (this.viewport && this.viewport.x != null && this.viewport.y != null) {
                    this.moveTo(this.viewport.x * this.wid, this.viewport.y * this.hei);
                } else this.reCenter();


                // Set the size of the canvas to that of the full image at the current resolution
                this.canvas.setStyles({
                    width: this.wid,
                    height: this.hei
                });


                // Load our images
                this.requestImages();
                this.positionZone();
                //added
                this.zoomCallback();
                if (this.scale) this.updateScale();

                // Add our key press and window resize events. Do this at the end to avoid reloading before
                // we are fully set up
                //if (this.winResize) window.addEvent('resize', this.reload.bind(this));
                if (this.winResize) window.addEvent('resize', function(){
                    this.reload();
                    this.updateSize();
                }.bind(this));
                window.fireEvent('iiploaded');

                this.updateSize();
                
                /*
                //added by huang to locate postion of marks
                $('.marktitle,.chat-mark').live('click', function() {

                    //var markid =$(this).parent().parent('item-box').find('.markid');
                    var markid = $(this).parent().parent('.item-box').find('.markid').val() || $(this).attr('id').split('_')[1];

                    var mark = $('#viewer').find('#mark_box_' + markid);
                    if(mark.length <= 0 ) {
                        return;
                    }

                    //标记的区域
                    var l_r = parseFloat(mark.attr('l_r'));
                    var t_r = parseFloat(mark.attr('t_r'));
                    var h_r = parseFloat(mark.attr('h_r'));
                    var w_r = parseFloat(mark.attr('w_r'));


                    //先zoom到最大(合适)的状态
                    while (_this.max_size.w > _this.wid) {
                        _this.zoomIn();
                    }

                    //移动到的位置
                    var x = parseInt(_this.wid * (l_r + w_r / 2)) - parseInt(_this.view.w / 2);
                    var y = parseInt(_this.hei * (t_r + h_r / 2)) - parseInt(_this.view.h / 2);
                    if (isNaN(x) || isNaN(y)) {
                        return;
                    }

                    //移动
                    _this.moveTo(x, y);

                    //显示选中的markbox
                    $('.mark-box').hide();
                    mark.show();


                    //调整mark-box的位置
                    var obj = mark;
                    var l = obj.width() + parseInt(obj.css('left'));
                    var t = obj.height() + parseInt(obj.css('top')) + 12;
                    var width = $('#viewer').width();
                    var height = $('#viewer').height();
                    if (l > width) {
                        var offset_left = width - obj.width() - 5;
                        obj.css('left', offset_left);
                    };
                    if (t > height) {
                        var offset_top = height - obj.height();
                        obj.css('top', offset_top);
                    };
                });
                */
            },

         /**
         *
         * 覆盖原组件的Create navigation方法
         * 
         **/

            createNavigationWindow: function() {

                // If the user does not want a navigation window, do not create one!
                if ((!this.showNavWindow) && (!this.showNavButtons)) return;

                var navcontainer = new Element('div', {
                    'class': 'navcontainer',
                    'styles': {
                        position: 'absolute',
                        width: this.navWin.w
                    }
                });

                var _this = this;
                //NO NEED ANYMORE
                /* 
                var toolbar = new Element('div', {
                    'class': 'toolbar',
                    'events': {
                        dblclick: function(source) {
                            document.id(source).getElement('div.navbuttons').get('slide').toggle();
                        }.pass(this.source)
                    }
                });
                toolbar.store('tip:text', '* Drag to move<br/>* Double Click to show/hide buttons<br/>* Press h to hide');
                toolbar.inject(navcontainer);
                */

                // Create our navigation div and inject it inside our frame if requested
                if (this.showNavWindow) {

                    var navwin = new Element('div', {
                        'class': 'navwin',
                        'styles': {
                            height: this.navWin.h
                        }
                    });
                    navwin.inject(navcontainer);


                    // Create our navigation image and inject inside the div we just created
                    var navimage = new Element('img', {
                        'class': 'navimage',
                        'src': this.server + '?FIF=' + this.images[0].src + '&SDS=' + this.images[0].sds + '&WID=' + this.navWin.w + '&QLT=99&CVT=jpeg',
                        'events': {
                            'click': this.scrollNavigation.bind(this),
                            'mousewheel:throttle(75)': this.zoom.bind(this),
                            // Prevent user from dragging navigation image
                            'mousedown': function(e) {
                                var event = new Event(e);
                                if (event.event.button != 2) {
                                    event.stop();
                                }
                            }
                        }
                    });
                    navimage.inject(navwin);


                    // Create our navigation zone and inject inside the navigation div
                    this.zone = new Element('div', {
                        'class': 'zone',
                        'morph': {
                            duration: 500,
                            transition: Fx.Transitions.Quad.easeInOut
                        },
                        'events': {
                            'mousewheel:throttle(75)': this.zoom.bind(this),
                            'dblclick': this.zoom.bind(this)
                        }
                    });
                    this.zone.inject(navwin);

                }


                // Add a progress bar only if we have the navigation window visible
                if (this.showNavWindow) {

                    // Create our progress bar
                    var loadBarContainer = new Element('div', {
                        'class': 'loadBarContainer',
                        'html': '<div class="loadBar"></div>',
                        'styles': {
                            width: this.navWin.w - 2
                        },
                        'tween': {
                            duration: 1000,
                            transition: Fx.Transitions.Sine.easeOut,
                            link: 'cancel'
                        },
                        'events': {
                            'click': function() {}
                        }
                    });
                    loadBarContainer.inject(navcontainer);
                }


                // Inject our navigation container into our holding div
                navcontainer.inject(this.source);


                if (this.showNavWindow) {
                    this.zone.makeDraggable({
                        container: document.id(this.source).getElement('div.navcontainer div.navwin'),
                        // Take a note of the starting coords of our drag zone
                        onStart: function() {
                            var pos = this.zone.getPosition();
                            this.navpos = {
                                x: pos.x,
                                y: pos.y
                            };
                        }.bind(this),
                        onDrag: this.zoomCallback.bind(this), //added by huang
                        onComplete: this.scrollNavigation.bind(this)
                    });
                }

            /*
            navcontainer.makeDraggable({
                container: this.source,
                handle: toolbar
            });
           */

            },
            /**
            *
            *覆盖原组件的positionZone方法
            */

            positionZone: function() {

                var _this = this;
                if (!this.showNavWindow) {
                    return;
                }

                var pleft = (this.view.x / this.wid) * (this.navWin.w);
                if (pleft > this.navWin.w) pleft = this.navWin.w;
                if (pleft < 0) pleft = 0;

                var ptop = (this.view.y / this.hei) * (this.navWin.h);
                if (ptop > this.navWin.h) ptop = this.navWin.h;
                if (ptop < 0) ptop = 0;

                var width = (this.view.w / this.wid) * (this.navWin.w);
                if (pleft + width > this.navWin.w) width = this.navWin.w - pleft;

                var height = (this.view.h / this.hei) * (this.navWin.h);
                if (height + ptop > this.navWin.h) height = this.navWin.h - ptop;

                var border = this.zone.offsetHeight - this.zone.clientHeight;

                // Move the zone to the new size and position
                this.zone.morph({
                    left: pleft,
                    //top: ptop + 10, // 10px for the toolbar
                    top: ptop, // no toolbar
                    width: (width - border > 0) ? width - border : 1, // Watch out for zero sizes!
                    height: (height - border > 0) ? height - border : 1
                });
                //added
                //this.zoomCallback();

                //判断是否需要右键选取区域的这一功能
                if (Cache.getData('imagick') == 0) {
                    //console.log(Cache.getData('imagick'));
                    return;
                }
                //$('.canvas').imgAreaSelect({handles: true, fadeSpeed: 200});
                var IAS = $('.canvas').imgAreaSelect({ //右键选择部分区域来进行更详细的显示
                    handles: true,
                    instance: true, //设置为可实例化
                    fadeSpeed: 200,
                    //maxHeight:parseInt(1000*$('.canvas').attr('r')),
                    //maxWidth:parseInt(1000*$('.canvas').attr('r')),
                    onSelectStart: function() {
                        var active = false;
                        $.each($('.userIcon'), function(i, e) {
                            if ($(e).hasClass('active')) {
                                var active = true;
                            };
                        });
                        if (active) {
                            IAS.cancelSelection();
                        }
                        $('.selected_area').hide();

                    },
                    onSelectChange: function() {

                    },
                    onSelectEnd: function(img, getSelection) {
                        //isMouseDown = false;
                        var col_num = Cache.getData('col_num'),
                        row_num = Cache.getData('row_num');
                        //var initialWidth = col_num * 2; //原图片的大小
                        //var initialHeight = row_num * 2;
                        var initialWidth = _this.max_size.w; //原图片的大小
                        var initialHeight = _this.max_size.h;
                        var currentWidth = parseInt($('.canvas').css('width'));
                        //var currentHeight=parseInt($('.canvas').css('height'));
                        //var row_num=3652;       //基因的横列数目
                        //var col_num=3841;
                        var radio = parseFloat(initialWidth / currentWidth); //缩放倍数

                        var x = Math.round(radio * parseInt(getSelection.x1)); //换算成实际起始坐标
                        if (x % 2 == 1) {
                            x = x - 1; //起始横坐标设定为偶数
                        }
                        var y = Math.round(radio * parseInt(getSelection.y1));
                        if (y % 2 == 1) { //纵坐标设定为起始值加偶数
                            y = y - 1;
                        }
                        //换算成实际高度
                        var w = Math.round(radio * parseInt(getSelection.width));
                        if (w % 2 == 1) {
                            w = w + 1; //宽度和高度都设置为偶数
                        }
                        var h = Math.round(radio * parseInt(getSelection.height));
                        if (h % 2 == 1) {
                            h = h + 1;
                        }
                        var d = x + '_' + y + '_' + w + '_' + h;
                        //alert(x + ' '+ y +' '+ w + ' '+h);
                        $('.canvas').attr('d', d); //把当前的实际截取坐标储存在d属性里面
                        $('.imgareaselect-outer:eq(2) .toolbar').remove();
                        $('.imgareaselect-outer:eq(2) form').remove();
                        var rUrl = Const.URL_R_TESTDESC;
                        var btns = '<div class="toolbar" style="opacity:1;z-index:5">' +
                        '<form id="matrixBtn" method="GET" action="' + rUrl + '" target= "_blank">' +
                        '<input id="r1" type="hidden" name="r1" value="">' +
                        '<input id="r2" type="hidden" name="r2" value="">' +
                        '<input id="c1" type="hidden" name="c1" value="">' +
                        '<input id="c2" type="hidden" name="c2" value="">' +
                        '<input id="getImagick" type="button" value="Detail" /><br/>' +
                        '<input id="reCluster" type="button" value="Recluster"/><br/>' +
                        '<input id="cancelBtn" type="button" value="Cancel" /><br/>' +
                        '</form></div>';
                        $('.imgareaselect-outer:eq(2)').append(btns);
                        $('.imgareaselect-outer:eq(2) .toolbar').css({
                            position: "absolute",
                            left: 0,
                            top: $('.imgareaselect-outer:eq(1)').height() + $('.imgareaselect-selection').height() - $('.imgareaselect-outer:eq(2) .toolbar').height() - 2
                        });
                        $('.imgareaselect-outer:eq(3)').css('overflow', 'visible');
                        //$('.imgareaselect-outer:eq(3)').css('z-index', '5');
                        $('.imgareaselect-outer').css('z-index', '5');
                        //get the gene row and col index
                        var colStartIndex = Math.round(x / 2) - 1;
                        var colLength = Math.round(w / 2);
                        var rowStartIndex = Math.round(y / 2) - 1;
                        var rowLength = Math.round(h / 2);
                        $('#matrixBtn #r1').val(rowStartIndex);
                        $('#matrixBtn #r2').val(rowStartIndex + rowLength);
                        $('#matrixBtn #c1').val(colStartIndex);
                        $('#matrixBtn #c2').val(colStartIndex + colLength);
                        $('.selected_area').show();
                    }

                });
                var time = parseInt(1 / $('.canvas').attr('r'));
                if (time > 8) { //缩放1到3倍时才可以选择区域截取
                    IAS.setOptions({
                        disable: true
                    });
                } else {
                    IAS.setOptions({
                        enable: true
                    });
                }

                $('#cancelBtn').live('click', function() {
                    IAS.cancelSelection(); //取消选择区域
                    $('.selected_area').show();
                });

                if (Cache.getData('imagick') == 0) {
                    IAS.setOptions({
                        disable: true
                    });
                }
            },

            /**
         *
         *覆盖原组件的scrollNavigation方法
         *Scroll resulting from a drag of the navigation window
         *
         */
            scrollNavigation: function(e) {

                var xmove = 0;
                var ymove = 0;

                var zone_size = this.zone.getSize();
                var zone_w = zone_size.x;
                var zone_h = zone_size.y;

                // From a mouse click
                if (e.event) {
                    e.stop();
                    var pos = this.zone.getParent().getPosition();
                    xmove = e.event.clientX - pos.x - zone_w / 2;
                    ymove = e.event.clientY - pos.y - zone_h / 2;
                } else {
                    // From a drag
                    xmove = e.offsetLeft;
                    //ymove = e.offsetTop - 10;
                    ymove = e.offsetTop; //added by huang
                    if ((Math.abs(xmove - this.navpos.x) < 3) && (Math.abs(ymove - this.navpos.y) < 3)) return;
                }

                if (xmove > (this.navWin.w - zone_w)) xmove = this.navWin.w - zone_w;
                if (ymove > (this.navWin.h - zone_h)) ymove = this.navWin.h - zone_h;
                if (xmove < 0) xmove = 0;
                if (ymove < 0) ymove = 0;

                xmove = Math.round(xmove * this.wid / this.navWin.w);
                ymove = Math.round(ymove * this.hei / this.navWin.h);

                // Only morph transition if we have moved a short distance
                var morphable = Math.abs(xmove - this.view.x) < this.view.w / 2 && Math.abs(ymove - this.view.y) < this.view.h / 2;
                if (morphable) {
                    this.canvas.morph({
                        left: (this.wid > this.view.w) ? -xmove : Math.round((this.view.w - this.wid) / 2),
                        top: (this.hei > this.view.h) ? -ymove : Math.round((this.view.h - this.hei) / 2)
                    });
                } else {
                    this.canvas.setStyles({
                        left: (this.wid > this.view.w) ? -xmove : Math.round((this.view.w - this.wid) / 2),
                        top: (this.hei > this.view.h) ? -ymove : Math.round((this.view.h - this.hei) / 2)
                    });
                }

                // Re-orient our canvas to 0 degrees rotation
                this.orientation = 0;
                this.canvas.setStyle(this.CSSprefix + 'transform', 'rotate(0deg)');
                this.zone.setStyle(this.CSSprefix + 'transform', 'rotate(0deg)');

                this.view.x = xmove;
                this.view.y = ymove;

                // The morph event automatically calls requestImages
                if (!morphable) {
                    this.requestImages();
                }

                // Position the zone after a click, but not for zone drags
                if (e.event) {
                    this.positionZone();
                    this.zoomCallback();
                }

                //added
                this.positionZone();
                this.zoomCallback();

                if (IIPMooViewer.sync) {
                    IIPMooViewer.windows(this).each(function(el) {
                        el.moveTo(xmove, ymove);
                        //added
                        el.zoomCallback();
                    });
                }
            },

            /**
         * 自带附加方法,缩放时执行的函数
         * @param hehe 初始化的数据
         */
            zoomCallback: function() {
                //var col_num = Cache.getData('col_num'),
                //    row_num = Cache.getData('row_num');
                //var initialWidth = col_num * 2;
                //var initialHeight = row_num * 2; //原图片的大小
                var initialWidth = this.max_size.w;
                var initialHeight = this.max_size.h; //原图片的大小
                //var row_num = row_num;
                //var col_num = col_num;      	    //基因的横列数目
                var y = parseInt($('.canvas').css('top'));
                var x = parseInt($('.canvas').css('left')); //图片相对于窗口的偏移
                var width = parseInt($('.canvas').css('width'));
                var height = parseInt($('.canvas').css('height')); //图片当前的尺寸
                var radio = width / initialWidth;
                $('.canvas').attr('r', parseFloat(radio)); //把缩放比例存放在r属性里面
                if ($('#viewer').find('.selected_area').length != 0) {
                    var sw = parseInt($('.selected_area').attr('wr') * width); //重新计算高度
                    var sh = parseInt($('.selected_area').attr('hr') * height);
                    var s_r = parseFloat(radio / $('.selected_area').attr('c_r')); //获取canvas相对于初始的缩放比例
                    var s_left = parseInt($('.selected_area').attr('left_gap') * s_r) + x;
                    var s_top = parseInt($('.selected_area').attr('top_gap') * s_r) + y; //偏移为相对位移+绝对位移
                    $('.selected_area').css({
                        width: sw,
                        height: sh,
                        left: s_left,
                        top: s_top
                    });
                    //console.log('l_'+s_left+' t_'+s_top);
                    $('.selected_area').show();
                }

                //保持标注的相对位置

                //保持pins的相对位置
                $('.pin').each(function(i, e) {
                    var pin = $(e);
                    var p_left = x + width * parseFloat(pin.attr('l_r'));
                    var p_top = y + height * parseFloat(pin.attr('t_r'));
                    pin.css({
                        left: p_left - parseInt($('.pin').width()/2),
                        top: p_top - $('.pin').height()
                    });
                });


                //保持regions的相对位置
                $('.region').each(function(i, e) {
                    var region = $(e);
                    var sw = parseInt(region.attr('w_r') * width); //重新计算高度
                    var sh = parseInt(region.attr('h_r') * height);
                    var s_left = parseInt(region.attr('l_r') * width) + x;
                    var s_top = parseInt(region.attr('t_r') * height) + y; //偏移为相对位移+绝对位移
                    region.css({
                        width: sw,
                        height: sh,
                        left: s_left,
                        top: s_top
                    });
                    region.show();
                });

                //保持markbox的相对位置
                $('.mark-box').each(function(i, e) {
                    var mark_box = $(e);
                    var type = mark_box.attr('type');

                    var m_left = x + width * parseFloat(mark_box.attr('l_r'));
                    var m_top = y + height * (parseFloat(mark_box.attr('t_r')) + parseFloat(mark_box.attr('h_r')));
                    var m_width = width * parseFloat(mark_box.attr('w_r'));
                    if (type == 0) {
                        m_left = m_left - 70 ; 
                    } else {
                        m_left = m_left + m_width / 2 - 70;
                        m_top = m_top + 5
                    }
                    mark_box.css({
                        left: m_left,
                        top: m_top + 5
                    });
                    //调整可见的mark-box的位置
                    adjustMarkboxPos(mark_box);
                });

                function adjustMarkboxPos(obj) {
                    if (obj.css('display') == 'none') {
                        return;
                    }
                    var l = obj.width() + obj.offset().left;
                    var t = obj.height() + obj.offset().top;
                    var width = $('#viewer').width();
                    var height = $('#viewer').height();
                    if (l > width) {
                        var offset_left = width - obj.width() - 25;
                        obj.css('left', offset_left);
                    };
                    if (t > height) {
                        var offset_top = height - obj.height() - 25;
                        obj.css('top', offset_top);
                    };
                }

                //增加region的mousewheel事件
                //$$('.region').addEvent('mousewheel:throttle(75)',this.zoom.bind(this));
                var _this = this ;
                $('.region').each(function(i,e){
                    e.addEvents({
                        'mousewheel:throttle(75)': _this.zoom.bind(_this),
                        'dblclick': _this.zoom.bind(_this)
                    });
                });

            },
            /**
            *  added
            *  调整初始化图像的大小和位置
            */
            updateSize: function() {
                
                //设置初始化zoom状态 ，放大图像直到图像铺满窗口或达到最大高度时退出
                while (this.view.w > this.wid) {  
                    if(this.max_size.w <= this.wid ){
                        break;
                    }
                    this.zoomIn();
                }
                
                //移动到中心位置        
                var left = parseInt((this.wid - this.view.w) / 2);
                var top = parseInt((this.hei - this.view.h) / 2);
                this.moveTo(left, top);
            }
            
            
            
        });
    });