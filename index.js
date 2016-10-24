var smallprojects = (function() {
    var nav = "#projects"
    var nav_item = '<li role="presentation"><a href="#"></a></li>';
    $.getJSON('projects.json', function(json) {
        var item = $.parseHTML(nav_item);
        $.each(json, function(json, item) {
            $(item).find('a').href(json.directory);
            $(nav).append(nav_item)
        });
    });

})();