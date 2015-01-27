'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.filters');
    module('jlogApp.services');
    module('jlogApp.controllers');
    module('jlogApp.test_services');
    module('ui.router');
    console.log = jasmine.createSpy('log');
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

    describe('when $stateParams.index is undefined', function() {

      beforeEach(inject([ '$controller', function($controller) {
        $controller('listViewCtrl', { '$scope': scope, '$stateParams': {} });
      }]));

      it('should go to "battle" state', function() {
        expect($state.go).toHaveBeenCalledWith('battle');
      });

    });

    describe('when $stateParams.index is defined', function() {

      beforeEach(inject([ '$controller', function($controller) {
        $controller('listViewCtrl', { '$scope': scope, '$stateParams': { index: 1 } });
      }]));

      it('should initialize scope', function() {
        expect(scope.battle).toBe(battles.list[1]);
      });

    });

  });

  describe('listViewBottomCtrl', function(c) {

    var scope;

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        c.state = jasmine.createSpyObj('state', ['go']);
        c.battles = jasmine.createSpyObj('battles', ['remove']);

        scope = $rootScope.$new();
        scope.resetListDisplay = jasmine.createSpy('resetListDisplay');

        $controller('listViewBottomCtrl', {
          '$scope': scope,
          '$stateParams': { index: 1 },
          '$state': c.state,
          'battles': c.battles
        });
      }]));

    describe('onEditBattle', function() {

      beforeEach(function() {
        scope.onEditBattle();
      });

      it('should go to "battle.edit" state', function() {
        expect(c.state.go).toHaveBeenCalledWith('battle.edit', { index: 1 });
      });

    });

    describe('onDeleteBattle', function() {

      beforeEach(inject([ '$window', function(_window) {
        c.index = 1;
        c.$window = _window;

        spyOn(scope, 'onClose');
      }]));

      it('should ask for confirmation', function() {
        scope.onDeleteBattle();

        expect(c.$window.confirm)
          .toHaveBeenCalledWith('You sure you wanna delete this battle ?');
      });

      describe('when user does not confirm', function() {
        beforeEach(function() {
          c.$window.confirm.and.returnValue(false);

          scope.onDeleteBattle();
        });

        it('should not remove index from battles', function() {
          expect(c.battles.remove).not.toHaveBeenCalled();
        });

        it('should not reset battle list display', function() {
          expect(scope.resetListDisplay).not.toHaveBeenCalled();
        });

        it('should not close battle view', function() {
          expect(scope.onClose).not.toHaveBeenCalled();
        });

      });

      describe('when user confirms', function() {
        beforeEach(function() {
          c.$window.confirm.and.returnValue(true);

          scope.onDeleteBattle();
        });

        it('should remove index from battles', function() {
          expect(c.battles.remove).toHaveBeenCalledWith(c.index);
        });

        it('should reset battle list display', function() {
          expect(scope.resetListDisplay).toHaveBeenCalled();
        });

        it('should  close battle view', function() {
          expect(scope.onClose).toHaveBeenCalled();
        });

      });

    });

  });

});
