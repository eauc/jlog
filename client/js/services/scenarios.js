'use strict';

angular.module('jlogApp.services')
  .service('scenarios', [
    '$http',
    '$q',
    function($http,
             $q) {
      // var scenarios = {
      //   'list': angular.copy(default_scenarios)
      // };
      // var store = function scenariosStore() {
      //   console.log('save scenarios in localStorage');
      //   storage.setItem(storage.KEYS.SCENARIOS, JSON.stringify(scenarios.list));
      // };
      // var load = function scenariosLoad() {
      //   console.log('load scenarios from localStorage');
      //   return JSON.parse(storage.getItem(storage.KEYS.SCENARIOS));
      // };
      // var storageContainsScenarios = function scenariosStorageContainsScenarios() {
      //   var data = storage.getItem(storage.KEYS.SCENARIOS);
      //   return ('string' === typeof data &&
      //           data.length > 0);
      // };
      // var build = function scenariosBuild(battles) {
      //   scenarios.list = angular.copy(default_scenarios);
      //   if (!_.isArray(battles)) return;
      //   var temp = {};
      //   _.each(battles, function(battle) {
      //     if (_.isObject(battle.setup) &&
      //         _.isString(battle.setup.scenario)) {
      //       temp[battle.setup.scenario] = true;
      //     }
      //   });
      //   _.each(temp, function(val, key) {
      //     if (undefined === scenarios.list[key]) {
      //       scenarios.list[key] = {
      //         'name': key
      //       };
      //     }
      //   });
      // };
      // scenarios.create = function scenariosCreate(battles) {
      //   build(battles);
      //   store();
      // };
      // scenarios.init = function scenariosInit(battles) {
      //   if (storageContainsScenarios()) {
      //     this.list = load();
      //   }
      //   else {
      //     this.create(battles);
      //   }
      // };
      // scenarios.update = store;
      // scenarios.add = function scenariosAdd(name) {
      //   var key = '';
      //   if(0 < name.length) {
      //     key = name.toLowerCase();
      //     this.list[key] = { name: name };
      //     store();
      //   }
      //   return key;
      // };
      // scenarios.remove = function scenariosRemove(name) {
      //   if(this.list.hasOwnProperty(name)) {
      //     delete this.list[name];
      //     store();
      //   }
      // };
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
