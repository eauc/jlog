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
    }]).factory('statCollection', [
        'statEntry',
        function(statEntry) {
            function dummyRefresh() {};
            function refreshAll(battle) {
                if(undefined === this.all.win) {
                    this.all = statEntry();
                }
                this.all.add(battle.score);
            };
            function refreshMyFaction(battle) {
                var my_faction = battle.my_army.faction;
                if(undefined === this.my_army.faction[my_faction]) {
                    this.my_army.faction[my_faction] = statEntry();
                }
                this.my_army.faction[my_faction].add(battle.score);
            };
            function refreshMyCaster(battle) {
                var my_faction = battle.my_army.faction;
                var my_caster = battle.my_army.caster;
                if(undefined === this.my_army.caster[my_caster]) {
                    this.my_army.caster[my_caster] = statEntry();
                    this.my_army.caster[my_caster].faction = my_faction;
                }
                this.my_army.caster[my_caster].add(battle.score);
            };
            function refreshOppName(battle) {
                var opp_name = battle.opponent.name;
                if(undefined === this.opponent.name[opp_name]) {
                    this.opponent.name[opp_name] = statEntry();
                }
                this.opponent.name[opp_name].add(battle.score);
            };
            function refreshOppFaction(battle) {
                var opp_faction = battle.opponent.faction;
                if(undefined === this.opponent.faction[opp_faction]) {
                    this.opponent.faction[opp_faction] = statEntry();
                }
                this.opponent.faction[opp_faction].add(battle.score);
            };
            function refreshOppCaster(battle) {
                var opp_faction = battle.opponent.faction;
                var opp_caster = battle.opponent.caster;
                if(undefined === this.opponent.caster[opp_caster]) {
                    this.opponent.caster[opp_caster] = statEntry();
                    this.opponent.caster[opp_caster].faction = opp_faction;
                }
                this.opponent.caster[opp_caster].add(battle.score);
            };
            function refreshScenario(battle) {
                var scenario = battle.setup.scenario;
                if(undefined === this.scenario[scenario]) {
                    this.scenario[scenario] = statEntry();
                }
                this.scenario[scenario].add(battle.score);
            };
            function refreshEvent(battle) {
                var event = battle.setup.event;
                if(undefined === this.event[event]) {
                    this.event[event] = statEntry();
                }
                this.event[event].add(battle.score);
            };
            function isEmpty(object) {
                var key;
                for(key in object) {
                    if(object.hasOwnProperty(key)) return false;
                }
                return true;
            };
            return function() {
                return {
                    all: {},
                    my_army: {
                        caster: {},
                        faction: {}
                    },
                    opponent: {
                        name: {},
                        faction: {},
                        caster: {}
                    },
                    event: {},
                    scenario: {},
                    reset: function statCollectionReset() {
                        this.all = {};
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
                    },
                    refresh: function statCollectionRefresh(battles, filter, show) {
                        var battle, i;
                        
                        this.refreshAll = (show.all && 
                                           undefined === this.all.win) ? 
                            refreshAll : dummyRefresh;
                        this.refreshMyFaction = (show.my_army.faction && 
                                                 isEmpty(this.my_army.faction)) ? 
                            refreshMyFaction : dummyRefresh;
                        this.refreshMyCaster = (show.my_army.caster &&
                                                isEmpty(this.my_army.caster)) ?
                            refreshMyCaster : dummyRefresh;
                        this.refreshOppName = (show.opponent.name &&
                                               isEmpty(this.opponent.name)) ?
                            refreshOppName : dummyRefresh;
                        this.refreshOppFaction = (show.opponent.faction &&
                                                  isEmpty(this.opponent.faction)) ?
                            refreshOppFaction : dummyRefresh;
                        this.refreshOppCaster = (show.opponent.caster &&
                                                 isEmpty(this.opponent.caster)) ? 
                            refreshOppCaster : dummyRefresh;
                        this.refreshScenario = (show.scenario &&
                                                isEmpty(this.scenario)) ?
                            refreshScenario : dummyRefresh;
                        this.refreshEvent = (show.event &&
                                             isEmpty(this.event)) ?
                            refreshEvent : dummyRefresh;

                        for(i = 0 ; i < battles.length ; i++) {
                            battle = battles[i];
                            
                            if(filter.match(battle)) {

                                this.refreshAll(battle);                            
                                this.refreshMyFaction(battle);                            
                                this.refreshMyCaster(battle);                            
                                this.refreshOppName(battle);                            
                                this.refreshOppFaction(battle);                            
                                this.refreshOppCaster(battle);                            
                                this.refreshScenario(battle);                            
                                this.refreshEvent(battle);                            
                                
                            }

                        }

                    }
                }
            };
        }]).factory('stats', [
            'statCollection',
            function(statCollection) {
                var dummy_filter = {
                    match: function() {
                        return true;
                    }
                };
                return {
                    show: {
                        all: false,
                        my_army: {
                            caster: false,
                            faction: false,
                            casters: {},
                            factions: {}
                        },
                        opponent: {
                            name: false,
                            caster: false,
                            faction: false,
                            names: {},
                            casters: {},
                            factions: {}
                        },
                        event: false,
                        events: {},
                        scenario: false,
                        scenarios: {},
                    },
                    raw: statCollection(),
                    filtered: statCollection(),
                    reset: function statsReset() {
                        this.raw.reset();
                        this.filtered.reset();
                    },
                    refresh: function statsRefresh(battles, filter, active) {
                        this.active = active ? this.filtered : this.raw;
                        var active_filter = active ? filter : dummy_filter;
                        this.active.refresh(battles, active_filter, this.show);
                    }
                };
            }]);

