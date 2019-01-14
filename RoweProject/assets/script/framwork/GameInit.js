const Constants = require('Constants');
const GAME_INIT = Constants.GAME_INIT;
var ModLoader = require('ModLoader');

function GameInit() {
    this.state = GAME_INIT.NONE;

    this.init = function() {
        this.state = GAME_INIT.DOING;
        var loader = new ModLoader();
        loader.init();
        this.state = GAME_INIT.DONE;
    };

    this.getState = function () {
        return this.state;
    };
};

module.exports = GameInit;
