'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.filters');
    module('jlogApp.services');
    module('jlogApp.controllers');
    module('ui.router');
  });

  describe('listViewCtrl', function() {

    var scope;
    var battle;
    var battles;
    var $state;

    beforeEach(inject([
      '$rootScope',
      '$controller',
      '$state',
      'battle',
      'battles',
      function($rootScope,
               $controller,
               _$state,
               _battle,
               _battles) {
        battle = _battle;
        battles = _battles;
        $state = _$state;

        spyOn($state, 'go');
        spyOn(battles, 'remove');

        scope = $rootScope.$new();
        scope.bottom_bar = {};
      }]));

    describe('when scope.battle is undefined', function() {

      beforeEach(inject([ '$controller', function($controller) {
        $controller('listViewCtrl', { '$scope': scope });
      }]));

      it('should go to "battle.list" state', function() {
        expect($state.go).toHaveBeenCalledWith('battle.list');
      });

    });

    describe('when scope.battle is defined', function() {

      beforeEach(inject([ '$controller', function($controller) {
        scope.battle = battle({});
        $controller('listViewCtrl', { '$scope': scope });
      }]));

      it('should initialize scope', function() {
        expect(angular.isFunction(scope.bottom_bar.onEditBattle)).toBeTruthy({});
        expect(angular.isFunction(scope.bottom_bar.onDeleteBattle)).toBeTruthy({});
      });

      describe('onEditBattle', function() {

        beforeEach(function() {
          scope.bottom_bar.onEditBattle();
        });

        it('should go to "battle.edit" state', function() {
          expect($state.go).toHaveBeenCalledWith('battle.edit');
        });

      });

      describe('onDeleteBattle', function() {

        var index = 1;
        var $window;

        beforeEach(inject([ '$window', function(_$window) {
          $window = _$window;

          scope.bottom_bar.onClose = jasmine.createSpy();
          spyOn($window, 'confirm');

          scope.battle_index = index;
        }]));

        it('should ask for confirmation', function() {
          scope.bottom_bar.onDeleteBattle();

          expect($window.confirm).toHaveBeenCalledWith('You sure you wanna delete this battle ?');
        });

        describe('when user does not confirm', function() {
          beforeEach(function() {
            $window.confirm.and.returnValue(false);

            scope.bottom_bar.onDeleteBattle();
          });

          it('should not remove index from battles', function() {
            expect(battles.remove).not.toHaveBeenCalled();
          })

          it('should not close battle view', function() {
            expect(scope.bottom_bar.onClose).not.toHaveBeenCalled();
          })

        });

        describe('when user confirms', function() {
          beforeEach(function() {
            $window.confirm.and.returnValue(true);

            scope.bottom_bar.onDeleteBattle();
          });

          it('should remove index from battles', function() {
            expect(battles.remove).toHaveBeenCalledWith(index);
          })

          it('should  close battle view', function() {
            expect(scope.bottom_bar.onClose).toHaveBeenCalled();
          })

        });

      });

    });

  });

});
