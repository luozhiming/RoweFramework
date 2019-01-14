const Constants = require("Constants");
const UI_ZORDER = Constants.UI_ZORDER;

function GameStateBase() {
    this.name = "GameStateBase";
    this.defaultUI = "splash";
    this.layerStack = [];
    this.wndStack = [];
    this.layerHash = {};
    this.restoringUI = false;
    this.layerZOrder = UI_ZORDER.LAYER_BASE;
    this.wndZOrder = UI_ZORDER.WND_BASE;
}

GameStateBase.prototype.getName = function () {
    return this.name;
};

GameStateBase.prototype.showDefaultUI = function () {
    cc.director.loadScene(this.defaultUI);
};

GameStateBase.prototype.resetUIStack = function (uiurl) {
    this.layerStack = [];
    this.layerHash = {};

    this.layerStack.push({ url: uiurl });
};

GameStateBase.prototype.isRestoringUI = function () {
    return this.restoringUI;
}

GameStateBase.prototype.restoreUIStack = function () {
    this.layerZOrder = UI_ZORDER.LAYER_BASE;
    this.restoringUI = true;
    for (var i = this.layerStack.length - 1; i >= 0; i--) {
        var ui = this.layerStack[i];
        if (ui.persist) {
            cc.loader.loadRes(ui.url, (err, prefab) => {
                if (err) {
                    cc.log(`加载预制体时出错,出错路径:${url}`);
                    return;
                }

                cc.log("load prefab sucess: " + ui.url);
                ui.node = cc.instantiate(prefab);;
                ui.inState = true;
                ui.parent = cc.director.getScene().getChildByName("Canvas");
                ui.parent.addChild(ui.node);
                ui.cb && ui.cb(ui.parent);

                ui.node.zIndex = this.layerZOrder++;
            });
            break;
        }
    }

    var topUI = this.layerStack[0];
    cc.log("topUI is loading: " + topUI.url);
    cc.loader.loadRes(topUI.url, (err, prefab) => {
        if (err) {
            cc.log(`加载预制体时出错,出错路径:${url}`);
            return;
        }

        cc.log("load prefab sucess: " + topUI.url);

        topUI.node = cc.instantiate(prefab);
        topUI.inState = true;
        topUI.parent = cc.director.getScene().getChildByName("Canvas");
        topUI.parent.addChild(topUI.node);
        topUI.cb && topUI.cb(topUI.parent);

        this.restoringUI = false;
    });
};

// 添加弹窗
GameStateBase.prototype.addWnd = function (url, inputData, callback) {
    var gameEngine = cc.director.getScene().getChildByName("Global").getComponent("GameEngine");
    gameEngine.getGameUI().lockUI();

    cc.loader.loadRes(url, (err, prefab) => {
        gameEngine.getGameUI().unlockUI();

        var wnd = cc.instantiate(prefab);
        var curScene = cc.director.getScene();
        curScene.addChild(wnd);

        wnd.x = cc.director.getWinSize().width / 2;
        wnd.y = cc.director.getWinSize().height / 2;

        this.wndStack.unshift(wnd);
        wnd.InputData = inputData;
        callback && callback(curScene, wnd);
        wnd.node.zIndex = this.wndZOrder++;
    });
};

// 关闭弹窗
GameStateBase.prototype.rmWnd = function () {
    if (this.wndStack.length == 0) {
        return;
    }

    var curWnd = this.wndStack.shift();
    cc.log("destroy: " + curWnd.name);
    curWnd.destroy();
}

// 关闭当前已打开的所有窗口
GameStateBase.prototype.rmAllWnd = function () {
    for (var k in this.wndStack) {
        this.wndStack[k].destroy();
    }

    this.wndZOrder = UI_ZORDER.WND_BASE;
    this.wndStack = [];
}

// 添加UI
GameStateBase.prototype.addLayer = function (url, inputData, callback, persist, holdLast, clearAll) {
    cc.log("cur scene add layer: " + url);
    if (clearAll) {
        this.clearLayer();
    }

    if (!holdLast && this.layerStack.length > 0) {
        // 移除老UI
        var lastUI = this.layerStack[0];
        if (!lastUI.persist) {
            lastUI.node.destroy();
            lastUI.inState = false;
        }
    }

    // 构建新UI
    var newUI = {};
    newUI.url = url;
    newUI.parent = cc.director.getScene().getChildByName("Canvas");
    newUI.rootChild = newUI.parent.name == "Canvas";
    newUI.persist = persist || false;
    newUI.cb = callback;

    if (newUI.persist) {
        // 常驻UI在列表尾部加入
        this.layerStack.push(newUI);
    } else {
        this.layerStack.unshift(newUI);
    }
    this.layerHash[newUI.url] = newUI;

    var gameEngine = cc.director.getScene().getChildByName("Global").getComponent("GameEngine");
    gameEngine.getGameUI().lockUI();

    // 加载新UI
    cc.loader.loadRes(newUI.url, (err, prefab) => {
        if (err) {
            cc.log(`加载预制体时出错,出错路径:${url}`);
            return;
        }

        newUI.node = cc.instantiate(prefab);
        newUI.inState = true;
        newUI.parent.addChild(newUI.node);
        newUI.cb && newUI.cb(newUI.parent, newUI.node);
        newUI.node.InputData = inputData;

        if (newUI.persist) {
            newUI.node.zIndex = this.layerZOrder++;
        }

        gameEngine.getGameUI().unlockUI();
    });
};

// 关闭UI
GameStateBase.prototype.rmLayer = function () {
    var curUI = this.layerStack.shift();
    cc.log("destroy: " + curUI.url);

    curUI.node.destroy();
    delete this.layerHash[curUI.url];

    var nextUI = this.layerStack[0];
    if (nextUI.inState) {
        return;
    }

    // 加载UI
    cc.loader.loadRes(nextUI.url, (err, prefab) => {
        if (err) {
            cc.log(`加载预制体时出错,出错路径:${url}`);
            return;
        }

        nextUI.node = cc.instantiate(prefab);
        nextUI.inState = true;
        nextUI.parent = cc.director.getScene().getChildByName("Canvas");
        nextUI.parent.addChild(nextUI.node);
        nextUI.cb && nextUI.cb(nextUI.parent);
    });
};

// 清空UI
GameStateBase.prototype.clearLayer = function () {
    for (var k in this.layerStack) {
        this.layerStack[k].node.destroy();
    }

    for (var k in this.wndStack) {
        this.wndStack[k].destroy();
    }

    this.layerZOrder = UI_ZORDER.LAYER_BASE;
    this.wndZOrder = UI_ZORDER.WND_BASE;
    this.layerStack = [];
    this.layerHash = {};
    this.wndStack = [];
};

GameStateBase.prototype.inState = function (url) {
    for (var k in this.layerStack) {
        if (this.layerStack[k].url == url) {
            return this.layerStack[k].inState;
        }
    }
    return false;
};

module.exports = GameStateBase;
