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
        this.battlesService = spyOnService('battles');

        this.opponentsService = spyOnService('opponents');
        this.eventsService = spyOnService('events');
        this.tagsService = spyOnService('tags');

        this.filterService = spyOnService('filter');

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
      expect(this.scope.sort_types).toBe('battles.sortTypes.returnValue');
      expect(this.scope.scores).toBe('scores.data.returnValue');
      expect(this.scope.factions).toBe('factions.data.returnValue');
    });

    it('should init sort state', function() {
      expect(this.scope.battles.sort.type).toBe('date');
      expect(this.scope.battles.sort.reverse).toBe(true);
    });

    it('should init filter state', function() {
      expect(this.scope.battles.filter).toEqual({
        state: 'filter.create.returnValue',
        invert: false,
        cache: {}
      });
    });

    describe('updateBattles()', function() {
      beforeEach(function() {
        this.scope.battles.list = [ 'battle_list' ];
        this.scope.battles.sort.type = 'sort_type';
        this.scope.battles.sort.reverse = 'sort_reverse';
      });

      when('filter is inactive', function() {
        this.scope.battles.filter.active = false;
      }, function() {
        it('should sort battle list', function() {
          this.scope.updateBattles();

          expect(this.battlesService.sort)
            .toHaveBeenCalledWith([ 'battle_list' ],
                                  'battles.sortTypes.returnValue',
                                  'sort_type', 'sort_reverse');
          expect(this.scope.battles.display_list)
            .toBe('battles.sort.returnValue');
        });
      });

      when('filter is active', function() {
        this.scope.battles.list = [ 'battle1', 'battle2', 'battle3' ];
        this.scope.battles.filter = {
          active: true,
          state: 'filter_state',
          invert: 'filter_invert',
          cache: 'cache'
        };
        this.filterService.match.and.callFake(function(f, b) {
          return b !== 'battle2';
        });
      }, function() {
        it('should filter battle list', function() {
          this.scope.updateBattles();

          expect(this.filterService.match.calls.count()).toBe(3);
          expect(this.filterService.match)
            .toHaveBeenCalledWith('filter_state', 'battle1',
                                  'filter_invert', 'cache',
                                  0, this.scope.battles.list);
          expect(this.filterService.match)
            .toHaveBeenCalledWith('filter_state', 'battle2',
                                  'filter_invert', 'cache',
                                  1, this.scope.battles.list);
          expect(this.filterService.match)
            .toHaveBeenCalledWith('filter_state', 'battle3',
                                  'filter_invert', 'cache',
                                  2, this.scope.battles.list);
        });

        it('should sort filtered list', function() {
          this.scope.updateBattles();

          expect(this.battlesService.sort)
            .toHaveBeenCalledWith([ 'battle1', 'battle3' ],
                                  'battles.sortTypes.returnValue',
                                  'sort_type', 'sort_reverse');
          expect(this.scope.battles.display_list)
            .toBe('battles.sort.returnValue');
        });
      });
    });

    describe('setBattles()', function() {
      beforeEach(function() {
        this.scope.battles.list = [ 'battle_list' ];
        spyOn(this.scope, 'updateBattles');

        this.scope.setBattles([ 'new_battles' ]);
      });

      it('should build index and set list', function() {
        expect(this.battlesService.buildIndex)
          .toHaveBeenCalledWith([ 'new_battles' ]);
        expect(this.scope.battles.list)
          .toBe('battles.buildIndex.returnValue');
      });

      using([
        [ 'service'   ],
        [ 'opponents' ],
        [ 'events'    ],
        [ 'tags'      ],
        [ 'scenarios' ],
      ], function(e, d) {
        it('should rebuild '+e.service+' list', function() {
          expect(this[e.service+'Service'].fromBattles)
            .toHaveBeenCalledWith('battles.buildIndex.returnValue');
          expect(this.scope.battles[e.service])
            .toBe(e.service+'.fromBattles.returnValue');
        });
      });

      it('should update battles data', function() {
        expect(this.scope.updateBattles)
          .toHaveBeenCalled();
      });
    });

    describe('doToggleFilterActive()', function() {
      it('should toggle filter active flag', function() {
        this.scope.battles.filter.active = false;
        this.scope.doToggleFilterActive();
        expect(this.scope.battles.filter.active).toBe(true);

        this.scope.battles.filter.active = true;
        this.scope.doToggleFilterActive();
        expect(this.scope.battles.filter.active).toBe(false);
      });
    });

    describe('doToggleFilterInvert()', function() {
      it('should toggle filter inverted flag', function() {
        this.scope.battles.filter.invert = false;
        this.scope.doToggleFilterInvert();
        expect(this.scope.battles.filter.invert).toBe(true);

        this.scope.battles.filter.invert = true;
        this.scope.doToggleFilterInvert();
        expect(this.scope.battles.filter.invert).toBe(false);
      });
    });
  });

});
