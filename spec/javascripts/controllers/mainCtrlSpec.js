'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.filters');
    module('jlogApp.services');
    module('jlogApp.controllers');
    console.log = jasmine.createSpy('log');
  });

  describe('mainCtrl', function(c) {

    var scope;

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        c.timeout = jasmine.createSpy('$timeout');

        c.battles_display = jasmine.createSpyObj('battles_display',
                                                 ['init', 'create', 'reset', 'showMore']);
        c.opponents = jasmine.createSpyObj('opponents',
                                           ['init', 'create']);
        c.opponents.list = [];
        c.events = jasmine.createSpyObj('events',
                                        ['init', 'create']);
        c.events.list = [];
        c.scenarios = jasmine.createSpyObj('scenarios',
                                           ['init', 'create']);
        c.scenarios.list = [];
        c.tags = jasmine.createSpyObj('tags',
                                      ['init', 'create']);
        c.tags.list = [];
        c.filter = jasmine.createSpyObj('filter', ['init']);
        c.filter.list = [];
        c.battle_sort = {};
        c.scores = {};
        c.factions = {};

        scope = $rootScope.$new();
        spyOn(scope, '$on');

        $controller('mainCtrl', {
          '$scope': scope,
          '$timeout': c.timeout,
          '$state': null,
          'opponents': c.opponents,
          'scores': c.scores,
          'factions': c.factions,
          'events': c.events,
          'scenarios': c.scenarios,
          'tags': c.tags,
          'battles_display': c.battles_display,
          'battle_sort': c.battle_sort,
          'filter': c.filter
        });
      }]));

    it('should initialize services', function() {
      expect(c.battles_display.init).toHaveBeenCalled();
      expect(c.opponents.init).toHaveBeenCalled();
      expect(c.events.init).toHaveBeenCalled();
      expect(c.scenarios.init).toHaveBeenCalled();
      expect(c.tags.init).toHaveBeenCalled();
      expect(c.filter.init).toHaveBeenCalled();
    });

    it('should initialize scope', function() {
      expect(scope.battles).toBe(c.battles_display);
      expect(scope.factions).toBe(c.factions);
      expect(scope.sort).toBe(c.battle_sort);
      expect(scope.scores).toBe(c.scores);

      expect(scope.filter).toBe(c.filter.list);
      expect(scope.opponents).toBe(c.opponents.list);
      expect(scope.scenarios).toBe(c.scenarios.list);
      expect(scope.events).toBe(c.events.list);
      expect(scope.tags).toBe(c.tags.list);

      expect(scope.filter_state).toBeA('Object');
      expect(scope.filter_state.active).toBe(false);
      expect(scope.filter_state.invert).toBe(false);
      expect(scope.setFilterActive).toBeA('Function');
      expect(scope.setFilterInvert).toBeA('Function');

      expect(scope.bottom_bar.show).toBe(false);
    });

    describe('on newBattles', function(c) {

      beforeEach(function() {
        expect(scope.$on)
          .toHaveBeenCalledWith('newBattles', jasmine.any(Function));

        c.onNewBattles = scope.$on.calls.first().args[1];

        c.data = [];
        c.onNewBattles('', c.data);
      });

      it('should recreate all services lists', function() {
        expect(c.battles_display.create).toHaveBeenCalledWith(c.data);
        expect(c.opponents.create).toHaveBeenCalledWith(c.battles_display.list);
        expect(c.events.create).toHaveBeenCalledWith(c.battles_display.list);
        expect(c.scenarios.create).toHaveBeenCalledWith(c.battles_display.list);
        expect(c.tags.create).toHaveBeenCalledWith(c.battles_display.list);
      });

    });

    describe('resetListDisplay', function(c) {

      beforeEach(function() {
        c.battles_display.reset.calls.reset();
        c.timeout.calls.reset();

        scope.resetListDisplay();
      });

      it('should reset battles list display', function() {
        expect(c.battles_display.reset)
          .toHaveBeenCalledWith(scope.filter_state.active,
                                scope.filter_state.invert,
                                c.battle_sort);
      });

      it('should schedule timeout', function() {
        expect(c.timeout)
          .toHaveBeenCalledWith(jasmine.any(Function), 100);
      });

      describe('timeout', function(c) {

        beforeEach(function() {
          c.timeout_handler = c.timeout.calls.first().args[0];
        });

        it('should show more of the list', function() {
          c.timeout_handler();

          expect(c.battles_display.showMore).toHaveBeenCalled();
        });

        describe('when there is more in the list', function() {

          beforeEach(function() {
            scope.battles.more = true;
            c.timeout.calls.reset();

            c.timeout_handler();
          });

          it('should schedule new timeout', function() {
            expect(c.timeout).toHaveBeenCalledWith(c.timeout_handler, 100);
          });

        });

        describe('when there is no more left in the list', function() {

          beforeEach(function() {
            scope.battles.more = false;
            c.timeout.calls.reset();

            c.timeout_handler();
          });

          it('should stop timeout', function() {
            expect(c.timeout).not.toHaveBeenCalled();
          });

        });

      });

    });

    describe('setFilterActive(<new>)', function() {

      beforeEach(function() {
        spyOn(scope, 'resetListDisplay');
      });

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
          expect(scope.resetListDisplay).toHaveBeenCalled();
        });

      });

      describe('when active state does not change', function() {

        beforeEach(function() {
          scope.filter_state.active = false;
          scope.setFilterActive(false);
        });
        
        it('should not reset list display', function() {
          expect(scope.resetListDisplay).not.toHaveBeenCalled();
        });

      });

    });

    describe('setFilterInvert(<new>)', function() {

      beforeEach(function() {
        spyOn(scope, 'resetListDisplay');
      });

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
          expect(scope.resetListDisplay).toHaveBeenCalled();
        });

      });

      describe('when invert state does not change', function() {

        beforeEach(function() {
          scope.filter_state.invert = false;
          scope.setFilterInvert(false);
        });
        
        it('should not reset list display', function() {
          expect(scope.resetListDisplay).not.toHaveBeenCalled();
        });

      });

    });

  });

});
