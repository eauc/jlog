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

    var $state;
    var $timeout;
    var scenarios;

    beforeEach(inject([
      '$rootScope',
      '$controller',
      '$state',
      'scenarios',
      function($rootScope,
               $controller,
               _$state,
               _scenarios) {
        $state = _$state;
        $timeout = jasmine.createSpy();
        scenarios = _scenarios;

        spyOn($state, 'go');

        scope = $rootScope.$new();
        spyOn(scope, '$on');
        spyOn(scope, '$watch');

        scope.battles = jasmine.createSpyObj('battles', ['reset', 'showMore']);
        scope.filter = 'filter';
        scope.filter_active = 'filter_active';
        scope.filter_invert = 'filter_invert';
        scope.sort = 'sort';

        $controller('listCtrl', { '$scope': scope, '$timeout': $timeout });
      }]));

    it('should initialize scope', function() {
      expect(scope.scenarios).toBe(scenarios.list);
      expect(scope.show_list).toBe(true);

      expect(angular.isFunction(scope.onViewBattle)).toBeTruthy({});
    });

    it('should watch state', function() {
      expect(scope.$on)
        .toHaveBeenCalledWith('$stateChangeSuccess', jasmine.any(Function));
    });

    describe('state watch', function() {

      var state_watcher;

      beforeEach(function() {
        state_watcher = scope.$on.calls.first().args[1];
      });

      it('should show list in "battle" state', function() {
        state_watcher('', { name: 'battle' });
        expect(scope.show_list).toBe(true);
      });

      it('should not show list in other states', function() {
        state_watcher('', { name: 'battle.edit' });
        expect(scope.show_list).toBe(false);

        state_watcher('', { name: 'battle.view' });
        expect(scope.show_list).toBe(false);
      });

    });

    it('should reset battles list display', function() {
      expect(scope.battles.reset)
        .toHaveBeenCalledWith(scope.filter,
                              scope.filter_active,
                              scope.filter_invert,
                              scope.sort);
    });

    it('should schedule timeout', function() {
      expect($timeout)
        .toHaveBeenCalledWith(jasmine.any(Function), 100);
    });

    describe('timeout', function() {

      var timeout;

      beforeEach(function() {
        timeout = $timeout.calls.first().args[0];
      });

      it('should show more of the list', function() {
        timeout();

        expect(scope.battles.showMore).toHaveBeenCalled();
      });

      describe('when there is more in the list', function() {

        beforeEach(function() {
          scope.battles.more = true;

          $timeout.calls.reset();

          timeout();
        });

        it('should schedule new timeout', function() {
          expect($timeout).toHaveBeenCalledWith(timeout, 100);
        });

      });

      describe('when there is no more left in the list', function() {

        beforeEach(function() {
          scope.battles.more = false;

          $timeout.calls.reset();

          timeout();
        });

        it('should stop timeout', function() {
          expect($timeout).not.toHaveBeenCalled();
        });

      });

    });

    it('should watch sort service', function() {
      expect(scope.$watch)
        .toHaveBeenCalledWith('sort', jasmine.any(Function), true);
    });

    describe('sort watch', function() {

      var timeout;
      var watcher;

      beforeEach(function() {
        timeout = $timeout.calls.first().args[0];
        $timeout.calls.reset();
        scope.battles.reset.calls.reset();

        watcher = scope.$watch.calls.first().args[1];

        watcher();
      });

      it('should reset display list', function() {
        expect(scope.battles.reset)
          .toHaveBeenCalledWith(scope.filter,
                                scope.filter_active,
                                scope.filter_invert,
                                scope.sort);
      });

      it('should schedule timeout', function() {
        expect($timeout)
          .toHaveBeenCalledWith(timeout, 100);
      });

    });

    describe('onViewBattle', function() {

      var index = 1;

      beforeEach(function() {
        scope.onViewBattle(index);
      });

      it('should go to battle.view state', function() {
        expect($state.go)
          .toHaveBeenCalledWith('battle.view', { index: index });
      });

    });

  });

  describe('listBottomCtrl', function() {

    var scope;

    var $state;
    var $timeout;
    var scenarios;

    beforeEach(inject([
      '$rootScope',
      '$controller',
      '$state',
      function($rootScope,
               $controller,
               _$state) {
        $state = _$state;
        spyOn($state, 'go');

        scope = $rootScope.$new();
        $controller('listBottomCtrl', { '$scope': scope, '$timeout': $timeout });
      }]));

    describe('onAddBattle', function() {

      beforeEach(function() {
        scope.onAddBattle();
      });

      it('should go to "battle.edit" state', function() {
        expect($state.go).toHaveBeenCalledWith('battle.edit', { index: -1 });
      });

    });

  });

});
