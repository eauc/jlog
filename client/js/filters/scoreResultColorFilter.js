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

  }]);
