'use strict';

angular.module('grudgeApp.services')
    .value('sort_types', {
        date: {
            name: 'Date',
            key: ['date.year', 'date.month', 'date.day']
        },
        my_caster: {
            name: 'My caster',
            key: ['my_army.faction', 'my_army.caster']
        },
        opponent: {
            name: 'Opponent',
            key: 'opponent.name'
        },
        opp_caster: {
            name: 'Opp. caster',
            key: ['opponent.faction', 'opponent.caster']
        },
        scenario: {
            name: 'Scenario',
            key: 'setup.scenario'
        },
        size: {
            name: 'Size',
            key: 'setup.size'
        },
        event: {
            name: 'Event',
            key: 'setup.event'
        },
        result: {
            name: 'Result',
            key: 'score'
        }
    });

