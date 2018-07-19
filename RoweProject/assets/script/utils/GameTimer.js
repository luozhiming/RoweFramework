function Timer(index, callback, target, interval, repeat, delay) {
    this.id = new Date().getTime();
    this.lIndex = index;
    this.cb = callback;
    this.target = target;
    this.interval = interval || 0;
    this.repeat = repeat || 1;
    this.delay = delay || 0;

    this.elapsed = -1;
    this.useDelay = delay > 0;

    this.trigger = function() {
        if (this.target && this.cb) {
            this.cb.call(this.target, this.elapsed);
        }
    };
}

function GameTimer() {
    this.arrayForTimers = [];
    this.hashForTimers = {};
    this.maxIndex = this.arrayForTimers.length;
}

GameTimer.prototype.add = function(callback, target, interval, repeat, delay) {
    var newTimer = new Timer(this.maxIndex, callback, target, interval, repeat, delay);
    this.arrayForTimers.push(newTimer);
    this.maxIndex = this.arrayForTimers.length;
    this.hashForTimers[newTimer.id] = newTimer;
    return newTimer.id;
};

GameTimer.prototype.del = function(id, needCallback) {
    var timer = null;
    if (id) {
        timer = this.hashForTimers[id];
    } else {
        timer = this.arrayForTimers[0];
    }

    if (!time) {
        return;
    }

    if (needCallback) {
        timer.trigger();
    }
    this.arrayForTimers.splice(timer.lIndex, 1);
    this.hashForTimers[timer.id] = null;
};

GameTimer.prototype.clr = function() {
    for (var i = this.arrayForTimers.length-1; i >= 0; i--) {
        var timer = this.arrayForTimers[i];
        this.hashForTimers[timer.id] = null;
        this.arrayForTimers.splice(i, 1);
    }
};

GameTimer.prototype.update = function(dt) {
    var cancelTimer = [];
    for(var i = 0, len = this.arrayForTimers.length; i < len; i++) {
        var timer = this.arrayForTimers[i];
        if (timer.elapsed === -1) {
            timer.elapsed = 0;
            timer._timesExecuted = 0;
        } else {
            timer.elapsed += dt;
            if (timer.useDelay) {
                if (timer.elapsed >= timer.delay) {
                    timer.trigger();

                    timer.elapsed -= timer.delay;
                    timer._timesExecuted += 1;
                    timer.useDelay = false;
                }
            } else {
                if (timer.elapsed >= timer.interval) {
                    timer.trigger();

                    timer.elapsed = 0;
                    timer._timesExecuted += 1;
                }
            }
        }

        if (timer._timesExecuted > timer.repeat) {
            cancelTimer.push({index:i, id:timer.id});
        }
    }

    for (var j = 0; j < cancelTimer.length; j++) {
        var ctimer = cancelTimer[j];
        this.arrayForTimers.splice(ctimer.index, 1);
        this.hashForTimers[ctimer.id] = null;
    }
};

module.exports = GameTimer;
