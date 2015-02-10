'use strict';

angular.module('jlogApp.services')
  .service('tags', [
    function() {
      var tags = {
        fromBattles: function(coll) {
          return _.chain(coll)
            .mapWith(_.getPath, 'tags')
            .flatten()
            .without(null, undefined)
            .uniq()
            .sort()
            .value();
        },
        add: function(coll, t) {
          return _.chain(coll)
            .cat(t)
            .without(null, undefined)
            .uniq()
            .sort()
            .value();
        },
        drop: function(coll, ts) {
          return _.without.apply(null, _.cat([coll], ts));
        }
      };
      return tags;
    }
  ]);
