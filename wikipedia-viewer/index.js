function toggleSearch() {
    switch(window.location.hash) {
        case '#search':
            $('.wrapper').html($('.search-menu').clone(true));
            break;
        default:
            $('.wrapper').html($('.initial-menu').clone());
            break;
    }
}
$(document).ready(function() {
    toggleSearch();
    $(window).on('hashchange', function() {
        toggleSearch();
    });
    $('.search-submit').click(function() {
        getInput();
    });
    $('.get-weird').click(function() {
        unusualList('', true);
    })
    $(document).keypress(function(e) {
        if(e.which == 13) {
            getInput();
        }
    });
});

function getInput() {
    var input = $('.search-field').val();
    if(input) {
        search(input, true)
    }
}

function displayResults(results) {
    $('.search-results').html('');
    for(var i=0; i < results.length; i++) {
        $('.search-results').append('<a href="https://en.wikipedia.org/wiki/'+ results[i].title +'" class="list-group-item"><h4 class="list-group-item-heading">' + results[i].title + '</h4><p class="list-group-item-text">' + results[i].snippet + '...</p></a>')
    }
}

var spot = [];
function unusualList(offset, reset_spot) {
    var offset = offset || '';
    if(reset_spot) {
        spot = [''];
    }
    var remote = 'https://en.wikipedia.org/w/api.php/w/api.php?action=query&format=json&list=categorymembers&utf8=1&cmtitle=Category:Lists_of_things_considered_unusual' + offset + '&callback=?';
     $.ajax({
        url: remote,
        dataType: 'json',
        type: 'GET',
        headers: { 'Api-User-Agent': 'FCC-WikipediaViewer/1.0 (gillis.andrew@gmail.com)' },
        success: function(data) {
            $('.search-results').html('');
            for(var i=0; i < data.query.categorymembers.length; i++) {
                $('.search-results').append('<a href="https://en.wikipedia.org/wiki/'+ data.query.categorymembers[i].title +'" class="list-group-item"><h4 class="list-group-item-heading">' + data.query.categorymembers[i].title + '</h4></a>')
            }

            if(data.continue){
                $('.pager .next_page').show();
                $('.pager .next_page').off('click').click(function() {
                    unusualList('&cmcontinue=' + data.continue.cmcontinue);
                    spot.push('&cmcontinue=' + data.continue.cmcontinue);
                });
                if(spot.length > 3) {
                    $('.pager .prev_page').show();
                    $('.pager .prev_page').off('click').click(function() {
                        unusualList(spot[spot.length - 2]);
                        spot.pop();
                    });
                }else {
                    $('.pager .prev_page').hide();
                }
            }else {
                $('.pager .next_page').hide();
                if(spot.length > 1) {
                    $('.pager .prev_page').show();
                    $('.pager .prev_page').off('click').click(function() {
                        unusualList(spot[spot.length - 2]);
                        spot.pop();
                    });
                }else {
                    $('.pager .prev_page').hide();
                }
            }
        },
        error: function(err) {
            console.error(err);
        }
    });
}

function search(cleanInput, reset_spot) {
    var remote = 'https://en.wikipedia.org/w/api.php/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=' + cleanInput + '&srlimit=5&callback=?';
    if(reset_spot) {
        spot = [];
    }
    $.ajax({
        url: remote,
        dataType: 'json',
        type: 'GET',
        headers: { 'Api-User-Agent': 'FCC-WikipediaViewer/1.0 (gillis.andrew@gmail.com)' },
        success: function(data) {
            displayResults(data.query.search);
            if(!spot[0]) {
                spot[0] = cleanInput;
            }
            if(data.continue){
                $('.pager .next_page').show();
                $('.pager .next_page').off('click').click(function() {
                    search(cleanInput + '&sroffset=' + data.continue.sroffset);
                    spot.push(cleanInput + '&sroffset=' + data.continue.sroffset);
                });
                if(spot.length > 1) {
                    $('.pager .prev_page').show();
                    $('.pager .prev_page').off('click').click(function() {
                        search(spot[spot.length - 2]);
                        spot.pop();
                    });
                }else {
                    $('.pager .prev_page').hide();
                }
            }else {
                $('.pager .next_page').hide();
                if(spot.length > 1) {
                    $('.pager .prev_page').show();
                    $('.pager .prev_page').off('click').click(function() {
                        unusualList(spot[spot.length - 2]);
                        spot.pop();
                    });
                }else {
                    $('.pager .prev_page').hide();
                }
            }

        },
        error: function(err) {
            console.error(err);
        }
    });
}