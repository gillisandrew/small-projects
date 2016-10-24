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

    $.getJSON('projects.json', function(json) {
        projects = json;
        for(var i = o; i<json.length; i++) {
            var item = '<li role="presentation"><a data-project="' + i + '" href="#'+ project.directory +'">' + project.title + '</a></li>';
            $(nav).append(item)
        }
    });
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
$(document).ready(function() {
    $(nav + ' li a').on('click', function() {
        $('#code pre').html(projects[$(this).data('project')][$('#code .active').data('content')])
    });
    console.log(projects)
});
    
    
})();