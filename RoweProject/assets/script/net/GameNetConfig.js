function GameNetConfig() {
    this.serverType = 1; // 1: 内网, 2: 外网测试，3:外网正式

    //当前选择的服务器
    this.curServer = {};

    this.configUrl = ""

    this.svrUrl = "";

    this.getSignURL = function() {
        // TODO:
    }

    this.getSvrURL = function() {
        return this.svrUrl;
    };

    this.getLoginURL = function () {
        // TODO:
    };

    this.getConfigURL = function () {
        return this.getSvrURL() + "config/";
    };

    this.getPID = function () {
        // TODO:
    };

    this.getClientVer = function () {
        return "1";
    };

    this.serSvrURL = function (url) {
        this.svrUrl = url + "/";
    };
}

module.exports = GameNetConfig;