'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.filters');
    module('jlogApp.services');
    module('jlogApp.controllers');
    module('ui.router');
    console.log = jasmine.createSpy('log');
  });

  describe('listCtrl', function() {

    var scope;

    var $state;
    var $timeout;
    var scenarios;

    function itShouldResetListDisplay() {
      it('should reset battles list display', function() {
        expect(scope.battles.reset)
          .toHaveBeenCalledWith(scope.filter_state.active,
                                scope.filter_state.invert,
                                scope.sort);
      });

      it('should schedule timeout', function() {
        expect($timeout)
          .toHaveBeenCalledWith(jasmine.any(Function), 100);
      });

      describe('timeout', function(c) {

        beforeEach(function() {
          c.timeout = $timeout.calls.first().args[0];
        });

        it('should show more of the list', function() {
          c.timeout();

          expect(scope.battles.showMore).toHaveBeenCalled();
        });

        describe('when there is more in the list', function() {

          beforeEach(function() {
            scope.battles.more = true;
            $timeout.calls.reset();

            c.timeout();
          });

          it('should schedule new timeout', function() {
            expect($timeout).toHaveBeenCalledWith(c.timeout, 100);
          });

        });

        describe('when there is no more left in the list', function() {

          beforeEach(function() {
            scope.battles.more = false;
            $timeout.calls.reset();

            c.timeout();
          });

          it('should stop timeout', function() {
            expect($timeout).not.toHaveBeenCalled();
          });

        });

      });
    }

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
        $state.current.data = {};
        $timeout = jasmine.createSpy();
        scenarios = _scenarios;

        spyOn($state, 'go');

        scope = $rootScope.$new();
        spyOn(scope, '$on');
        spyOn(scope, '$watch');

        scope.battles = jasmine.createSpyObj('battles', ['reset', 'showMore']);
        scope.filter = 'filter';
        scope.filter_state = {
          active: 'filter_active',
          invert: 'filter_invert'
        };
        scope.sort = 'sort';

        $controller('listCtrl', { '$scope': scope, '$timeout': $timeout });
      }]));

    it('should initialize scope and state data', function() {
      expect(scope.show_list).toBe(true);
      expect(scope.onViewBattle).toBeA('Function');

      expect($state.current.data.resetListDisplay).toBeA('Function');
    });

    it('should watch state', function() {
      expect(scope.$on)
        .toHaveBeenCalledWith('$stateChangeSuccess', jasmine.any(Function));
    });

    describe('state watch', function(c) {

      beforeEach(function() {
        c.state_watcher = scope.$on.calls.first().args[1];
      });

      it('should show list in "battle" state', function() {
        c.state_watcher('', { name: 'battle' });
        expect(scope.show_list).toBe(true);
      });

      it('should not show list in other states', function() {
        c.state_watcher('', { name: 'battle.edit' });
        expect(scope.show_list).toBe(false);

        c.state_watcher('', { name: 'battle.view' });
        expect(scope.show_list).toBe(false);
      });

    });

    itShouldResetListDisplay();

    it('should watch sort service', function() {
      expect(scope.$watch)
        .toHaveBeenCalledWith('sort', jasmine.any(Function), true);
    });

    describe('sort watch', function(c) {

      beforeEach(function() {
        $timeout.calls.reset();
        scope.battles.reset.calls.reset();

        c.watcher = scope.$watch.calls.first().args[1];
        c.watcher();
      });

      itShouldResetListDisplay();

    });

    describe('resetListDisplay', function(c) {

      beforeEach(function() {
        scope.battles.reset.calls.reset();
        $timeout.calls.reset();

        $state.current.data.resetListDisplay();
      });

      itShouldResetListDisplay();

    });

    describe('onViewBattle', function(c) {

      beforeEach(function() {
        c.index = 1;
        scope.onViewBattle(c.index);
      });

      it('should go to battle.view state', function() {
        expect($state.go)
          .toHaveBeenCalledWith('battle.view', { index: c.index });
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
        $state.current.data = jasmine.createSpyObj('data', ['resetListDisplay']);

        scope = $rootScope.$new();
        scope.filter_state = {
          active: false,
          invert: false
        };
        $controller('listBottomCtrl', { '$scope': scope, '$timeout': $timeout });
      }]));

    it('should initialize scope', function() {
      expect(scope.onAddBattle).toBeA('Function');
      expect(scope.setFilterActive).toBeA('Function');
      expect(scope.setFilterInvert).toBeA('Function');
    });

    describe('onAddBattle', function() {

      beforeEach(function() {
        scope.onAddBattle();
      });

      it('should go to "battle.edit" state', function() {
        expect($state.go).toHaveBeenCalledWith('battle.edit', { index: -1 });
      });

    });

    describe('setFilterActive(<new>)', function() {

      it('should set scope.filter_state.active', function() {
        scope.setFilterActive(true);
        expect(scope.filter_state.active).toBe(true);

        scope.setFilterActive(false);
        expect(scope.filter_state.active).toBe(false);
      });

      describe('when active state changes', function() {

        beforeEach(function() {
          scope.filter_state.active = false;
          scope.setFilterActive(true);
        });
        
        it('should reset list display', function() {
          expect($state.current.data.resetListDisplay)
            .toHaveBeenCalled();
        });

      });

      describe('when active state does not change', function() {

        beforeEach(function() {
          scope.filter_state.active = false;
          scope.setFilterActive(false);
        });
        
        it('should not reset list display', function() {
          expect($state.current.data.resetListDisplay)
            .not.toHaveBeenCalled();
        });

      });

    });

    describe('setFilterInvert(<new>)', function() {

      it('should set scope.filter_state.invert', function() {
        scope.setFilterInvert(true);
        expect(scope.filter_state.invert).toBe(true);

        scope.setFilterInvert(false);
        expect(scope.filter_state.invert).toBe(false);
      });

      describe('when invert state changes', function() {

        beforeEach(function() {
          scope.filter_state.invert = false;
          scope.setFilterInvert(true);
        });
        
        it('should reset list display', function() {
          expect($state.current.data.resetListDisplay)
            .toHaveBeenCalled();
        });

      });

      describe('when invert state does not change', function() {

        beforeEach(function() {
          scope.filter_state.invert = false;
          scope.setFilterInvert(false);
        });
        
        it('should not reset list display', function() {
          expect($state.current.data.resetListDisplay)
            .not.toHaveBeenCalled();
        });

      });

    });

  });

});
