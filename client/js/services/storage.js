'use strict';

angular.module('jlogApp.services')
  .factory('storage', [
    '$window',
    function($window) {
      var instance = {
        setItem: function() {
          return $window.localStorage.setItem.apply($window.localStorage, arguments);
        },
        getItem: function() {
          return $window.localStorage.getItem.apply($window.localStorage, arguments);
        },
        KEYS: {
          BATTLES: 'jlog_battles',
          OPPONENTS: 'jlog_opponents',
          EVENTS: 'jlog_events',
          SCENARIOS: 'jlog_scenarios',
          TAGS: 'jlog_tags',
          FILTER: 'jlog_filter'
        },
        clearJLogKeys: function() {
          console.log('clear all localStorage keys');
          _.each(instance.KEYS, function(key) {
            instance.setItem(key, '');
          });
        }
      };
      return instance;
    }]);
