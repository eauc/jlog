'use strict';

describe('services', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('statEntryFaction', function() {

    var statEntryFaction;
    beforeEach(inject([
      'statEntryFaction',
      function(_statEntryFaction) {
        statEntryFaction = _statEntryFaction;
      }
    ]));

    describe('reduce(<collection>, <title>, <key>)', function() {
      beforeEach(inject(function($rootScope, factions) {
        spyOn(factions, 'data').and.returnValue([
          { key: 'cryx', name: 'Cryx', hue: [0,0] },
          { key: 'loe', name: 'Legion of Everblight', hue: [10,0] },
          { key: 'menoth', name: 'The Protectorate of Menoth', hue: [0,10] },
        ]);
        statEntryFaction.init();
        $rootScope.$digest();

        this.battles = [
          { key: 'cryx' },
          { key: 'loe' },
          { key: 'menoth' },
          { key: 'cryx' },
          { key: 'cryx' },
          { key: 'loe' },
          { key: 'unknown' },
        ];

        this.ret = statEntryFaction.reduce(this.battles, 'title', 'key');
      }));
      
      it('should forward collection\'s title', function() {
        expect(this.ret.title).toBe('title');
      });
      
      it('should build hues collection from factions data', function() {
        expect(this.ret.hues).toEqual({
          'Cryx': [ 0, 0 ],
          'Legion of Everblight': [ 10, 0 ],
          'The Protectorate of Menoth': [ 0, 10 ]
        });
      });
      
      it('should reduce collection by <key> factions', function() {
        expect(this.ret.values).toEqual({
          'Cryx': 3,
          'Legion of Everblight': 2,
          'The Protectorate of Menoth': 1,
          'undefined': 1
        });
      });
    });
  });

  describe('statEntryCaster', function() {

    var statEntryCaster;
    beforeEach(inject([
      'statEntryCaster',
      function(_statEntryCaster) {
        statEntryCaster = _statEntryCaster;
      }
    ]));

    describe('reduce(<collection>, <title>, <key>)', function() {
      beforeEach(inject(function($rootScope, factions) {
        spyOn(factions, 'data').and.returnValue([
          { key: 'cryx', name: 'Cryx', hue: [0,0] },
          { key: 'loe', name: 'Legion of Everblight', hue: [10,0] },
          { key: 'menoth', name: 'The Protectorate of Menoth', hue: [0,10] },
        ]);
        statEntryCaster.init();
        $rootScope.$digest();

        this.battles = [
          { key: { faction: 'cryx', caster: 'coven1' } },
          { key: { faction: 'loe', caster: 'saeryn1' } },
          { key: { faction: 'menoth', caster: 'feora1' } },
          { key: { faction: 'cryx', caster: 'coven1' } },
          { key: { faction: 'cryx', caster: null } },
          { key: { faction: 'loe', caster: 'vayl1' } },
          { key: { faction: 'unknown', caster: 'toto1' } },
        ];

        this.ret = statEntryCaster.reduce(this.battles, 'title', 'key');
      }));
      
      it('should forward collection\'s title', function() {
        expect(this.ret.title).toBe('title');
      });
      
      it('should build hues collection from factions data', function() {
        expect(this.ret.hues).toEqual({
          'Cryx': [ 0, 0 ],
          'Legion of Everblight': [ 10, 0 ],
          'The Protectorate of Menoth': [ 0, 10 ]
        });
      });
      
      it('should reduce collection by <key> casters', function() {
        expect(this.ret.values).toEqual({
          'Cryx': { 'coven1': 2, 'null': 1 },
          'Legion of Everblight': { 'saeryn1': 1, 'vayl1': 1 },
          'The Protectorate of Menoth': { 'feora1': 1 },
          'undefined': { 'toto1': 1 }
        });
      });
    });
  });

  describe('statEntrySimple', function() {

    var statEntrySimple;
    beforeEach(inject([
      'statEntrySimple',
      function(_statEntrySimple) {
        statEntrySimple = _statEntrySimple;
      }
    ]));

    describe('reduce(<collection>, <title>, <key>)', function() {
      beforeEach(inject(function($rootScope, factions) {
        this.battles = [
          { key: 'value1' },
          { key: 'value1' },
          { key: 'value2' },
          { key: 'value1' },
          { key: 'value2' },
          { key: 'value3' },
        ];

        this.ret = statEntrySimple.reduce(this.battles, 'title', 'key');
      }));
      
      it('should forward collection\'s title', function() {
        expect(this.ret.title).toBe('title');
      });

      it('should reduce collection by <key>', function() {
        expect(this.ret.values).toEqual({
          value1: 3,
          value2: 2,
          value3: 1
        });
      });
    });
  });

  describe('statEntryScenario', function() {

    var statEntryScenario;
    beforeEach(inject([
      'statEntryScenario',
      function(_statEntryScenario) {
        statEntryScenario = _statEntryScenario;
      }
    ]));

    describe('reduce(<collection>, <title>)', function() {
      beforeEach(inject(function($rootScope, scenarios) {
        spyOn(scenarios, 'data').and.returnValue([
          { key: 'sr15inco', name: 'SR2015 Incoming' },
          { key: 'sr15breach', name: 'SR2015 Into the Breach' },
          { key: 'custom', name: 'custom' },
        ]);
        statEntryScenario.init();
        $rootScope.$digest();

        this.battles = [
          { setup: { scenario: 'sr15inco' } },
          { setup: { scenario: 'sr15breach' } },
          { setup: { scenario: 'sr15inco' } },
          { setup: { scenario: 'sr15breach' } },
          { setup: { scenario: null } },
          { setup: { scenario: 'custom' } },
          { setup: { scenario: 'unknown' } },
        ];

        this.ret = statEntryScenario.reduce(this.battles, 'title');
      }));
      
      it('should forward collection\'s title', function() {
        expect(this.ret.title).toBe('title');
      });
      
      it('should reduce collection by setup scenarios', function() {
        expect(this.ret.values).toEqual({
          'SR2015 Incoming': 2,
          'SR2015 Into the Breach': 2,
          'undefined': 1,
          'custom': 1
        });
      });
    });
  });

  describe('statEntryInit', function() {

    var statEntryInit;
    beforeEach(inject([
      'statEntryInit',
      function(_statEntryInit) {
        statEntryInit = _statEntryInit;
      }
    ]));

    describe('reduce(<collection>, <title>)', function() {
      beforeEach(function() {
        this.battles = [
          { setup: { initiative: { won_roll: 'true', started: 'true' } } },
          { setup: { initiative: { won_roll: 'false', started: 'true' } } },
          { setup: { initiative: { won_roll: 'true', started: 'false' } } },
          { setup: { initiative: { won_roll: 'false', started: 'false' } } },
          { setup: { initiative: { won_roll: 'true', started: 'true' } } },
          { setup: { initiative: { won_roll: 'false', started: 'true' } } },
          // ingored for stats
          { setup: { initiative: { won_roll: 'true', started: null } } },
          { setup: { initiative: { won_roll: null, started: 'true' } } },
        ];

        this.ret = statEntryInit.reduce(this.battles, 'title');
      });
      
      it('should forward collection\'s title', function() {
        expect(this.ret.title).toBe('title');
      });
      
      it('should reduce collection by initiative', function() {
        expect(this.ret.values).toEqual([ 2, 1, 2, 1 ]);
      });
    });
  });

  describe('statEntryResult', function() {

    var statEntryResult;
    beforeEach(inject([
      'statEntryResult',
      function(_statEntryResult) {
        statEntryResult = _statEntryResult;
      }
    ]));

    describe('reduce(<collection>, <title>)', function() {
      beforeEach(function() {
        this.battles = [
          { score: 'va' }, { score: 'vs' }, { score: 'vc' }, { score: 'vt' },
          { score: 'dd' },
          { score: 'da' }, { score: 'ds' }, { score: 'dc' }, { score: 'dt' },
          { score: 'va' }, { score: 'dd' }, { score: 'dc' }, { score: 'vt' },
          // ingored for stats
          { score: 'toto' },
          { score: null },
        ];

        this.ret = statEntryResult.reduce(this.battles, 'title');
      });
      
      it('should forward collection\'s title', function() {
        expect(this.ret.title).toBe('title');
      });
      
      it('should reduce collection by result', function() {
        expect(this.ret.values).toEqual([ 2, 1, 1, 2, 2, 1, 1, 2, 1 ]);
      });
    });
  });

  describe('statEntryTimeResult', function() {

    var statEntryTimeResult;
    beforeEach(inject([
      'statEntryTimeResult',
      function(_statEntryTimeResult) {
        statEntryTimeResult = _statEntryTimeResult;
      }
    ]));

    describe('reduce(<collection>, <title>)', function() {
      beforeEach(inject(function($rootScope) {
        this.battlesService = spyOnService('battles');
        this.battlesService.sortTypes.and.returnValue(['sorts']);
        this.battlesService.sort.and.callFake(_.identity);
        statEntryTimeResult.init();
        $rootScope.$digest();

        this.battles = [
          { score: 'va' }, { score: 'vs' }, { score: 'vc' }, { score: 'vt' },
          { score: 'dd' },
          { score: 'da' }, { score: 'ds' }, { score: 'dc' }, { score: 'dt' },
          { score: 'va' }, { score: 'dd' }, { score: 'dc' }, { score: 'vt' },
          // ingored for stats
          { score: 'toto' },
          { score: null },
        ];

        this.ret = statEntryTimeResult.reduce(this.battles, 'title');
      }));
      
      it('should forward collection\'s title', function() {
        expect(this.ret.title).toBe('title');
      });
      
      it('should sort collection by date', function() {
        expect(this.battlesService.sort)
          .toHaveBeenCalledWith(this.battles, ['sorts'], 'date', false);
      });
      
      it('should reduce collection by timed result', function() {
        expect(this.ret.values).toEqual([
          [ 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
          [ 1, 0, 1, 0, 0, 0, 0, 0, 0 ],
          [ 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
          [ 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
          [ 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
          [ 1, 1, 1, 1, 1, 0, 0, 0, 1 ],
          [ 1, 1, 1, 1, 1, 0, 1, 0, 1 ],
          [ 1, 1, 1, 1, 1, 0, 1, 1, 1 ],
          [ 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
          [ 2, 1, 1, 1, 1, 1, 1, 1, 1 ],
          [ 2, 1, 1, 1, 2, 1, 1, 1, 1 ],
          [ 2, 1, 1, 1, 2, 1, 1, 2, 1 ],
          [ 2, 1, 1, 2, 2, 1, 1, 2, 1 ],
          [ 2, 1, 1, 2, 2, 1, 1, 2, 1 ],
          [ 2, 1, 1, 2, 2, 1, 1, 2, 1 ]
        ]);
      });
    });
  });

  describe('statEntryPoints', function() {

    var statEntryPoints;
    beforeEach(inject([
      'statEntryPoints',
      function(_statEntryPoints) {
        statEntryPoints = _statEntryPoints;
      }
    ]));

    describe('reduce(<collection>, <title>)', function() {
      beforeEach(function() {
        this.battles = [
          { points: { my_army:  { scenario: 4, army: 35, kill: 42 },
                      opponent: { scenario: 2, army: 25, kill: 12 } } },
          { points: { my_army:  { scenario: 4, army: 35, kill: 42 },
                      opponent: { scenario: 2, army: 25, kill: 12 } } },
          { points: { my_army:  { scenario: 4, army: 35, kill: 42 },
                      opponent: { scenario: 2, army: 25, kill: 12 } } },
          // ignored for stats
          { points: { my_army:  { scenario: null, army: 35, kill: 42 },
                      opponent: { scenario: 2, army: 25, kill: 12 } } },
          { points: { my_army:  { scenario: 4, army: 35, kill: 42 },
                      opponent: { scenario: null, army: 25, kill: 12 } } },
          { points: { my_army:  { scenario: 4, army: null, kill: 42 },
                      opponent: { scenario: 2, army: 25, kill: 12 } } },
          { points: { my_army:  { scenario: 4, army: 35, kill: 42 },
                      opponent: { scenario: 2, army: null, kill: 12 } } },
          { points: { my_army:  { scenario: 4, army: 35, kill: null },
                      opponent: { scenario: 2, army: 25, kill: 12 } } },
          { points: { my_army:  { scenario: 4, army: 35, kill: 42 },
                      opponent: { scenario: 2, army: 25, kill: null } } },
        ];

        this.ret = statEntryPoints.reduce(this.battles, 'title');
      });
      
      it('should forward collection\'s title', function() {
        expect(this.ret.title).toBe('title');
      });
      
      it('should reduce collection by mean points', function() {
        expect(this.ret.values).toEqual({
          Scenario : [ 4, 2 ],
          Army : [ 35, 25 ],
          Kill : [ 42, 12 ]
        });
      });
    });
  });

  describe('statEntryTag', function() {

    var statEntryTag;
    beforeEach(inject([
      'statEntryTag',
      function(_statEntryTag) {
        statEntryTag = _statEntryTag;
      }
    ]));

    describe('reduce(<collection>, <title>)', function() {
      beforeEach(function() {
        this.battles = [
          { tags: ['tag1', 'tag2'] },
          { tags: ['tag3'] },
          { tags: ['tag1', 'tag2'] },
          { tags: ['tag1'] },
          { tags: ['tag2'] },
          { tags: [] },
          { tags: ['tag1'] },
        ];

        this.ret = statEntryTag.reduce(this.battles, 'title');
      });
      
      it('should forward collection\'s title', function() {
        expect(this.ret.title).toBe('title');
      });
      
      it('should reduce collection by mean points', function() {
        expect(this.ret.values).toEqual({
          Tag1 : 4,
          Tag2 : 3,
          Tag3 : 1
        });
      });
    });
  });

});
