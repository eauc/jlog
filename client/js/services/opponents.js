'use strict';

angular.module('jlogApp.services')
  .service('opponents', [
    function() {
      var opponents = {
        fromBattles: function(coll) {
          return _.chain(coll)
            .mapWith(_.getPath, 'opponent.name')
            .without(null, undefined)
            .uniq()
            .sort()
            .value();
        },
        add: function(coll, o) {
          return _.chain(coll)
            .cat(o)
            .without(null, undefined)
            .uniq()
            .sort()
            .value();
        },
        drop: function(coll, o) {
          return _.without(coll, o);
        }
      };
      return opponents;
    }
  ]);
