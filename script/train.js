globalConfig();

function train(env, agent, canvas, mode) {
    if (mode == 0) {
        GENMAX = 10000;
        LEVEL = 512;

        for (var epoch = 0; epoch < GENMAX; epoch++) {
            console.log('epoch: ' + epoch);

            agent.reset();
            for (var i = 0; i < LEVEL; i++) {
                if (train_one(env, agent)) break;
            }

        }

        agent.reset();

    } else if (mode == 1){
        var epoch = 0;
        var goal = false;
        var intervalID = setInterval(function() {
            if (goal) {
                console.log('epoch: ' + epoch);
                goal = false;
                epoch++;
                agent.reset();
            }
            else {
                goal = train_one(env, agent);
            }

            canvas.drawObjects(agent.position, env.object);
            canvas.drawQValue(agent.qvalue);

            if (epoch == 1000) {
                return clearInterval(intervalID);
            }
        }, time_step);

    }

    canvas.drawObjects(agent.position, env.object);
    canvas.drawQValue(agent.qvalue);
}

function train_one(env, agent) {
    var action = agent.policy(agent.position);
    var info = agent.observe(env, action);

    if (!env.isGoal(info.next_pos)) {
        agent.update(action, info.next_pos, info.reward);
    } else {
        agent.last_update(action, info.reward);
        agent.move(action);
        return true;
    }

    if (agent.x != info.next_pos.x || agent.y != info.next_pos.y)
        agent.move(action);

    return false;
}