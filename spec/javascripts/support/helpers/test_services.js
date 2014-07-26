'use strict';

angular.module('jlogApp.test_services', ['jlogApp.services'])
  .factory('storage', function() {
    return jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'clear']);
  });
