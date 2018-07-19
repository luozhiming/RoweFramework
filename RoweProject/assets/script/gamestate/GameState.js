const Constants = require('Constants');
const GAME_STATE = Constants.GAME_STATE;
var LoginStateClass = require('LoginState');

function GameState() {
    var curSDK = null;
    var curGameState = null;
    var stateObjs = [];

    this.init = function (sdk) {
        curSDK = sdk;
        var curOS = curSDK.getCurOS();
        if (curOS === cc.sys.OS_WINDOWS) {
            this.setCurState(GAME_STATE.LOGIN);
        }
    };

    this.setCurState = function (state) {
        if (!stateObjs[state]) {
            if (state === GAME_STATE.LOGIN) {
                stateObjs[state] = new LoginStateClass();
            }
        }
        curGameState = stateObjs[state];
        curGameState.showDefaultUI();
    };

    this.getCurState = function() {
        return curGameState;
    };
}

module.exports = GameState;
