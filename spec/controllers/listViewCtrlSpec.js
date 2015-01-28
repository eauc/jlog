'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.services');
    module('jlogApp.controllers');
  });

  describe('listViewCtrl', function(c) {

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        this.scope = $rootScope.$new();
        this.scope.stateGo = jasmine.createSpy('stateGo');
        this.scope.battles = {
          display_list: [ 'battle1','battle2','battle3','battle4','battle5' ]
        };

        this.stateParams = { index: 2 };

        $controller('listViewCtrl', { 
          '$scope': this.scope,
          '$stateParams': this.stateParams
        });
        $rootScope.$digest();
      }
    ]));

    it('should init battle', function() {
      expect(this.scope.battle).toBe('battle3');
    });
  });

  describe('listViewBottomCtrl', function(c) {

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        this.scope = $rootScope.$new();
        this.scope.stateGo = jasmine.createSpy('stateGo');

        $controller('listViewBottomCtrl', { 
          '$scope': this.scope,
        });
        $rootScope.$digest();
      }
    ]));

    describe('doClose()', function() {
      it('should go back to battle list', function() {
        this.scope.doClose();
        expect(this.scope.stateGo)
          .toHaveBeenCalledWith('battle');
      });
    });
  });

});
