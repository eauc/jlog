'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.services');
    module('jlogApp.controllers');
    console.log = jasmine.createSpy('log');
  });

  describe('filterEditCtrl', function(c) {

    var scope;

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        c.filter = jasmine.createSpyObj('filter', ['clearCache', 'update']);
        c.state = jasmine.createSpyObj('$state', ['go']);

        scope = $rootScope.$new();
        spyOn(scope, '$watch');
        scope.bottom_bar = { show: null };

        $controller('filterEditCtrl', {
          '$scope': scope,
          'filter': c.filter
        });
      }]));

    it('should initialise scope', function() {
      expect(scope.bottom_bar.show).toBe(true);
    });

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

  describe('filterEditBottomCtrl', function(c) {

    var scope;

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        c.state = jasmine.createSpyObj('$stata', ['go']);

        scope = $rootScope.$new();
        scope.filter_state = {
          previous: 'toto'
        };

        $controller('filterEditBottomCtrl', {
          '$scope': scope,
          '$state': c.state,
          'filter': c.filter
        });
      }]));

    describe('onBack()', function() {

      it('should go to previous page', function() {
        scope.onBack();

        expect(c.state.go).toHaveBeenCalledWith('toto');
      });

    });

  });

});
