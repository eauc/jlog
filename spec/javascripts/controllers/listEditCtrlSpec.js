'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.filters');
    module('jlogApp.services');
    module('jlogApp.controllers');
    module('ui.router');
  });

  describe('listEditCtrl', function() {

    var scope;
    var battle;
    var battles;
    var opponents;
    var scenarios;
    var tags;
    var events;
    var $state;

    beforeEach(inject([
      '$rootScope',
      '$controller',
      '$state',
      'battle',
      'battles',
      'opponents',
      'scenarios',
      'events',
      'tags',
      function($rootScope,
               $controller,
               _$state,
               _battle,
               _battles,
               _opponents,
               _scenarios,
               _events,
               _tags) {
        battle = _battle;
        battles = _battles;
        opponents = _opponents;
        scenarios = _scenarios;
        events = _events;
        tags = _tags;
        $state = _$state;

        $state.current.data = {};
        spyOn($state, 'go');
        
        spyOn(battles, 'save');
        battles.list = [ battle(), battle(), battle() ];

        scope = $rootScope.$new();
        scope.bottom_bar = {};
        scope.battles = battles;
        scope.bottom_bar.onClose = jasmine.createSpy();
      }]));

    describe('when $stateParams.index is < 0', function() {

      beforeEach(inject([ '$controller', function($controller) {
        $controller('listEditCtrl', { '$scope': scope, '$stateParams': { index: -1 } });
      }]));

      it('should create a new battle', function() {
        expect($state.current.data.battle).toEqual(battle());
        expect($state.current.data.index).toBe(3);
      });

    });

    describe('when $stateParams.index is >= 0', function() {

      beforeEach(inject([ '$controller', function($controller) {
        scope.battle = battles.list[1];
        $controller('listEditCtrl', { '$scope': scope, '$stateParams': { index: 1 }});
      }]));

      it('should clone the battle', function() {
        expect($state.current.data.index).toBe(1);
        expect($state.current.data.battle).toEqual(battles.list[1]);
        expect($state.current.data.battle).not.toBe(battles.list[1]);
      });

    });

    describe('always', function() {

      var $window;
      var index = 1;
      var prompt = 'Toto';

      beforeEach(inject([
        '$controller',
        '$window',
        function($controller, _$window) {
          $window = _$window;

          spyOn(scope, '$watch');
          spyOn($window, 'prompt').and.returnValue(prompt);
          spyOn($window, 'confirm');
          
          scope.battle_index = index;
          scope.battle = battles.list[index];
          $controller('listEditCtrl', { '$scope': scope, '$stateParams': { index: 1 } });
        }
      ]));

      it('should initialize scope and state', function() {
        expect(scope.battle).toBe($state.current.data.battle);
        expect($state.current.data.save_enable).toBe(false);

        expect(scope.opponents).toBe(opponents.list);
        expect(scope.events).toBe(events.list);
        expect(scope.tags).toBe(tags.list);

        expect(angular.isFunction(scope.onAddOpponent)).toBeTruthy({});
        expect(angular.isFunction(scope.onAddEvent)).toBeTruthy({});
        expect(angular.isFunction(scope.onAddScenario)).toBeTruthy({});
        expect(angular.isFunction(scope.onAddTag)).toBeTruthy({});
        expect(angular.isFunction(scope.onDelete)).toBeTruthy({});
        expect(angular.isFunction(scope.onDeleteTag)).toBeTruthy({});
      });

      it('should watch form validation', function() {
        expect(scope.$watch).toHaveBeenCalledWith('battle_edit.$valid',
                                                  jasmine.any(Function));
      });

      describe('the form validation watcher', function() {

        var watcher;

        beforeEach(function() {
          watcher = scope.$watch.calls.first().args[1];
        });

        it('should set $state.current.data.save_enable to the form validation state', function() {
          watcher(true);
          expect($state.current.data.save_enable).toBe(true);

          watcher(false);
          expect($state.current.data.save_enable).toBe(false);
        });

      });

      describe('onAddOpponent', function() {

        beforeEach(function() {
          spyOn(opponents, 'add');

          scope.onAddOpponent();
        });
          
        it('should prompt for new opponent name', function() {
          expect($window.prompt).toHaveBeenCalledWith('Enter new opponent name :');
        });

        it('should add opponent in lower case to opponents list', function() {
          expect(opponents.add).toHaveBeenCalledWith(prompt.toLowerCase());
        });

        it('should set battle opponent name', function() {
          expect(scope.battle.opponent.name).toBe(prompt.toLowerCase());
        });

      });

      describe('onAddEvent', function() {

        beforeEach(function() {
          spyOn(events, 'add');

          scope.onAddEvent();
        });
          
        it('should prompt for new event name', function() {
          expect($window.prompt).toHaveBeenCalledWith('Enter new event name :');
        });

        it('should add event to events list', function() {
          expect(events.add).toHaveBeenCalledWith(prompt);
        });

        it('should set battle setup event', function() {
          expect(scope.battle.setup.event).toBe(prompt);
        });

      });

      describe('onAddScenario', function() {

        var key = 'key';
        beforeEach(function() {
          spyOn(scenarios, 'add').and.returnValue(key);

          scope.onAddScenario();
        });
          
        it('should prompt for new scenario name', function() {
          expect($window.prompt).toHaveBeenCalledWith('Enter new scenario name :');
        });

        it('should add scenario to scenarios list', function() {
          expect(scenarios.add).toHaveBeenCalledWith(prompt);
        });

        it('should set battle setup scenario', function() {
          expect(scope.battle.setup.scenario).toBe(key);
        });

      });

      describe('onAddTag', function() {

        beforeEach(function() {
          spyOn(tags, 'add');
          spyOn(scope.battle, 'addTag');

          scope.onAddTag();
        });
          
        it('should prompt for new tag name', function() {
          expect($window.prompt).toHaveBeenCalledWith('Enter new tag name :');
        });

        it('should add tag to tags list', function() {
          expect(tags.add).toHaveBeenCalledWith(prompt);
        });

        it('should set battle tag', function() {
          expect(scope.battle.addTag).toHaveBeenCalledWith(prompt);
        });

      });

      describe('onDelete("opponent")', function() {

        beforeEach(function() {
          spyOn(opponents, 'remove');
          
          scope.battle.opponent.name = 'toto';
          battles.list[0].opponent.name = 'toto';
          battles.list[2].opponent.name = 'tata';
        });
          
        it('should ask for confirmation', function() {
          scope.onDelete('opponent');

          expect($window.confirm).toHaveBeenCalledWith('Forget everything about "toto" ?');
        });

        describe('when user gives confirmation', function() {

          beforeEach(function() {
            $window.confirm.and.returnValue(true);

            scope.onDelete('opponent');
          });

          it('should clear scope battle opponent name', function() {
            expect(scope.battle.opponent.name).toBe(null);
          });

          it('should clear this opponent name from battles list', function() {
            expect(battles.list[0].opponent.name).toBe(null);
            expect(battles.list[2].opponent.name).not.toBe(null);
          });

          it('should remove this opponent name from opponents list', function() {
            expect(opponents.remove).toHaveBeenCalledWith('toto');
          });

        });

        describe('when user does not confirm', function() {

          beforeEach(function() {
            $window.confirm.and.returnValue(false);

            scope.onDelete('opponent');
          });

          it('should not clear scope battle opponent name', function() {
            expect(scope.battle.opponent.name).not.toBe(null);
          });

          it('should not clear this opponent name from battles list', function() {
            expect(battles.list[0].opponent.name).not.toBe(null);
            expect(battles.list[2].opponent.name).not.toBe(null);
          });

          it('should not remove this opponent name from opponents list', function() {
            expect(opponents.remove).not.toHaveBeenCalled();
          });

        });

      });

      describe('onDelete("scenario")', function() {

        beforeEach(function() {
          spyOn(scenarios, 'remove');
          
          scope.battle.setup.scenario = 'toto';
          battles.list[0].setup.scenario = 'toto';
          battles.list[2].setup.scenario = 'tata';
        });
          
        it('should ask for confirmation', function() {
          scope.onDelete('scenario');

          expect($window.confirm).toHaveBeenCalledWith('Forget everything about "toto" ?');
        });

        describe('when user gives confirmation', function() {

          beforeEach(function() {
            $window.confirm.and.returnValue(true);

            scope.onDelete('scenario');
          });

          it('should clear scope battle scenario name', function() {
            expect(scope.battle.setup.scenario).toBe(null);
          });

          it('should clear this scenario name from battles list', function() {
            expect(battles.list[0].setup.scenario).toBe(null);
            expect(battles.list[2].setup.scenario).not.toBe(null);
          });

          it('should remove this scenario name from scenarios list', function() {
            expect(scenarios.remove).toHaveBeenCalledWith('toto');
          });

        });

        describe('when user does not confirm', function() {

          beforeEach(function() {
            $window.confirm.and.returnValue(false);

            scope.onDelete('scenario');
          });

          it('should not clear scope battle scenario name', function() {
            expect(scope.battle.setup.scenario).not.toBe(null);
          });

          it('should not clear this scenario name from battles list', function() {
            expect(battles.list[0].setup.scenario).not.toBe(null);
            expect(battles.list[2].setup.scenario).not.toBe(null);
          });

          it('should not remove this scenario name from scenarios list', function() {
            expect(scenarios.remove).not.toHaveBeenCalled();
          });

        });

      });

      describe('onDelete("event")', function() {

        beforeEach(function() {
          spyOn(events, 'remove');
          
          scope.battle.setup.event = 'toto';
          battles.list[0].setup.event = 'toto';
          battles.list[2].setup.event = 'tata';
        });
          
        it('should ask for confirmation', function() {
          scope.onDelete('event');

          expect($window.confirm).toHaveBeenCalledWith('Forget everything about "toto" ?');
        });

        describe('when user gives confirmation', function() {

          beforeEach(function() {
            $window.confirm.and.returnValue(true);

            scope.onDelete('event');
          });

          it('should clear scope battle event name', function() {
            expect(scope.battle.setup.event).toBe(null);
          });

          it('should clear this event name from battles list', function() {
            expect(battles.list[0].setup.event).toBe(null);
            expect(battles.list[2].setup.event).not.toBe(null);
          });

          it('should remove this event name from events list', function() {
            expect(events.remove).toHaveBeenCalledWith('toto');
          });

        });

        describe('when user does not confirm', function() {

          beforeEach(function() {
            $window.confirm.and.returnValue(false);

            scope.onDelete('event');
          });

          it('should not clear scope battle event name', function() {
            expect(scope.battle.setup.event).not.toBe(null);
          });

          it('should not clear this event name from battles list', function() {
            expect(battles.list[0].setup.event).not.toBe(null);
            expect(battles.list[2].setup.event).not.toBe(null);
          });

          it('should not remove this event name from events list', function() {
            expect(events.remove).not.toHaveBeenCalled();
          });

        });

      });

      describe('onDeleteTag', function() {

        beforeEach(function() {
          spyOn(tags, 'remove');
          
          scope.battle.tags = [ 'toto', 'titi' ];
          battles.list[0].tags = [ 'toto', 'tata' ];
          battles.list[2].tags = [ 'tata', 'titi' ];
        });
          
        it('should ask for confirmation', function() {
          scope.onDeleteTag();

          expect($window.confirm).toHaveBeenCalledWith('Forget everything about these tags ?\r\n\ttoto\r\n\ttiti\r\n');
        });

        describe('when user gives confirmation', function() {

          beforeEach(function() {
            $window.confirm.and.returnValue(true);

            scope.onDeleteTag();
          });

          it('should clear scope battle tag name', function() {
            expect(scope.battle.tags).toEqual([]);
          });

          it('should clear these tags name from battles list', function() {
            expect(battles.list[0].tags).toEqual(['tata']);
            expect(battles.list[2].tags).toEqual(['tata']);
          });

          it('should remove this tag name from tags list', function() {
            expect(tags.remove).toHaveBeenCalledWith('toto');
            expect(tags.remove).toHaveBeenCalledWith('titi');
          });

        });

        describe('when user does not confirm', function() {

          beforeEach(function() {
            $window.confirm.and.returnValue(false);

            scope.onDelete('tag');
          });

          it('should not clear scope battle tag name', function() {
            expect(scope.battle.setup.tag).not.toBe(null);
          });

          it('should not clear this tag name from battles list', function() {
            expect(battles.list[0].setup.tag).not.toBe(null);
            expect(battles.list[2].setup.tag).not.toBe(null);
          });

          it('should not remove this tag name from tags list', function() {
            expect(tags.remove).not.toHaveBeenCalled();
          });

        });

      });

    });

  });

  describe('listEditBottomCtrl', function() {

    var scope;
    var battles;
    var $state;

    beforeEach(inject([
      '$rootScope',
      '$controller',
      '$state',
      'battles',
      function($rootScope,
               $controller,
               _$state,
               _battles) {
        battles = _battles;
        $state = _$state;

        $state.current.data = { index: 'index', battle: 'battle' };
        spyOn($state, 'go');
        spyOn(battles, 'save');

        scope = $rootScope.$new();
        $controller('listEditBottomCtrl', { '$scope': scope });
      }]));

    it('should initialize scope and state', function() {
      expect(scope.state).toBe($state.current.data);
      
      expect(angular.isFunction(scope.onSave)).toBeTruthy({});
      expect(angular.isFunction(scope.onClose)).toBeTruthy({});
    });
    
    describe('onSave', function() {
      
      beforeEach(function() {
        spyOn(scope, 'onClose');

        scope.onSave();
      });
      
      it('should save edited battle in battles', function() {
        expect(battles.save).toHaveBeenCalledWith('index', 'battle');
      });
      
      it('should close edit battle', function() {
        expect(scope.onClose).toHaveBeenCalled();
      });
      
    });
    
    describe('onClose', function() {
      
      beforeEach(function() {
        scope.onClose();
      });
      
      it('should go to "battle" state', function() {
        expect($state.go).toHaveBeenCalledWith('battle');
      });
      
    });
    
  });

});
