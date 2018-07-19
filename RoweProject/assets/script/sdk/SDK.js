function SDK() {
    this.curSDK = null;
    this.curOS = "none";
}

SDK.prototype.init = function () {
    if (cc.sys.os === cc.sys.OS_WINDOWS) {
        this.curOS = cc.sys.OS_WINDOWS;
        this.initWinSDK();
    } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        this.curOS = cc.sys.OS_ANDROID;
        this.initAndroidSDK();
        this.login();
    } else if (cc.sys.os === cc.sys.OS_IOS) {
        this.curOS = cc.sys.OS_IOS;
        this.initIOSSDK();
        this.login();
    }
};

SDK.prototype.initWinSDK = function () {
    cc.log("initWinSDK done === ");
};

SDK.prototype.initAndroidSDK = function () {
    // var sdk = require("Google");
    // this.curSDK = new sdk();
    cc.log("initAndroidSDK done === ");
};

SDK.prototype.initIOSSDK = function () {
    // var sdk = require("Tencent");
    // this.curSDK = new sdk();
    cc.log("initIOSSDK done === ");
};

SDK.prototype.getCurSDKName = function () {
    return this.curSDK.getName();
};

SDK.prototype.getCurOS = function () {
    return this.curOS;
};

SDK.prototype.login = function () {
    this.curSDK.login();
};

SDK.prototype.logout = function () {
    this.curSDK.logout();
};

SDK.prototype.pay = function () {
    this.curSDK.pay();
};

module.exports = SDK;
