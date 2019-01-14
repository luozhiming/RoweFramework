function Utils() {
    this.random = function (lower, upper) {
        return Math.floor(Math.random() * (upper - lower)) + lower;
    };

    this.deepCopy = function (obj) {
        var result = Array.isArray(obj) ? [] : {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object') {
                    result[key] = deepCopy(obj[key]);
                } else {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    };

    this.requireFullScreen = function () {
        var element = window.document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    };

    this.base64decode = function (input) {
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = this.utf8decode(output);
        return output;
    };

    this.utf8decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = 0;
        var c2 = 0;
        var c3 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    };

    this.formatTime = function (second) {
        var hour = Math.floor(second / 60 / 60);
        var minute = Math.floor((second - hour * 3600) / 60);
        var second = Math.floor(second % 60);
        var day = Math.floor(hour / 24);
        hour = hour % 24;

        var str = day ? (day < 10 ? "0" + day : day) + ":" : "";
        str += (hour ? (hour < 10 ? "0" + hour : hour) : "00") + ":";
        str += (minute ? (minute < 10 ? "0" + minute : minute) : "00") + ":";
        str += second ? (second < 10 ? "0" + second : second) : "00";
        return str;
    };

    this.restartGame = function() {
        function restart() {
            window.location.reload(true);
        }
        require("GE").getData().ui.showMsgBox("重启游戏", 1, "与服务器链接已断开，请重启游戏!", "确定", null, restart, restart);
    }
};

module.exports = Utils;
