globalFunc();

$(document).ready(function() {
    var canavas = document.getElementById("canvas");

    if (canvas.getContext) {
        ctx = canvas.getContext("2d");

        ctx.font = "20px serif";

        img_agent = new Image();
        img_agent.src = "./img/agent.png";
        img_heart = new Image();
        img_heart.src = "./img/reward_plus.png";
        img_skull = new Image();
        img_skull.src = "./img/reward_minus.png";
        img_block = new Image();
        img_block.src = "./img/block.png";

        $("#btn-solve").on("click", function() {
            clearCanvas();
            main(1);
        });

        $("#btn-solve-step").on("click", function() {
            $("#btn-solve").prop("disabled", true);
            $("#btn-solve-step").prop("disabled", true);

            clearCanvas();
            main(2);

        });
    }
});

function drawEnvironment(env) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(PANEL_SIZE);

    for (var i = 0; i < H; i++) {
        for (var j = 0; j < W; j++) {
            switch (env[i][j]) {
                case AG:
                    ctx.drawImage(img_agent, j * PANEL_SIZE, i * PANEL_SIZE);
                        break;
                case RP:
                    ctx.drawImage(img_heart, j * PANEL_SIZE, i * PANEL_SIZE);
                    break;
                case RN:
                    ctx.drawImage(img_skull, j * PANEL_SIZE, i * PANEL_SIZE);
                    break;
                case BL:
                    ctx.drawImage(img_block, j * PANEL_SIZE, i * PANEL_SIZE);
                    break;
                default:
            }

        }
    }

}

function drawQValue(qvalue) {
    for (var i = 0; i < H; i++) {
        for (var j = 0; j < W; j++) {
            drawNumber(qvalue[i * W + j][0].toFixed(3), 200 * j + 2, 100 + 200 * i); // left
            drawNumber(qvalue[i * W + j][1].toFixed(3), 145 + 200 * j, 100 + 200 * i); // right
            drawNumber(qvalue[i * W + j][2].toFixed(3), 75 + 200 * j, 18 + 200 * i); //up
            drawNumber(qvalue[i * W + j][3].toFixed(3), 75 + 200 * j, 198 + 200 * i); //down
        }
    }
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawGrid(boxSize) {
    for (var i = 0; i <= HPX / boxSize; i++) {
        drawLine(0, boxSize * i, WPX, boxSize * i);
    }
    for (var i = 0; i <= WPX / boxSize; i++) {
        drawLine(boxSize * i, 0, boxSize * i, HPX);
    }
}

function drawNumber(num, x, y) {
    if (num != NINF) {
        ctx.fillText(num, x, y);
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}