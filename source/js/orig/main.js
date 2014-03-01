$(document).ready(function() {
    $('#projects-link').click(function() {
        var url = "projects/index.html #main-content";
        $('#main-content').hide().load(url).;
        $('head').append('<link rel="stylesheet" type="text/css" href="css/projects.css">');
        //history.pushState("Projects", "projects", "projects/index.html");
        return false;
    });
    $('#play-pong').click(function() {
        $('#pong').animate({'opacity': '1'}, 'slow');
        playPong();
    });
});
