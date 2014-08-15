'use strict';

angular.module('jlogApp.filters')
  .filter('scoreResultColor', [function() {

    return function(input) 
    {
      return typeof(input) !== 'string' ? '' : 
        ((input == 'victory') ? 'text-success' : 
         ((input == 'defeat') ? 'text-danger' : 
          'text-warning'));
    };

  }])
  .filter('scoreTypeLetter', [function() {

    return function(input) 
    {
      return typeof(input) === 'string' ? input.charAt(0).toUpperCase() : input;
    };

  }])
  .filter('scoreType', [function() {

    return function(input) 
    {
      switch(input) {
      case 'va':
        return 'Assassination Victory';
      case 'vs':
        return 'Scenario Victory';
      case 'vc':
        return 'Clock Victory';
      case 'vt':
        return 'Tiebreaker Victory';
      case 'dd':
        return 'Dice-down Draw';
      case 'da':
        return 'Assassination Defeat';
      case 'ds':
        return 'Scenario Defeat';
      case 'dc':
        return 'Clock Defeat';
      case 'dt':
        return 'Tiebreaker Defeat';
      }
      return '';
    };

  }]);
