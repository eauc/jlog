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
      // var store = function opponentsStore() {
      //   console.log('save opponents in localStorage');
      //   storage.setItem(storage.KEYS.OPPONENTS, JSON.stringify(opponents.list));
      // };
      // var load = function opponentsLoad() {
      //   console.log('load opponents from localStorage');
      //   return JSON.parse(storage.getItem(storage.KEYS.OPPONENTS));
      // };
      // var storageContainsOpponents = function opponentsStorageContainsOpponents() {
      //   var data = storage.getItem(storage.KEYS.OPPONENTS);
      //   return ('string' === typeof data &&
      //           data.length > 0);
      // };
      // var build = function opponentsBuild(battles) {
      //   opponents.list = [];
      //   if (!_.isArray(battles)) return;
      //   var opp, temp = {};
      //   _.each(battles, function(battle) {
      //     if (_.isObject(battle.opponent) &&
      //         _.isString(battle.opponent.name)) {
      //       temp[battle.opponent.name] = true;
      //     }
      //   });
      //   opponents.list = _.keys(temp);
      //   opponents.list.sort();
      // };
      // opponents.create = function opponentsCreate(battles) {
      //   build(battles);
      //   store();
      // };
      // opponents.init = function opponentsInit(battles) {
      //   if (storageContainsOpponents()) {
      //     this.list = load().sort();
      //   }
      //   else {
      //     this.create(battles);
      //   }
      // };
      // opponents.update = store;
      // opponents.add = function opponentsAdd(name) {
      //   if(0 < name.length) {
      //     this.list.push(name);
      //     this.list.sort();
      //     store();
      //   }
      // };
      // opponents.remove = function opponentsRemove(name) {
      //   var index = this.list.indexOf(name);
      //   if(0 <= index) {
      //     this.list.splice(index, 1);
      //     store();
      //   }
      // };
      return opponents;
    }
  ]);
