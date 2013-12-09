'use strict';

angular.module('grudgeApp.services')
    .value('battles', [
        {
            'date': {
                year: 2013,
                month: 10,
                day: 13
            },
            'my_army': {
                faction: 'loe',
                caster: 'vayl2'
            },
            'opponent': {
                name: 'kevin',
                faction: 'cryx',
                caster: 'gaspy2'
            },
            'setup': {
                size: 50,
                scenario: 'sr13poe',
                event: 'baf131020'
            },
            'score': 'da',
            'points': {
                my_army: {
                    scenario: 1,
                    army: 10
                },
                opponent: {
                    scenario: 3,
                    army: 35
                }
            },
            'comment': 'Cryx c\'est fume.'
        },
        {
            'date': {
                year: 2013,
                month: 10,
                day: 25
            },
            'my_army': {
                faction: 'loe',
                caster: 'kallus1'
            },
            'opponent': {
                name: 'wood',
                faction: 'scyrah',
                caster: 'rahn1'
            },
            'setup': {
                size: 35,
                scenario: 'sr13cr',
                event: 'amical'
            },
            'score': 'dd',
            'points': {
                my_army: {
                    scenario: 2,
                    army: 30
                },
                opponent: {
                    scenario: 2,
                    army: 30
                }
            }
        },
        {
            'date': {
                year: 2013,
                month: 10,
                day: 20
            },
            'my_army': {
                faction: 'loe',
                caster: 'vayl1'
            },
            'opponent': {
                name: 'fred',
                faction: 'skorne',
                caster: 'hexeris2'
            },
            'setup': {
                size: 50,
                scenario: 'sr13inco',
                event: 'amical'
            },
            'score': 'vs',
            'points': {
                my_army: {
                    scenario: 5,
                    army: 45
                },
                opponent: {
                    scenario: 0,
                    army: 20
                }
            }
        }
    ]);
