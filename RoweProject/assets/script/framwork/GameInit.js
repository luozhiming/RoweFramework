const Constants = require('Constants');
const GAME_INIT = Constants.GAME_INIT;
var ModLoader = require('ModLoader');

function GameInit() {
    this.state = GAME_INIT.NONE;
};

GameInit.prototype.init = function() {
    this.state = GAME_INIT.DOING;
    var loader = new ModLoader();
    loader.init();
    this.state = GAME_INIT.DONE;
};

GameInit.prototype.getState = function () {
    return this.state;
};

module.exports = GameInit;
