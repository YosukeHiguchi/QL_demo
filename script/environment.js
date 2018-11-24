globalConfig();

var Environment = (function() {
    var Environment = function(object, reward) {
        var _h = object.length;
        var _w = object[0].length;

        var _reward = reward;
        var _object = JSON.parse(JSON.stringify(object));
        var _field = JSON.parse(JSON.stringify(object));

        Object.defineProperties(this, {
            w: {
                get: function() {
                    return _w;
                }
            },
            h: {
                get: function() {
                    return _h;
                }
            },
            object: {
                get: function() {
                    return _object;
                }
            },
            reward: {
                get: function() {
                    return _reward;
                }
            },
            field: {
                get: function() {
                    return _field;
                }
            }
        });

        for (var i = 0; i < _h; i++) {
            for (var j = 0; j < _w; j++) {
                if (_object[i][j] == AG) {
                    _object[i][j] = 0;
                }
                if (_field[i][j] != 0 && _field[i][j] != BL) {
                    _field[i][j] = 0;
                }
            }
        }
    }

    var p = Environment.prototype;
    p.isMovable = function(position, action) {
        var self = this;
        var ret = false;
        var x = position.x, y = position.y;

        switch (action) {
            case 0: //left
                if (x - 1 >= 0 && self.field[y][x - 1] == 0)
                    ret = true;
                break;
            case 1: //right
                if (x + 1 < self.w && self.field[y][x + 1] == 0)
                    ret = true;
                break;
            case 2: //up
                if (y - 1 >= 0 && self.field[y - 1][x] == 0)
                    ret = true;
                break;
            case 3: //down
                if (y + 1 < self.h && self.field[y + 1][x] == 0)
                    ret = true;
                break;
        }

        return ret;
    }

    p.isGoal = function(position) {
        var x = position.x, y = position.y;

        if (self.object[y][x] == RW || self.object[y][x] == PN)
            return true;

        return false;
    }

    p.get_reward = function(position) {
        return self.reward[position.y][position.x];
    }

    return Environment;
})();
