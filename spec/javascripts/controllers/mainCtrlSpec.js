'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.filters');
    module('jlogApp.services');
    module('jlogApp.controllers');
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
      function($rootScope,
               $controller,
               _battles,
               _opponents,
               _events,
               _factions,
               _scenarios,
               _scores,
               _tags,
               _battle_sort) {
        battles_display = _battles;
        opponents = _opponents;
        events = _events;
        factions = _factions;
        scenarios = _scenarios;
        scores = _scores;
        tags = _tags;
        battle_sort = _battle_sort;

        spyOn(battles_display, 'init');
        spyOn(opponents, 'init');
        spyOn(events, 'init');
        spyOn(scenarios, 'init');
        spyOn(tags, 'init');

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
    });

    it('should initialize scope', function() {
      expect(scope.battles).toBe(battles_display);
      expect(scope.factions).toBe(factions);
      expect(scope.sort).toBe(battle_sort);
      expect(scope.scores).toBe(scores);
    });

    describe('on newBattles', function() {

      var onNewBattles;
      var data = [];

      beforeEach(function() {
        expect(scope.$on)
          .toHaveBeenCalledWith('newBattles', jasmine.any(Function));

        onNewBattles = scope.$on.calls.first().args[1];

        onNewBattles('', data);
      });

      it('should recreate all services lists', function() {
        expect(battles_display.create).toHaveBeenCalledWith(data);
        expect(opponents.create).toHaveBeenCalledWith(battles_display.list);
        expect(events.create).toHaveBeenCalledWith(battles_display.list);
        expect(scenarios.create).toHaveBeenCalledWith(battles_display.list);
        expect(tags.create).toHaveBeenCalledWith(battles_display.list);
      });

    })

  });

});
