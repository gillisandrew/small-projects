var quote = (function() {
  //CONFIG///////////////////////////
  var output = {
    content: '#content',
    source: '#source',
    tweet: '#tweet_quote'
  };
  ///////////////////////////////////
  var public = {};
  var random_url = 'https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&_jsonp=?';
  var unique_url = 'https://quotesondesign.com/wp-json/posts/';
  
  function visibility(show) {
    if(show) {
      $("#loading").hide();
      $("#quote").show();
    }else {
      $("#quote").hide();
      $("#loading").show();
    }
  }
  function request(url, id) {
    visibility(false);
    $.getJSON(url, function(json) {
      if(json[0]) {
        json = json[0];
      }
      window.location.hash = json.ID;
      $(document).ready(function() {
        $(output.content).html(json.content);
        $(output.source).html(json.title);
        visibility(true);
        json.title = json.title.replace('&#8217;', '\'');
        $(output.tweet).prop('href', 'https://twitter.com/intent/tweet?text=Great quote I found from ' + encodeURIComponent(json.title + '. ' + window.location.href));
      });
      
    });
  };
  $(document).ready(function() {
    if(window.location.hash) {
      var unique_id = window.location.hash.slice(1, window.location.hash.length);
      unique(unique_id);
    }else {
      random();
    }
    $('#new_quote').on('click', function() {
      random();
    });
  });

  function random() {
    request(random_url);
  }
  function unique(id) {
    var id_url = unique_url + id + '?_jsonp=?';
    request(id_url);
  }
  return public;
})();