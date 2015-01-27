'use strict';

describe('service', function() {

  beforeEach(function() {
    module('jlogApp.services');
    console.log = jasmine.createSpy('log');
  });

  function expectObjectToHaveAllDefaultBattleProperties(object) {
    expect(object.date).toBeAn('Object');
    expect(object.date.year).toBeA('Number');
    expect(object.date.month).toBeA('Number');
    expect(object.date.day).toBeA('Number');

    expect(object.my_army).toBeAn('Object');
    expect(object.my_army).toHaveProperty('caster');
    expect(object.my_army).toHaveProperty('faction');

    expect(object.opponent).toBeAn('Object');
    expect(object.opponent).toHaveProperty('name');
    expect(object.opponent).toHaveProperty('caster');
    expect(object.opponent).toHaveProperty('faction');

    expect(object.points).toBeAn('Object');
    expect(object.points.my_army).toBeAn('Object');
    expect(object.points.my_army).toHaveProperty('scenario');
    expect(object.points.my_army).toHaveProperty('army');
    expect(object.points.my_army).toHaveProperty('kill');
    expect(object.points.opponent).toBeAn('Object');
    expect(object.points.opponent).toHaveProperty('scenario');
    expect(object.points.opponent).toHaveProperty('army');
    expect(object.points.opponent).toHaveProperty('kill');

    expect(object.setup).toBeAn('Object');
    expect(object.setup).toHaveProperty('size');
    expect(object.setup).toHaveProperty('scenario');
    expect(object.setup).toHaveProperty('event');
    expect(object.setup).toHaveProperty('initiative');
    expect(object.setup.initiative).toHaveProperty('started');
    expect(object.setup.initiative).toHaveProperty('won_roll');

    expect(object).toHaveProperty('score');
    expect(object).toHaveProperty('comment');
  }

  describe('battle', function() {

    var battle;

    beforeEach(inject([ 'battle', function(_battle) {
      battle = _battle;
    }]));

    it('default object should have all default properties', function() {
      var default_object = battle();

      expectObjectToHaveAllDefaultBattleProperties(default_object);
    });

    it('argument properties override default properties', function() {
      var data = {
        'date': {
          'year': 1983,
          'month': 1,
          'day': 27
        },
        'my_army': {
          'caster': 'vayl1',
          'faction': 'loe'
        },
        'opponent': {
          'name': 'toto',
          'caster': 'irusk1',
          'faction': 'khador'
        },
        'points': {
          'my_army': {
            'scenario': 4,
            'army': 3,
            'kill': 2
          },
          'opponent': {
            'scenario': 1,
            'army': 0,
            'kill': 5
          }
        },
        'setup': {
          'size': 50,
          'scenario': 'sr13inco',
          'event': 'amical',
          'initiative': {
            'won_roll': true,
            'started': false
          },
        },
        'score': 'va',
        'comment': 'coucouc',
        'tags': []
      };
      var object = battle(data);

      expect(angular.equals(object, data)).toBeTruthy();
    });

    it('should recognize the old definition of initiative', function() {
      var data = {
        'initiative': {
          'started': 'true',
          'won_roll': 'false'
        },
      };
      var object = battle(data);

      expect(object.setup.initiative.started).toBe('true');
      expect(object.setup.initiative.won_roll).toBe('false');
    });

    it('should normalize casters name', function() {
      var data = {
        'my_army': {
          'caster': 'vayl',
          'faction': 'loe'
        },
        'opponent': {
          'name': 'toto',
          'caster': 'irusk',
          'faction': 'khador'
        },
      };
      var object = battle(data);

      expect(object.my_army.caster).toEqual('vayl1');
      expect(object.opponent.caster).toEqual('irusk1');
    });

    it('should not change normalized casters name', function() {
      var data = {
        'my_army': {
          'caster': 'vayl2',
          'faction': 'loe'
        },
        'opponent': {
          'name': 'toto',
          'caster': 'irusk2',
          'faction': 'khador'
        },
      };
      var object = battle(data);

      expect(object.my_army.caster).toEqual('vayl2');
      expect(object.opponent.caster).toEqual('irusk2');
    });

    describe('addTag', function(c) {

      beforeEach(function() {
        var data = {
          'tags': [
            'tournament',
            'training',
            'amical'
          ]
        };
        c.instance = battle(data);
        
        c.instance.addTag('archangel');
      });

      it('should add tag to the list and sort it', function() {
        expect(c.instance.tags).toEqual([ 'amical', 'archangel', 'tournament', 'training' ]);
      });

    });

  });

  describe('battles', function() {

    var battle;
    var battles;
    var storage;

    beforeEach(inject([
      'battle', 'battles', 'storage',
      function(_battle, _battles, _storage) {
        battle = _battle;
        battles = _battles;
        storage = _storage;
        spyOn(storage, 'getItem');
        spyOn(storage, 'setItem');
      }]));
    
    it('list should be created empty', function() {
      expect(battles.list).toEqual([]);
    });

    describe('update', function() {

      beforeEach(function() {
        battles.list = [
          battle(),
          battle({index: 45}),
          battle()
        ];
        battles.update();
      });

      it('should build list index', function() {
        expect(battles.list[0].index).toBe(0);
        expect(battles.list[1].index).toBe(1);
        expect(battles.list[2].index).toBe(2);
      });

      it('should store list', function() {
        expect(storage.setItem)
          .toHaveBeenCalledWith('jlog_battles',
                                JSON.stringify(battles.list));
      });

    });

    describe('create', function() {

      beforeEach(function() {
        spyOn(battles, 'update');
      });

      it('should create list empty if argument is not an array', function() {
        battles.create('toto');

        expect(battles.list).toEqual([]);
      });

      it('should fill list if argument is an array', function() {
        battles.create([
          battle(),
          {},
          { toto: 45 }
        ]);

        expect(battles.list.length).toBe(3);
        expectObjectToHaveAllDefaultBattleProperties(battles.list[0]);
        expectObjectToHaveAllDefaultBattleProperties(battles.list[1]);
        expectObjectToHaveAllDefaultBattleProperties(battles.list[2]);
      });

      it('should call "update"', function() {
        battles.create();

        expect(battles.update).toHaveBeenCalled();
      });

    });

    describe('init', function() {

      beforeEach(function() {
        spyOn(battles, 'create');
      });

      it('should create list empty if storage is empty', function() {
        storage.getItem.and.returnValue(null);

        battles.init();

        expect(battles.create).toHaveBeenCalledWith([]);
      });

      it('should fill list if storage is not empty', function() {
        storage.getItem.and.returnValue('[{ "toto":45}]');

        battles.init();

        expect(battles.create).toHaveBeenCalledWith([{'toto':45}]);
      });

    });

    describe('save(index, battle)', function(c) {

      beforeEach(function() {
        spyOn(battles, 'update');

        c.new_battle = battle({});
        c.index = 0;
        storage.getItem.and.returnValue(JSON.stringify([ battle({}), battle({}), battle({}) ]));
        battles.init();
      });

      describe('when index > list.length', function(c) {

        beforeEach(function() {
          c.index = 3;
        });

        it('should append "battle" to the list', function() {
          battles.save(c.index, c.new_battle);
          
          expect(battles.list.length).toBe(4);
          expect(battles.list[3]).toBe(c.new_battle);
        });

      });

      describe('when index <= list.length', function() {

        beforeEach(function() {
          c.index = 2;
        });

        it('should replace "battle" in the list', function() {
          battles.save(c.index, c.new_battle);
          
          expect(battles.list.length).toBe(3);
          expect(battles.list[c.index]).toBe(c.new_battle);
        });

      });

      it('should update the list', function() {
        battles.save(c.index, c.new_battle);
        
        expect(battles.update).toHaveBeenCalled();
      });

    });

    describe('remove(index)', function(c) {

      beforeEach(function() {
        spyOn(battles, 'update');

        c.index = 1;
        storage.getItem.and.returnValue(JSON.stringify([ battle({}), battle({}), battle({}) ]));
        battles.init();
      });

      it('should remove "index" from the list', function() {
        battles.remove(c.index);
          
        expect(battles.list.length).toBe(2);
      });

      it('should update the list', function() {
        battles.remove(c.index);
        
        expect(battles.update).toHaveBeenCalled();
      });

    });

    describe('clear(value)', function(c) {

      beforeEach(function() {
        c.value = 'value';

        spyOn(battles, 'update');
        c.cleaner = jasmine.createSpy().and.callFake(function(value) {
          this.test_value = c.value;
        });

        storage.getItem.and.returnValue(JSON.stringify([ battle({}), battle({}), battle({}) ]));
        battles.init();
      });

      describe('when getter returns string', function() {

        beforeEach(function() {
          c.getter = function() {
            return this === battles.list[1] ? 'value' : 'toto';
          };
          battles.clear(c.value, c.getter, c.cleaner);
        });

        it('should call "cleaner" if "getter" returns "value"', function() {
          expect(c.cleaner.calls.count()).toBe(1);
          expect(c.cleaner).toHaveBeenCalledWith(c.value);
          // test that cleaner has been applied on battles.list[1]
          expect(battles.list[1].test_value).toBe(c.value);
        });

        it('should update the list', function() {
          expect(battles.update).toHaveBeenCalled();
        });
        
      });

      describe('when getter returns array', function() {

        beforeEach(function() {
          c.getter = function() {
            return this === battles.list[1] ? [ 'titi', 'value' ] : ['toto'];
          };
          battles.clear(c.value, c.getter, c.cleaner);
        });

        it('should call "cleaner" if "getter" returns an array containing "value"', function() {
          expect(c.cleaner.calls.count()).toBe(1);
          expect(c.cleaner).toHaveBeenCalledWith(c.value);
          // test that cleaner has been applied on battles.list[1]
          expect(battles.list[1].test_value).toBe(c.value);
        });

        it('should update the list', function() {
          expect(battles.update).toHaveBeenCalled();
        });

      });

    });

  });

});
