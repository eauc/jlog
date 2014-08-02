'use strict';

describe('service', function() {

  beforeEach(function() {
    module('jlogApp.filters');
    module('jlogApp.services');
    console.log = jasmine.createSpy('log');
  });

  describe('stats', function(c) {

    var stats;
    var battle;
    var battles_display;

    beforeEach(inject([
      'stats',
      'battle',
      'battles_display',
      function(_stats,
               _battle,
               _battles_display) {
        stats = _stats;
        battle = _battle;
        battles_display = _battles_display;
      }]));
    
    describe('initial collections', function() {

      it('should be empty', function() {
        expect(stats.collections).toEqual({});
      });

    });

    describe('generate(<entry>, <selector>)', function(c) {
      
      beforeEach(function() {
        c.mock_entry = jasmine.createSpyObj('entry', ['addBattle']);
        c.mock_selection = {};
        stats.ENTRIES['test'] = {
          desc: 'Test',
          factory: jasmine.createSpy('entryFactory')
            .and.callFake(function() {
              return c.mock_entry;
            })
        };
        stats.SELECTORS['test'] = {
          desc: 'Test',
          factory: jasmine.createSpy('selectorFactory')
            .and.returnValue(c.mock_selection)
        };
        battles_display.sorted_list = [
          battle({ my_caster: { faction: 'loe' } }),
          battle({ my_caster: { faction: 'khador' } }),
          battle({ my_caster: { faction: 'cryx' } }),
        ];

        stats.generate('test', 'test');
      });

      it('should create total stats for <entry>', function() {
        expect(stats.collections['test']).toBeAn('Object');

        expect(stats.collections['test'].all).toBe(c.mock_entry);
        expect(c.mock_entry.addBattle.calls.count()).toBe(battles_display.sorted_list.length);
        _.each(battles_display.sorted_list, function(battle) {
          expect(c.mock_entry.addBattle).toHaveBeenCalledWith(battle);
        });
      });

      it('should create stats for <entry>.<selector>', function() {
        expect(stats.collections['test']['test']).toBe(c.mock_selection);

        expect(stats.SELECTORS['test'].factory)
          .toHaveBeenCalledWith(battles_display.sorted_list,
                                stats.ENTRIES['test'].factory);
      });

    });

  });

});
