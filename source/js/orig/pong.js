function playPong() {

    // RequestAnimFrame: used for animations
    window.cancelRequestAnimFrame = (function() { return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout })();

    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            return window.setTimeout(callback, 1000/60);
        }
    })();

    var canvas = document.getElementById('pong');
    canvas.addEventListener('mousemove', trackPosition, true); // trackPosition is the callback for the listener
    // Check if user has canvas feature with canvas.getContext
    // if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    // }
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Define particles coming off paddle
    var particles = [];
    var ball = {};
    var paddles = [];
    var mouse = {};

    var loadingAlpha = 0.0;

    // Constants
    var BALL_ORIG_X = 50;
    var BALL_ORIG_Y = 50;
    var BALL_ORIG_VX = 4;
    var BALL_ORIG_VY= 8;
    var score = 0;
    var gameStarted = false;

    ball = {
        x: BALL_ORIG_X,
        y: BALL_ORIG_Y,
        r: 5,
        vx: 4,
        vy: 8,

        draw: function(loadingAlpha) {
            ctx.beginPath(); // Draw ball
            var rgba = "rgba(0, 0, 0, " + roundToThree(loadingAlpha) + ")";
            ctx.fillStyle = rgba;
            ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false); // last 3 parameters are start angle, finish angle, and false so arc draws clockwise.
            ctx.fill();
        }
    }
    function Paddle(pos) {
        this.h = 100;
        this.w = 5;
        this.color = "#444";
        this.x = (pos === 'left') ? 0 : WIDTH - this.w;
        this.y = HEIGHT/2 - this.h/2; // Draw at vertical middle
    }

    paddles.push(new Paddle('left'));
    paddles.push(new Paddle('right'));

    function paintCanvas() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    function fadeInDraw() {
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
        if (ball.x + ball.r > WIDTH) { // Right side
            ball.x = HEIGHT - ball.r;
            gameOver();
        } else if (ball.x < 0) { // Left side
            ball.x = ball.r;
            gameOver();
        } else if (ball.y + ball.r > HEIGHT) { // Top side
            ball.vy = -ball.vy;
            ball.y = HEIGHT - ball.r;
        } else if (ball.y < 0) { // Bottom side
            ball.vy = -ball.vy;
            ball.y = 0;
        } else if (ball.x - ball.r < leftPaddle.x && ball.y < leftPaddle.y + leftPaddle.h && ball.y > leftPaddle.y) { // Left paddle
            ball.vx = -ball.vx;
            ball.x = leftPaddle.x + leftPaddle.w;
            increaseScore();
        } else if (ball.x + ball.r > rightPaddle.x && ball.y < rightPaddle.y + rightPaddle.h && ball.y > rightPaddle.y) { // Right paddle
            if (ball.vx < 0) {
                ball.vx -= 0.2;
            }
            if (ball.vx > 0) {
                ball.vx += 0.2;
            }
            ball.vx = -ball.vx;
            ball.x = rightPaddle.x - rightPaddle.w;
            increaseScore();
        }
    }

    function increaseScore() {
        score++;
    }

    function updateScore() {
        ctx.fillStyle = "rgba(150, 150, 150, " + roundToThree(loadingAlpha) + ")";
        ctx.font = "30pt Open Sans"
        ctx.fillText(score.toString(), WIDTH/2, HEIGHT/2);
    }

    function update() {
        ball.x += ball.vx;
        ball.y += ball.vy;
        updatePaddles();
        checkCollisions();
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
            updateScore();
        } else {
            fadeInDraw();
        }
    }

    function gameOver() {
        ball.x = BALL_ORIG_X;
        ball.y = BALL_ORIG_Y;
        ball.vx = BALL_ORIG_VX;
        ball.vy = BALL_ORIG_VY;
        score = 0;
        loadingAlpha = 0.0;
        gameStarted = false;
        
    }

    animationLoop();
}
