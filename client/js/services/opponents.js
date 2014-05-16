'use strict';

angular.module('jlogApp.services')
  .service('opponents', [
    '$window',
    function($window) {
      var opponents = {
        'list': []
      };
      var storage_opponents_key = 'jlog_opponents';
      var store = function opponentsStore() {
        console.log('save opponents in localStorage');
        $window.localStorage.setItem(storage_opponents_key, opponents.list);
      };
      var load = function opponentsLoad() {
        console.log('load opponents from localStorage');
        return JSON.parse($window.localStorage.getItem(storage_opponents_key));
      };
      var storageContainsOpponents = function opponentsStorageContainsOpponents() {
        return 'string' === typeof $window.localStorage.getItem(storage_opponents_key);
      };
      var build = function opponentsBuild(battles) {
        opponents.list = [];
        if (!angular.isArray(battles)) return;
        var i, battle, opp, temp = {};
        for (i = 0 ; i < battles.length ; i++) {
          battle = battles[i];
          if (angular.isObject(battle.opponent) &&
              angular.isString(battle.opponent.name)) {
            temp[battle.opponent.name] = true;
          }
        }
        for (opp in temp) {
          opponents.list.push(opp);
        }
        opponents.list.sort();
      };
      opponents.create = function opponentsCreate(battles) {
        build(battles);
        store();
      };
      opponents.init = function opponentsInit(battles) {
        if (storageContainsOpponents()) {
          this.list = load().sort();
        }
        else {
          this.create(battles);
        }
      };
      opponents.update = store;
      return opponents;
    }]);
