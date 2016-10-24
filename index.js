var smallprojects = (function() {
    var nav = "#projects"

    var projects = [{
        "title": "Server Information",
        "directory": "server-information"
    },
    {
        "title": "Simon Game",
        "directory": "simon-game"
    },
    {
        "title": "Random Quote Machine",
        "directory": "random-quote"
    }]

    for(var i = 0; i<projects.length; i++) {
        $.getJSON(projects[i].directory + '/index.html', function(html) {
            projects[i]["HTML"] = html;
        })
        $.getJSON(projects[i].directory + '/index.js', function(js) {
            projects[i]["JS"] = js;
        })
        $.getJSON(projects[i].directory + '/index.js', function(css) {
            projects[i]["CSS"] = css;
        })
    }

    $(nav + ' li a').on('click', function() {
        $('#code pre').html(projects[$(this).data('project')][$('#code .active').data('content')])
    });

$(document).ready(function() {
    $.each(projects, function(i, project, item) {
        var item = '<li role="presentation"><a data-project="' + i + '" href="#'+ project.directory +'">' + project.title + '</a></li>';
        $(nav).append(item)
    });
});
    
})();