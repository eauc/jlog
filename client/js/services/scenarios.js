'use strict';

angular.module('jlogApp.services')
  .service('scenarios', [
    '$http',
    '$q',
    function($http,
             $q) {
      var data;
      var scenarios = {
        data: function() {
          if(_.exists(data)) return data;
          return $http.get('data/scenarios.json').then(function(response) {
            data = _.chain(response.data)
              .map(function(s, k) {
                return {
                  key: k,
                  name: s.name
                };
              })
              .value();
            return _.clone(data);
          }, function(response) {
            console.log('scenarios get data error', response);
            return $q.reject(response);
          });
        },
        fromBattles: function(battles) {
          var ret = _.clone(data);
          _.chain(battles)
            .mapWith(_.getPath, 'setup.scenario')
            .uniq()
            .without(undefined, null)
            .each(function(s) {
              if(!_.exists(scenarios.nameFor(ret, s))) {
                ret = scenarios.add(ret, s);
              }
            })
            .value();
          return ret;
        },
        add: function(coll, sc) {
          return _.chain(coll)
            .cat({ key: sc, name: s.capitalize(sc) })
            .filter(function(s) { return _.exists(_.getPath(s, 'key')); })
            .uniq(false, _.partial(_.getPath, _, 'key'))
            .value();
        },
        drop: function(coll, sc) {
          return _.filter(coll, function(s) { return s.key !== sc; });
        },
        nameFor: function(coll, s) {
          return _.chain(coll)
            .where({ key: s })
            .first()
            .getPath('name')
            .value();
        }
      };
      return scenarios;
    }]);
