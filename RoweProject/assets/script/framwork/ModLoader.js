var SDK = require('SDK');
var GameState = require('GameState');

function ModLoader() {
    this.init = function () {
        var sdk = new SDK();
        sdk.init();

        var gameState = new GameState();
        gameState.init(sdk);
        window.gameState = gameState;

        sdk.curSDK.login();
    };
}

module.exports = ModLoader;
