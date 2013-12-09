'use strict';

angular.module('grudgeApp.filters')
    .filter('scoreResultColor', [function() {

        return function(input) 
        {
            return typeof(input) !== 'string' ? input : 
                ((input == 'victory') ? 'text-success' : 
                 ((input == 'defeat') ? 'text-danger' : 
                  'text-warning'));
        }

    }])
    .filter('scoreTypeLetter', [function() {

        return function(input) 
        {
            return typeof(input) === 'string' ? input.charAt(0).toUpperCase() : input;
        }

    }]);
