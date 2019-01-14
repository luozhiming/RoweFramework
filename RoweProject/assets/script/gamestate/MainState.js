var GameStateBase = require('GameStateBase');

function MainState() {
    this.name = "MainState";
    this.defaultUI = "main";
}

MainState.prototype = new GameStateBase();
MainState.prototype.constructor = MainState;

module.exports = MainState;
