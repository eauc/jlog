'use strict';

angular.module('jlogApp.services')
    .factory('statEntry', [function() {
        return function() {
            return {
                win: {
                    total: 0,
                    assassination: 0,
                    scenario: 0,
                    clock: 0
                },
                draw: {
                    total: 0,
                    assassination: 0,
                    scenario: 0,
                    clock: 0
                },
                loss: {
                    total: 0,
                    assassination: 0,
                    scenario: 0,
                    clock: 0
                },
                add: function(score) {
                    switch(score) {
                    case 'va':
                        {
                            this.win.assassination++;
                            this.win.total++;
                            break;
                        }
                    case 'vc':
                        {
                            this.win.clock++;
                            this.win.total++;
                            break;
                        }
                    case 'vs':
                        {
                            this.win.scenario++;
                            this.win.total++;
                            break;
                        }
                    case 'dd':
                        {
                            this.draw.clock++;
                            this.draw.total++;
                            break;
                        }
                    case 'da':
                        {
                            this.loss.assassination++;
                            this.loss.total++;
                            break;
                        }
                    case 'dc':
                        {
                            this.loss.clock++;
                            this.loss.total++;
                            break;
                        }
                    case 'ds':
                        {
                            this.loss.scenario++;
                            this.loss.total++;
                            break;
                        }
                    }
                }
            };
        };
    }]).factory('stats', [
        'statEntry',
        function(statEntry) {
            return {
                refresh: function statsRefresh(battles, filter) {
                    var battle, i;
                    this.all = statEntry();
                    this.my_army = {
                        caster: {},
                        faction: {}
                    };
                    this.opponent = {
                        name: {},
                        faction: {},
                        caster: {}
                    };
                    this.event = {};
                    this.scenario = {};
                    for(i=0 ; i < battles.length ; i++) {
                        battle = battles[i];
                        
                        if(filter.match(battle)) {
                            
                            this.all.add(battle.score);
                            
                            var my_caster = battle.my_army.caster;
                            if(undefined === this.my_army.caster[my_caster]) {
                                this.my_army.caster[my_caster] = statEntry();
                            }
                            this.my_army.caster[my_caster].add(battle.score);
                            
                            var my_faction = battle.my_army.faction;
                            if(undefined === this.my_army.faction[my_faction]) {
                                this.my_army.faction[my_faction] = statEntry();
                            }
                            this.my_army.faction[my_faction].add(battle.score);
                            
                            var opp_name = battle.opponent.name;
                            if(undefined === this.opponent.name[opp_name]) {
                                this.opponent.name[opp_name] = statEntry();
                            }
                            this.opponent.name[opp_name].add(battle.score);
                            
                            var opp_faction = battle.opponent.faction;
                            if(undefined === this.opponent.faction[opp_faction]) {
                                this.opponent.faction[opp_faction] = statEntry();
                            }
                            this.opponent.faction[opp_faction].add(battle.score);
                            
                            var opp_caster = battle.opponent.caster;
                            if(undefined === this.opponent.caster[opp_caster]) {
                                this.opponent.caster[opp_caster] = statEntry();
                            }
                            this.opponent.caster[opp_caster].add(battle.score);
                            
                            var scenario = battle.setup.scenario;
                            if(undefined === this.scenario[scenario]) {
                                this.scenario[scenario] = statEntry();
                            }
                            this.scenario[scenario].add(battle.score);
                            
                            var event = battle.setup.event;
                            if(undefined === this.event[event]) {
                                this.event[event] = statEntry();
                            }
                            this.event[event].add(battle.score);
                            
                        }
                        
                    }
                }
            };
        }]);
