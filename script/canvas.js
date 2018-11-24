globalConfig();

$(document).ready(function() {
    // INITIALIZATION
    gameConfig();
    var width_px = block_px * object[0].length;
    var height_px = block_px * object.length
    var canvas = new MyCanvas(width_px, height_px, block_px);
    var env = new Environment(object, reward);
    var agent;
    for (var i = 0; i < env.h; i++) {
        for (var j = 0; j < env.w; j++) {
            if (object[i][j] == AG) {
                agent = new Agent(j, i);
                break;
            }
        }
    }

    setTimeout(function() {
        canvas.drawObjects(agent.position, env.object);
        canvas.drawQValue(agent.qvalue);
    }, 100);

    $('#btn-solve').on('click', function() {
        canvas.trainingMode();
        train(env, agent, canvas, 0);
    });

    $('#btn-solve-step').on('click', function() {
        canvas.trainingMode();
        train(env, agent, canvas, 1);
    });

    $('#btn-reset').on('click', function() {
        location.reload();
    });

    $('#time_step').slider().on('slide', function(e) {
        time_step = e.value;
    });
});

var MyCanvas = (function() {
    var MyCanvas = function(width, height, grid_size) {
        $('body').prepend($('<canvas id="canvas" width="' + width + 'px" height="' + height + 'px"></canvas>'));
        var $canvas = document.getElementById('canvas');

        var _ctx = $canvas.getContext('2d');
        _ctx.font = (grid_size / 10) + 'px serif';
        var _width = width;
        var _height = height;
        var _grid_size = grid_size;
        var _image = {};

        Object.keys(IMAGE).forEach(function(key) {
            var tmp = new Image();
            tmp.src = IMAGE[key];
            _image[key] = tmp;
        });

        Object.defineProperties(this, {
            ctx: {
                get: function() {
                    return _ctx;
                }
            },
            width: {
                get: function() {
                    return _width;
                }
            },
            height: {
                get: function() {
                    return _height;
                }
            },
            grid_size: {
                get: function() {
                    return _grid_size;
                }
            },
            image: {
                get: function() {
                    return _image;
                },
                set: function(name, image) {
                    _image[name] = image;
                }
            }
        });
    }

    var p = MyCanvas.prototype;
    p.drawLine = function(x1, y1, x2, y2) {
        var self = this;

        self.ctx.beginPath();
        self.ctx.moveTo(x1, y1);
        self.ctx.lineTo(x2, y2);
        self.ctx.stroke();
    }

    p.drawGrid = function() {
        var self = this;

        size = self.grid_size;
        for (var i = 0; i <= self.height / size; i++) {
            self.drawLine(0, size * i, self.width, size * i);
        }
        for (var i = 0; i <= this.width / size; i++) {
            self.drawLine(size * i, 0, size * i, self.height);
        }
    }

    p.drawNumber = function(x, y, num) {
        var self = this;

        if (num != null) {
            self.ctx.fillText(num.toFixed(3), x, y);
        }
    }

    p.drawImage = function(x, y, img_key) {
        var self = this;

        Object.keys(self.image).forEach(function(key) {
            if (KEY_TO_NUM[key] == img_key) {
                self.ctx.drawImage(self.image[key], 0, 0, 200, 200, x, y, self.grid_size, self.grid_size);
            }
        });
    }

    p.drawObjects = function(ag_pos, object) {
        var self = this;
        var scale = self.grid_size;

        self.clearCanvas();
        self.drawGrid();
        for (var i = 0; i < self.height / scale; i++) {
            for (var j = 0; j < self.width / scale; j++) {
                self.drawImage(j * scale, i * scale, object[i][j]);
            }
        }
        self.drawImage(ag_pos.x * scale, ag_pos.y * scale, AG);
    }

    p.drawQValue = function(qvalue) {
        var self = this;
        var size = self.grid_size;
        var gh = self.height / size;
        var gw = self.width / size;

        // MAGIC NUMBERS YAY!!!
        // scaled based on grid_size=200px
        for (var i = 0; i < gh; i++) {
            for (var j = 0; j < gw; j++) {
                self.drawNumber(size * j + 2, size / 2 + size * i, qvalue[i][j][0]); // left
                self.drawNumber(0.725 * size + size * j, size / 2 + size * i, qvalue[i][j][1]); // right
                self.drawNumber(0.375 * size + size * j, (size / 10 - size / 100) + size * i, qvalue[i][j][2]); //up
                self.drawNumber(0.375 * size + size * j, (size - size / 100) + size * i, qvalue[i][j][3]); //down
            }
        }
    }

    p.clearCanvas = function() {
        var self = this;

        self.ctx.clearRect(0, 0, self.width, self.height);
    }

    p.trainingMode = function() {
        $("#btn-solve").prop("disabled", true);
        $("#btn-solve-step").prop("disabled", true);
        $("#time_step").slider("disable");
    }

    return MyCanvas;
})();
