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
    },
    {
        "title": "Pomodoro Clock",
        "directory": "pomodoro-clock"
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
                $.ajax({
                    url: projects[i].directory + '/index.' + resources[j],
                    converters: {
                    'text script': function (text) {
                        return text;
                    }
                    },
                    success: function(res) {
                        projects[i][resources[j]] = htmlEncode(res, resources[j]);
                    }
                });
            })(i, j)
        }
    }
    function addItem(i) {
        var item = '<li role="presentation"><a data-project="' + i + '" href="#'+ i +'">' + projects[i].title + '</a></li>';
        $(document).ready(function() {
            $(nav).append(item);
        })
    }
    function setPre() {
        $(document).ready(function() {
            $('#demo').attr('href', projects[$('#projects .active a').data('project')].directory + '/');
            $('#code pre').html(projects[$('#projects .active a').data('project')][$('#code .active').data('content')]);
        });
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
            setPre();
        });
        $('#code li a').on('click', function() {
            console.log(projects);
            $('#code li.active').removeClass('active');
            $(this).parent('li').addClass('active');
            setPre()
        });
        if(window.location.hash) {
            $('#projects a[data-project="' + window.location.hash.slice(1, window.location.hash.length) + '"]').click();
        }else {
            $('#projects a')[0].click();
        }
        window.onhashchange = function() {
            $('#projects a[data-project="' + window.location.hash.slice(1, window.location.hash.length) + '"]').click();
        }
    });
})();