'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('ui.router');
    module('jlogApp.services');
    module('jlogApp.controllers');
  });

  describe('mainCtrl', function(c) {

    beforeEach(inject([
      '$rootScope',
      '$controller',
      '$state',
      function($rootScope,
               $controller,
               $state) {
        this.scope = $rootScope.$new();

        this.state = $state;
        spyOn($state, 'is').and.returnValue('state.is.returnValue');
        spyOn($state, 'go').and.returnValue('state.go.returnValue');

        this.factionsService = spyOnService('factions');
        this.scenariosService = spyOnService('scenarios');
        this.scoresService = spyOnService('scores');

        this.opponentsService = spyOnService('opponents');
        this.eventsService = spyOnService('events');
        this.tagsService = spyOnService('tags');

        $controller('mainCtrl', { 
          '$scope': this.scope,
        });
        $rootScope.$digest();
      }
    ]));

    it('stateIs should map to $state.is', function() {
      expect(this.scope.stateIs('toto')).toBe('state.is.returnValue');
      expect(this.state.is).toHaveBeenCalledWith('toto');
    });

    it('stateGo should map to $state.go', function() {
      expect(this.scope.stateGo('toto')).toBe('state.go.returnValue');
      expect(this.state.go).toHaveBeenCalledWith('toto');
    });

    it('should store info lists', function() {
      expect(this.scope.scores).toBe('scores.data.returnValue');
      expect(this.scope.factions).toBe('factions.data.returnValue');
      expect(this.scope.battles.scenarios).toBe('scenarios.data.returnValue');
    });

    using([
      [ 'type'      ],
      [ 'events'    ],
      [ 'tags'      ],
      [ 'opponents' ],
    ], function(e,d) {
      it('should init '+e.type+' from battles list', function() {
        expect(this[e.type+'Service'].fromBattles)
          .toHaveBeenCalledWith([]);
        expect(this.scope.battles[e.type])
          .toBe(e.type+'.fromBattles.returnValue');
      });
    });
  });

});
