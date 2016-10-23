var calculator = (function($) {
    
    //CONFIG//////////////////////////////
    var output = '#output';             //
    //////////////////////////////////////
    
    var public = {};
    var input = new Array();
    var floating = false;
    if(!Array.prototype.last) {
        Array.prototype.last = function() {
            return this[this.length - 1];
        }
    }
    
    //  {
    //      value: 123,
    //      type: (operand or operator);
    //  }
    //

    function add(a, b) {
        return a + b;
    }
    function subtract(a, b) {
        return a - b;
    }
    function multiply(a, b) {
        return a * b;
    }
    function divide(a, b) {
        return a / b;
    }
    function percent(a) {
        return a / 100;
    }
    function exponent(a, b) {
        return Math.pow(a, b);
    }
    function float(a,b) {
        return parseFloat(a + '.' + b);
    }
    function display(reset, value) {
        if(reset) {
            $(output).html(value);
        }else {
            $(output).append(value);
        }
    }
    public.enter = function(value) {
        var v, t;
        if(isNaN) {
            input.push({
                value: value,
                type: 'operator'
            });
            if(value === '.') {
                floating === true;
                display(false, value);
            }else {
                display(true, '');
            }
        }else {
            if(input.last().type === 'operand') {
                input.last().value = parseInt(input.last().value.toString() + value.toString());
            }else {
                input.push({
                    value: value,
                    type: 'operand'
                });
            }
            display(false, value);
        }
        return input;
    }

    return public;
})(jQuery);