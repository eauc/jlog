'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.services');
    module('jlogApp.controllers');
  });

  describe('filterEditCtrl', function(c) {

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

  describe('filterEditBottomCtrl', function(c) {

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

        $controller('filterEditBottomCtrl', { 
          '$scope': this.scope,
        });
        $rootScope.$digest();
      }
    ]));

    describe('doBack()', function() {
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
