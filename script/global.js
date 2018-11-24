function globalConfig() {
    NINF = Number.NEGATIVE_INFINITY;

    AG = 1; // agent
    RW = 101; // positive reward
    PN = 102; // negative reward
    BL = 103; // block

    KEY_TO_NUM = {
        'agent': AG,
        'reward': RW,
        'penalty': PN,
        'block': BL
    }

    IMAGE = {
        'agent': "./img/agent.png",
        'reward': "./img/reward.png",
        'penalty': "./img/penalty.png",
        'block': "./img/block.png"
    };
}

// edit here to change game settings
function gameConfig() {
    time_step = 100;
    block_px = 200;

    object = [
        [  0,  0,  0,  0, PN, RW],
        [  0, BL, BL,  0,  0,  0],
        [  0, BL, BL, BL, BL,  0],
        [ AG,  0,  0,  0,  0,  0],
    ];

    reward = [
        [-0.1, -0.1, -0.1, -0.1, -1, 1],
        [-0.1, -100, -100, -0.1, -0.1, -0.1],
        [-0.1, -100, -100, -100, -100, -0.1],
        [-0.1, -0.1, -0.1, -0.1, -0.1, -0.1]
    ];

    // width = 800;
    // height = 600;
    // block = 200;
    //
    // object = [
    //     [ 0,  0,  0, RW],
    //     [ 0, BL,  0, PN],
    //     [AG,  0,  0,  0]
    // ];

    // reward = [
    //     [0, 0, 0, 5],
    //     [0, 0, 0, -5],
    //     [0, 0, 0, 0]
    // ];
    //
    // reward = [
    //     [-0.5, -0.5, -0.5, 5],
    //     [-0.5, -0.5, -0.5, -5],
    //     [-0.5, -0.5, -0.5, -0.5]
    // ];
}