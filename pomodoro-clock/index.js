$(document).ready(function() {
  $.timerOptions = {
    breakLength: {
      id: '#breakLength',
      default: 5,
      value: 5,
      min: 2,
      max: 60
    },
    sessionLength: {
      id: '#sessionLength',
      default: 25,
      value: 25,
      min: 5,
      max: 240,
    },
    changeVal: function(target, operation) {
      var targetOption;
      switch (target) {
        case 'breakLength':
          targetOption = $.timerOptions.breakLength;
          break;
        case 'sessionLength':
          targetOption = $.timerOptions.sessionLength;
          break;
        default:
          break;
      }
      switch (operation) {
        case 'increment':

          if (targetOption.value == targetOption.max - 1) {
            ++targetOption.value;
            $(targetOption.id + ' input').val(targetOption.value)
            $(targetOption.id + ' .plus').addClass('disabled');
          } else if (targetOption.value < targetOption.max - 1) {
            ++targetOption.value;
            $(targetOption.id + ' input').val(targetOption.value)
            $(targetOption.id + ' .minus').removeClass('disabled');
          }
          break;
        case 'decrement':
          if (targetOption.value == targetOption.min + 1) {
            --targetOption.value;
            $(targetOption.id + ' input').val(targetOption.value)
            $(targetOption.id + ' .minus').addClass('disabled');
          } else if (targetOption.value > targetOption.min + 1) {
            --targetOption.value;
            $(targetOption.id + ' input').val(targetOption.value)
            $(targetOption.id + ' .plus').removeClass('disabled');
          }
          break;
        default:
          var userValue = parseInt($(targetOption.id + ' input').val());
          if (isNaN(userValue)) {
            targetOption.value = targetOption.default;
            $(targetOption.id + ' input').val(targetOption.value);
            $(targetOption.id + ' .plus').removeClass('disabled');
            $(targetOption.id + ' .minus').removeClass('disabled');
          } else {
            if (userValue < targetOption.min) {
              targetOption.value = targetOption.min;
              $(targetOption.id + ' input').val(targetOption.value);
              $(targetOption.id + ' .minus').addClass('disabled');
            } else if (userValue > targetOption.max) {
              targetOption.value = targetOption.max;
              $(targetOption.id + ' input').val(targetOption.value);
              $(targetOption.id + ' .plus').addClass('disabled');
            } else {
              targetOption.value = userValue;
              $(targetOption.id + ' input').val(targetOption.value);
              $(targetOption.id + ' .minus').removeClass('disabled');
              $(targetOption.id + ' .plus').removeClass('disabled');
            }
          }
          break;
      }
    },
    timer: function(target, time) {
      if (!$.timerOptions.running) {
        $.timerOptions.running = true;
        var startTime, endTime, title;
        if (time) {
          startTime = time;
        } else {
          startTime = Date.now();
        };

        switch (target) {
          case 'session':
            endTime = startTime + ($.timerOptions.sessionLength.value * 60000);
            $('#pomodoroTimer .progress-bar').addClass('progress-bar-success');
            $('#pomodoroTimer .progress-bar').removeClass('progress-bar-info');
            title = "Get to work!"
            break;
          case 'break':
            endTime = startTime + ($.timerOptions.breakLength.value * 60000);
            $('#pomodoroTimer .progress-bar').addClass('progress-bar-info');
            $('#pomodoroTimer .progress-bar').removeClass('progress-bar-success');
            title = "Relax!"
        }
        var difference = endTime - startTime;
        var timer = setInterval(function() {
          if ($.timerOptions.running) {
            var timeRemaining = (endTime - Date.now());
            if (timeRemaining <= 0) {
              clearInterval(timer);
              switch (target) {
                case 'break':
                  $('#pomodoroTimer .progress-bar').css('width', '0%');
                  $.timerOptions.running = false;
                  $.timerOptions.timer('session', endTime);
                  $.timerOptions.sound.play();
                  break;
                case 'session':
                  $('#pomodoroTimer .progress-bar').css('width', '100%');
                  $.timerOptions.running = false;
                  $.timerOptions.timer('break', endTime);
                  $.timerOptions.sound.play();
                  break;
              }
            } else {
              var progress;
              switch (target) {
                case 'session':
                  progress = 100 - (timeRemaining / difference * 100);
                  break;
                case 'break':
                  progress = (timeRemaining / difference * 100);
                  break;
              }
              $('#pomodoroTimer .progress-bar').css('width', progress + '%');
              var seconds = Math.floor(timeRemaining / 1000);
              var minutes = Math.floor(seconds / 60);
              var hours = Math.floor(minutes / 60);
              minutes = minutes - (hours * 60);
              seconds = seconds - (minutes * 60) - (hours * 3600);
              if (seconds.toString().length == 1) {
                seconds = '0' + seconds;
              }
              if (minutes.toString().length == 1) {
                minutes = '0' + minutes;
              }
              $('#pomodoroTimer .message').html(title);
              $('#pomodoroTimer .time .hour').html(hours);
              $('#pomodoroTimer .time .min').html(minutes);
              $('#pomodoroTimer .time .sec').html(seconds);
            }
          } else {
            clearInterval(timer)
            $('#pomodoroTimer .progress-bar').css('width', '0%');
            $('#pomodoroTimer .message').html('Ready to start!');
            $('#pomodoroTimer .time .hour').html('--');
            $('#pomodoroTimer .time .min').html('--');
            $('#pomodoroTimer .time .sec').html('--');
          }
        }, 1000);
      }
    },
    sound: new Audio('http://www.freesound.org/data/previews/32/32304_37876-lq.mp3'),
    running: false,
  }
  $('#breakLength input').val($.timerOptions.breakLength.value);
  $('#sessionLength input').val($.timerOptions.sessionLength.value);

  $('#breakLength .minus').on('click', function() {
    $.timerOptions.changeVal('breakLength', 'decrement')
  });
  $('#breakLength .plus').on('click', function() {
    $.timerOptions.changeVal('breakLength', 'increment')
  });
  $('#sessionLength .minus').on('click', function() {
    $.timerOptions.changeVal('sessionLength', 'decrement')
  });
  $('#sessionLength .plus').on('click', function() {
    $.timerOptions.changeVal('sessionLength', 'increment')
  });
  $('#sessionLength input').on('blur', function() {
    $.timerOptions.changeVal('sessionLength');
  })
  $('#breakLength input').on('blur', function() {
    $.timerOptions.changeVal('breakLength');
  })
  $('#pomodoroTimer .start').on('click', function() {
    $.timerOptions.timer('session')
    $('#pomodoroTimer .start').addClass('disabled');
    $('#pomodoroTimer .progress-bar').addClass('progress-bar-striped active');
    $('#pomodoroTimer .stop').removeClass('disabled');
  })
  $('#pomodoroTimer .stop').on('click', function() {
    $.timerOptions.running = false;
    $('#pomodoroTimer .stop').addClass('disabled');
    $('#pomodoroTimer .progress-bar').addClass('progress-bar-striped active');
    $('#pomodoroTimer .start').removeClass('disabled');
  })

  if (!Date.now) {
    Date.now = function now() {
      return new Date().getTime();
    };
  }
});