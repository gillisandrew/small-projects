var calculator = (function($) {
    
    //CONFIG//////////////////////////////
    var output = '#output';             //
    //////////////////////////////////////
    
    var public = {};
    var input;
    var OOO = [['.'], ['^'], ['/', '*', '%'], ['+', '-']];
    var floating = false;
    if(!Array.prototype.last) {
        Array.prototype.last = function() {
            return this[this.length - 1];
        }
    }
    
    function evaluate() {
        for(var i=0; i<OOO.length; i++) {
            for(var j=0; j<OOO[i].length; j++) {
                for(var k = 0; k<input.length; k++) {
                    console.log('Checking for Operator: ' + OOO[i][j]);
                    if(input[k].value == OOO[i][j]) {
                        console.log('Found Operator: '+input[k].value);
                        return operation(k);
                    }
                }
            }
        }
    }
    function operation(i) {
        switch(input[i].value) {
            case '.':
                input[i-1].value = float(i);
                input.splice(i, 2);
                break;
            case '*':
                input[i-1].value = multiply(i);
                input.splice(i, 2);
                break;
            case '/':
                input[i-1].value = divide(i);
                input.splice(i, 2);
                break;
            case '^':
                input[i-1].value = exponent(i);
                input.splice(i, 2);
                break;
            case '+':
                input[i-1].value = add(i);
                input.splice(i, 2);
                break;
            case '-':
                input[i-1].value = subtract(i);
                input.splice(i, 2);
                break;
        }
        console.log(input);
        if(input.length > 1) {
            return evaluate();
        }else {
            return display(true, input[0].value);
        }
    }
    function AC() {
        input = [{
            value: 0,
            type: 'operand'
        }];
    }
    function CE() {
        input.pop();
    }
    function add(i) {
        return input[i-1].value + input[i+1].value;
    }
    function subtract(i) {
        return input[i-1].value - input[i+1].value;
    }
    function multiply(i) {
        return input[i-1].value * input[i+1].value;
    }
    function divide(i) {
        return input[i-1].value / input[i+1].value;
    }
    function percent(i) {
        return input[i-1].value / 100;
    }
    function exponent(i) {
        return Math.pow(input[i-1].value, input[i+1].value);
    }
    function float(i) {
        return parseFloat(input[i-1].value + '.' + input[i+1].value);
    }
    function display(reset, value) {
        if(reset) {
            $(output).html(value);
        }else {
            $(output).append(value);
        }
    }
    public.enter = function(value) {
        if(isNaN(value)) {
            input.push({
                value: value,
                type: 'operator'
            });
            if(value == '.') {
                floating === true;
                display(false, input.last().value);
            }else {
                display(true, '');
            }
        }else {
            if(input.last().type == 'operand') {
                input.last().value = parseInt(input.last().value.toString() + value.toString());
            }else {
                input.push({
                    value: value,
                    type: 'operand'
                });
            }
            display(true, input.last().value);
        }
        return input;
    }
    AC();
    public.eval = evaluate;
    return public;
})(jQuery);

$(document).ready(function() {
    $('button[data-enter]').on('click', function(e) {
        var v = $(this).data('enter');
        calculator.enter(v);
        return console.log(v)
    })
});