'use strict';

angular.module('grudgeApp.filters')
    .filter('filterBattle', [function() {
        return function(input, filter) {
            return angular.isArray(input) ? input.filter(function(battle) {
                return filter.match(battle);
            }) : input;
        }
    }]);
