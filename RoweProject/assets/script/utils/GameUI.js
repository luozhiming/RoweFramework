const Constants = require("Constants");
const UI_ZORDER = Constants.UI_ZORDER;

function UI() {

    // 多语言处理
    this.txt = function (text) {
        // TODO:读表
        return text;
    };

    // 对话窗口
    // 如果只传了 txtBtnLeft，则显示中间一个按钮
    this.showMsgBox = function (title, titleLocation, content, txtBtnLeft, txtBtnRight, okCB, cancelCB) {
        title = this.txt(title);
        content = this.txt(content);
        txtBtnLeft = txtBtnLeft == undefined ? this.txt("确定") : this.txt(txtBtnLeft);
        this.loadPrefab("prefab/common/msgbox", cc.director.getScene(), (pNode) => {
            var msgWnd = pNode.getChildByName("msgbox");
            msgWnd.zIndex = UI_ZORDER.MSG_BOX;
            var contentView = msgWnd.getChildByName("msgScrollView").getChildByName("view").getChildByName("content");
            var txtTile = msgWnd.getChildByName("title").getComponent(cc.Label);
            var txtContent = contentView.getChildByName("txt").getComponent(cc.Label);
            var btnLeft = msgWnd.getChildByName("btnLeft");
            var btnRight = msgWnd.getChildByName("btnRight");
            var btnCenter = msgWnd.getChildByName("btnCenter");
            var btnClose = msgWnd.getChildByName("btnClose");
            var txtLBtn = btnLeft.getChildByName("txt").getComponent(cc.Label);
            var txtRBtn = btnRight.getChildByName("txt").getComponent(cc.Label);
            var txtCBtn = btnCenter.getChildByName("txt").getComponent(cc.Label);
            if (titleLocation == 1) {
                txtTile.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
            } else {
                txtTile.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            }
            msgWnd.x = cc.winSize.width / 2;
            msgWnd.y = cc.winSize.height / 2;
            txtTile.string = this.txt(title);
            txtContent.string = this.txt(content);

            if (txtBtnRight) {
                txtBtnRight = txtBtnRight == undefined ? this.txt("取消") : this.txt(txtBtnRight);
                btnLeft.active = true;
                btnRight.active = true;
                txtLBtn.string = txtBtnLeft;
                txtRBtn.string = txtBtnRight;

                btnLeft.on(cc.Node.EventType.TOUCH_END, (event) => {
                    okCB && okCB();
                    msgWnd.destroy();
                });

                btnRight.on(cc.Node.EventType.TOUCH_END, (event) => {
                    cancelCB && cancelCB();
                    msgWnd.destroy();
                });
            } else {
                btnCenter.active = true;
                txtCBtn.string = txtBtnLeft;

                btnCenter.on(cc.Node.EventType.TOUCH_END, (event) => {
                    okCB && okCB();
                    msgWnd.destroy();
                });
            }

            btnClose.on(cc.Node.EventType.TOUCH_END, (event) => {
                cancelCB && cancelCB();
                msgWnd.destroy();
            });

            setTimeout(()=>{
                if (contentView.getChildByName("txt").height > contentView.height) {
                    contentView.height = contentView.getChildByName("txt").height;
                }
            }, 20);
        });
    };

    /**
     * 自定义漂字
     * @param {*} text 文本
     * @param {*} offset y轴偏移量，屏幕中间为原点，向上为正
     * @param {*} duration 位移动画持续时间
     */
    this.showTip = function (text, offset, duration) {
        offset = offset || 0;
        duration = duration || 0.5;

        if (!this.tipWnds) {
            this.tipWnds = [];
        }

        var showWindow = (wnd) => {
            wnd.getChildByName("content").getComponent(cc.Label).string = this.txt(text);
            wnd.y += offset;
            for (var i = 0; i < this.tipWnds.length; i++) {
                if (this.tipWnds[i].isRun) {
                    continue;
                }

                this.tipWnds[i].wnd.stopAllActions();
                this.tipWnds[i].wnd.runAction(actDelay(0, this.tipWnds[i].wnd));
                this.tipWnds[i].isRun = true;
            }
            this.tipWnds.push({ isRun: false, wnd: wnd });
            wnd.runAction(actDelay(0.5, wnd));
        }

        var actDelay = (displayTime, targetWnd) => {
            var delay = cc.delayTime(displayTime);
            var func = cc.callFunc(() => {
                targetWnd.destroy();
                this.tipWnds.splice(0, 1);
            });
            var moveUp = cc.moveBy(duration, cc.v2(0, 300));
            var seq = cc.sequence(delay, moveUp, func);
            return seq;
        }

        var topLayer = cc.director.getScene().getChildByName('topLayer');
        if (this.tipPrefab) {
            var wnd = cc.instantiate(this.tipPrefab);
            topLayer.addChild(wnd);
            showWindow(wnd);
        } else {
            this.loadPrefab("prefab/common/tip", topLayer, (pNode, tNode, tPrefab) => {
                this.tipPrefab = tPrefab;
                showWindow(tNode);
            });
        }
    };

    this.loadPrefab = (url, parentNode, callback, inputData) => {
        var parent = parentNode;
        cc.loader.loadRes(url, (err, prefab) => {
            if (err) {
                cc.log(this.txt(`加载预制体时出错,出错路径:${url}`));
                return;
            }

            var wnd = cc.instantiate(prefab);
            wnd.InputData = inputData;
            parent && parent.addChild(wnd);
            callback && callback(parent, wnd, prefab);
        });
    };

    this.lockUI = function () {
        var topLayer = cc.director.getScene().getChildByName("topLayer");
        topLayer.getComponent("TopLayer").lockLayer();
    };

    this.unlockUI = function () {
        var topLayer = cc.director.getScene().getChildByName("topLayer");
        topLayer.getComponent("TopLayer").unlockLayer();
    };

    this.netLoading = function () {
        var topLayer = cc.director.getScene().getChildByName("topLayer");
        topLayer.getComponent("TopLayer").netLoading();
    };

    this.netLoadingEnd = function () {
        var topLayer = cc.director.getScene().getChildByName("topLayer");
        topLayer.getComponent("TopLayer").netLoadingEnd();
    };
};

module.exports = UI;
