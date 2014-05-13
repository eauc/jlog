'use strict';

angular.module('jlogApp.services')
  .factory('filterMatchSimple', [
    function() {
      return function(data, get) {
        return angular.extend({
          active: false,
          is: 'true',
          value: [],
          match: function filterMatchOpponentName(battle) {
            var match = ( 0 == this.value.length ||
                          0 <= this.value.indexOf(get(battle)) );
            // console.log(filter.opp_name.is + ' ' + match);
            return !this.active
              || (this.is === 'true' ? match : !match);
          }
        }, data);
      };
    }
  ])
  .factory('filterMatchComp', [
    function() {
      return function filterMatchComp(type, comp) {
        if (type === 0) return (comp === 0);
        if (type === 1) return (comp !== 0);
        if (type === 2) return (comp === -1);
        if (type === 3) return (comp !== 1);
        if (type === 4) return (comp === 1);
        if (type === 5) return (comp !== -1);
        return false;
      };
    }
  ])
  .factory('filterMatchDate', [
    'filterMatchComp',
    function(filterMatchComp) {
      var compareDate = function filterCompareDate(date1, date2) {
        if (date1.year > date2.year) return 1;
        if (date1.year < date2.year) return -1;
        if (date1.month > date2.month) return 1;
        if (date1.month < date2.month) return -1;
        if (date1.day > date2.day) return 1;
        if (date1.day < date2.day) return -1;
        return 0;
      };
      return function(data) {
        var today = new Date();
        return angular.extend({
          active: false,
          is: '0',
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate(),
          match: function filterMatchDate(battle) {
            var comp = compareDate(this, battle.date);
            var type = parseInt(this.is, 10);
            var match = filterMatchComp(type, comp);
            // console.log(comp + ' ' + type + ' ' + match);
            return !this.active || match;
          }
        }, data);
      };
    }
  ])
  .factory('filterMatchSize', [
    'filterMatchComp',
    function(filterMatchComp) {
      var compareSize = function filterCompareSize(size1, size2) {
        if (size1 > size2) return 1;
        if (size1 < size2) return -1;
        return 0;
      };
      return function(data) {
        return angular.extend({
          active: false,
          is: '0',
          value: 50,
          match: function filterMatchSize(battle) {
            var comp = compareSize(this.value, battle.setup.size);
            var type = parseInt(this.is, 10);
            var match = filterMatchComp(type, comp);
            // console.log(comp + ' ' + type + ' ' + match);
            return !this.active || match;
          }
        }, data);
      };
    }
  ])
  .factory('filterMatchCaster', [
    function() {
      return function(data, get) {
        return angular.extend({
          active: false,
          is: 'true',
          faction: null,
          caster: [],
          match: function filterMatchCaster(battle) {
            var match = this.faction === get(battle).faction
              && ( 0 == this.caster.length || 
                   0 <= this.caster.indexOf(get(battle).caster) );
            // console.log(filter.my_army.is + ' ' + match);
            return !this.active
              || (this.is === 'true' ? match : !match);
          }
        }, data);
      };
    }
  ])
  // .factory('filterMatchOpponent', [
  //   function() {
  //     return function(data) {
  //       return angular.extend({
  //         active: false,
  //         is: 'true',
  //         value: [],
  //         match: function filterMatchOpponentName(battle) {
  //           var match = ( 0 == this.value.length ||
  //                         0 <= this.value.indexOf(battle.opponent.name) );
  //           // console.log(filter.opp_name.is + ' ' + match);
  //           return !this.active
  //             || (this.is === 'true' ? match : !match);
  //         }
  //       }, data);
  //     };
  //   }
  // ])
  // .factory('filterMatchResult', [
  //   function() {
  //     return function(data) {
  //       return angular.extend({
  //         active: false,
  //         is: 'true',
  //         value: [],
  //         match: function filterMatchResult(battle) {
  //           var match = ( 0 == this.value.length ||
  //                         0 <= this.value.indexOf(battle.score) );
  //           // console.log(filter.result.is + ' ' + match);
  //           return !this.active
  //             || (this.is === 'true' ? match : !match);
  //         }
  //       }, data);
  //     };
  //   }
  // ])
  // .factory('filterMatchScenario', [
  //   function() {
  //     return function(data) {
  //       return angular.extend({
  //         active: false,
  //         is: 'true',
  //         name: [],
  //         match: function filterMatchScenario(battle) {
  //           var match = ( 0 == this.name.length ||
  //                         0 <= this.scenario.name.indexOf(battle.setup.scenario) );
  //           // console.log(filter.scenario.is + ' ' + match);
  //           return !this.active
  //             || (this.is === 'true' ? match : !match);
  //         }
  //       }, data);
  //     };
  //   }
  // ])
  // .factory('filterMatchEvent', [
  //   function() {
  //     return function(data) {
  //       return angular.extend({
  //         active: false,
  //         is: 'true',
  //         value: [],
  //         match: function filterMatchEvent(battle) {
  //           var match = ( 0 == this.value.length ||
  //                         0 <= this.value.indexOf(battle.setup.event) );
  //           // console.log(filter.event.is + ' ' + match);
  //           return !this.active
  //             || (this.is === 'true' ? match : !match);
  //         }
  //       }, data);
  //     };
  //   }
  // ])
  .factory('filterMatchInitiative', [
    function() {
      return function(data) {
        return angular.extend({
          active: false,
          is: 'true',
          won_roll: '',
          started: '',
          match: function filterMatchInitiative(battle) {
            var match = ( 0 == this.won_roll.length ||
                          this.won_roll === battle.setup.initiative.won_roll)
              && ( 0 == this.started.length  ||
                   this.started === battle.setup.initiative.started);
            // console.log(filter.scenario.is + ' ' + match);
            return !this.active
              || (this.is === 'true' ? match : !match);
          }
        }, data);
      };
    }
  ])
  .factory('filterMatchTags', [
    function() {
      return function(data) {
        return angular.extend({
          active: false,
          is: 'any',
          value: [],
          match: function filterMatchTags(battle) {
            if (!this.active ||
                0 === this.value.length) return true;
            if (0 === battle.tags.length) {
              return 'none' === this.is
                || 'not_all' === this.is;
            }
            var i, and = true, or = false, found;
            for (i = 0 ; i < this.value.length ; i++) {
              found = (0 <= battle.tags.indexOf(this.value[i]));
              and = (and && found);
              or = (or || found);
            }
            switch (this.is) {
            case 'any':
              return or;
            case 'all':
              return and;
            case 'not_all':
              return !and;
            case 'none':
              return !or;
            default:
              return false;
            }
          }
        }, data);
      };
    }
  ])
  .factory('filter', [
    'filterMatchSimple',
    'filterMatchDate',
    'filterMatchSize',
    'filterMatchCaster',
    // 'filterMatchOpponent',
    // 'filterMatchResult',
    // 'filterMatchScenario',
    // 'filterMatchEvent',
    'filterMatchInitiative',
    'filterMatchTags',
    function(filterMatchSimple,
             filterMatchDate,
             filterMatchSize,
             filterMatchCaster,
             filterMatchInitiative,
             filterMatchTags) {
      var storage_filter_key = 'jlog_filter';
      var store = function filterStore(list) {
        console.log('save filter in localStorage');
        localStorage.setItem(storage_filter_key, list);
      };
      var load = function filterLoad() {
        console.log('load filter from localStorage');
        return JSON.parse(localStorage.getItem(storage_filter_key));
      };
      var storageContainsFilter = function filterStorageContainsFilter() {
        return 'string' === typeof localStorage.getItem(storage_filter_key);
      };

      var create = function filterCreate(data) {
        return {
          date: filterMatchDate(angular.isObject(data.date) ? data.date : {}),
          my_army: filterMatchCaster(angular.isObject(data.my_army) ? data.my_army : {},
                                     function(battle) { return battle.my_army; }),
          opp_name: filterMatchSimple(angular.isObject(data.opp_name) ? data.opp_name : {},
                                      function(battle) { return battle.opponent.name; }),
          opp_caster: filterMatchCaster(angular.isObject(data.opp_caster) ? data.opp_caster : {},
                                        function(battle) { return battle.opponent; }),
          result: filterMatchSimple(angular.isObject(data.result) ? data.result : {},
                                    function(battle) { return battle.score; }),
          scenario: filterMatchSimple(angular.isObject(data.scenario) ? data.scenario : {},
                                      function(battle) { return battle.setup.scenario; }),
          initiative: filterMatchInitiative(angular.isObject(data.initiative) ? data.initiative : {}),
          size: filterMatchSize(angular.isObject(data.size) ? data.size : {}),
          event: filterMatchSimple(angular.isObject(data.event) ? data.event : {},
                                   function(battle) { return battle.setup.event; }),
          tags: filterMatchTags(angular.isObject(data.tags) ? data.tags : {})
        };
      };
      
      var cache = {};
      return {
        list: null,
        init: function filterInit() {
          if (storageContainsFilter()) {
            var data = load();
            this.list = create(data);
          }
          else {
            this.list = create({});
            store(this.list);
          }
        },
        update: function filterUpdate() {
          store(this.list);
        },
        match: function filterMatch(battle, invert) {
          if (!cache.hasOwnProperty(battle.index)) {
            cache[battle.index] = true;
            var key;
            for(key in this.list) {
              if(this.list.hasOwnProperty(key)) {
                cache[battle.index] = cache[battle.index] && this.list[key].match(battle);
              }
            }
            console.log('filter battle ' + battle.index + ' ' + cache[battle.index]);
          }
          return invert ? !cache[battle.index] : cache[battle.index];
        },
        clearCache: function filterClearCache(index) {
          console.log('filter clearCache ' + index);
          if (undefined === index) {
            cache = {};
          }
          else {
            delete cache[index];
          }
        }
      };
    }]);
