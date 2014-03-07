'use strict';

angular.module('jlogApp.services')
    .service('opponents', [function() {
        var storage_opponents_key = 'jlog_opponents';
        var store = function opponentsStore(list) {
            console.log('save opponents in localStorage');
            localStorage[storage_opponents_key] = JSON.stringify(list);
        };
        var load = function opponentsLoad() {
            console.log('load opponents from localStorage');
            return JSON.parse(localStorage[storage_opponents_key]);
        };
        var storageContainsOpponents = function opponentsStorageContainsOpponents() {
            return 'string' === typeof localStorage[storage_opponents_key];
        };
        var build = function opponentsBuild(battles) {
            var i, battle, opp, temp = {};
            var result = [];
            for (i = 0 ; i < battles.length ; i++) {
                battle = battles[i];
                temp[battle.opponent.name] = true;
            }
            for (opp in temp) {
                result.push(opp);
            }
            return result.sort();
        };
        return {
            create: function opponentsCreate(battles) {
                var list = build(battles);
                store(list);
                return list;
            },
            init: function opponentsInit(battles) {
                if (storageContainsOpponents()) {
                    return load();
                }
                else {
                    return this.create(battles);
                }
            },
            store: store
        };
    }]);
