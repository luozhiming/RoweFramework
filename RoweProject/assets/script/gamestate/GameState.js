const Constants = require('Constants');
const GAME_STATE = Constants.GAME_STATE;
var LoginStateClass = require('LoginState');
var MainStateClass = require('MainState');

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
            }
        }

        curGameState = stateObjs[state];

        if (curGameState) {
            curGameState.showDefaultUI();
        } else {
            cc.log("game state is null");
        }
    };

    this.getCurState = function () {
        return curGameState;
    };

    this.getSDK = function() {
        return SDK;
    };

    this.getState = function(state) {
        if (state) {
            return stateObjs[state];
        } else {
            return this.getCurState();
        }
    }
}

module.exports = GameState;
