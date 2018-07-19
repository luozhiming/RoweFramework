var GameStateBase = require('GameStateBase');

function LoginState() {
    this.name = "LoginState";
    this.defaultCanvas = "login";
}

LoginState.prototype = new GameStateBase();
LoginState.prototype.constructor = LoginState;

module.exports = LoginState;
