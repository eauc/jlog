'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.filters');
    module('jlogApp.services');
    module('jlogApp.controllers');
    module('ui.router');
    console.log = jasmine.createSpy('log');
  });

  describe('listCtrl', function(c) {

    var scope;
    
    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        c.state = jasmine.createSpyObj('$state', ['go']);

        scope = $rootScope.$new();
        spyOn(scope, '$on');
        spyOn(scope, '$watch');
        scope.resetListDisplay = jasmine.createSpy('resetListDisplay');

        $controller('listCtrl', {
          '$scope': scope,
          '$state': c.state
        });
      }
    ]));

    it('should initialize scope and state data', function() {
      expect(scope.show_list).toBe(true);
      expect(scope.onViewBattle).toBeA('Function');
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

    it('should reset list display', function() {
      expect(scope.resetListDisplay).toHaveBeenCalled();
    });

    it('should watch sort service', function() {
      expect(scope.$watch)
        .toHaveBeenCalledWith('sort', jasmine.any(Function), true);
    });

    describe('sort watch', function(c) {

      beforeEach(function() {
        scope.resetListDisplay.calls.reset();

        c.watcher = scope.$watch.calls.first().args[1];
        c.watcher();
      });

      it('should reset list display', function() {
        expect(scope.resetListDisplay).toHaveBeenCalled();
      });

    });

    describe('onViewBattle', function(c) {

      beforeEach(function() {
        c.index = 1;
        scope.onViewBattle(c.index);
      });

      it('should go to battle.view state', function() {
        expect(c.state.go)
          .toHaveBeenCalledWith('battle.view', { index: c.index });
      });

    });

  });

  describe('listBottomCtrl', function(c) {

    var scope;

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
      
        c.state = jasmine.createSpyObj('$state', ['go']);
        c._export = jasmine.createSpyObj('export', ['generate']);
        c.battles_display = { sorted_list: [] };

        scope = $rootScope.$new();
        scope.filter_state = {
          active: false,
          invert: false
        };
        scope.drop_down = {
          toggle: function() {}
        };
        $controller('listBottomCtrl', {
          '$scope': scope,
          '$state': c.state,
          'export': c._export,
          'battles_display': c.battles_display
        });
      }
    ]));

    it('should initialize scope', function() {
      expect(scope.onAddBattle).toBeA('Function');
      expect(scope.onExportOpen).toBeA('Function');

      expect(scope['export']).toBe(c._export);
    });

    describe('onAddBattle', function() {

      beforeEach(function() {
        scope.onAddBattle();
      });

      it('should go to "battle.edit" state', function() {
        expect(c.state.go).toHaveBeenCalledWith('battle.edit',
                                                { index: -1 });
      });

    });

    describe('onExportOpen', function() {

      beforeEach(function() {
        scope.onExportOpen();
      });

      it('should generate export links', function() {
        expect(c._export.generate)
          .toHaveBeenCalledWith(c.battles_display.sorted_list);
      });

    });

  });

});
