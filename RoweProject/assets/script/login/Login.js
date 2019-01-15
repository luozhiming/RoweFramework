cc.Class({
    extends: cc.Component,

    start () {
        this.GE = require("GE").getData();
        this.GE.event.register(1, "LAYER_LOAD_OVER", this.eventCB.bind(this));
    },

    onDestroy() {
        require("GE").getData().unregister(1, "LAYER_LOAD_OVER");
    },

    onLoginClick() {
        this.GE.event.dispatch("LAYER_LOAD_OVER");
    },

    eventCB() {
        this.GE.ui.showTip("TEST");
    }
});
