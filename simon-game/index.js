Simon = (function() {
    // green => 0; red => 1; blue => 2; yellow => 3;
    var public = {};
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
        public.ready = false;
        if(cpu_sequence.length === 21) {
            alert('Congratulation! You have reached 20 steps. The game will now reset.')
            public.reset();
            return public.start();
        }
        $('.main_buttons').removeClass('failed');
        $('.sector.active').removeClass('active');
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
                $('.sector.active').removeClass('active');
            }, interval)
                public.ready = true;
                
        };
    }
    function nextStep() {

        if(user_sequence.length == cpu_sequence.length) {
            public.ready = false;
            $('#step').html(step_number);
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
        public.ready = false;
        $('.main_buttons').addClass('failed');
        if(is_strict) {
            public.reset();
            public.start();
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
            public.ready = false;
            failedStep();
        }
    }
    public.ready = false;
    public.press = function(e) {
        sounds[e].play();
        user_sequence.push(e);
        compareSequence(user_sequence, cpu_sequence);
    }
    public.toggleStrict = function(bool) {
        return is_strict = bool;
    }
    public.reset = function() {
        step_number = 0;
        $('#step').html('--');
        cpu_sequence = [];
        user_sequence = [];
    }
    public.start = function() {
        nextStep();
    }
    return public;
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
    $('#strict_toggle .btn').on('click', function() {
        $('#strict_toggle .btn').removeClass('active');
        $(this).addClass('active');
        Simon.toggleStrict($(this).data('strict'));
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