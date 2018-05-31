globalFunc();

function main(mode) {
    var env = [
        [ 0,  0,  0, RP],
        [ 0, BL,  0, RN],
        [AG,  0,  0,  0]
    ];

    var reward = [
        [0, 0, 0, 1],
        [0, 0, 0, -1],
        [0, 0, 0, 0]
    ];

    drawEnvironment(env);

    // format data
    var ag_loc = new Object();
    var env_ = new Array(H + 2);

    for (var i = 0; i <= H + 1; i++) {
        env_[i] = new Array(W + 2);
        for (var j = 0; j <= W + 1; j++) {
            if (i == 0 || i == H + 1 || j == 0 || j == W + 1) {
                env_[i][j] = -1;
            } else if (env[i - 1][j - 1] == RP || env[i - 1][j - 1] == RN) {
                // remove reward from envronment
                env_[i][j] = 0;
            } else if (env[i - 1][j - 1] == AG) {
                // remove agent from envronment
                ag_loc.x = j;
                ag_loc.y = i;
                env[i - 1][j - 1] = 0;
                env_[i][j] = 0;
            } else {
                env_[i][j] = env[i - 1][j - 1];
            }
        }
    }

    // solve
    if (mode == 1) qlearning(ag_loc, env_, reward);
    else if (mode == 2) qlearning_step(ag_loc, env, env_, reward);
}