function GameStateBase() {
    this.name = "GameStateBase";
    this.defaultCanvas = "splash";
}

GameStateBase.prototype.getName = function () {
    return this.name;
};

GameStateBase.prototype.showDefaultUI = function () {
    cc.director.loadScene(this.defaultCanvas);
};

// 弹窗
GameStateBase.prototype.openWindow = function (node, prefabPath) {
    cc.loader.loadRes(prefabPath, function (err, prefab) {
        var wnd = cc.instantiate(prefab);
        node.addChild(wnd);
    });
};

// 动态添加弹窗内容
GameStateBase.prototype.addLayer = function () {
    cc.log("addLayer");
};

module.exports = GameStateBase;
