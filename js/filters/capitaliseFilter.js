'use strict';

angular.module('grudgeApp.filters')
    .filter('capitalise', [function() {

        return function(text) 
        {
            return typeof(text) === 'string' ? text.charAt(0).toUpperCase() + text.slice(1) : text;
        }

    }]);
