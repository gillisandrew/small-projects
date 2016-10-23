function loadNewQuote(random) {
  $("#quote").hide();
  $("#loading").show();
  var url = 'url';
  if(random) {
    url = 'https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&_jsonp=?'
  } else {
    url = 'https://quotesondesign.com/wp-json/posts/' + window.location.hash.slice(1, window.location.hash.length) + '?_jsonp=?'
  }
  $.ajax({
    type: 'GET',
    url: url,
    async: false,
    jsonpCallback: 'jsonCallback',
    contentType: "application/json",
    dataType: 'jsonp',
    success: function(json) {
      var data = json;
      if(json[0]) {
        data = json[0]
      }
      window.location.hash = data.ID;
      $('#quote blockquote p').html(data.content);
      $('#quote blockquote footer cite').html(data.title);
      $("#loading").hide();
      $("#quote").show();
      $("#tweetquote").prop("href", "https://twitter.com/intent/tweet?text=Great quote I found by " + data.title + ". " + encodeURIComponent(window.location.href));
    },
    error: function() {
      $('#quote').html('<div class="alert alert-danger" role="alert"><strong>Error!</strong><br /> Something went wrong. You can try loading a new quote but if the problem persists check back later.</div>')
      $("#loading").hide();
      $("#quote").show();
    }
  });
}

$(document).ready(function() {
  if (window.location.hash) {
    loadNewQuote(false)
  } else {
    loadNewQuote(true);
  }
});