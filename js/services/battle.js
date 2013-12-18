'use strict';

angular.module('jlogApp.services')
    .factory('battle', [function() {
        var dateIsValid = function dateIsValid(date) {
            return angular.isObject(date)
                && typeof(date.year) === 'number'
                && date.year > 1999
                && date.year < 2050
                && typeof(date.month) === 'number'
                && date.month > 0
                && date.month < 13
                && typeof(date.day) === 'number'
                && date.day > 0
                && date.day < 32;
        };
        var myArmyIsValid = function myArmyIsValid(my_army) {
            return angular.isObject(my_army)
                && typeof(my_army.faction) === 'string'
                && my_army.faction.length > 0
                && typeof(my_army.caster) === 'string'
                && my_army.caster.length > 0;
        };
        var opponentIsValid = function opponentIsValid(opponent) {
            return angular.isObject(opponent)
                && typeof(opponent.name) === 'string'
                && opponent.name.length > 0
                && typeof(opponent.faction) === 'string'
                && opponent.faction.length > 0
                && typeof(opponent.caster) === 'string'
                && opponent.caster.length > 0;
        };
        var scoreIsValid = function scoreIsValid(score) {
            return typeof(score) === 'string'
                && score.length > 0;
        };
        return {
            create: function battleCreate() {
                var today = new Date();
                return {
                    'date': {
                        year: today.getFullYear(),
                        month: today.getMonth()+1,
                        day: today.getDate()
                    }
                };
            },
            isValid: function battleIsValid(battle) {
                return dateIsValid(battle.date)
                    && myArmyIsValid(battle.my_army)
                    && opponentIsValid(battle.opponent)
                    && scoreIsValid(battle.score);
            }
        };
    }])
    .value('battles', [
//         {
//             'date': {
//                 year: 2013,
//                 month: 10,
//                 day: 13
//             },
//             'my_army': {
//                 faction: 'loe',
//                 caster: 'vayl2'
//             },
//             'opponent': {
//                 name: 'kevin',
//                 faction: 'cryx',
//                 caster: 'gaspy2'
//             },
//             'setup': {
//                 size: 50,
//                 scenario: 'sr13poe',
//                 event: 'baf131020'
//             },
//             'score': 'da',
//             'points': {
//                 my_army: {
//                     scenario: 1,
//                     army: 10
//                 },
//                 opponent: {
//                     scenario: 3,
//                     army: 35
//                 }
//             },
//             'comment': 'Cryx c\'est fume.'
//         },
//         {
//             'date': {
//                 year: 2013,
//                 month: 10,
//                 day: 25
//             },
//             'my_army': {
//                 faction: 'loe',
//                 caster: 'kallus1'
//             },
//             'opponent': {
//                 name: 'wood',
//                 faction: 'scyrah',
//                 caster: 'rahn1'
//             },
//             'setup': {
//                 size: 35,
//                 scenario: 'sr13cr',
//                 event: 'amical'
//             },
//             'score': 'dd',
//             'points': {
//                 my_army: {
//                     scenario: 2,
//                     army: 30
//                 },
//                 opponent: {
//                     scenario: 2,
//                     army: 30
//                 }
//             }
//         },
//         {
//             'date': {
//                 year: 2013,
//                 month: 10,
//                 day: 20
//             },
//             'my_army': {
//                 faction: 'loe',
//                 caster: 'vayl1'
//             },
//             'opponent': {
//                 name: 'fred',
//                 faction: 'skorne',
//                 caster: 'hexeris2'
//             },
//             'setup': {
//                 size: 50,
//                 scenario: 'sr13inco',
//                 event: 'amical'
//             },
//             'score': 'vs',
//             'points': {
//                 my_army: {
//                     scenario: 5,
//                     army: 45
//                 },
//                 opponent: {
//                     scenario: 0,
//                     army: 20
//                 }
//             }
//         }
    ]);
