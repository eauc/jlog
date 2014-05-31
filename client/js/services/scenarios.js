'use strict';

angular.module('jlogApp.services')
  .value('default_scenarios', {
    sr14des: {
      name: 'SR14 Destruction'
    },
    sr14sad: {
      name: 'SR14 Supply & Demand'
    },
    sr14bop: {
      name: 'SR14 Balance of Power'
    },
    sr14poe: {
      name: 'SR14 Process of Elimination'
    },
    sr14cq: {
      name: 'SR14 Close Quarters'
    },
    sr14tf: {
      name: 'SR14 Two Fronts'
    },
    sr14inco: {
      name: 'SR14 Incoming'
    },
    sr14rp: {
      name: 'SR14 Rally Point'
    },
    sr14incu: {
      name: 'SR14 Incursion'
    },
    sr14out: {
      name: 'SR14 Outflank'
    },
    sr14itb: {
      name: 'SR14 Into the Breach'
    },
    sr14fs: {
      name: 'SR14 Fire Support'
    },
    sr13des: {
      name: 'SR13 Destruction'
    },
    sr13sad: {
      name: 'SR13 Supply & Demand'
    },
    sr13cq: {
      name: 'SR13 Close Quarters'
    },
    sr13ar: {
      name: 'SR13 Ammunition Run'
    },
    sr13incu: {
      name: 'SR13 Incursion'
    },
    sr13cr: {
      name: 'SR13 Chemical Reaction'
    },
    sr13out: {
      name: 'SR13 Outflank'
    },
    sr13inco: {
      name: 'SR13 Incoming'
    },
    sr13itb: {
      name: 'SR13 Into the Breach'
    },
    sr13rp: {
      name: 'SR13 Rally Point'
    },
    sr13poe: {
      name: 'SR13 Process of elimination'
    },
    sr13fs: {
      name: 'SR13 Fire Support'
    }
  })
  .service('scenarios', [
    '$window',
    'default_scenarios',
    function($window,
             default_scenarios) {
      var scenarios = {
        'list': angular.copy(default_scenarios)
      };
      var storage_scenarios_key = 'jlog_scenarios';
      var store = function scenariosStore() {
        console.log('save scenarios in localStorage');
        $window.localStorage.setItem(storage_scenarios_key, JSON.stringify(scenarios.list));
      };
      var load = function scenariosLoad() {
        console.log('load scenarios from localStorage');
        return JSON.parse($window.localStorage.getItem(storage_scenarios_key));
      };
      var storageContainsScenarios = function scenariosStorageContainsScenarios() {
        var data = $window.localStorage.getItem(storage_scenarios_key);
        return ('string' === typeof data &&
                data.length > 0);
      };
      var build = function scenariosBuild(battles) {
        scenarios.list = angular.copy(default_scenarios);
        if (!angular.isArray(battles)) return;
        var i, temp = {}, key;
        for (i = 0 ; i < battles.length ; i++) {
          if (angular.isObject(battles[i].setup) &&
              angular.isString(battles[i].setup.scenario)) {
            temp[battles[i].setup.scenario] = true;
          }
        }
        for (key in temp) {
          if (undefined === scenarios.list[key]) {
            scenarios.list[key] = {
              'name': key
            };
          }
        }
      };
      scenarios.create = function scenariosCreate(battles) {
        build(battles);
        store();
      };
      scenarios.init = function scenariosInit(battles) {
        if (storageContainsScenarios()) {
          this.list = load();
        }
        else {
          this.create(battles);
        }
      };
      scenarios.update = store;
      scenarios.add = function scenariosAdd(name) {
        var key = '';
        if(0 < name.length) {
          key = name.toLowerCase();
          this.list[key] = { name: name };
          store();
        }
        return key;
      };
      scenarios.remove = function scenariosRemove(name) {
        if(this.list.hasOwnProperty(name)) {
          delete this.list[name];
          store();
        }
      };
      return scenarios;
    }]);
