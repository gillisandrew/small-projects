var smallprojects = (function() {
    var nav = "#projects";
    var resources = ['html', 'js', 'css'];
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
        $(nav).append(item);

        for(var j=0; j<resources.length; j++) {
            $.getJSON(projects[i].directory + '/index.' + resources[j], false, function(res) {
                console.log(res);
            });
        }
        console.log(projects)
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