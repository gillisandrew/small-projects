var smallprojects = (function() {
    var nav = "#projects"
    var nav_item = '<li role="presentation"><a href="#"></a></li>';
    $.getJSON('projects.json', function(json) {
        $.each(json, function(json) {
            $(nav_item).find('a').href(json.directory);
            $(nav).append(nav_item)
        });
    });

})();