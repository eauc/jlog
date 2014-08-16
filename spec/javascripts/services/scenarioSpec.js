'use strict';

describe('service', function() {

  beforeEach(function() {
    module('jlogApp.services');
    console.log = jasmine.createSpy('log');
  });

  describe('scenarios', function() {

    var default_scenarios;
    var scenarios;
    var battle;
    var storage;

    beforeEach(inject([
      'default_scenarios', 'scenarios', 'battle', 'storage',
      function(_default_scenarios, _scenarios, _battle, _storage) {
        default_scenarios = _default_scenarios;
        scenarios = _scenarios;
        battle = _battle;
        storage = _storage;
        spyOn(storage, 'getItem');
        spyOn(storage, 'setItem');
      }]));
    
    it('list should be created with default scenarios list', function() {
      expect(scenarios.list).toEqual(default_scenarios);
    });

    describe('update', function() {

      it('should store current list', function() {
        scenarios.list = {
          'sr13inco': { name: 'SR2013 Incoming' },
          'sr13por': { name: 'SR2013 Point of Rally' },
          'sr13poe': { name: 'SR2013 Process of Elimination' },
        };

        scenarios.update();

        expect(storage.setItem)
          .toHaveBeenCalledWith('jlog_scenarios',
                                JSON.stringify({
                                  'sr13inco': { name: 'SR2013 Incoming' },
                                  'sr13por': { name: 'SR2013 Point of Rally' },
                                  'sr13poe': { name: 'SR2013 Process of Elimination' },
                                }));
      });

    });

    describe('create', function() {

      it('should fill list with default scenarios if argument is not an array', function() {
        scenarios.create('toto');

        expect(scenarios.list).toEqual(default_scenarios);
      });

      it('should merge scenarios names with default scenarios if argument is an array', function() {
        scenarios.create([
          battle({ setup: { scenario: 'sr13inco' }}),
          battle({ setup: { scenario: 'custom' }}),
          battle({ setup: { scenario: 'myown' }})
        ]);

        expect(scenarios.list['custom']).toEqual({ name: 'custom' });
        expect(scenarios.list['myown']).toEqual({ name: 'myown' });
        var scenar;
        for (scenar in default_scenarios) {
          expect(scenarios.list[scenar]).toEqual(default_scenarios[scenar]);
        }                    
      });

      it('should guard against invalid entries in argument', function() {
        scenarios.create([
          battle({ setup: { scenario: null }}),
          battle({ setup: { scenario: 42 }}),
          battle({ setup: { scenarios: 'alphonse' }}),
          battle({ setup: 'tutu' })
        ]);

        expect(scenarios.list).toEqual(default_scenarios);
      });

      it('should store result', function() {
        var expected_scenarios = angular.copy(default_scenarios);
        angular.extend(expected_scenarios, {
          'custom': { name: 'custom' },
          'myown': { name: 'myown' }
        });

        scenarios.create([
          battle({ setup: { scenario: 'sr13inco' }}),
          battle({ setup: { scenario: 'custom' }}),
          battle({ setup: { scenario: 'myown' }})
        ]);

        expect(storage.setItem)
          .toHaveBeenCalledWith('jlog_scenarios', JSON.stringify(expected_scenarios));
      });

    });

    describe('init', function() {

      it('should use stored list if present', function() {
        storage.getItem.and
          .returnValue('{ "toto": { "name": "toto" }, "titi": { "name": "titi" } }');

        scenarios.init([
          battle({ setup: { scenario: 'sr13inco' }}),
          battle({ setup: { scenario: 'custom' }}),
          battle({ setup: { scenario: 'myown' }})
        ]);

        expect(scenarios.list).toEqual({ 
          "toto": { "name": "toto" },
          "titi": { "name": "titi" } 
        });
      });

      it('should use argument if list not present in storage', function() {
        scenarios.init([
          battle({ setup: { scenario: 'sr13inco' }}),
          battle({ setup: { scenario: 'custom' }}),
          battle({ setup: { scenario: 'myown' }})
        ]);

        expect(scenarios.list['custom']).toEqual({ name: 'custom' });
        expect(scenarios.list['myown']).toEqual({ name: 'myown' });
        var scenar;
        for (scenar in default_scenarios) {
          expect(scenarios.list[scenar]).toEqual(default_scenarios[scenar]);
        }                    
      });

    });

    describe('add', function() {

      beforeEach(function() {
        scenarios.init([
          battle({ setup: { scenario: 'sr13inco' }}),
          battle({ setup: { scenario: 'custom' }}),
          battle({ setup: { scenario: 'myown' }})
        ]);
        storage.setItem.calls.reset();

        scenarios.add('dudule');
      });

      it('should add new scenario to the list', function() {
        expect(scenarios.list['dudule']).toEqual({ name: 'dudule' });
      });

      it('should store the new list', function() {
        expect(storage.setItem)
          .toHaveBeenCalledWith('jlog_scenarios',
                            jasmine.any(String));
      });

    });

    describe('remove', function() {

      var initial_list;

      beforeEach(function() {
        scenarios.init([
          battle({ setup: { scenario: 'sr13inco' }}),
          battle({ setup: { scenario: 'custom' }}),
          battle({ setup: { scenario: 'myown' }})
        ]);
        storage.setItem.calls.reset();
        initial_list = scenarios.list;
      });

      describe('when the removed opponent is not in the list', function() {

        beforeEach(function() {
          scenarios.remove('dudule');
        });

        it('should not change the list', function() {
          expect(scenarios.list).toEqual(initial_list);
        });

        it('should not store the list', function() {
          expect(storage.setItem)
            .not.toHaveBeenCalled();
        });

      });

      describe('when the removed event is in the list', function() {

        beforeEach(function() {
          scenarios.remove('custom');
        });

        it('should update the list', function() {
          expect(scenarios.list['custom']).toBe(undefined);
        });

        it('should store the updated list', function() {
          expect(storage.setItem)
            .toHaveBeenCalledWith('jlog_scenarios',
                                  jasmine.any(String));
        });

      });

    });

  });

});
