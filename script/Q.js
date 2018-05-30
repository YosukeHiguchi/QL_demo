globalFunc();

function qlearning(ag_loc, env, reward) {
    GENMAX = 10000;
    LEVEL = 512;

    ALPHA = 0.1;
    GAMMA = 0.9;

    // initialize qvalue
    var qvalue = new Array(H * W);

    for (var i = 0; i < H; i++) {
        for (var j = 0; j < W; j++) {
            qvalue[i * W + j] = new Array(4);

            // fill -Infinity if (i, j) has reward or block
            if (reward[i][j] == 0 && env[i + 1][j + 1] == 0) {
                for (var k = 0; k < 4; k++) {
                    qvalue[i * W + j][k] = (isMovable(env, {y: i + 1, x: j + 1}, k))? Math.random(): NINF;
                }
            } else {
                qvalue[i * W + j].fill(NINF);
            }
        }
    }

    var s = new Object();

    for (var i = 0; i < GENMAX; i++) {
        // console.log(i + " epoch");

        // initialize s
        s.x = ag_loc.x;
        s.y = ag_loc.y;

        for (var j = 0; j < LEVEL; j++) {
            // policy selects a from qvalue
            var a = pi(s, qvalue);
            // get next situation and reward
            var snext = nexts(env, s, a);
            var r = reward[snext.y - 1][snext.x - 1];

            // update
            if (r != 0) {
                qvalue[(s.y - 1) * W + s.x - 1][a] = qvalue[(s.y - 1) * W + s.x - 1][a] + ALPHA * (r - qvalue[(s.y - 1) * W + s.x - 1][a]);
                break;
            } else {
                qvalue[(s.y - 1) * W + s.x - 1][a] = qvalue[(s.y - 1) * W + s.x - 1][a] + ALPHA * (GAMMA * qvalue[(snext.y - 1) * W + snext.x - 1][pi(snext, qvalue)] - qvalue[(s.y - 1) * W + s.x - 1][a]);
            }

            // move to next situation
            s.x = snext.x;
            s.y = snext.y;
        }
    }
    showQValue(qvalue);

    drawQValue(qvalue);
}

function showQValue(qvalue) {
    for (var i = 0; i < H * W; i++) {
        var s = i;
        for (var j = 0; j < 4; j++) {
            if (qvalue[i][j] == NINF)
                s = s + " " + " -INF";
            else {
                s = s + " " + qvalue[i][j].toFixed(3);
            }
        }
        console.log(s);
    }
}

function pi(s, qvalue) {
    var ret = 0;

    if (Math.random() < 0.3) {
        do {
            ret = rand03();
        } while (qvalue[(s.y - 1) * W + s.x - 1][ret] == NINF);
    } else {
        for (var i = 1; i <= 4; i++) {
            if (qvalue[(s.y - 1) * W + s.x - 1][ret] < qvalue[(s.y - 1) * W + (s.x - 1)][i]) {
                ret = i;
            }
        }
    }

    return ret;
}

function nexts(env, s, a) {
    var dx = [-1, 1, 0, 0];
    var dy = [0, 0, -1, 1];

    return {x: s.x + dx[a], y: s.y + dy[a]};
}

function isMovable(env, s, a) {
    var ret = false;

    switch (a) {
        case 0: //left
            if (env[s.y][s.x - 1] == 0) ret = true;
            break;
        case 1: //right
            if (env[s.y][s.x + 1] == 0) ret = true;
            break;
        case 2: //up
            if (env[s.y - 1][s.x] == 0) ret = true;
            break;
        case 3: //down
            if (env[s.y + 1][s.x] == 0) ret = true;
            break;
    }

    return ret;
}

function rand03() {
    return Math.floor(Math.random() * 4);
}