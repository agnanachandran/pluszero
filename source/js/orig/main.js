$(document).ready(function() {
    var clicked = false;
    $('#play-pong').click(function() {
        if (!clicked) {
            $('#pong').animate({'opacity': '1'}, 'slow');
            if (!!window.HTMLCanvasElement) {
                playPong();
            }
            clicked = true;
        } else {
            window.location = document.getElementById('projects-link').href;
        }
    });
});
