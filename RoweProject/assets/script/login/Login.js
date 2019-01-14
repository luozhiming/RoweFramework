cc.Class({
    extends: cc.Component,

    start () {

    },

    onLoginClick() {
        var GE = require("GE").getData();
            GE.ui.showMsgBox("测试", 0, "TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest",
                "确定", "取消");
    }
});
