'use strict';

angular.module('grudgeApp.filters')
    .filter('scoreResultColor', [function() {

        return function(input) 
        {
            return (input == 'victory') ? 'text-success' : 
                ((input == 'defeat') ? 'text-danger' : 
                 'text-warning');
        }

    }])
    .filter('scoreTypeLetter', [function() {

        return function(input) 
        {
            return input.charAt(0).toUpperCase();
        }

    }]);
