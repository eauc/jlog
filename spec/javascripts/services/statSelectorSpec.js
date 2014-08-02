'use strict';

describe('service', function() {

  beforeEach(function() {
    module('jlogApp.services');
    console.log = jasmine.createSpy('log');
  });

  describe('statSelectorMyCaster', function(c) {

    var statSelectorMyCaster;

    beforeEach(inject([
      'statSelectorMyCaster',
      'battle',
      function(_statSelectorMyCaster,
               battle) {
        statSelectorMyCaster = _statSelectorMyCaster;

        c.entryFactory = jasmine.createSpy('entryFactory')
          .and.callFake(function() {
            return jasmine.createSpyObj('statEntry', ['addBattle']);
          });
        c.battles = [
          battle({ my_army: { faction: 'loe', caster: 'saeryn1' } }),
          battle({ my_army: { faction: 'loe', caster: 'kallus1' } }),
          battle({ my_army: { faction: 'khador', caster: 'irusk1' } })
        ];
      }]));

    it('should calculate stat entry for all battles', function() {
      var collec = statSelectorMyCaster(c.battles, c.entryFactory);

      expect(collec.all).toBeAn('Object');
      expect(collec.all.addBattle.calls.count()).toBe(c.battles.length);
      _.each(c.battles, function(battle) {
        expect(collec.all.addBattle).toHaveBeenCalledWith(battle);
      });
    });

    it('should calculate stat entry for each of my factions', function() {
      var collec = statSelectorMyCaster(c.battles, c.entryFactory);

      expect(collec.factions['loe']).toBeAn('Object');
      expect(collec.factions['loe'].all).toBeAn('Object');
      expect(collec.factions['loe'].all.addBattle.calls.count()).toBe(2);
      expect(collec.factions['loe'].all.addBattle).toHaveBeenCalledWith(c.battles[0]);
      expect(collec.factions['loe'].all.addBattle).toHaveBeenCalledWith(c.battles[1]);

      expect(collec.factions['khador']).toBeAn('Object');
      expect(collec.factions['khador'].all).toBeAn('Object');
      expect(collec.factions['khador'].all.addBattle.calls.count()).toBe(1);
      expect(collec.factions['khador'].all.addBattle).toHaveBeenCalledWith(c.battles[2]);
    });

    it('should calculate stat entry for each of my casters', function() {
      var collec = statSelectorMyCaster(c.battles, c.entryFactory);

      expect(collec.factions['loe'].casters['saeryn1']).toBeAn('Object');
      expect(collec.factions['loe'].casters['saeryn1'].addBattle.calls.count()).toBe(1);
      expect(collec.factions['loe'].casters['saeryn1'].addBattle).toHaveBeenCalledWith(c.battles[0]);

      expect(collec.factions['loe'].casters['kallus1']).toBeAn('Object');
      expect(collec.factions['loe'].casters['kallus1'].addBattle.calls.count()).toBe(1);
      expect(collec.factions['loe'].casters['kallus1'].addBattle).toHaveBeenCalledWith(c.battles[1]);

      expect(collec.factions['khador'].casters['irusk1']).toBeAn('Object');
      expect(collec.factions['khador'].casters['irusk1'].addBattle.calls.count()).toBe(1);
      expect(collec.factions['khador'].casters['irusk1'].addBattle).toHaveBeenCalledWith(c.battles[2]);
    });
    
  });

  describe('statSelectorOppName', function(c) {

    var statSelectorOppName;

    beforeEach(inject([
      'statSelectorOppName',
      'battle',
      function(_statSelectorOppName,
               battle) {
        statSelectorOppName = _statSelectorOppName;

        c.entryFactory = jasmine.createSpy('entryFactory')
          .and.callFake(function() {
            return jasmine.createSpyObj('statEntry', ['addBattle']);
          });
        c.battles = [
          battle({ opponent: { name: 'fred' } }),
          battle({ opponent: { name: 'wood' } }),
          battle({ opponent: { name: 'fred' } })
        ];
      }]));

    it('should calculate stat entry for all battles', function() {
      var collec = statSelectorOppName(c.battles, c.entryFactory);

      expect(collec.all).toBeAn('Object');
      expect(collec.all.addBattle.calls.count()).toBe(c.battles.length);
      _.each(c.battles, function(battle) {
        expect(collec.all.addBattle).toHaveBeenCalledWith(battle);
      });
    });

    it('should calculate stat entry for each of opponent names', function() {
      var collec = statSelectorOppName(c.battles, c.entryFactory);

      expect(collec.names['fred']).toBeAn('Object');
      expect(collec.names['fred'].addBattle.calls.count()).toBe(2);
      expect(collec.names['fred'].addBattle).toHaveBeenCalledWith(c.battles[0]);
      expect(collec.names['fred'].addBattle).toHaveBeenCalledWith(c.battles[2]);

      expect(collec.names['wood']).toBeAn('Object');
      expect(collec.names['wood'].addBattle.calls.count()).toBe(1);
      expect(collec.names['wood'].addBattle).toHaveBeenCalledWith(c.battles[1]);
    });
    
  });

  describe('statSelectorOppCaster', function(c) {

    var statSelectorOppCaster;

    beforeEach(inject([
      'statSelectorOppCaster',
      'battle',
      function(_statSelectorOppCaster,
               battle) {
        statSelectorOppCaster = _statSelectorOppCaster;

        c.entryFactory = jasmine.createSpy('entryFactory')
          .and.callFake(function() {
            return jasmine.createSpyObj('statEntry', ['addBattle']);
          });
        c.battles = [
          battle({ opponent: { faction: 'loe', caster: 'saeryn1' } }),
          battle({ opponent: { faction: 'loe', caster: 'kallus1' } }),
          battle({ opponent: { faction: 'khador', caster: 'irusk1' } })
        ];
      }]));

    it('should calculate stat entry for all battles', function() {
      var collec = statSelectorOppCaster(c.battles, c.entryFactory);

      expect(collec.all).toBeAn('Object');
      expect(collec.all.addBattle.calls.count()).toBe(c.battles.length);
      _.each(c.battles, function(battle) {
        expect(collec.all.addBattle).toHaveBeenCalledWith(battle);
      });
    });

    it('should calculate stat entry for each of opponent factions', function() {
      var collec = statSelectorOppCaster(c.battles, c.entryFactory);

      expect(collec.factions['loe']).toBeAn('Object');
      expect(collec.factions['loe'].all).toBeAn('Object');
      expect(collec.factions['loe'].all.addBattle.calls.count()).toBe(2);
      expect(collec.factions['loe'].all.addBattle).toHaveBeenCalledWith(c.battles[0]);
      expect(collec.factions['loe'].all.addBattle).toHaveBeenCalledWith(c.battles[1]);

      expect(collec.factions['khador']).toBeAn('Object');
      expect(collec.factions['khador'].all).toBeAn('Object');
      expect(collec.factions['khador'].all.addBattle.calls.count()).toBe(1);
      expect(collec.factions['khador'].all.addBattle).toHaveBeenCalledWith(c.battles[2]);
    });

    it('should calculate stat entry for each of opponent casters', function() {
      var collec = statSelectorOppCaster(c.battles, c.entryFactory);

      expect(collec.factions['loe'].casters['saeryn1']).toBeAn('Object');
      expect(collec.factions['loe'].casters['saeryn1'].addBattle.calls.count()).toBe(1);
      expect(collec.factions['loe'].casters['saeryn1'].addBattle).toHaveBeenCalledWith(c.battles[0]);

      expect(collec.factions['loe'].casters['kallus1']).toBeAn('Object');
      expect(collec.factions['loe'].casters['kallus1'].addBattle.calls.count()).toBe(1);
      expect(collec.factions['loe'].casters['kallus1'].addBattle).toHaveBeenCalledWith(c.battles[1]);

      expect(collec.factions['khador'].casters['irusk1']).toBeAn('Object');
      expect(collec.factions['khador'].casters['irusk1'].addBattle.calls.count()).toBe(1);
      expect(collec.factions['khador'].casters['irusk1'].addBattle).toHaveBeenCalledWith(c.battles[2]);
    });
    
  });

  describe('statSelectorEvent', function(c) {

    var statSelectorEvent;

    beforeEach(inject([
      'statSelectorEvent',
      'battle',
      function(_statSelectorEvent,
               battle) {
        statSelectorEvent = _statSelectorEvent;

        c.entryFactory = jasmine.createSpy('entryFactory')
          .and.callFake(function() {
            return jasmine.createSpyObj('statEntry', ['addBattle']);
          });
        c.battles = [
          battle({ setup: { event: 'amical' } }),
          battle({ setup: { event: 'lsm14' } }),
          battle({ setup: { event: 'amical' } })
        ];
      }]));

    it('should calculate stat entry for all battles', function() {
      var collec = statSelectorEvent(c.battles, c.entryFactory);

      expect(collec.all).toBeAn('Object');
      expect(collec.all.addBattle.calls.count()).toBe(c.battles.length);
      _.each(c.battles, function(battle) {
        expect(collec.all.addBattle).toHaveBeenCalledWith(battle);
      });
    });

    it('should calculate stat entry for each of setup event', function() {
      var collec = statSelectorEvent(c.battles, c.entryFactory);

      expect(collec.events['amical']).toBeAn('Object');
      expect(collec.events['amical'].addBattle.calls.count()).toBe(2);
      expect(collec.events['amical'].addBattle).toHaveBeenCalledWith(c.battles[0]);
      expect(collec.events['amical'].addBattle).toHaveBeenCalledWith(c.battles[2]);

      expect(collec.events['lsm14']).toBeAn('Object');
      expect(collec.events['lsm14'].addBattle.calls.count()).toBe(1);
      expect(collec.events['lsm14'].addBattle).toHaveBeenCalledWith(c.battles[1]);
    });
    
  });

  describe('statSelectorScenario', function(c) {

    var statSelectorScenario;

    beforeEach(inject([
      'statSelectorScenario',
      'battle',
      function(_statSelectorScenario,
               battle) {
        statSelectorScenario = _statSelectorScenario;

        c.entryFactory = jasmine.createSpy('entryFactory')
          .and.callFake(function() {
            return jasmine.createSpyObj('statEntry', ['addBattle']);
          });
        c.battles = [
          battle({ setup: { scenario: 'sr13inc' } }),
          battle({ setup: { scenario: 'sr13poe' } }),
          battle({ setup: { scenario: 'sr13inc' } })
        ];
      }]));

    it('should calculate stat entry for all battles', function() {
      var collec = statSelectorScenario(c.battles, c.entryFactory);

      expect(collec.all).toBeAn('Object');
      expect(collec.all.addBattle.calls.count()).toBe(c.battles.length);
      _.each(c.battles, function(battle) {
        expect(collec.all.addBattle).toHaveBeenCalledWith(battle);
      });
    });

    it('should calculate stat entry for each of setup scenario', function() {
      var collec = statSelectorScenario(c.battles, c.entryFactory);

      expect(collec.scenarios['sr13inc']).toBeAn('Object');
      expect(collec.scenarios['sr13inc'].addBattle.calls.count()).toBe(2);
      expect(collec.scenarios['sr13inc'].addBattle).toHaveBeenCalledWith(c.battles[0]);
      expect(collec.scenarios['sr13inc'].addBattle).toHaveBeenCalledWith(c.battles[2]);

      expect(collec.scenarios['sr13poe']).toBeAn('Object');
      expect(collec.scenarios['sr13poe'].addBattle.calls.count()).toBe(1);
      expect(collec.scenarios['sr13poe'].addBattle).toHaveBeenCalledWith(c.battles[1]);
    });
    
  });

  describe('statSelectorSize', function(c) {

    var statSelectorSize;

    beforeEach(inject([
      'statSelectorSize',
      'battle',
      function(_statSelectorSize,
               battle) {
        statSelectorSize = _statSelectorSize;

        c.entryFactory = jasmine.createSpy('entryFactory')
          .and.callFake(function() {
            return jasmine.createSpyObj('statEntry', ['addBattle']);
          });
        c.battles = [
          battle({ setup: { size: 50 } }),
          battle({ setup: { size: 35 } }),
          battle({ setup: { size: 50 } })
        ];
      }]));

    it('should calculate stat entry for all battles', function() {
      var collec = statSelectorSize(c.battles, c.entryFactory);

      expect(collec.all).toBeAn('Object');
      expect(collec.all.addBattle.calls.count()).toBe(c.battles.length);
      _.each(c.battles, function(battle) {
        expect(collec.all.addBattle).toHaveBeenCalledWith(battle);
      });
    });

    it('should calculate stat entry for each of setup size', function() {
      var collec = statSelectorSize(c.battles, c.entryFactory);

      expect(collec.sizes['50pts']).toBeAn('Object');
      expect(collec.sizes['50pts'].addBattle.calls.count()).toBe(2);
      expect(collec.sizes['50pts'].addBattle).toHaveBeenCalledWith(c.battles[0]);
      expect(collec.sizes['50pts'].addBattle).toHaveBeenCalledWith(c.battles[2]);

      expect(collec.sizes['35pts']).toBeAn('Object');
      expect(collec.sizes['35pts'].addBattle.calls.count()).toBe(1);
      expect(collec.sizes['35pts'].addBattle).toHaveBeenCalledWith(c.battles[1]);
    });
    
  });

  describe('statSelectorInit', function(c) {

    var statSelectorInit;

    beforeEach(inject([
      'statSelectorInit',
      'battle',
      function(_statSelectorInit,
               battle) {
        statSelectorInit = _statSelectorInit;

        c.entryFactory = jasmine.createSpy('entryFactory')
          .and.callFake(function() {
            return jasmine.createSpyObj('statEntry', ['addBattle']);
          });
        c.battles = [
          battle({ setup: { initiative: { won_roll: "true", started: "false" } } }),
          battle({ setup: { initiative: { won_roll: "true", started: "true" } } }),
          battle({ setup: { initiative: { won_roll: "false", started: "false" } } }),
          battle({ setup: { initiative: { won_roll: "false", started: "true" } } }),
        ];
      }]));

    it('should calculate stat entry for all battles', function() {
      var collec = statSelectorInit(c.battles, c.entryFactory);

      expect(collec.all).toBeAn('Object');
      expect(collec.all.addBattle.calls.count()).toBe(c.battles.length);
      _.each(c.battles, function(battle) {
        expect(collec.all.addBattle).toHaveBeenCalledWith(battle);
      });
    });

    it('should calculate stat entry for each of setup init', function() {
      var collec = statSelectorInit(c.battles, c.entryFactory);

      expect(collec.rw).toBeAn('Object');
      expect(collec.rw.addBattle.calls.count()).toBe(2);
      expect(collec.rw.addBattle).toHaveBeenCalledWith(c.battles[0]);
      expect(collec.rw.addBattle).toHaveBeenCalledWith(c.battles[1]);

      expect(collec.rl).toBeAn('Object');
      expect(collec.rl.addBattle.calls.count()).toBe(2);
      expect(collec.rl.addBattle).toHaveBeenCalledWith(c.battles[2]);
      expect(collec.rl.addBattle).toHaveBeenCalledWith(c.battles[3]);

      expect(collec.pf).toBeAn('Object');
      expect(collec.pf.addBattle.calls.count()).toBe(2);
      expect(collec.pf.addBattle).toHaveBeenCalledWith(c.battles[1]);
      expect(collec.pf.addBattle).toHaveBeenCalledWith(c.battles[3]);

      expect(collec.ps).toBeAn('Object');
      expect(collec.ps.addBattle.calls.count()).toBe(2);
      expect(collec.ps.addBattle).toHaveBeenCalledWith(c.battles[0]);
      expect(collec.ps.addBattle).toHaveBeenCalledWith(c.battles[2]);
    });
    
  });

  describe('statSelectorResult', function(c) {

    var statSelectorResult;

    beforeEach(inject([
      'statSelectorResult',
      'battle',
      function(_statSelectorResult,
               battle) {
        statSelectorResult = _statSelectorResult;

        c.entryFactory = jasmine.createSpy('entryFactory')
          .and.callFake(function() {
            return jasmine.createSpyObj('statEntry', ['addBattle']);
          });
        c.battles = [
          battle({ score: 'va' }),
          battle({ score: 'ds' }),
          battle({ score: 'va' })
        ];
      }]));

    it('should calculate stat entry for all battles', function() {
      var collec = statSelectorResult(c.battles, c.entryFactory);

      expect(collec.all).toBeAn('Object');
      expect(collec.all.addBattle.calls.count()).toBe(c.battles.length);
      _.each(c.battles, function(battle) {
        expect(collec.all.addBattle).toHaveBeenCalledWith(battle);
      });
    });

    it('should calculate stat entry for each of setup result', function() {
      var collec = statSelectorResult(c.battles, c.entryFactory);

      expect(collec.results['va']).toBeAn('Object');
      expect(collec.results['va'].addBattle.calls.count()).toBe(2);
      expect(collec.results['va'].addBattle).toHaveBeenCalledWith(c.battles[0]);
      expect(collec.results['va'].addBattle).toHaveBeenCalledWith(c.battles[2]);

      expect(collec.results['ds']).toBeAn('Object');
      expect(collec.results['ds'].addBattle.calls.count()).toBe(1);
      expect(collec.results['ds'].addBattle).toHaveBeenCalledWith(c.battles[1]);
    });
    
  });

  describe('statSelectorTag', function(c) {

    var statSelectorTag;

    beforeEach(inject([
      'statSelectorTag',
      'battle',
      function(_statSelectorTag,
               battle) {
        statSelectorTag = _statSelectorTag;

        c.entryFactory = jasmine.createSpy('entryFactory')
          .and.callFake(function() {
            return jasmine.createSpyObj('statEntry', ['addBattle']);
          });
        c.battles = [
          battle({ tags: [ 'tournament' ] }),
          battle({ tags: [ 'tournament', 'raek spam' ] }),
          battle({ tags: [ 'tiers4' ] })
        ];
      }]));

    it('should calculate stat entry for all battles', function() {
      var collec = statSelectorTag(c.battles, c.entryFactory);

      expect(collec.all).toBeAn('Object');
      expect(collec.all.addBattle.calls.count()).toBe(c.battles.length);
      _.each(c.battles, function(battle) {
        expect(collec.all.addBattle).toHaveBeenCalledWith(battle);
      });
    });

    it('should calculate stat entry for each of setup tag', function() {
      var collec = statSelectorTag(c.battles, c.entryFactory);

      expect(collec.tags['tournament']).toBeAn('Object');
      expect(collec.tags['tournament'].addBattle.calls.count()).toBe(2);
      expect(collec.tags['tournament'].addBattle).toHaveBeenCalledWith(c.battles[0]);
      expect(collec.tags['tournament'].addBattle).toHaveBeenCalledWith(c.battles[1]);

      expect(collec.tags['tiers4']).toBeAn('Object');
      expect(collec.tags['tiers4'].addBattle.calls.count()).toBe(1);
      expect(collec.tags['tiers4'].addBattle).toHaveBeenCalledWith(c.battles[2]);

      expect(collec.tags['raek spam']).toBeAn('Object');
      expect(collec.tags['raek spam'].addBattle.calls.count()).toBe(1);
      expect(collec.tags['raek spam'].addBattle).toHaveBeenCalledWith(c.battles[1]);
    });
    
  });

});
