cc.Class({
    extends: cc.Component,

    properties: {
    },

    start() {
        cc.game.addPersistRootNode(this.node);

        this.gameConfig = {};

        var GameTimer = require('GameTimer');
        this.gameTimer = new GameTimer();

        var GameNet = require('GameNet');
        this.gameNet = new GameNet();

        var GameEvent = require("GameEvent");
        this.gameEvent = new GameEvent;

        var GameUI = require("GameUI");
        this.gameUI = new GameUI;

        var Utils = require("Utils");
        this.utils = new Utils;

        var GameInit = require('GameInit');
        var gameinit = new GameInit();
        gameinit.init();

        var GE = require("GE");
        GE.init(this);

        this.loadRes();
    },

    onDestroy() {
        cc.game.removePersistRootNode(this.node);
    },

    update(dt) {
        this.gameTimer.update(dt);
    },

    loadRes() {
        // TODO:
    },

    getGameTimer() {
        return this.gameTimer;
    },

    getGameNet() {
        return this.gameNet;
    },

    getGameEvent() {
        return this.gameEvent;
    },

    getGameUI() {
        return this.gameUI;
    },

    getUtils() {
        return this.utils;
    },

    getGameConfig(name) {
        if (!name) {
            return this.gameConfig;
        } else {
            return this.gameConfig[name];
        }
    },
});
