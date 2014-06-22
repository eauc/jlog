'use strict';

angular.module('jlogApp.services')
  .factory('storage', [
    '$window',
    function($window) {
      return $window.localStorage;
    }]);
