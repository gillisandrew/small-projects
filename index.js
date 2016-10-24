var smallprojects = (function() {
    var nav = "#projects";
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
    }];

    for(var i = 0; i<projects.length; i++) {
        var item = '<li role="presentation"><a data-project="' + i + '" href="#'+ projects[i].directory +'">' + projects[i].title + '</a></li>';
        $(nav).append(item)
        var html_file = $.getJSON(projects[i].directory + '/index.html');
        var js_file = $.getJSON(projects[i].directory + '/index.js');
        var css_file = $.getJSON(projects[i].directory + '/index.css');
        projects[i]['HTML'] = html_file.responseText;
        projects[i]['JS'] = js_file.responseText;
        projects[i]['CSS'] = css_file.responseText;
    }
    $(document).ready(function() {
        
        $('#projects a').on('click', function() {
            console.log(projects);
            // $('#projects li.active').removeClass('active');
            // $(this).parent('li').addClass('active');
            // $('#code pre').html(projects[$(this).data('project')][$('#code .active').data('content')])
        });
    });
})();