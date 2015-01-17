function Timer() {}
Timer.prototype = (function () {
    'use strict';
    var self = {};
    var started = null, stopped = null;

    self.start = function() {
        started = Date.now();
        stopped = null;
    };
    self.stop = function() {
        if (started) {
            stopped = Date.now();
        }
    };
    self.reset = function() {
        started = null;
        stopped = null;
    };
    self.time = function() {
        if (started && stopped) {
            return stopped - started;
        } else if (started) {
            return Date.now() - started;
        } else {
            return 0;
        }
    };
    self.running = function() {
        return (started !== null && stopped === null);
    };

    return self;
})();

var TimeFormatter = (function () {
    'use strict';

    var replace = function (milliseconds, directive, s) {
        var value = '';
        switch (directive) {
            case '%%D':
                value = zero(Math.floor(milliseconds / 86400000), 2);
                break;
            case '%H':
                value = zero(Math.floor(milliseconds / 3600000) % 24, 2);
                break;
            case '%%H':
                value = zero(Math.floor(milliseconds / 3600000), 2);
                break;
            case '%M':
                value = zero(Math.floor(milliseconds / 60000) % 60, 2);
                break;
            case '%%M':
                value = zero(Math.floor(milliseconds / 60000), 2);
                break;
            case '%S':
                value = zero(Math.floor(milliseconds / 1000) % 60, 2);
                break;
            case '%%S':
                value = zero(Math.floor(milliseconds / 1000), 2);
                break;
            case '%f':
                value = zero(milliseconds % 1000, 3);
                break;
            case '%%f':
                value = zero(milliseconds, 3);
                break;
            case '%h':
                value = String(zero(milliseconds % 1000, 3)).substring(0, 2);
                break;
        }
        return s.replace(directive, value);
    };

    var zero = function (s, length) {
        var d = length > s.toString().length ? length - s.toString().length : 0;
        for (var i = 0; i < d; i++) {
            s = '0' + s;
        }
        return s;
    };


    /* Public
    /*************************************/
    var self = {};

    self.format = function (milliseconds, format) {
        if (milliseconds === null || format === null) { return ''; }

        var negative = milliseconds < 0;
        if (negative) {
            milliseconds *= -1;
        }

        // TODO Remove duplicate results.
        var directives = format.match(/([%]{1,2}[DHMSfh]{1})/g);
        var i;
        if (directives !== null) {
            for (i = 0; i < directives.length; i++) {
                format = replace(milliseconds, directives[i], format);
            }
        }

        return (negative ? '-' : '') + format;
    };

    return self;
})();
