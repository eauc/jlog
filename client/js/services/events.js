'use strict';

angular.module('jlogApp.services')
  .service('events', [
    function() {
      var events = {
        fromBattles: function(coll) {
          return _.chain(coll)
            .mapWith(_.getPath, 'setup.event')
            .without(null, undefined)
            .uniq()
            .sortBy(function(e) { return e.toUpperCase(); })
            .value();
        },
        add: function(coll, e) {
          return _.chain(coll)
            .cat(e)
            .without(null, undefined)
            .uniq()
            .sort()
            .value();
        },
        drop: function(coll, e) {
          return _.without(coll, e);
        }
      };
      return events;
    }
  ]);
