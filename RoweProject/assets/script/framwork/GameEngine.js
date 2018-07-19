cc.Class({
    extends: cc.Component,

    properties: {
        gameTimer : {
            default : null,
            visible : false,
            serializable : false,
        }
    },

    start() {
        cc.game.addPersistRootNode(this.node);

        var GameInit = require('GameInit');
        var gameinit = new GameInit();
        gameinit.init();

        var GameTimer = require('GameTimer');
        this.gameTimer = new GameTimer();
    },

    onDestroy() {
        cc.game.removePersistRootNode(this.node);
    },

    update(dt) {
        this.gameTimer.update(dt);
    },

    getGameTimer() {
        return this.gameTimer;
    }
});
