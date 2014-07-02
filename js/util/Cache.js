/**
 * 全局缓存模块
 * 本模块封装了locache.js库的API，可以在在各个js之间共享数据
 * （本模块是一个适配器，在原Cache模块的API和locache.js的API之间进行了转换）
 * @author Ray Taylor Lin
 */

require.config({
    baseUrl: './js',
    paths: {
        locache: 'lib/locache.min'
    }
});

define([
    'locache'
], function () {
    "use strict";
    return {
        getData: function (key) {
            return locache.get(key);
        },
        putData: function (key, value) {
            locache.set(key, value);
        },
        removeData: function (key) {
            locache.remove(key);
        }
    };

//    var data = {};
//    return{
//        getData: function (key) {
//            return data[key];
//        },
//        putData: function (key, value) {
//            data[key] = value;
//        }
//    };
});