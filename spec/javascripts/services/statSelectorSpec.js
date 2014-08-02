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

    it('should calculate stat entry for each of my factions', function() {
      var collec = statSelectorMyCaster(c.battles, c.entryFactory);

      expect(collec['loe']).toBeAn('Object');
      expect(collec['loe'].all).toBeAn('Object');
      expect(collec['loe'].all.addBattle.calls.count()).toBe(2);
      expect(collec['loe'].all.addBattle).toHaveBeenCalledWith(c.battles[0]);
      expect(collec['loe'].all.addBattle).toHaveBeenCalledWith(c.battles[1]);

      expect(collec['khador']).toBeAn('Object');
      expect(collec['khador'].all).toBeAn('Object');
      expect(collec['khador'].all.addBattle.calls.count()).toBe(1);
      expect(collec['khador'].all.addBattle).toHaveBeenCalledWith(c.battles[2]);
    });

    it('should calculate stat entry for each of my casters', function() {
      var collec = statSelectorMyCaster(c.battles, c.entryFactory);

      expect(collec['loe'].casters['saeryn1']).toBeAn('Object');
      expect(collec['loe'].casters['saeryn1'].addBattle.calls.count()).toBe(1);
      expect(collec['loe'].casters['saeryn1'].addBattle).toHaveBeenCalledWith(c.battles[0]);

      expect(collec['loe'].casters['kallus1']).toBeAn('Object');
      expect(collec['loe'].casters['kallus1'].addBattle.calls.count()).toBe(1);
      expect(collec['loe'].casters['kallus1'].addBattle).toHaveBeenCalledWith(c.battles[1]);

      expect(collec['khador'].casters['irusk1']).toBeAn('Object');
      expect(collec['khador'].casters['irusk1'].addBattle.calls.count()).toBe(1);
      expect(collec['khador'].casters['irusk1'].addBattle).toHaveBeenCalledWith(c.battles[2]);
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

    it('should calculate stat entry for each of opponent names', function() {
      var collec = statSelectorOppName(c.battles, c.entryFactory);

      expect(collec['fred']).toBeAn('Object');
      expect(collec['fred'].addBattle.calls.count()).toBe(2);
      expect(collec['fred'].addBattle).toHaveBeenCalledWith(c.battles[0]);
      expect(collec['fred'].addBattle).toHaveBeenCalledWith(c.battles[2]);

      expect(collec['wood']).toBeAn('Object');
      expect(collec['wood'].addBattle.calls.count()).toBe(1);
      expect(collec['wood'].addBattle).toHaveBeenCalledWith(c.battles[1]);
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

    it('should calculate stat entry for each of opponent factions', function() {
      var collec = statSelectorOppCaster(c.battles, c.entryFactory);

      expect(collec['loe']).toBeAn('Object');
      expect(collec['loe'].all).toBeAn('Object');
      expect(collec['loe'].all.addBattle.calls.count()).toBe(2);
      expect(collec['loe'].all.addBattle).toHaveBeenCalledWith(c.battles[0]);
      expect(collec['loe'].all.addBattle).toHaveBeenCalledWith(c.battles[1]);

      expect(collec['khador']).toBeAn('Object');
      expect(collec['khador'].all).toBeAn('Object');
      expect(collec['khador'].all.addBattle.calls.count()).toBe(1);
      expect(collec['khador'].all.addBattle).toHaveBeenCalledWith(c.battles[2]);
    });

    it('should calculate stat entry for each of opponent casters', function() {
      var collec = statSelectorOppCaster(c.battles, c.entryFactory);

      expect(collec['loe'].casters['saeryn1']).toBeAn('Object');
      expect(collec['loe'].casters['saeryn1'].addBattle.calls.count()).toBe(1);
      expect(collec['loe'].casters['saeryn1'].addBattle).toHaveBeenCalledWith(c.battles[0]);

      expect(collec['loe'].casters['kallus1']).toBeAn('Object');
      expect(collec['loe'].casters['kallus1'].addBattle.calls.count()).toBe(1);
      expect(collec['loe'].casters['kallus1'].addBattle).toHaveBeenCalledWith(c.battles[1]);

      expect(collec['khador'].casters['irusk1']).toBeAn('Object');
      expect(collec['khador'].casters['irusk1'].addBattle.calls.count()).toBe(1);
      expect(collec['khador'].casters['irusk1'].addBattle).toHaveBeenCalledWith(c.battles[2]);
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

    it('should calculate stat entry for each of setup event', function() {
      var collec = statSelectorEvent(c.battles, c.entryFactory);

      expect(collec['amical']).toBeAn('Object');
      expect(collec['amical'].addBattle.calls.count()).toBe(2);
      expect(collec['amical'].addBattle).toHaveBeenCalledWith(c.battles[0]);
      expect(collec['amical'].addBattle).toHaveBeenCalledWith(c.battles[2]);

      expect(collec['lsm14']).toBeAn('Object');
      expect(collec['lsm14'].addBattle.calls.count()).toBe(1);
      expect(collec['lsm14'].addBattle).toHaveBeenCalledWith(c.battles[1]);
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

    it('should calculate stat entry for each of setup scenario', function() {
      var collec = statSelectorScenario(c.battles, c.entryFactory);

      expect(collec['sr13inc']).toBeAn('Object');
      expect(collec['sr13inc'].addBattle.calls.count()).toBe(2);
      expect(collec['sr13inc'].addBattle).toHaveBeenCalledWith(c.battles[0]);
      expect(collec['sr13inc'].addBattle).toHaveBeenCalledWith(c.battles[2]);

      expect(collec['sr13poe']).toBeAn('Object');
      expect(collec['sr13poe'].addBattle.calls.count()).toBe(1);
      expect(collec['sr13poe'].addBattle).toHaveBeenCalledWith(c.battles[1]);
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

    it('should calculate stat entry for each of setup size', function() {
      var collec = statSelectorSize(c.battles, c.entryFactory);

      expect(collec['50pts']).toBeAn('Object');
      expect(collec['50pts'].addBattle.calls.count()).toBe(2);
      expect(collec['50pts'].addBattle).toHaveBeenCalledWith(c.battles[0]);
      expect(collec['50pts'].addBattle).toHaveBeenCalledWith(c.battles[2]);

      expect(collec['35pts']).toBeAn('Object');
      expect(collec['35pts'].addBattle.calls.count()).toBe(1);
      expect(collec['35pts'].addBattle).toHaveBeenCalledWith(c.battles[1]);
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

    it('should calculate stat entry for each of setup result', function() {
      var collec = statSelectorResult(c.battles, c.entryFactory);

      expect(collec['va']).toBeAn('Object');
      expect(collec['va'].addBattle.calls.count()).toBe(2);
      expect(collec['va'].addBattle).toHaveBeenCalledWith(c.battles[0]);
      expect(collec['va'].addBattle).toHaveBeenCalledWith(c.battles[2]);

      expect(collec['ds']).toBeAn('Object');
      expect(collec['ds'].addBattle.calls.count()).toBe(1);
      expect(collec['ds'].addBattle).toHaveBeenCalledWith(c.battles[1]);
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

    it('should calculate stat entry for each of setup tag', function() {
      var collec = statSelectorTag(c.battles, c.entryFactory);

      expect(collec['tournament']).toBeAn('Object');
      expect(collec['tournament'].addBattle.calls.count()).toBe(2);
      expect(collec['tournament'].addBattle).toHaveBeenCalledWith(c.battles[0]);
      expect(collec['tournament'].addBattle).toHaveBeenCalledWith(c.battles[1]);

      expect(collec['tiers4']).toBeAn('Object');
      expect(collec['tiers4'].addBattle.calls.count()).toBe(1);
      expect(collec['tiers4'].addBattle).toHaveBeenCalledWith(c.battles[2]);

      expect(collec['raek spam']).toBeAn('Object');
      expect(collec['raek spam'].addBattle.calls.count()).toBe(1);
      expect(collec['raek spam'].addBattle).toHaveBeenCalledWith(c.battles[1]);
    });
    
  });

});
