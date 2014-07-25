'use strict';

angular.module('jlogApp.filters')
  .filter('battle', [
    'filter',
    function(filter) {
      return function(array, active, invert) {
        return active && _.isArray(array) ? array.filter(function(battle) {
          return filter.match(battle, invert);
        }) : array;
      };
    }]);
