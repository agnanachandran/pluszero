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

    // Only do opacity animation if not originating from the projects page. TODO: take this out, maybe
    //var oldURL = document.referrer;
    //if (oldURL.indexOf(document.URL + '/projects') === -1 && oldURL.indexOf(document.URL + 'projects') === -1 ) {
        //$('#nav-bar').css('opacity', '0');
        //$('#nav-bar').animate({'opacity': '1'}, '900');
    //}
    $('#play-pong').click(function() {
        if (!clicked) {
            var $pongCanvas = $('#pong');
            $pongCanvas.animate({'opacity': '1'}, 'slow');
            document.getElementById('pong').addEventListener("touchmove", touchHandler, true);
            document.getElementById('pong').addEventListener("touchcancel", touchHandler, true);    

            if (!!window.HTMLCanvasElement) { // if we're ready to go
                playPong();
                $pongCanvas.animate({'opacity': '1'}, 'slow');
                $pongCanvas.css('background', 'rgba(255,255,255,0.05)');
            }
            clicked = true;
        } else {
            window.location = document.getElementById('projects-link').href;
        }
    });
});
