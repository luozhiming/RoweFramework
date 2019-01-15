const Constants = require('Constants');
const UI_ZORDER = Constants.UI_ZORDER;

cc.Class({
    extends: cc.Component,

    start () {
        cc.loader.loadRes("prefab/common/topLayer", (err, prefab) => {
            if (err) {
                return;
            }

            var wnd = cc.instantiate(prefab);
            cc.game.addPersistRootNode(wnd);
            wnd.zIndex = UI_ZORDER.TOP_LAYER;
            wnd.x = cc.winSize.width / 2;
            wnd.y = cc.winSize.height / 2;

            window.gameState.getCurState().addLayer("prefab/login/login");
        });
    },
});
