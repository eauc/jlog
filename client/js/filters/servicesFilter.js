'use strict';

angular.module('jlogApp.filters')
  .filter('battle', [
    'battle',
    function(battle) {
      return function(input, method) {
        var args = _.rest(_.rest(arguments));
        return battle[method].apply(null, _.cons(input, args));
      };
    }
  ])
  .filter('factions', [
    'factions',
    function(factions) {
      return function(input, method) {
        var args = _.rest(_.rest(arguments));
        return factions[method].apply(null, _.cons(input, args));
      };
    }
  ])
  .filter('scenarios', [
    'scenarios',
    function(scenarios) {
      return function(input, method) {
        var args = _.rest(_.rest(arguments));
        return scenarios[method].apply(null, _.cons(input, args));
      };
    }
  ])
  .filter('scores', [
    'scores',
    function(scores) {
      return function(input, method) {
        var args = _.rest(_.rest(arguments));
        return scores[method].apply(null, _.cons(input, args));
      };
    }
  ]);
