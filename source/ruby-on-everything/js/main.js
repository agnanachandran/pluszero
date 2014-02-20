$(document).ready(function() {
    $("img.lazy").lazyload({
        effect: "fadeIn",
        threshold : 200
    });
    $('.appear').hide();
    // call waypoint plugin
    $('.appear').waypoint(function(event, direction) {
        // do your fade in here
        $(this).fadeIn();
    }, {
    offset: function() {
        // The bottom of the element is in view
        return $.waypoints('viewportHeight') - $(this).outerHeight();
        }
    });
});
