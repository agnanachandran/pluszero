$(document).ready(function() {

    // RequestAnimFrame: used for animations
    window.cancelRequestAnimFrame = (function() { return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout })();

    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            return window.setTimeout(callbackForAnimFrame, 1000/45); // fps?
        }
    })();

    function touchHandler(event) {
        var touches = event.changedTouches,
            first = touches[0],
            type = "";

        switch(event.type) {
            case "touchstart":  type="mousedown"; break;        
            case "touchmove":  type="mousemove"; break;        
            case "touchend":  type="mouseup"; break;        
            default: return;
        }

        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                      first.screenX, first.screenY, 
                                      first.clientX, first.clientY, false, 
                                      false, false, false, 0/*left*/, null);

                                      first.target.dispatchEvent(simulatedEvent);
                                      event.preventDefault();
    }

    var clicked = false;

    var animateAndPlayGame = function() {
        var $canvas = $('#game-canvas');
        $canvas.animate({'opacity': '1'}, 'slow');
        $canvas[0].addEventListener("touchmove", touchHandler, true);
        $canvas[0].addEventListener("touchcancel", touchHandler, true);    

        if (!!window.HTMLCanvasElement) { // if we're ready to go
            clicked = true;
            if (Math.random() < 0.5) {
                playPong();
            } else {
                playGameOfLife();
            }
            $canvas.animate({'opacity': '1'}, 'slow');
            $canvas.css('background', 'rgba(255,255,255,0.05)');
        }
    };

    $('#play-game').click(function() {
        if (!clicked) {
            animateAndPlayGame();
        } else {
            window.location = document.getElementById('projects-link').href;
        }
    });
});
