'use strict';

angular.module('jlogApp.filters')
    .filter('filterBattle', [function() {
        return function(input, filter, active) {
            return active && angular.isArray(input) ? input.filter(function(battle) {
                return filter.match(battle);
            }) : input;
        }
    }]);
