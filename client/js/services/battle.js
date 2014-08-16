'use strict';

angular.module('jlogApp.services')
  .factory('battle', [function() {
    function normalizeCaster(caster) {
      if (!_.isString(caster)) return null;
      var last_char = caster.charAt(caster.length - 1);
      if ('0' > last_char || '9' < last_char) {
        caster += '1';
      }
      return caster;
    }
    function battleAddTag(name) {
      this.tags.push(name);
      this.tags.sort();
    }
    return function(data) {
      var today = new Date();
      data = data || {};
      var instance = _.deepExtend({
        'date': {
          'year': today.getFullYear(),
          'month': today.getMonth() + 1,
          'day': today.getDate()
        },
        'my_army': {
          'caster': null,
          'faction': null
        },
        'opponent': {
          'name': null,
          'caster': null,
          'faction':null
        },
        'points': {
          'my_army': {
            'scenario': null,
            'army': null,
            'kill': null
          },
          'opponent': {
            'scenario': null,
            'army': null,
            'kill': null
          }
        },
        'setup': {
          'size': null,
          'scenario': null,
          'event': null,
          'initiative': {
            'started': null,
            'won_roll': null
          },
        },
        'score': null,
        'comment':null,
        'tags': [],
        'addTag': battleAddTag
      }, data);
      instance.my_army.caster = normalizeCaster(instance.my_army.caster);
      instance.opponent.caster = normalizeCaster(instance.opponent.caster);
      return instance;
    };
  }])
  .service('battles', [ 
    'storage', 
    'battle', 
    function(storage, battle) {
      var battles = {
        'list': []
      };
      var store = function battlesStore() {
        console.log('save battles in localStorage');
        storage.setItem(storage.KEYS.BATTLES, JSON.stringify(battles.list));
      };
      var load = function battlesLoad() {
        console.log('load battles from localStorage');
        return JSON.parse(storage.getItem(storage.KEYS.BATTLES));
      };
      var storageContainsBattles = function battlesStorageContainsBattles() {
        var data = storage.getItem(storage.KEYS.BATTLES);
        return ('string' === typeof data &&
                data.length > 0);
      };
      var buildIndex = function buildIndex() {
        var i = 0;
        for (i = 0 ; i < battles.list.length ; i++) {
          battles.list[i].index = i;
        }
      };
      battles.update = function battlesUpdate() {
        buildIndex();
        store();
      };
      battles.create = function battlesCreate(list) {
        this.list = [];
        if (_.isArray(list)) {
          this.list = _.map(list, battle);
        }
        this.update();
      };
      battles.init = function battlesInit() {
        if (storageContainsBattles()) {
          this.create(load());
        }
        else {
          this.create([]);
        }
      };
      battles.save = function battlesSave(index, battle) {
        if(this.list.length > index) {
          this.list[index] = battle;
        }
        else {
          this.list.push(battle);
        }
        this.update();
      };
      battles.clear = function battlesClear(value, getter, clearer) {
        _.each(this.list, function(battle) {
          if(0 <= getter.call(battle).indexOf(value)) {
            clearer.call(battle, value);
          }
        });
        this.update();
      };
      battles.remove = function battlesRemove(index) {
        if(index < this.list.length) {
          this.list.splice(index, 1);
          this.update();
        }
      };
      return battles;
    }]);
