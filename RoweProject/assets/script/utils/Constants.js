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

module.exports = {
    GAME_INIT:GAME_INIT,
    GAME_STATE:GAME_STATE,
};
