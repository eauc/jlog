'use strict';

angular.module('jlogApp.services')
    .value('sort_types', {
        date: {
            name: 'Date',
            key: ['date.year', 'date.month', 'date.day', 'index']
        },
        my_caster: {
            name: 'My caster',
            key: ['my_army.faction', 'my_army.caster', 'index']
        },
        opponent: {
            name: 'Opponent',
            key: ['opponent.name', 'index']
        },
        opp_caster: {
            name: 'Opp. caster',
            key: ['opponent.faction', 'opponent.caster', 'index']
        },
        scenario: {
            name: 'Scenario',
            key: ['setup.scenario', 'index']
        },
        size: {
            name: 'Size',
            key: ['setup.size', 'index']
        },
        event: {
            name: 'Event',
            key: ['setup.event', 'index']
        },
        result: {
            name: 'Result',
            key: ['score', 'index']
        }
    })
    .factory('battle_sort', [
        'sort_types',
        function(sort_types) {
            return function() {
                return {
                    types: sort_types,
                    type: 'date',
                    reverse: true,
                    sortBy: function sortBy(type) {
                        if (this.type === type) {
                            this.reverse = !this.reverse;
                        }
                        else {
                            this.type = type;
                            this.reverse = false;
                        }
                    }
                };
        };
    }]);
