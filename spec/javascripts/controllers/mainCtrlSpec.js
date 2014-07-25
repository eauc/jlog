'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.filters');
    module('jlogApp.services');
    module('jlogApp.controllers');
    console.log = jasmine.createSpy('log');
  });

  describe('mainCtrl', function() {

    var scope;
    var battles_display;
    var opponents;
    var events;
    var factions;
    var scenarios;
    var scores;
    var tags;
    var battle_sort;
    var filter;

    beforeEach(inject([
      '$rootScope',
      '$controller',
      'battles_display',
      'opponents',
      'events',
      'factions',
      'scenarios',
      'scores',
      'tags',
      'battle_sort',
      'filter',
      function($rootScope,
               $controller,
               _battles,
               _opponents,
               _events,
               _factions,
               _scenarios,
               _scores,
               _tags,
               _battle_sort,
               _filter) {
        battles_display = _battles;
        opponents = _opponents;
        events = _events;
        factions = _factions;
        scenarios = _scenarios;
        scores = _scores;
        tags = _tags;
        battle_sort = _battle_sort;
        filter = _filter;

        spyOn(battles_display, 'init');
        spyOn(opponents, 'init');
        spyOn(events, 'init');
        spyOn(scenarios, 'init');
        spyOn(tags, 'init');
        spyOn(filter, 'init');

        spyOn(battles_display, 'create');
        spyOn(opponents, 'create');
        spyOn(events, 'create');
        spyOn(scenarios, 'create');
        spyOn(tags, 'create');

        scope = $rootScope.$new();
        spyOn(scope, '$on');
        $controller('mainCtrl', { '$scope': scope });
      }]));

    it('should initialize services', function() {
      expect(battles_display.init).toHaveBeenCalled();
      expect(opponents.init).toHaveBeenCalled();
      expect(events.init).toHaveBeenCalled();
      expect(scenarios.init).toHaveBeenCalled();
      expect(tags.init).toHaveBeenCalled();
      expect(filter.init).toHaveBeenCalled();
    });

    it('should initialize scope', function() {
      expect(scope.battles).toBe(battles_display);
      expect(scope.factions).toBe(factions);
      expect(scope.sort).toBe(battle_sort);
      expect(scope.scores).toBe(scores);

      expect(scope.filter).toBe(filter.list);
      expect(scope.opponents).toBe(opponents.list);
      expect(scope.scenarios).toBe(scenarios.list);
      expect(scope.events).toBe(events.list);
      expect(scope.tags).toBe(tags.list);

      expect(scope.filter_state).toBeA('Object');
      expect(scope.filter_state.active).toBe(false);
      expect(scope.filter_state.invert).toBe(false);
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
        expect(battles_display.create).toHaveBeenCalledWith(c.data);
        expect(opponents.create).toHaveBeenCalledWith(battles_display.list);
        expect(events.create).toHaveBeenCalledWith(battles_display.list);
        expect(scenarios.create).toHaveBeenCalledWith(battles_display.list);
        expect(tags.create).toHaveBeenCalledWith(battles_display.list);
      });

    });

  });

});
