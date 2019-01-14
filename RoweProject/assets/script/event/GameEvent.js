function GameEvent() {

    this.eventHash = {};

    // cb:必须使用 function(){}.bind(this) 的写法
    this.register = function (id, type, cb) {
        var event = {};
        event.id = id;
        event.type = type;
        event.callback = cb;

        if (!this.eventHash.hasOwnProperty(type)) {
            this.eventHash[type] = [];
        }

        this.eventHash[type].push(event);
    };

    this.unregister = function (id, type) {
        var events = this.eventHash[type];
        if (events && events.length > 0) {
            events.forEach((event, index) => {
                if (event.id === id && event.type === type) {
                    events.splice(index, 1);
                }
            });
        };
    };

    this.dispatch = function (type, ...data) {
        var events = this.eventHash[type];
        if (events && events.length > 0) {
            for (var i in events) {
                var event = events[i];
                event.callback && (event.callback(...data));
            }
        }
    };
};

module.exports = GameEvent;
