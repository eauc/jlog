'use strict';

describe('service', function() {

  beforeEach(function() {
    module('jlogApp.services');
    console.log = jasmine.createSpy('log');
  });

  describe('statEntryInit', function(c) {

    beforeEach(inject([
      'statEntryInit',
      function(statEntryInit) {
        c.stat_entry = statEntryInit();
      }]));
    
    describe('initial instance', function() {

      it('should be empty', function() {
        expect(c.stat_entry.rw).toBe(0);
        expect(c.stat_entry.rl).toBe(0);
        expect(c.stat_entry.pf).toBe(0);
        expect(c.stat_entry.ps).toBe(0);
      });

    });
    
    describe('instance.addBattle(<battle>)', function(c) {

      beforeEach(function() {
        c.battle = {
          setup: {
            initiative: {
              won_roll: "",
              started: ""
            }
          }
        };
      });

      using(null, [
        [ 'won_roll', 'rw', 'rl' ],
        [ 'started', 'pf', 'ps' ],
      ], function(init_key, entry_key_true, entry_key_false) {
        describe('when <battle>.setup.initiative.'+init_key+' == "true"', function() {
          it('should increment instance.'+entry_key_true, function() {
            c.battle.setup.initiative[init_key] = "true";
            c.stat_entry.addBattle(c.battle);

            expect(c.stat_entry[entry_key_true]).toBe(1);
          });
        });

        describe('when <battle>.setup.initiative.'+init_key+' == "false"', function() {
          it('should increment instance.'+entry_key_false, function() {
            c.battle.setup.initiative[init_key] = "false";
            c.stat_entry.addBattle(c.battle);

            expect(c.stat_entry[entry_key_false]).toBe(1);
          });
        });
      });

    });

  });

  describe('statEntryResult', function(c) {

    beforeEach(inject([
      'statEntryResult',
      function(statEntryResult) {
        c.stat_entry = statEntryResult();
      }]));
    
    describe('initial instance', function() {

      it('should be empty', function() {
        expect(c.stat_entry.va).toBe(0);
        expect(c.stat_entry.vc).toBe(0);
        expect(c.stat_entry.vs).toBe(0);
        expect(c.stat_entry.vt).toBe(0);

        expect(c.stat_entry.dd).toBe(0);

        expect(c.stat_entry.da).toBe(0);
        expect(c.stat_entry.dc).toBe(0);
        expect(c.stat_entry.ds).toBe(0);
        expect(c.stat_entry.dt).toBe(0);
      });

    });
    
    describe('instance.addBattle(<battle>)', function() {

      using(null, [
        'va', 'vc', 'vs', 'vt',
        'dd',
        'da', 'dc', 'ds', 'dt',
      ], function(score) {
        describe('when <battle>.score == "'+score+'"', function() {
          it('should increment instance.'+score, function() {
            c.stat_entry.addBattle({ score: score });

            expect(c.stat_entry[score]).toBe(1);
          });
        });
      });

    });

  });

});
