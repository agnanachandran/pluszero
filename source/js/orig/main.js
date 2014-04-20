$(document).ready(function() {
    function touchHandler(event) {
        var touches = event.changedTouches,
        first = touches[0],
        type = "";

        switch(event.type) {
            case "touchmove":  type="mousemove"; break;        
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
    $('#play-pong').click(function() {
        if (!clicked) {
            $('#pong').animate({'opacity': '1'}, 'slow');
            document.getElementById('pong').addEventListener("touchmove", touchHandler, true);
            document.getElementById('pong').addEventListener("touchcancel", touchHandler, true);    

            if (!!window.HTMLCanvasElement) {
                playPong();
            }
            clicked = true;
        } else {
            window.location = document.getElementById('projects-link').href;
        }
    });
});
