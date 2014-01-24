'use strict';

angular.module('jlogApp.filters')
    .filter('initiative', [function() {

        return function(init) 
        {
            if(!angular.isObject(init)) return 'nil';
            var result = '';
            result += ('true' === init.won_roll) ? "Won roll, " : "Lost roll, ";
            result += ('true' === init.started) ? "started game" : "chose side";
            return result;
        }

    }]);
