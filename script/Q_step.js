globalFunc();

function qlearning_step(ag_loc, env_draw, env, reward) {
    GENMAX = 100;
    //LEVEL = 512;

    ALPHA = 0.1;
    GAMMA = 0.9;

    var time_step = 100;


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
    var epoch = 0;

    s.x = ag_loc.x;
    s.y = ag_loc.y;
    drawQValue(qvalue);

    var intervalID = setInterval(function() {

        // policy selects a from qvalue
        var a = pi(s, qvalue);
        // get next situation and reward
        var snext = nexts(env, s, a);
        var r = reward[snext.y - 1][snext.x - 1];

        env_draw[s.y - 1][s.x - 1] = 0;
        env_draw[snext.y - 1][snext.x - 1] = AG;
        clearCanvas();
        drawEnvironment(env_draw);

        // update
        if (r != 0) {
            qvalue[(s.y - 1) * W + s.x - 1][a] = qvalue[(s.y - 1) * W + s.x - 1][a] + ALPHA * (r - qvalue[(s.y - 1) * W + s.x - 1][a]);
            env_draw[snext.y - 1][snext.x - 1] = (r == 5)? RP: RN;

            snext.x = ag_loc.x;
            snext.y = ag_loc.y;

            console.log("epoch: " + epoch++);
        } else {
            qvalue[(s.y - 1) * W + s.x - 1][a] = qvalue[(s.y - 1) * W + s.x - 1][a] + ALPHA * (GAMMA * qvalue[(snext.y - 1) * W + snext.x - 1][pi(snext, qvalue)] - qvalue[(s.y - 1) * W + s.x - 1][a]);
        }

        drawQValue(qvalue);

        // move to next situation
        s.x = snext.x;
        s.y = snext.y;

        if (epoch == GENMAX) {
            $("#btn-solve").prop("disabled", false);
            $("#btn-solve-step").prop("disabled", false);

            return clearInterval(intervalID);
        }

    }, time_step);

}