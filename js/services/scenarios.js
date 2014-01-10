'use strict';

angular.module('jlogApp.services')
    .value('default_scenarios', {
        sr13des: {
            name: 'SR13 Destruction'
        },
        sr13sad: {
            name: 'SR13 Supply & Demand'
        },
        sr13cq: {
            name: 'SR13 Close Quarters'
        },
        sr13ar: {
            name: 'SR13 Ammunition Run'
        },
        sr13incu: {
            name: 'SR13 Incursion'
        },
        sr13cr: {
            name: 'SR13 Chemical Reaction'
        },
        sr13out: {
            name: 'SR13 Outflank'
        },
        sr13inco: {
            name: 'SR13 Incoming'
        },
        sr13itb: {
            name: 'SR13 Into the Breach'
        },
        sr13rp: {
            name: 'SR13 Rally Point'
        },
        sr13poe: {
            name: 'SR13 Process of elimination'
        },
        sr13fs: {
            name: 'SR13 Fire Support'
        }
    })
    .service('scenarios', [
        'default_scenarios',
        function(default_scenarios) {
            var storage_scenarios_key = 'jlog_scenarios';
            var store = function scenariosStore(list) {
                console.log('save scenarios in localStorage');
                localStorage[storage_scenarios_key] = JSON.stringify(list);
            };
            var load = function scenariosLoad() {
                console.log('load scenarios from localStorage');
                return JSON.parse(localStorage[storage_scenarios_key]);
            };
            var storageContainsScenarios = function scenariosStorageContainsScenarios() {
                return 'string' === typeof localStorage[storage_scenarios_key];
            };
            var build = function scenariosBuild(battles) {
                var i, temp = default_scenarios;
                for(i = 0 ; i < battles.length ; i++) {
                    if(undefined === temp[battles[i].setup.scenario]) {
                        temp[battles[i].setup.scenario] = {
                            name: battles[i].setup.scenario
                        }
                    }
                }
                return temp;
            };
            return {
                create: function scenariosCreate(battles) {
                    var list = build(battles);
                    store(list);
                    return list;
                },
                init: function scenariosInit(battles) {
                    if(storageContainsScenarios()) {
                        return load();
                    }
                    else {
                        return this.create(battles);
                    }
                }
            };
        }]);
