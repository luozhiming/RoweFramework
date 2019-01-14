const Constants = require('Constants');
function SDK() {
    this.curSDK = null;
    this.userData = {};
    this.userData.user = {};

    this.init = function () {
        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            this.initWeChatSDK();

            cc.log(window.wx.getLaunchOptionsSync());
        } else if (cc.sys.os === cc.sys.OS_WINDOWS) {
            this.initWinSDK();
        } else if (cc.sys.os === cc.sys.OS_ANDROID) {
            this.initAndroidSDK();
        } else if (cc.sys.os === cc.sys.OS_IOS) {
            this.initIOSSDK();
        }
    };

    this.initWinSDK = function () {
        var sdk = require("WinSDK");
        this.curSDK = new sdk();
    };

    this.initAndroidSDK = function () {
        cc.log("initAndroidSDK done === ");
    };

    this.initIOSSDK = function () {
        cc.log("initIOSSDK done === ");
    };

    this.initWeChatSDK = function () {
        cc.log("initWeChatSDK done === ");
    };
};

SDK.prototype.getName = function () {
    return this.name;
};

SDK.prototype.setUserData = function (data) {
    this.userData.user.id = data.id;
    this.userData.user.token = data.token;
    this.userData.user.sign = data.sign;
    this.userData.user.timestamp = data.timestamp;
};

SDK.prototype.getUserData = function () {
    return this.userData;
};

SDK.prototype.login = function () {
    cc.log("=== sdk proto login ===");
};

SDK.prototype.logout = function () {
    cc.log("=== sdk proto logout ===");
};

SDK.prototype.roleData = function () {
    cc.log("=== sdk proto roleData ===");
};

SDK.prototype.uploginData = function () {
    cc.log("=== sdk proto uploginData ===");
};

SDK.prototype.share = function () {
    cc.log("=== sdk proto share ===");
};

SDK.prototype.pay = function (type, config) {
    cc.log("=== sdk proto pay ===");
};

module.exports = SDK;
