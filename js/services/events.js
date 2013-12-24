'use strict';

angular.module('jlogApp.services')
    .factory('events', [function() {
        return function(battles) {
            var i, temp = {}, event, result = [];
            for(i = 0 ; i < battles.length ; i++) {
                temp[battles[i].setup.event] = true;
            }
            for(event in temp) {
                result.push(event);
            }
            return result.sort();
        };
    }]);
