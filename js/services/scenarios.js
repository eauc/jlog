'use strict';

angular.module('jlogApp.services')
    .factory('scenarios', [function() {
        return function(battles) {
            var i, temp = {
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
            };
            for(i = 0 ; i < battles.length ; i++) {
                if(undefined === temp[battles[i].setup.scenario]) {
                    temp[battles[i].setup.scenario] = {
                        name: battles[i].setup.scenario
                    }
                }
            }
            return temp;
        }
    }]);
