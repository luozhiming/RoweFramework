const Constants = require('Constants');
const GAME_STATE = Constants.GAME_STATE;
var LoginStateClass = require('LoginState');

function GameState() {
    var curSDK = null;
    var curGameState = null;
    var stateObjs = [];

    this.init = function (sdk) {
        curSDK = sdk;
    };

    this.setCurState = function (state) {
        if (!stateObjs[state]) {
            if (state === GAME_STATE.LOGIN) {
                stateObjs[state] = new LoginStateClass();
            } else if (state === GAME_STATE.MAINSCENE) {
                stateObjs[state] = new MainStateClass();
            } else if (state === GAME_STATE.BATTLE) {
                stateObjs[state] = new BattleStateClass();
            }
        }
        curGameState = stateObjs[state];

        if (curGameState) {
            curGameState.showDefaultUI();
        } else {
            cc.log("game state is null");
        }
    };

    this.getCurState = function() {
        return curGameState;
    };
}

module.exports = GameState;
