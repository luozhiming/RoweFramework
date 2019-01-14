module.exports =
(function GE() {
    var config = null;
    var ui = null;
    var timer = null;
    var event = null;
    var utils = null;
    var audio = null;
    var net = null;

    function init(gameEngine) {
        ui = gameEngine.getGameUI();
        net = gameEngine.getGameNet();
        timer = gameEngine.getGameTimer();
        event = gameEngine.getGameEvent();
        utils = gameEngine.getUtils();
    };

    function setConfig(gameEngine) {
        config = gameEngine.getGameConfig();
    }

    function getData() {
        return {
            config : config,
            ui : ui,
            net : net,
            timer : timer,
            event : event,
            utils : utils,
        }
    }

    return {
        init : init,
        getData : getData,
        setConfig : setConfig,
    }
})();