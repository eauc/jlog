'use strict';

angular.module('jlogApp.services')
    .factory('opponents', [function() {
        return function opponentsFactory(battles) {
            var i, battle, opp, temp = {};
            var result = [];
            for(i = 0 ; i < battles.length ; i++) {
                battle = battles[i];
                temp[battle.opponent.name] = true;
            }
            for(opp in temp) {
                result.push(opp);
            }
            return result.sort();
        };
    }]);
