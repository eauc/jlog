'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.services');
    module('jlogApp.controllers');
  });

  describe('filterEditCtrl', function() {

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        this.scope = $rootScope.$new();
          
        $controller('filterEditCtrl', { 
          '$scope': this.scope,
        });
        $rootScope.$digest();
      }
    ]));

  });

  describe('filterEditBottomCtrl', function() {

    beforeEach(inject([
      '$rootScope',
      '$controller',
      '$window',
      function($rootScope,
               $controller,
               $window) {
        this.scope = $rootScope.$new();
        this.scope.updateBattles = jasmine.createSpy('updateBattles');

        this.history = $window.history;
        spyOn($window.history, 'back');

        this.filterService = spyOnService('filter');

        $controller('filterEditBottomCtrl', { 
          '$scope': this.scope,
        });
        $rootScope.$digest();
      }
    ]));

    describe('doBack()', function() {
      beforeEach(function() {
        this.scope.battles = {
          filter: { cache: 'filter_cache',
                    active: false },
        };
      });

      it('should clear filter cache', function() {
        this.scope.doBack();

        expect(this.filterService.clearCache)
          .toHaveBeenCalledWith('filter_cache');
        expect(this.scope.battles.filter.cache)
          .toBe('filter.clearCache.returnValue');
      });

      it('should activate filter', function() {
        this.scope.doBack();

        expect(this.scope.battles.filter.active).toBe(true);
      });

      it('should update battles list', function() {
        this.scope.doBack();
        expect(this.scope.updateBattles).toHaveBeenCalled();
      });

      it('should go back to previous page', function() {
        this.scope.doBack();
        expect(this.history.back).toHaveBeenCalled();
      });
    });
  });

});
