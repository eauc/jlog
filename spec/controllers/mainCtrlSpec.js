'use strict';

describe('controllers', function() {

  beforeEach(function() {
    this.windowService = {
      location: jasmine.createSpyObj('location', [
        'reload',
      ]),
      // localStorage: jasmine.createSpyObj('localStorage', [
      //   'getItem', 'setItem'
      // ]),
    };
    this.anchorScrollService = jasmine.createSpy('anchorScroll');
    module({
      '$window': this.windowService,
      '$anchorScroll': this.anchorScrollService,
      'prompt': this.promptService,
    });
    module('ui.router');
    module('jlogApp.services');
    module('jlogApp.controllers');
  });

  describe('mainCtrl', function() {
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

        this.parseSyncService = spyOnService('parseSync');
        mockReturnPromise(this.parseSyncService.init);
        
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
        state: 'filter.init.returnValue',
        active: false,
        invert: false,
        cache: {}
      });
    });

    it('should init battle list', function() {
      expect(this.battlesService.init).toHaveBeenCalled();
      expect(this.battlesService.buildIndex)
        .toHaveBeenCalledWith('battles.init.returnValue');
      expect(this.scope.battles.list)
        .toBe('battles.buildIndex.returnValue');
    });

    describe('updateBattles()', function() {
      beforeEach(function() {
        this.scope.battles.list = [ 'battle_list' ];
        this.scope.battles.sort.type = 'sort_type';
        this.scope.battles.sort.reverse = 'sort_reverse';
        this.scope.battles.filter.state = [ 'filter_state' ];
      });

      it('should store filter state', function() {
        this.filterService.store.calls.reset();

        this.scope.updateBattles();

        expect(this.filterService.store)
          .toHaveBeenCalledWith([ 'filter_state' ]);
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
          expect(this.scope.battles.sorted_list)
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
          expect(this.scope.battles.sorted_list)
            .toBe('battles.sort.returnValue');
        });
      });
    });

    describe('setBattles(<battles>, <onLoad>)', function() {
      beforeEach(function() {
        this.scope.battles.list = [ 'battle_list' ];
        spyOn(this.scope, 'updateBattles');
        this.battlesService.store.calls.reset();
        spyOn(this.scope, 'initParseSync');

        this.scope.setBattles([ 'new_battles' ], 'onLoad');
      });

      it('should build index and set list', function() {
        expect(this.battlesService.buildIndex)
          .toHaveBeenCalledWith([ 'new_battles' ]);
        expect(this.scope.battles.list)
          .toBe('battles.buildIndex.returnValue');
      });

      it('should store battle list', function() {
        expect(this.battlesService.store)
          .toHaveBeenCalledWith('battles.buildIndex.returnValue');
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

      it('should init parse sync', function() {
        expect(this.scope.initParseSync)
          .toHaveBeenCalledWith('onLoad');
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

    describe('doReload()', function() {
      it('should reload current page', function() {
        this.scope.doReload();

        expect(this.windowService.location.reload).toHaveBeenCalled();
      });
    });

    describe('scrollTo(<id>)', function() {
      beforeEach(inject(function($location) {
        this.locationService = $location;
        spyOn($location, 'hash');
        this.scope.scrollTo('id');
      }));

      it('should change location hash', function() {
        expect(this.locationService.hash)
          .toHaveBeenCalledWith('id');
      });

      it('should scroll page', function() {
        expect(this.anchorScrollService)
          .toHaveBeenCalled();
      });
    });

    describe('parse', function() {
      it('should init parte state', function() {
        expect(this.scope.parse.state).toBe('Init Sync');
        expect(this.scope.parse.state_class).toBe(null);
        expect(this.scope.parse.user).toBe(null);
        expect(this.scope.parse.sync).toBe(null);
      });

      describe('when parseSync init is resolved', function() {
        beforeEach(function() {
          this.parseUserService = spyOnService('parseUser');
          mockReturnPromise(this.parseUserService.init);
          spyOn(this.scope.parse.channel, 'publish');
          
          this.parseSyncService.init.resolve('sync');
        });

        it('should init parse user', function() {
          expect(this.scope.parse.sync).toBe('sync');
          expect(this.scope.parse.state).toBe('LogIn Sync');
          expect(this.scope.parse.state_class).toBe('info');

          expect(this.parseUserService.init)
            .toHaveBeenCalled();
        });

        describe('when user logs in', function() {
          beforeEach(function() {
            this.parseUserService.init.resolve('user');
          });

          it('should emit "login" event', function() {
            expect(this.scope.parse.channel.publish)
              .toHaveBeenCalledWith('login');
            expect(this.scope.parse.user)
              .toBe('user');
          });
        });

        describe('when user log in fails', function() {
          beforeEach(function() {
            this.parseUserService.init.reject('oups');
          });

          it('should emit "logout" event', function() {
            expect(this.scope.parse.channel.publish)
              .toHaveBeenCalledWith('logout');
            expect(this.scope.parse.user)
              .toBe(null);
          });
        });
      });

      describe('when user logs in', function() {
        beforeEach(function() {
          this.parseLogService = spyOnService('parseLog');
          mockReturnPromise(this.parseLogService.sync);

          this.scope.parse.user = 'user';
          this.scope.parse.sync = 'sync';
          this.scope.battles = { list: 'list' };
          
          this.scope.parse.channel.publish('login');
        });

        it('should attempts parse sync', function() {
          expect(this.scope.parse.state).toBe('Syncing...');
          expect(this.scope.parse.state_class).toBe('info');

          expect(this.parseLogService.sync)
            .toHaveBeenCalledWith('user', 'sync', 'list');
        });

        describe('when parse sync succeeds', function() {
          beforeEach(function() {
            spyOn(this.scope, 'setBattles');
            
            this.parseLogService.sync.resolve([
              { updatedAt: 'updatedAt' }, 'data'
            ]);
          });

          it('should update parse state', function() {
            expect(this.parseSyncService.validate)
              .toHaveBeenCalledWith('updatedAt');
            expect(this.scope.parse.sync)
              .toBe('parseSync.validate.returnValue');

            expect(this.scope.parse.state).toBe('Synced');
            expect(this.scope.parse.state_class).toBe('success');
          });

          it('should update battles with sync result', function() {
            expect(this.scope.setBattles)
              .toHaveBeenCalledWith('data', true);
          });
        });

        describe('when parse sync fails', function() {
          beforeEach(function() {
            this.parseLogService.sync.reject('oups');
          });

          it('should update parse state', function() {
            expect(this.scope.parse.state).toBe('Sync Failed');
            expect(this.scope.parse.state_class).toBe('danger');
          });
        });
      });

      describe('when user logs out', function() {
        beforeEach(function() {
          this.scope.parse.channel.publish('logout');
        });

        it('should update parse state', function() {
          expect(this.scope.parse.state).toBe('Sync Off');
          expect(this.scope.parse.state_class).toBe(null);
        });
      });
    });
  });
});
