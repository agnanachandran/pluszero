//holo color:#00ddff

$(document).ready(function() {
	$('.projtext').fadeIn('slow');
	$('#head').fadeIn('slow');
	$('#endofpage').fadeIn('slow');

	$(".glow").hover(function(){
		$(this).animate({color:"#fff"},200);

	}, function(){
		$(this).animate({color:"#00ddff"}, 200);
	});

	$(".link").hover(function(){
		$(this).animate({color:"#fff"},200);

	}, function(){
		$(this).animate({color:"#eee"}, 200);
	});

});