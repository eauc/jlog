'use strict';

angular.module('grudgeApp.filters')
    .filter('capitalise', [function() {

        return function(text) 
        {
            return text.charAt(0).toUpperCase() + text.slice(1);
        }

    }]);
