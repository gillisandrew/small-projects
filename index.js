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

        projects[i]['HTML'] = $.getJSON(projects[i].directory + '/index.html').responseText;
        projects[i]['JS'] = $.getJSON(projects[i].directory + '/index.js').responseText;
        projects[i]['CSS'] = $.getJSON(projects[i].directory + '/index.css').responseText;
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