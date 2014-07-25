'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.services');
    module('jlogApp.controllers');
    console.log = jasmine.createSpy('log');
  });

  describe('mainCtrl', function() {

    var scope;
    var filter;

    beforeEach(inject([
      '$rootScope',
      '$controller',
      'filter',
      function($rootScope,
               $controller,
               _filter) {
        filter = _filter;
        spyOn(filter, 'clearCache');

        scope = $rootScope.$new();
        spyOn(scope, '$watch');
        $controller('filterEditCtrl', { '$scope': scope });
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
        expect(filter.clearCache).toHaveBeenCalled();
      });

    });

  });

});
