var SDK = require('SDK');
var GameState = require('GameState');

function ModLoader() {
}

ModLoader.prototype.init = function () {
    var sdk = new SDK();
    sdk.init();

    var gameState = new GameState();
    gameState.init(sdk);
    window.gameState = gameState;
};

module.exports = ModLoader;
