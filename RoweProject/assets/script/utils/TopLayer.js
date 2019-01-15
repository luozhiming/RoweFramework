cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Node,
        netLoadingNode: cc.Node,
    },

    start() {
        this.GE = require("GE").getData();
    },

    lockLayer() {
        this.mask.active = true;
    },

    unlockLayer() {
        this.mask.active = false;
    },

    netLoading() {
        this.mask.active = true;
        this.netLoadingNode.active = true;

        var prg = this.netLoadingNode.getChildByName("prg");
        prg.runAction(cc.repeatForever(cc.rotateBy(0.1, 30)));
    },

    netLoadingEnd() {
        this.mask.active = false;
        this.netLoadingNode.active = false;

        var prg = this.netLoadingNode.getChildByName("prg");
        prg.stopAllActions();
    },
});
