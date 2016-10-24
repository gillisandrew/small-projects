Simon = (function() {
    // green => 0; red => 1; blue => 2; yellow => 3;
    var exports = {};
    var sounds = [
        new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
        new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
        new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
        new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
    ];
    var step_number = 0;
    var cpu_sequence = [];
    var user_sequence = [];
    var is_strict = false;
    var interval = 1200

    
    function runSequence(n) {
        exports.ready = false;
        $('.main_buttons').removeClass('failed');
        console.log(cpu_sequence[n]);
        $('.active').removeClass('active');
        $('.sector[data-index=' + cpu_sequence[n] + ']').addClass('active');
        sounds[cpu_sequence[n]].pause();
        sounds[cpu_sequence[n]].currentTime = 0;
        sounds[cpu_sequence[n]].play();
        n++;
        if(n < cpu_sequence.length) {
            setTimeout(function() {
                    runSequence(n);
            }, interval)
        }else {
            setTimeout(function() {
                $('.active').removeClass('active');
            }, interval)
                exports.ready = true;
                
        };
    }
    function nextStep() {
        if(user_sequence.length == cpu_sequence.length) {
            exports.ready = false;
            $('#step').html(step_number + 1);
            cpuSelect();
        }
        
    }
    function cpuSelect() {
        user_sequence = [];
        ++step_number;
        var cpu_select = Math.floor(Math.random() * 4);
        cpu_sequence.push(cpu_select);
        setTimeout(function() {
            runSequence(0);
        }, interval);
    }
    function failedStep() {
        exports.ready = false;
        $('.main_buttons').addClass('failed');
        if(is_strict) {
            exports.reset();
            exports.start();
        }else {
            user_sequence = [];
            setTimeout(function() {
                runSequence(0);
            }, interval);
        }
    }
    function compareSequence(user, cpu) {
        var i = user.length - 1;
        if(user[i] == cpu[i]) {
            nextStep();
        }else {
            exports.ready = false;
            failedStep();
        }
    }
    exports.ready = false;
    exports.press = function(e) {
        sounds[e].play();
        user_sequence.push(e);
        compareSequence(user_sequence, cpu_sequence);
    }
    exports.toggleStrict = function() {
        return is_strict = !is_strict;
    }
    exports.reset = function() {
        step_number = 0;
        cpu_sequence = [];
        user_sequence = [];
    }
    exports.start = function() {
        nextStep();
    }
    return exports;
})();

$(document).ready(function() {
    $('#start').on('click', function() {
        $('#start').disabled = true;
        Simon.start();
    });
    $('#reset').on('click', function() {
        $('#start').disabled = false;
        Simon.reset();
    });
    $('#strict').on('click', function() {
        Simon.toggleStrict();
    });
    $('.sector').on('mousedown', function() {
        if(Simon.ready){
            $(this).addClass('active');
            Simon.press($(this).data('index'));
        }
    });
    $('.sector').on('mouseup', function() {
        if(Simon.ready){
            $(this).removeClass('active');
        }
    });
});