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
    // 'storage', 
    // 'battle', 
    function() {
      var battles = {
        test: function(n, factions, scores, scenarios) {
          return _.range(n).map(function(i) {
            var my_faction = _.chain(factions).shuffle().first().value();
            var opp_faction = _.chain(factions).shuffle().first().value();
            return {
              index: i,
              date: { year: 2015,
                      month: 1,
                      day: 27
                    },
              my_army: { faction: my_faction.key,
                         caster: _.chain(my_faction.casters).shuffle().first().value().key
                       },
              opponent: { name: 'wood',
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
          });
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
