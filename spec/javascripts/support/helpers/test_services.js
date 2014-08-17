'use strict';

angular.module('jlogApp.test_services', ['jlogApp.services'])
  .factory('$window', function() {
    return {
      applicationCache: jasmine.createSpyObj('applicationCache', [
        'addEventListener'
      ]),
      confirm: jasmine.createSpy('window.confirm')
    };
  });
