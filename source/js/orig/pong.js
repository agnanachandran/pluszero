function playPong() {

    // RequestAnimFrame: used for animations
    window.cancelRequestAnimFrame = (function() { return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout })();

    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            return window.setTimeout(callback, 1000/45); // fps?
        }
    })();

    var canvas = document.getElementById('pong');
    canvas.addEventListener('mousemove', trackPosition, true); // trackPosition is the callback for the listener
    // Check if user has canvas feature with canvas.getContext
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
    }
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
    var highScore = 0;

    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    if (typeof(Storage) !== 'undefined') {
        if (localStorage.getItem('highScore') !== null) {
            highScore = localStorage.getItem('highScore');
        } ;
        // highScore is actually displayed later, after the first clearRect call
    }

    var ball = {};
    var paddles = [];
    var mouse = {};

    var loadingAlpha = 0.0;

    // Constants
    var BALL_ORIG_X = 70;
    var BALL_ORIG_Y = 50;
    var BALL_ORIG_VX = 4;
    var BALL_ORIG_VY= 8;
    var INNER_PADDING = 50;

    var score = 0;
    var gameStarted = false;

    ball = {
        x: BALL_ORIG_X,
        y: BALL_ORIG_Y,
        r: 6,
        vx: BALL_ORIG_VX,
        vy: BALL_ORIG_VY,

        draw: function(loadingAlpha) {
            ctx.beginPath(); // Draw ball
            var rgba = "rgba(0, 0, 0, " + roundToThree(loadingAlpha) + ")";
            ctx.fillStyle = rgba;
            ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false); // last 3 parameters are start angle, finish angle, and false so arc draws clockwise.
            ctx.fill();
        }
    };

    function Paddle(pos) {
        this.h = 100;
        this.w = 5;
        this.color = "#444";
        this.x = (pos === 'left') ? INNER_PADDING : WIDTH - INNER_PADDING - this.w;
        this.y = HEIGHT/2 - this.h/2; // Draw at vertical middle
    }

    paddles.push(new Paddle('left'));
    paddles.push(new Paddle('right'));
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    updateHighScore(highScore);

    function paintCanvas() {
        ctx.beginPath();
        ctx.moveTo(INNER_PADDING, 0);
        ctx.lineTo(INNER_PADDING, HEIGHT);
        ctx.strokeStyle = "#9f1024";
        ctx.clearRect(paddles[0].x - 15, 0, paddles[0].w + 25, HEIGHT); // left paddle
        ctx.clearRect(paddles[1].x - 15, 0, paddles[1].w + 25, HEIGHT); // right paddle
        ctx.clearRect(ball.x-35, ball.y-30, 50, 50);
        ctx.moveTo(WIDTH - INNER_PADDING, 0);
        ctx.lineTo(WIDTH - INNER_PADDING, HEIGHT);
        ctx.stroke();
    }

    function fadeInDraw() {
        // TODO: most of these calls are unnecessary
        paintCanvas();
        drawPaddles();
        ball.draw(loadingAlpha);
        loadingAlpha = loadingAlpha + 0.025;
        if (roundToThree(loadingAlpha) === "1.000") {
            gameStarted = true;
        }
        updatePaddles();
        updateScore();
    }

    function drawPaddles() {
        for (var i = 0, len = paddles.length; i < len; i++) {
            var p = paddles[i];
            ctx.fillStyle = "rgba(0, 0, 0, " + 1 + ")";
            ctx.fillRect(p.x, p.y, p.w, p.h);
        }
    }

    function roundToThree(num) {
        return num.toFixed(3);
    }

    function draw() {
        paintCanvas();
        for (var i = 0, len = paddles.length; i < len; i++) {
            var p = paddles[i];
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.w, p.h);
        }
        ball.draw(1.0);
    }

    function getMousePos(evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
        };
    }

    function trackPosition(e) {
        var mousePos = getMousePos(e);
        mouse.x = mousePos.x;
        mouse.y = mousePos.y;
    }

    function checkCollisions() {
        var leftPaddle = paddles[0];
        var rightPaddle = paddles[1];

        var RIGHT_SIDE = WIDTH - INNER_PADDING;
        var LEFT_SIDE = INNER_PADDING;
        if (ball.y + ball.r > HEIGHT) { // Bottom side
            ball.vy = -ball.vy;
            ball.y = HEIGHT - ball.r;
        } else if (ball.y - ball.r < 0) { // Top side
            ball.vy = -ball.vy;
            ball.y = ball.r;
        } else if (ball.x - leftPaddle.w < leftPaddle.x && ball.y < leftPaddle.y + leftPaddle.h && ball.y > leftPaddle.y) { // Left paddle
            ball.vx = -ball.vx;
            ball.x = leftPaddle.x + leftPaddle.w;
            increaseScore();
        } else if (ball.x + ball.r > rightPaddle.x + (rightPaddle.w/2) && ball.y < rightPaddle.y + rightPaddle.h && ball.y > rightPaddle.y) { // Right paddle
            if (ball.vx > 0 && ball.vx <= 8) {
                ball.vx += 0.2;
            }
            ball.vx = -ball.vx;
            ball.x = rightPaddle.x - rightPaddle.w;
            increaseScore();
        } else if (ball.x - ball.r/2 > RIGHT_SIDE - rightPaddle.w) { // Right side
            gameOver();
        } else if (ball.x + ball.r/2 < LEFT_SIDE) { // Left side
            gameOver();
        }
    }

    function update() {
        ball.x += ball.vx;
        ball.y += ball.vy;
        updatePaddles();
        checkCollisions();
        updateScore();
    }

    function clearMiddleArea() {
        ctx.clearRect(WIDTH/2-40, HEIGHT/2 - 55, 100, 80); // score middle area
    }

    function increaseScore() {
        score++;
        clearMiddleArea();
    }

    function updateScore() {
        ctx.fillStyle = "rgba(150, 150, 150, " + roundToThree(loadingAlpha) + ")";
        ctx.font = "300 40px Open Sans";
        ctx.textAlign = 'center';
        ctx.fillText(score.toString(), WIDTH/2, HEIGHT/2);
    }

    function updatePaddles() {
        if (mouse.x && mouse.y) {
            for (var i = 0, len = paddles.length; i < len; i++) {
                var p = paddles[i];
                p.y = mouse.y - p.h/2;
            }
        }
    }

    function animationLoop() {
        requestAnimFrame(animationLoop);
        if (gameStarted) {
            draw();
            update();
        } else {
            fadeInDraw();
        }
    }

    function updateHighScore(updatedHighScore) {
        ctx.clearRect(0, 0, 30, 30);
        ctx.fillStyle = "rgb(150, 150, 150)";
        ctx.font = "300 22px Open Sans";
        if (updatedHighScore >= 100) {
            ctx.font = "300 16px Open Sans";
        }
        ctx.textAlign = 'start';
        ctx.fillText(updatedHighScore.toString(), 5, 20);
    }

    function gameOver() {
        ball.x = BALL_ORIG_X;
        ball.y = Math.floor((Math.random()*(HEIGHT - 20)) + 20);
        ball.vx = BALL_ORIG_VX;

        var randomNum = Math.round(Math.random());
        if (randomNum < 1) {
            ball.vy = -BALL_ORIG_VY;
        } else {
            ball.vy = BALL_ORIG_VY;
        }
        if (typeof(Storage) !== 'undefined') {
            if (score > highScore) {
                localStorage.setItem('highScore', score);
                highScore = score;
                updateHighScore(highScore);
            }
        }
        score = 0;
        loadingAlpha = 0.0;
        gameStarted = false;
        clearMiddleArea();
    }

    animationLoop();
}
