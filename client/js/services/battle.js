'use strict';

angular.module('jlogApp.services')
  .factory('battle', [
    function() {
    // function normalizeCaster(caster) {
    //   if (!_.isString(caster)) return null;
    //   var last_char = caster.charAt(caster.length - 1);
    //   if ('0' > last_char || '9' < last_char) {
    //     caster += '1';
    //   }
    //   return caster;
    // }
    // function battleAddTag(name) {
    //   this.tags.push(name);
    //   this.tags.sort();
    // }
    // return function(data) {
    //   var today = new Date();
    //   data = data || {};
    //   var instance = _.deepExtend({
    //     'date': {
    //       'year': today.getFullYear(),
    //       'month': today.getMonth() + 1,
    //       'day': today.getDate()
    //     },
    //     'my_army': {
    //       'caster': null,
    //       'faction': null
    //     },
    //     'opponent': {
    //       'name': null,
    //       'caster': null,
    //       'faction':null
    //     },
    //     'points': {
    //       'my_army': {
    //         'scenario': null,
    //         'army': null,
    //         'kill': null
    //       },
    //       'opponent': {
    //         'scenario': null,
    //         'army': null,
    //         'kill': null
    //       }
    //     },
    //     'setup': {
    //       'size': null,
    //       'scenario': null,
    //       'event': null,
    //       'initiative': {
    //         'started': null,
    //         'won_roll': null
    //       },
    //     },
    //     'score': null,
    //     'comment':null,
    //     'tags': [],
    //     'addTag': battleAddTag
    //   }, data);
    //   if(_.isObject(instance.initiative)) {
    //     _.deepExtend(instance.setup.initiative, instance.initiative);
    //     delete instance.initiative;
    //   }
    //   instance.my_army.caster = normalizeCaster(instance.my_army.caster);
    //   instance.opponent.caster = normalizeCaster(instance.opponent.caster);
    //   return instance;
    // };
      var battle = {
        create: function(data) {
          data = _.exists(data) ? data : {};
          var today = new Date();
          return _.deepExtend({
            index: 0,
            date: { year: today.getFullYear(),
                    month: today.getMonth()+1,
                    day: today.getDate()
                  },
            my_army: { faction: null,
                       caster: null
                     },
            opponent: { name: null,
                        faction: null,
                        caster: null
                      },
            setup: { size: null,
                     scenario: null,
                     event: null,
                     initiative: {
                       won_roll: null,
                       started: null
                     } },
            score: null,
            points: {
              my_army: { scenario: null,
                         army: null,
                         kill: null },
              opponent: { scenario: null,
                          army: null,
                          kill: null }
            },
            tags: [],
            comment: null
          }, data);
        },
        test: function(i, factions, scores, scenarios) {
          var my_faction = _.chain(factions).shuffle().first().value();
          var opp_faction = _.chain(factions).shuffle().first().value();
          return {
            index: i,
            date: { year: _.chain([2012, 2014, 2013]).shuffle().first().value(),
                    month: _.chain([4, 8, 9]).shuffle().first().value(),
                    day: _.chain([5, 12, 19]).shuffle().first().value()
                  },
            my_army: { faction: my_faction.key,
                       caster: _.chain(my_faction.casters).shuffle().first().value().key
                     },
            opponent: { name: _.chain(['wood', 'kevin', 'fred']).shuffle().first().value(),
                        faction: opp_faction.key,
                        caster: _.chain(opp_faction.casters).shuffle().first().value().key
                      },
            setup: { size: _.chain([15,25,35,50]).shuffle().first().value(),
                     scenario: _.chain(scenarios).shuffle().first().value().key,
                     event: _.chain(['master', 'amical', 'wtc']).shuffle().first().value(),
                     initiative: {
                       won_roll: _.chain(['true', 'false']).shuffle().first().value(),
                       started: _.chain(['true', 'false']).shuffle().first().value()
                     } },
            score: _.chain(scores).keys().shuffle().first().value(),
            points: {
              my_army: { scenario: (Math.random()*5)>>0,
                         army: (Math.random()*50)>>0,
                         kill: (Math.random()*50)>>0 },
              opponent: { scenario: (Math.random()*5)>>0,
                          army: (Math.random()*50)>>0,
                          kill: (Math.random()*50)>>0 }
            },
            tags: ['tiers4', 'raek spam'],
            comment: 'don\'t panic'
          };
        },
        addTag: function(b, t) {
          return _.chain(b)
            .clone()
            .apply(function(b) {
              b.tags = _.chain(b.tags)
                .cat(t)
                .uniq()
                .sort()
                .value();
              return b;
            })
            .value();
        },
        initRollDescFor: function(b) {
          return 'true' === _.getPath(b ,'setup.initiative.won_roll') ?
            'Won Roll' : 'Lost Roll';
        },
        initStartDescFor: function(b) {
          return 'true' === _.getPath(b, 'setup.initiative.started') ?
            'Started Game' : 'Chose Side';
        }
      };
      return battle;
    }
  ])
  .service('battles', [ 
    '$window',
    '$http',
    '$q',
    'battle', 
    'orderByFilter',
    function($window,
             $http,
             $q,
             battle,
             orderByFilter) {
      var sort_types;
      var TABLE_KEYS = {
        'date': function(b) { return b.date.year+'-'+b.date.month+'-'+b.date.day; },
        'my_faction': 'my_army.faction',
        'my_caster': 'my_army.caster',
        'opponent': 'opponent.name',
        'opponent_faction': 'opponent.faction',
        'opponent_caster': 'opponent.caster',
        'size': 'setup.size',
        'scenario': 'setup.scenario',
        'event': 'setup.event',
        'initiative': function(b) {
          return ((b.setup.initiative.won_roll === 'true' ? 'wonRoll' : 'lostRoll')+
                  '-'+
                  (b.setup.initiative.started === 'true' ? 'startedGame' : 'choseSide'));
        },
        'result': 'score',
        'my_cp': 'points.my_army.scenario',
        'my_ap': 'points.my_army.army',
        'my_kp': 'points.my_army.kill',
        'opponent_cp': 'points.opponent.scenario',
        'opponent_ap': 'points.opponent.army',
        'opponent_kp': 'points.opponent.kill',
        'tags': function(b) { return b.tags.join('|'); },
        'comment': 'comment'
      };
      var battles = {
        init: function() {
          var bs;
          var bs_store = $window.localStorage.getItem('jlog_battles_v2');
          if(_.isString(bs_store)) {
            try {
              bs = JSON.parse(bs_store);
              if(_.isArray(bs)) {
                console.log('retrieve stored battles v2');
                // $window.localStorage.removeItem('jlog_battles');
                return bs;
              }
            }
            catch(err) {
              console.log(err);
            }
          }
          bs_store = $window.localStorage.getItem('jlog_battles');
          if(_.isString(bs_store)) {
            try {
              bs = JSON.parse(bs_store);
              if(_.isArray(bs)) {
                console.log('retrieve stored battles v1');
                return bs;
              }
            }
            catch(err) {
              console.log(err);
            }
          }
          return [];
        },
        store: function(coll) {
          console.log('store battles v2');
          $window.localStorage.setItem('jlog_battles_v2', JSON.stringify(coll));
        },
        clearStorage: function() {
          console.log('clear stored battles');
          $window.localStorage.removeItem('jlog_battles_v2');
          $window.localStorage.removeItem('jlog_battles');
        },
        buildIndex: function(coll) {
          return _.each(coll, function(b, i) {
            b.index = i;
          });
        },
        save: function(coll, i, b) {
          var ret = _.clone(coll);
          ret.splice(i, 1, b);
          return ret;
        },
        drop: function(coll, i) {
          var ret = _.clone(coll);
          ret.splice(i, 1);
          return ret;
        },
        test: function(n, factions, scores, scenarios) {
          return _.chain(n)
            .range()
            .map(_.partial(battle.test, _, factions, scores, scenarios))
            .value();
        },
        sortTypes: function() {
          if(_.exists(sort_types)) return sort_types;
          return $http.get('data/sorts.json').then(function(response) {
            sort_types = response.data;
            return sort_types;
          }, function(response) {
            console.log('battles get sort types error', response);
            return $q.reject(response);
          });
        },
        updateSortBy: function(sorts, by, type) {
          if(!_.exists(sorts[type])) return by;
          var ret = _.clone(by);
          if(ret.type === type) {
            ret.reverse = !ret.reverse;
          }
          else {
            ret.type = type;
            ret.reverse = sorts[type].reverse;
          }
          return ret;
        },
        sort: function(battles, sorts, type, reverse) {
          return orderByFilter(battles, sorts[type].key, reverse);
        },
        toTable: function(battles) {
          return _.cat([_.keys(TABLE_KEYS)],
                       _.chain(battles)
                       .map(function(b) {
                         return _.reduce(TABLE_KEYS, function(mem, k) {
                           if(_.isFunction(k)) {
                             mem.push(k(b));
                           }
                           else {
                             mem.push(_.getPath(b, k));
                           }
                           return mem;
                         }, []);
                       })
                       .value()
                      );
        }
      };
      return battles;
  //       'list': []
  //     };
  //     var store = function battlesStore() {
  //       console.log('save battles in localStorage');
  //       storage.setItem(storage.KEYS.BATTLES, JSON.stringify(battles.list));
  //     };
  //     var load = function battlesLoad() {
  //       console.log('load battles from localStorage');
  //       return JSON.parse(storage.getItem(storage.KEYS.BATTLES));
  //     };
  //     var storageContainsBattles = function battlesStorageContainsBattles() {
  //       var data = storage.getItem(storage.KEYS.BATTLES);
  //       return ('string' === typeof data &&
  //               data.length > 0);
  //     };
  //     var buildIndex = function buildIndex() {
  //       var i = 0;
  //       for (i = 0 ; i < battles.list.length ; i++) {
  //         battles.list[i].index = i;
  //       }
  //     };
  //     battles.update = function battlesUpdate() {
  //       buildIndex();
  //       store();
  //     };
  //     battles.create = function battlesCreate(list) {
  //       this.list = [];
  //       if (_.isArray(list)) {
  //         this.list = _.map(list, battle);
  //       }
  //       this.update();
  //     };
  //     battles.init = function battlesInit() {
  //       if (storageContainsBattles()) {
  //         this.create(load());
  //       }
  //       else {
  //         this.create([]);
  //       }
  //     };
  //     battles.save = function battlesSave(index, battle) {
  //       if(this.list.length > index) {
  //         this.list[index] = battle;
  //       }
  //       else {
  //         this.list.push(battle);
  //       }
  //       this.update();
  //     };
  //     battles.clear = function battlesClear(value, getter, clearer) {
  //       _.each(this.list, function(battle) {
  //         if(0 <= getter.call(battle).indexOf(value)) {
  //           clearer.call(battle, value);
  //         }
  //       });
  //       this.update();
  //     };
  //     battles.remove = function battlesRemove(index) {
  //       if(index < this.list.length) {
  //         this.list.splice(index, 1);
  //         this.update();
  //       }
  //     };
  //     return battles;
    }
  ]);
