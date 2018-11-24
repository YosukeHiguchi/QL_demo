globalConfig();

var Agent = (function() {
    var Agent = function(x, y, brain_size=100) {
        var _sx = x, _sy = y;
        var _x = x, _y = y;
        var _visited = new Array(brain_size);
        var _qvalue = new Array(brain_size);
        for (var i = 0; i < brain_size; i++) {
            _visited[i] = new Array(brain_size).fill(0);
            _qvalue[i] = new Array(brain_size);
            for (var j = 0; j < brain_size; j++) {
                _qvalue[i][j] = new Array(4).fill(null);
            }
        }

        Object.defineProperties(this, {
            x: {
                get: function() {
                    return _x;
                },
                set: function(v) {
                    _x = v;
                }
            },
            y: {
                get: function() {
                    return _y;
                },
                set: function(v) {
                    _y = v;
                }
            },
            position: {
                get: function() {
                    return {x: _x, y: _y};
                }
            },
            start_position: {
                get: function() {
                    return {x: _sx, y: _sy};
                }
            },
            visited: {
                get: function() {
                    return _visited;
                },
                set: function(v) {
                    _visited = v;
                }
            },
            qvalue: {
                get: function() {
                    return _qvalue;
                },
                set: function(v) {
                    _qvalue = v;
                }
            }
        });

        this.memorize(this.position);
    }

    var p = Agent.prototype;
    p.policy = function(position, explorer=true) {
        var self = this;
        var action = 0;
        var eps = 0.3;

        if (explorer && Math.random() < eps) {
            action = Math.floor(Math.random() * 4);
        } else {
            action = self.qvalue[position.y][position.x].indexOf(
                Math.max(...self.qvalue[position.y][position.x]));
        }

        return action;
    }

    p.observe = function(env, action) {
        var self = this;
        var dx = [-1, 1, 0, 0];
        var dy = [0, 0, -1, 1];
        var next_pos, reward;

        if (env.isMovable(self.position, action)) {
            next_pos = {x: self.x + dx[action], y: self.y + dy[action]};
        } else {
            next_pos = {x: self.x, y: self.y};
        }
        if (!self.visited[next_pos.y][next_pos.x] && !env.isGoal(next_pos)) {
            self.memorize(next_pos);
        }
        reward = env.get_reward(next_pos);

        return {'next_pos': next_pos, 'reward': reward};
    }

    p.memorize = function(new_pos) {
        var self = this;

        self.visited[new_pos.y][new_pos.x] = 1;
        self.qvalue[new_pos.y][new_pos.x].fill(0.5);
    }

    p.update = function(action, next_pos, reward) {
        var self = this
        var alpha = 0.1;
        var gamma = 0.9;
        var greedy_a = self.policy(next_pos, false);

        self.qvalue[self.y][self.x][action] +=
            alpha * (reward + gamma * self.qvalue[next_pos.y][next_pos.x][greedy_a] - self.qvalue[self.y][self.x][action])
    }

    p.last_update = function(action, reward) {
        var self = this;
        var alpha = 0.1;

        self.qvalue[self.y][self.x][action] +=
            alpha * (reward - self.qvalue[self.y][self.x][action])
    }

    p.move = function(action) {
        var self = this;
        var dx = [-1, 1, 0, 0];
        var dy = [0, 0, -1, 1];

        self.x += dx[action];
        self.y += dy[action];
    }

    p.reset = function() {
        var self = this;

        start = self.start_position;
        self.x = start.x;
        self.y = start.y;
    }

    return Agent
})();