'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.filters');
    module('jlogApp.services');
    module('jlogApp.controllers');
    module('ui.router');
  });

  describe('listCtrl', function() {

    var scope;
    var battle;
    var $state;

    beforeEach(inject([
      '$rootScope',
      '$controller',
      '$state',
      'battle',
      function($rootScope,
               $controller,
               _$state,
               _battle) {
        battle = _battle;
        $state = _$state;

        spyOn($state, 'go');

        scope = $rootScope.$new();
        scope.bottom_bar = {};
        $controller('listCtrl', { '$scope': scope });
      }]));

    it('should initialize scope', function() {
      expect(angular.isFunction(scope.bottom_bar.onAddBattle)).toBeTruthy({});
      expect(angular.isFunction(scope.bottom_bar.onClose)).toBeTruthy({});

      expect(angular.isFunction(scope.onViewBattle)).toBeTruthy({});
    });

    describe('onAddBattle', function() {

      beforeEach(function() {
        scope.bottom_bar.onAddBattle();
      });

      it('should go to "battle.edit" state', function() {
        expect($state.go).toHaveBeenCalledWith('battle.edit');
      });

    });

    describe('onViewBattle', function() {

      var index = 1;

      beforeEach(function() {
        scope.battles = {
          list: [ {}, {}, {} ]
        };
        scope.onViewBattle(index);
      });

      it('should initialise scope.battle & battle_index', function() {
        expect(scope.battle).toBe(scope.battles.list[index]);
        expect(scope.battle_index).toBe(index);
      });

      it('should go to "battle.view" state', function() {
        expect($state.go).toHaveBeenCalledWith('battle.view');
      });

    });

    describe('onClose', function() {

      beforeEach(function() {
        scope.battle = {};
        scope.bottom_bar.onClose();
      });

      it('should reset scope.battle', function() {
        expect(scope.battle).toBe(undefined);
      });

      it('should go to "battle.list" state', function() {
        expect($state.go).toHaveBeenCalledWith('battle.list');
      });

    });

  });

});
