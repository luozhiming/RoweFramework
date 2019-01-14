cc.Class({
    extends: cc.Component,

    start () {
        window.gameState.getCurState().addLayer("prefab/login");
    },
});
