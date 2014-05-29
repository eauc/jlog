'use strict';

angular.module('jlogApp.services')
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
    vt: {
      result: 'victory',
      type: 'tiebreaker'
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
    },
    dt: {
      result: 'defeat',
      type: 'tiebreaker'
    }
  });
