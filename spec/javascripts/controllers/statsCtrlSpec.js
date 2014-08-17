'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.filters');
    module('jlogApp.services');
    module('jlogApp.controllers');
    console.log = jasmine.createSpy('log');
  });

  describe('statCtrl', function(c) {

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        c.battles = jasmine.createSpyObj('battles', ['reset']);
        c.stats = jasmine.createSpyObj('stats', ['generate']);
        c.stats.collections = { titi: 'toto' };

        c.scope = $rootScope.$new();
        spyOn(c.scope, '$on');
        c.scope.resetListDisplay = jasmine.createSpy('resetListDisplay');
        c.scope.bottom_bar = { show: null };
        c.scope.filter_state = { previous: null };

        c.state = {
          current: {
            data: {}
          }
        };
        $controller('statsCtrl', {
          '$scope': c.scope,
          '$state': c.state,
          'battles_display': c.battles,
          'stats': c.stats
        });
      }]));

    it('should initialize state data', function() {
      expect(c.state.current.data.state).toBeAn('Object');
      expect(c.state.current.data.state.entry).toBe('result');
      expect(c.state.current.data.state.selector).toBe('my_caster');

      expect(c.state.current.data.state.setEntry).toBeA('Function');
      expect(c.state.current.data.state.setSelector).toBeA('Function');
      expect(c.state.current.data.state.doGenerate).toBeA('Function');
    });

    it('should initialize scope', function() {
      expect(c.scope.stats).toBe(c.stats);
      expect(c.scope.state).toBe(c.state.current.data.state);
      
      expect(c.scope.doShow).toBeA('Function');
      expect(c.scope.show).toBeA('Function');

      expect(c.scope.bottom_bar.show).toBe(true);
      expect(c.scope.filter_state.previous).toBe('stats');
    });

    it('should reset battle display', function() {
      expect(c.scope.resetListDisplay).toHaveBeenCalled();
    });

    it('should reset stats collections', function() {
      expect(c.stats.collections).toEqual({});
    });

    it('should generate default stats', function() {
      expect(c.stats.generate).toHaveBeenCalledWith('result','my_caster');
    });

    it('should listen to "battles_reset" event', function() {
      expect(c.scope.$on).toHaveBeenCalledWith('battles_reset',jasmine.any(Function));
    });

    describe('on "battles_reset" event', function() {

      beforeEach(function() {
        var listener = c.scope.$on.calls.first().args[1];
        listener();
      });

      it('should reset stats collections', function() {
        expect(c.stats.collections).toEqual({});
      });

      it('should re-generate current stats', function() {
        expect(c.stats.generate).toHaveBeenCalledWith(c.state.current.data.state.entry,
                                                      c.state.current.data.state.selector);
      });

    });

    describe('state', function(c) {

      beforeEach(function() {
        c.state = c.state.current.data.state;
      });

      describe('doGenerate()', function() {

        beforeEach(function() {
          c.state.entry = 'toto';
          c.state.selector = 'tata';

          c.state.doGenerate();
        });

        it('should generate current stat', function() {
          expect(c.stats.generate).toHaveBeenCalledWith('toto', 'tata');
        });

      });

      describe('setEntry()', function() {

        beforeEach(function() {
          c.state.entry = 'toto';
          c.state.selector = 'tata';

          c.state.setEntry('titi');
        });

        it('should update current stat entry', function() {
          expect(c.state.entry).toBe('titi');
        });

        it('should generate new stat entry', function() {
          expect(c.stats.generate).toHaveBeenCalledWith('titi', 'tata');
        });

      });

      describe('setSelector()', function() {

        beforeEach(function() {
          c.state.entry = 'toto';
          c.state.selector = 'tata';
          c.scope.doShow('toto');
          expect(c.scope.show('toto')).toBe(true);

          c.state.setSelector('titi');
        });

        it('should update current stat selector', function() {
          expect(c.state.selector).toBe('titi');
        });

        it('should reset show state', function() {
          expect(c.scope.show('toto')).toBe(false);
        });

        it('should generate new stat selector', function() {
          expect(c.stats.generate).toHaveBeenCalledWith('toto', 'titi');
        });

      });

    });

    describe('show(<id>)', function() {

      it('should be true only if <id> matches last doShow(<id>)', function() {
        c.scope.doShow('tata');
        expect(c.scope.show('tata')).toBe(true);
        expect(c.scope.show('tutu')).toBe(false);
      });

    });

  });

  describe('statsBottomCtrl', function(c) {

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        c.stats = {};

        c.scope = $rootScope.$new();
        c.state = {
          current: {
            data: {
              state: {}
            }
          }
        };

        $controller('statsBottomCtrl', {
          '$scope': c.scope,
          '$state': c.state,
          'stats': c.stats
        });
      }
    ]));

    it('should initialize scope', function() {
      expect(c.scope.stats).toBe(c.stats);
      expect(c.scope.state).toBe(c.state.current.data.state);
    });

  });

});
