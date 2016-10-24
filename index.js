var smallprojects = (function() {
    var nav = '#projects';
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
    function htmlEncode(value, content){
        var lang = 'markup';
        switch(content) {
            case 'html':
                lang = 'markup';
                break;
            case 'css':
                lang ='css';
                break;
            case 'js':
                lang= 'javascript'
                break;
        }
        return Prism.highlight(value, Prism.languages[lang]);
    }
    function fetchContent(i) {
        for(var j=0; j<resources.length; j++) {
            (function(i, j) {
                $.get(projects[i].directory + '/index.' + resources[j], function(res) {
                    projects[i][resources[j]] = htmlEncode(res, resources[j]);
                });
            })(i, j)
        }
    }
    function addItem(i) {
        var item = '<li role="presentation"><a data-project="' + i + '" href="#'+ projects[i].directory +'">' + projects[i].title + '</a></li>';
        $(document).ready(function() {
            $(nav).append(item);
        })
    }

    for(var i = 0; i<projects.length; i++) {
        addItem(i);
        fetchContent(i);
    }
    $(document).ready(function() {
        $('#projects a').on('click', function() {
            console.log(projects);
            $('#projects li.active').removeClass('active');
            $(this).parent('li').addClass('active');
            $('#code pre').html(projects[$('#projects .active').data('project')][$('#code .active').data('content')]);
            Prism.highlightAll();
        });
        $('#code li a').on('click', function() {
            console.log(projects);
            $('#code li.active').removeClass('active');
            $(this).parent('li').addClass('active');
            $('#code pre').html(projects[$('#projects .active').data('project')][$('#code .active').data('content')]);
            Prism.highlightAll();
        });
    });
})();