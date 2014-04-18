$(document).ready(function() {
    $('#play-pong').click(function() {
        $('#pong').animate({'opacity': '1'}, 'slow');
        if (!!window.HTMLCanvasElement) {
            playPong();
        }
    });
});
