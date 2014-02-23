$(document).ready(function() {
	$('#plus-zero').fadeIn('slow');
    $('#play-pong').click(function() {
        $('#pong').animate({'opacity': '1'}, 'slow');
        playPong();
    });
});
