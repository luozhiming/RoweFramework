const Constants = require('Constants');
const HTTP_SVR = Constants.HTTP_SVR;
var NetConfig = require("GameNetConfig");
var protocol = require("NetProtocol");

function GameNet() {
    this.timeoutID = 0;
    this.isRequesting = false;
    this.isLogining = false;
    this.requestQueue = [];
    this.reconnectTimes = 0;
    this.socketCount = 0;
    this.configFileCount = 0;
    this.configTotalCount = 0;
    this.netConfig = new NetConfig();
    this.gameEngine = cc.director.getScene().getChildByName("Global").getComponent("GameEngine");

    // 参数：
    // name : netprotocol 中的协议名
    // data : 协议所需的数据
    // cb : 回调函数，必须使用 function(){}.bind(this) 的写法
    // noTip : 需要不提示，就传 true
    // svrType : 服务器类型：Constants中的HTTP_SVR定义
    this.send = function (name, data, cb, noTip, svrType) {
        var msgObj = {};
        msgObj.name = name;
        msgObj.moduleName = protocol[name][0];
        msgObj.methodName = protocol[name][1];
        msgObj.data = data;
        msgObj.callback = cb;
        msgObj.noTip = noTip;
        msgObj.svrType = svrType || HTTP_SVR.GAME;

        // 如果当前有网络请求未返回，则缓存网络请求数据
        if (this.isRequesting) {
            if (this.requestQueue) {
                this.requestQueue.push(msgObj);
            }
            return
        }

        // 整理 http 请求的 url 和 post data
        var url = null;
        var postData = null;
        var openType = "POST";
        if (msgObj.svrType == HTTP_SVR.GAME) {
            var rd = this.getGameSvrPostData(msgObj);
            url = rd[0];
            postData = rd[1];
        } else if (msgObj.svrType == HTTP_SVR.MCENTER) {
            // TODO:
        } else if (msgObj.svrType == HTTP_SVR.ACCOUNT) {
            var rd = this.getLoginPostData(msgObj);
            url = rd[0];
            postData = rd[1];
        }

        this.gameEngine.getGameUI().netLoading();

        var xhr = new XMLHttpRequest();
        xhr.open(openType, url, true);
        if (msgObj.svrType == HTTP_SVR.ACCOUNT) {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        xhr.send(postData);
        this.isRequesting = true;
        this.timeoutID = setTimeout(()=>{
            if (this.isRequesting) {
                this.isRequesting = false;
                this.gameEngine.getGameUI().netLoadingEnd();
                require("GE").getData().utils.restartGame();
            }
        }, 8000);

        xhr.onreadystatechange = () => {
            this.gameEngine.getGameUI().netLoadingEnd();
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                this.isRequesting = false;
                clearTimeout(this.timeoutID);

                cc.log("xhr.readyState: %s, xhr.status: %s", xhr.readyState, xhr.status);
                this.handleNetMessage(xhr, msgObj);
            } else {
                cc.log("xhr.readyState: %s, xhr.status: %s", xhr.readyState, xhr.status);
            }
        };
    };

    this.getGameSvrPostData = function (params) {
        var postData = {};
        postData.ModuleName = params.moduleName;
        postData.MethodName = params.methodName;
        postData.Data = params.data;

        var retData = JSON.stringify(postData);
        return [curSvr.GameServerUrl, retData];
    };

    this.handleNetMessage = function (xhr, msgObj) {
        var response = xhr.responseText;
        cc.log(response);

        var msgContent = JSON.parse(xhr.response);
        var isOK = xhr.status == 200;

        if (isOK) {
            if (msgObj.svrType == HTTP_SVR.GAME) {
                this.dealGameResponse(msgContent, msgObj.autoModifyCache)
            } else if (msgObj.svrType == HTTP_SVR.ACCOUNT) {
                if (msgContent.Status != 0) {
                    cc.log(msgContent);
                    this.gameEngine.getGameUI().showTip(NetErrCode.SERVER[msgContent.Status]);
                    return;
                }

                var pd = require("PlayerData");
                pd.setLoginInfo(msgContent.Data);
            }
        } else {
            cc.log("连接服务器错误 ERRO " + xhr.status);
        }

        if (isOK) {
            msgObj.callback && msgObj.callback(msgContent)

            if (this.requestQueue && this.requestQueue.length > 0)
                var reqInfo = this.requestQueue.shift();
            if (reqInfo) {
                this.send(reqInfo.name, reqInfo.data, reqInfo.callback, reqInfo.svrType);
            }
        } else {
            this.gameEngine.getGameUI().showTip("网络异常");
        }
    };

    this.dealGameResponse = function (response, needModifyCache) {
        // TODO:更新本地缓存，同步服务器时间
    };

    this.getLoginPostData = function (params) {
        var postData = {};
        postData.UserId = params.data[0];
        postData.PartnerId = this.netConfig.getPID();
        postData.Token = params.data[1];
        postData.Sign = params.data[2];
        postData.TimeStamp = params.data[3];

        var loginURL = this.netConfig.getLoginURL();
        var retData = this.formatData(postData);

        return [loginURL, retData];
    };

    this.formatData = function (data) {
        var finalStr = "";
        for (var key in data) {
            finalStr += key + "=";
            finalStr += data[key].toString() + "&";
        }
        finalStr = finalStr.substr(0, finalStr.length - 1);
        return finalStr;
    };

    this.connetChatServer = function (force) {
        if (this.connectTag && !force) {
            return;
        }

        this.connectTag = false;
        this.socketCount = 0;

        var loginInfo = require("PlayerData").getLoginInfo();
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = JSON.parse(xhr.responseText);
                if (!response || typeof response != 'object') {
                    setTimeout(()=>{
                        this.connetChatServer();
                    }, 5000);
                    return;
                }

                if (response.Data) {
                    this.openWebSocket(response.Data);
                }
            }
        };
        xhr.open("POST", loginInfo.ChatServerAddr, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(this.formatData({
            PartnerId: this.netConfig.getPID(),
            ServerId: loginInfo.curSvr.ServerId
        }));
    };

    this.openWebSocket = function (url) {
        var GE = require("GE").getData();

        this.socketCount++;

        if (this.socketCount > Constants.SOCKET_CALL_MAX_TIMES) {
            clearTimeout(this.heartTimerid);
            GE.event.dispatch(eType.CONNET_CHAT_SVR_OK);
            return;
        }

        if (!("WebSocket" in window)) {
            cc.log('浏览器不支持WebSocket');
            return;
        }

        this.ws && this.ws.close();

        this.ws = new WebSocket(`ws://${url}`);
        this.ws.onopen = (event) => {
            this.socketHeart();
            this.connectTag = true;
            GE.event.dispatch(eType.CONNET_CHAT_SVR_OK);
        };

        this.ws.onmessage = (event) => {
            var data = JSON.parse(event.data);
            var moduleInfo = data['ModuleInfo'];
            var GE = require("GE").getData();

            if (data.ResultStatus != 0) {
                if (moduleInfo == 'PlayerLogin') {
                    this.ws.close();
                    this.connetChatServer(true);
                } else if (moduleInfo == 'FriendChat') {
                    if (data['ResultStatus'] == -9) {
                        GE.ui.showTip('目标玩家不在线!', 3);
                    }
                }
                return;
            }

            // TODO:
        };

        this.ws.onerror = (event) => {
            this.connetChatServer(true);
        };

        this.ws.onclose = (event) => {
            this.connetChatServer(true);
        };
    };

    this.sendSoketMsg = function (name, dataArray) {
        if (!this.ws || this.ws.readyState != WebSocket.OPEN) {
            cc.log('socket还没连接好');
            return;
        }

        var str = JSON.stringify({MethodName:name, Data:dataArray});
        cc.log(`本次消息格式${str}`);
        this.ws.send(str);
    };

    this.socketHeart = function () {
        this.heartTimerid = setTimeout(() => {
            if (this.ws.readyState != WebSocket.OPEN) {
                this.connetChatServer(true);
                return;
            }

            this.ws.send('');
            this.socketHeart();
        }, 10000);
    };

    // 获取游戏配置文件
    this.getConfigFiles = function (fileList) {
        this.cfgFileList = fileList;
        this.configTotalCount = fileList.length;
        this.getFile();
    };

    this.getFile = function () {
        var url = this.netConfig.getConfigURL() + this.cfgFileList[this.configFileCount] + ".json";
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var content = JSON.parse(xhr.response);

                var gameCfg = this.gameEngine.getGameConfig();
                var modName = this.cfgFileList[this.configFileCount];
                gameCfg[modName] = content;

                this.configFileCount++;

                var eventMgr = this.gameEngine.getGameEventMgr();
                if (this.configFileCount == this.configTotalCount) {
                    eventMgr.dispatch(eType.CONFIG_DOWNLOAD_DONE);
                } else {
                    eventMgr.dispatch(eType.CONFIG_DOWNLOAD_UPDATE, (this.configFileCount - 1) / this.configTotalCount);
                    this.getFile();
                }
            }
        }
        xhr.responseType = "text";
        xhr.open("GET", url, true);
        xhr.send();
    };
}

module.exports = GameNet;
