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
      '$window',
      function($rootScope,
               $controller,
               $window) {
        this.scope = $rootScope.$new();
        this.scope.stateGo = jasmine.createSpy('stateGo');
        this.scope.setBattles = jasmine.createSpy('setBattles');
        this.scope.battles = {
          display_list: ['battles_list']
        };

        this.stateParams = { index: '2' };
        this.window = $window;
        spyOn($window, 'confirm');
        this.battles = spyOnService('battles');

        $controller('listViewBottomCtrl', { 
          '$scope': this.scope,
          '$stateParams': this.stateParams
        });
        $rootScope.$digest();
      }
    ]));

    describe('doEditBattle()', function() {
      it('should go to batte view', function() {
        this.scope.doEditBattle();

        expect(this.scope.stateGo)
          .toHaveBeenCalledWith('battle.edit', { index: '2' });
      });
    });

    describe('doDeleteBattle()', function() {
      beforeEach(function() {
        spyOn(this.scope, 'doClose');
      });

      it('should ask for confirmation', function() {
        this.scope.doDeleteBattle();
        expect(this.window.confirm).toHaveBeenCalled();
      });

      when('user changes his mind', function() {
        this.window.confirm.and.returnValue(false);

        this.scope.doDeleteBattle();
      }, function() {
        it('shouldn\'t delete the battle', function() {
          expect(this.battles.drop).not.toHaveBeenCalled();
        });

        it('shouldn\'t close the view', function() {
          expect(this.scope.doClose).not.toHaveBeenCalled();
        });
      });

      when('user confirms', function() {
        this.window.confirm.and.returnValue(true);

        this.scope.doDeleteBattle();
      }, function() {
        it('should delete the battle', function() {
          expect(this.battles.drop)
            .toHaveBeenCalledWith(['battles_list'], 2);
          expect(this.scope.setBattles)
            .toHaveBeenCalledWith('battles.drop.returnValue');
        });

        it('should close the view', function() {
          expect(this.scope.doClose).toHaveBeenCalled();
        });
      });
    });

    describe('doClose()', function() {
      it('should go back to battle list', function() {
        this.scope.doClose();
        expect(this.scope.stateGo)
          .toHaveBeenCalledWith('battle');
      });
    });
  });

});
