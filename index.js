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
        for(var i = 0; i<json.length; i++) {
            var item = '<li role="presentation"><a data-project="' + i + '" href="#'+ json[i].directory +'">' + json[i].title + '</a></li>';
            $(nav).append(item)
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
    });
$(document).ready(function() {
    $(nav + ' li a').on('click', function(e) {
        console.log(projects);
        $(nav + ' .active').removeClass('active');
        $(e).addClass('active');
        $('#code pre').html(projects[$(this).data('project')][$('#code .active').data('content')])
    });
});
    
    
})();