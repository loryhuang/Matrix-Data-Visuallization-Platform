define(function () {
    "use strict";
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/\{(\d+)\}/g, function(){
            var val = args[arguments[1]];
            return (! val) ? arguments[0] : val;
        });
    };


    var randomString = function (length) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split(''),
            str = '',
            i;

        if (!length) {
            length = Math.floor(Math.random() * chars.length);
        }
        for (i = 0; i < length; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    };

    return{
        randomString: randomString
    };
});