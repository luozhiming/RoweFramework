var SDK = require('SDK');
const Constants = require('Constants');
const GAME_STATE = Constants.GAME_STATE;

function WinSDK() {
    this.name = Constants.SDK_NAME.WIN;

    this.login = function() {
        window.gameState.setCurState(GAME_STATE.LOGIN);
    };
}

WinSDK.prototype = new SDK();
WinSDK.prototype.constructor = WinSDK;

module.exports = WinSDK;