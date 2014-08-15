'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.services');
    module('jlogApp.controllers');
    console.log = jasmine.createSpy('log');
  });

  describe('filterCtrl', function(c) {

    var scope;

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        c.filter = jasmine.createSpyObj('filter', ['clearCache', 'update']);

        scope = $rootScope.$new();
        spyOn(scope, '$watch');
        $controller('filterEditCtrl', {
          '$scope': scope,
          'filter': c.filter
        });
      }]));

    it('should watch filter', function() {
      expect(scope.$watch)
        .toHaveBeenCalledWith('filter', jasmine.any(Function), true);
    });

    describe('filter watch', function() {

      beforeEach(function() {
        var watcher = scope.$watch.calls.first().args[1];

        watcher();
      });

      it('should clear filter cache', function() {
        expect(c.filter.clearCache).toHaveBeenCalled();
      });

      it('should update filter in local storage', function() {
        expect(c.filter.update).toHaveBeenCalled();
      });

    });

  });

});
