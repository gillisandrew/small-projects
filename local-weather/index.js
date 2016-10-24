var weather = (function() {
    var app_id = '704e4ed72ec04ff7c6c1ca7dc023fd4a';
    var pos = {
        lat: 45.5017,
        lon: -73.5673
    };
    var public = {};
    var units = 'C';

    

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos.lat = Math.floor(position.coords.latitude * 10000) / 10000;
            pos.lon = Math.floor(position.coords.longitude * 10000) / 10000;
            updateWeather(pos.lat, pos.lon, units);
        });
    }else {
        updateWeather(lat, lon, units);
    }

    function temperature(v) {
        switch(units) {
            case 'C':
                return Math.floor(v - 273.15) + '&deg;C';
            case 'F':
                return Math.floor((v * 9 / 5) - 459.67) + '&deg;F';
        }
    }

    function display(data) {
        $('#icon').className = '';
        $('#windDirection').className = '';
        $('#city').html(data.city);
        $('#icon').addClass(data.icon + ' weathericon wi');
        $('#temp').html(data.temp);
        $('#windStrength').html(data.wind_strength);
        $('#windDirection').addClass(windDirection + ' windicon wi wi-wind');
        $('#spinner').hide()
        $('#icon').show()
    }
    function weatherIcon(json) {
        var icon = 'wi-';
        //day or night
        if (json.weather[0].icon.slice(2, 0) === 'd') {
            icon += 'day-';
        }else {
            icon += 'night-';
        }
        //type of weather
        var weatherType = json.weather[0].id.toString().slice(0, 1);
        var weatherSubtype = json.weather[0].id.toString().slice(1, 3);
        switch (weatherType) {
            case '2':
            icon += 'thunderstorm'
            break;
            case '3':
            icon += 'sprinkle'
            break;
            case '5':
            icon += 'rain'
            break;
            case '6':
            icon += 'snow'
            break;
            case '7':
            icon += 'haze'
            break;
            case '8':
            switch (weatherSubtype) {
                case '00':
                icon += 'clear'
                break;
                default:
                icon += 'cloudy'
                break;
            }
            break;
            case '9':
            icon += 'extreme'
            break;
            default:
            icon = 'wi-na';
            break;
        }
        return icon;
    }
    function updateWeather() {
        $('#spinner').show();
        $('#icon').hide()
        $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + pos.lat + '&lon=' + pos.lon + '&APPID=' + app_id, function(json) {
            var data = {};
            data.city = json.name + ', ' + json.sys.country;
            data.temp = temperature(json.main.temp);
            data.icon = weatherIcon(json);
            data.wind_direction = 'towards-' + json.wind.deg + '-deg';
            data.wind_strength = json.wind.speed + ' knots';
            display(data);
        });
    }
    
    public.get = updateWeather;
    public.units = function(u) {
        units = u;
        updateWeather();
    }
    
    return public;

})();

$(document).ready(function() {
    $('#C').on('click', function() {
        weather.units('C');
        $('#C').addClass('active');
        $('#F').removeClass('active');
    });
    $('#F').on('click', function() {
        weather.units('F');
        $('#F').addClass('active');
        $('#C').removeClass('active');
    });
    $('#refresh').on('click', function() {
        weather.get();
    });
});