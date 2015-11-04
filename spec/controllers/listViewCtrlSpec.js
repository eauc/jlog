'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.services');
    module('jlogApp.directives');
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
          list: [ 'battle1','battle2','battle3','battle4','battle5' ],
          display_list: [ 'battle1','battle3','battle5' ]
        };
        this.scope.ready = true;
        
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
        this.scope.setBattles = jasmine.createSpy('setBattles');
        this.scope.battles = {
          list: ['battles_list'],
          display_list: ['display_list']
        };

        this.stateParams = { index: '2' };
        this.battlesService = spyOnService('battles');
        this.promptService = spyOnService('prompt');
        mockReturnPromise(this.promptService.prompt);

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
        expect(this.promptService.prompt)
          .toHaveBeenCalledWith('confirm', jasmine.any(String));
      });

      when('user changes his mind', function() {
        this.scope.doDeleteBattle();

        this.promptService.prompt.reject();
      }, function() {
        it('shouldn\'t delete the battle', function() {
          expect(this.battlesService.drop).not.toHaveBeenCalled();
        });

        it('shouldn\'t close the view', function() {
          expect(this.scope.doClose).not.toHaveBeenCalled();
        });
      });

      when('user confirms', function() {
        this.scope.doDeleteBattle();

        this.promptService.prompt.resolve();
      }, function() {
        it('should delete the battle', function() {
          expect(this.battlesService.drop)
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
