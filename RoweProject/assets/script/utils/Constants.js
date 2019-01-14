const UI_ZORDER = cc.Enum({
    LAYER_BASE: 10,     // layer
    BATTLE_RESULT: 98,  // battle result
    BOTTOM_BAR: 99,     // bottom bar
    WND_BASE: 100,      // wnd
    MSG_BOX: 200,       // msg box
    ANNOUNCE: 201,      // announce
    REWARD: 202,        // reward
    TOP_LAYER: 1000,    // top layer
});

const GAME_INIT = cc.Enum({
    NONE: 1,   // 未初始化
    DOING: 2,   // 正在初始化
    DONE: 3,    // 完成初始化
});

const GAME_STATE = cc.Enum({
    LOGIN: 1,
    MAINSCENE: 2,
    BATTLE: 3,
    MAP: 4,
});

const SDK_NAME = cc.Enum({
    WIN: 1,
    ANDROID: 2,
    IOS: 3,
    WECHAT: 4,
});

const HTTP_SVR = cc.Enum({
    GAME: 0,       //游戏业务服务器
    ACCOUNT: 1,    //账户服务器
    MCENTER: 2,    //ManageCenter 服务器，用于获取服务器列表
});

module.exports = {
    UI_ZORDER:UI_ZORDER,
    GAME_INIT:GAME_INIT,
    GAME_STATE:GAME_STATE,
    SDK_NAME:SDK_NAME,
    HTTP_SVR:HTTP_SVR
};
