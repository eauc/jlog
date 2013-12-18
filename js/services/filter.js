'use strict';

angular.module('jlogApp.services')
    .factory('filter', [function() {
        var compareDate = function filterCompareDate(date1, date2) {
            if(date1.year > date2.year) return 1;
            if(date1.year < date1.year) return -1;
            if(date1.month > date2.month) return 1;
            if(date1.month < date2.month) return -1;
            if(date1.day > date2.day) return 1;
            if(date1.day < date2.day) return -1;
            return 0;
        };
        var matchComp = function filterMatchComp(type, comp) {
            if(type === 0) return (comp === 0);
            if(type === 1) return (comp !== 0);
            if(type === 2) return (comp === -1);
            if(type === 3) return (comp !== 1);
            if(type === 4) return (comp === 1);
            if(type === 5) return (comp !== -1);
            return false;
        };
        var matchDate = function filterMatchDate(filter, battle) {
            var comp = compareDate(filter.date, battle.date);
            var type = parseInt(filter.date.is, 10);
            var match = matchComp(type, comp);
            // console.log(comp + ' ' + type + ' ' + match);
            return !filter.date.active
                || match;
        };
        var matchMyArmy = function filterMatchMyArmy(filter, battle) {
            var match = battle.my_army.faction === filter.my_army.faction
                && (0 == filter.my_army.caster.length
                    || 0 <= filter.my_army.caster.indexOf(battle.my_army.caster)
                   );
            // console.log(filter.my_army.is + ' ' + match);
            return !filter.my_army.active
                || (filter.my_army.is === 'true' ? match : !match);
        };
        var matchOpponentName = function filterMatchOpponentName(filter, battle) {
            var match = (0 == filter.opp_name.value.length
                         || 0 <= filter.opp_name.value.indexOf(battle.opponent.name));
            // console.log(filter.opp_name.is + ' ' + match);
            return !filter.opp_name.active
                || (filter.opp_name.is === 'true' ? match : !match);
        };
        var matchOpponentCaster = function filterMatchOpponentCaster(filter, battle) {
            var match = battle.opponent.faction === filter.opp_caster.faction
                && (0 == filter.opp_caster.caster.length
                    || 0 <= filter.opp_caster.caster.indexOf(battle.opponent.caster)
                   );
            console.log(filter.opp_caster.is + ' ' + match);
            return !filter.opp_caster.active
                || (filter.opp_caster.is === 'true' ? match : !match);
        };
        return {
            create: function filterCreate() {
                var today = new Date();
                return {
                    active: false,
                    date: {
                        active: false,
                        is: '0',
                        year: today.getFullYear(),
                        month: today.getMonth()+1,
                        day: today.getDate()
                    },
                    my_army: {
                        active: false,
                        is: 'true',
                        faction: null,
                        caster: []
                    },
                    opp_name: {
                        active: false,
                        is: 'true',
                        value: []
                    },
                    opp_caster: {
                        active: false,
                        is: 'true',
                        faction: null,
                        caster: []
                    },
                    result: {
                        active: false,
                        is: 'true',
                        value: []
                    },
                    scenario: {
                        active: false,
                        is: 'true',
                        name: []
                    },
                    size: {
                        active: false,
                        is: '0',
                        value: 50
                    },
                    event: {
                        active: false,
                        is: 'true',
                        value: []
                    },
                    match: function filterMatch(battle) {
                        return !this.active
                            || ( matchDate(this, battle)
                                 && matchMyArmy(this, battle)
                                 && matchOpponentName(this, battle)
                                 && matchOpponentCaster(this, battle) );
                    }
                };
            },
        };
    }]);
