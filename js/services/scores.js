'use strict';

angular.module('grudgeApp.services')
    .value('scores', {
        va: {
            result: 'victory',
            type: 'assassination'
        },
        vc: {
            result: 'victory',
            type: 'clock'
        },
        vs: {
            result: 'victory',
            type: 'scenario'
        },
        dd: {
            result: 'draw',
            type: 'dice down'
        },
        da: {
            result: 'defeat',
            type: 'assassination'
        },
        dc: {
            result: 'defeat',
            type: 'clock'
        },
        ds: {
            result: 'defeat',
            type: 'scenario'
        }
    });
