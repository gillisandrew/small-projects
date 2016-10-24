var smallprojects = (function() {
    var nav = "#projects";

    $.getJSON('projects.json', function(json) {
        for(var i = 0; i<json.length; i++) {
            var item = '<li role="presentation"><a data-project="' + i + '" href="#'+ json[i].directory +'">' + json[i].title + '</a></li>';
            $(nav).append(item)
            $.getJSON(projects[i].directory + '/index.html', function(html) {
                json[i]["HTML"] = html;
            })
            $.getJSON(projects[i].directory + '/index.js', function(js) {
                json[i]["JS"] = js;
            })
            $.getJSON(projects[i].directory + '/index.js', function(css) {
                json[i]["CSS"] = css;
            })
        }
        projects = json;
    });
    $(document).ready(function() {
        $('#projects li a').on('click', function() {
            console.log(projects);
            $('#projects li.active').removeClass('active');
            $(this).parent('li').addClass('active');
            $('#code pre').html(projects[$(this).data('project')][$('#code .active').data('content')])
        });
    });
    
    
})();