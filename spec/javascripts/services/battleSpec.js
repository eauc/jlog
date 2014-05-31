'use strict';

describe('service', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  function expectObjectToHaveAllDefaultBattleProperties(object) {
    expect(angular.isObject(object.date)).toBeTruthy();
    expect(angular.isNumber(object.date.year)).toBeTruthy();
    expect(angular.isNumber(object.date.month)).toBeTruthy();
    expect(angular.isNumber(object.date.day)).toBeTruthy();

    expect(angular.isObject(object.my_army)).toBeTruthy();
    expect(object.my_army.hasOwnProperty('caster')).toBeTruthy();
    expect(object.my_army.hasOwnProperty('faction')).toBeTruthy();

    expect(angular.isObject(object.opponent)).toBeTruthy();
    expect(object.opponent.hasOwnProperty('name')).toBeTruthy();
    expect(object.opponent.hasOwnProperty('caster')).toBeTruthy();
    expect(object.opponent.hasOwnProperty('faction')).toBeTruthy();

    expect(angular.isObject(object.points)).toBeTruthy();
    expect(angular.isObject(object.points.my_army)).toBeTruthy();
    expect(object.points.my_army.hasOwnProperty('scenario')).toBeTruthy();
    expect(object.points.my_army.hasOwnProperty('army')).toBeTruthy();
    expect(object.points.my_army.hasOwnProperty('kill')).toBeTruthy();
    expect(angular.isObject(object.points.opponent)).toBeTruthy();
    expect(object.points.opponent.hasOwnProperty('scenario')).toBeTruthy();
    expect(object.points.opponent.hasOwnProperty('army')).toBeTruthy();
    expect(object.points.opponent.hasOwnProperty('kill')).toBeTruthy();

    expect(angular.isObject(object.setup)).toBeTruthy();
    expect(object.setup.hasOwnProperty('size')).toBeTruthy();
    expect(object.setup.hasOwnProperty('scenario')).toBeTruthy();
    expect(object.setup.hasOwnProperty('event')).toBeTruthy();

    expect(object.hasOwnProperty('score')).toBeTruthy();
    expect(object.hasOwnProperty('comment')).toBeTruthy();

    expect(angular.isObject(object.initiative)).toBeTruthy();
    expect(object.initiative.hasOwnProperty('dice')).toBeTruthy();
    expect(object.initiative.hasOwnProperty('start')).toBeTruthy();
  };

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
        },
        'score': 'va',
        'comment': 'coucouc',
        'initiative': {
          'dice': true,
          'start': false
        },
        'tags': []
      };
      var object = battle(data);

      expect(angular.equals(object, data)).toBeTruthy();
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

    describe('addTag', function() {

      var instance;

      beforeEach(function() {
        var data = {
          'tags': [
            'tournament',
            'training',
            'amical'
          ]
        };
        instance = battle(data);
        
        instance.addTag('archangel');
      });

      it('should add tag to the list and sort it', function() {
        expect(instance.tags).toEqual([ 'amical', 'archangel', 'tournament', 'training' ]);
      });

    });

  });

  describe('battles', function() {

    var battle;
    var battles;
    var storage;

    beforeEach(inject([
      'battle', 'battles', '$window',
      function(_battle, _battles, $window) {
        battle = _battle;
        battles = _battles;
        storage = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'clear']);
        Object.defineProperty(window, 'localStorage', {
          value: storage,
          configurable: true,
          enumerable: true,
          writable:true
        });
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

    describe('save(index, battle)', function() {

      var new_battle;
      var index;

      beforeEach(function() {
        spyOn(battles, 'update');

        new_battle = battle({});
        index = 0;
        localStorage.getItem.and.returnValue(JSON.stringify([ battle({}), battle({}), battle({}) ]));
        battles.init();
      });

      describe('when index > list.length', function() {

        beforeEach(function() {
          index = 3;
        });

        it('should append "battle" to the list', function() {
          battles.save(index, new_battle);
          
          expect(battles.list.length).toBe(4);
          expect(battles.list[3]).toBe(new_battle);
        });

      });

      describe('when index <= list.length', function() {

        beforeEach(function() {
          index = 2;
        });

        it('should replace "battle" in the list', function() {
          battles.save(index, new_battle);
          
          expect(battles.list.length).toBe(3);
          expect(battles.list[index]).toBe(new_battle);
        });

      });

      it('should update the list', function() {
        battles.save(index, new_battle);
        
        expect(battles.update).toHaveBeenCalled();
      });

    });

    describe('remove(index)', function() {

      var index;

      beforeEach(function() {
        spyOn(battles, 'update');

        index = 1;
        localStorage.getItem.and.returnValue(JSON.stringify([ battle({}), battle({}), battle({}) ]));
        battles.init();
      });

      it('should remove "index" from the list', function() {
        battles.remove(index);
          
        expect(battles.list.length).toBe(2);
      });

      it('should update the list', function() {
        battles.remove(index);
        
        expect(battles.update).toHaveBeenCalled();
      });

    });

    describe('clear(value)', function() {

      var value = 'value';
      var getter;
      var cleaner;

      beforeEach(function() {
        spyOn(battles, 'update');
        cleaner = jasmine.createSpy().and.callFake(function(value) {
          this.test_value = value;
        });

        localStorage.getItem.and.returnValue(JSON.stringify([ battle({}), battle({}), battle({}) ]));
        battles.init();
      });

      describe('when getter returns string', function() {

        beforeEach(function() {
          getter = function() {
            return this === battles.list[1] ? 'value' : 'toto';
          };
          battles.clear(value, getter, cleaner);
        })

        it('should call "cleaner" if "getter" returns "value"', function() {
          expect(cleaner.calls.count()).toBe(1);
          expect(cleaner).toHaveBeenCalledWith(value);
          // test that cleaner has been applied on battles.list[1]
          expect(battles.list[1].test_value).toBe(value);
        });

        it('should update the list', function() {
          expect(battles.update).toHaveBeenCalled();
        });
        
      });

      describe('when getter returns array', function() {

        beforeEach(function() {
          getter = function() {
            return this === battles.list[1] ? [ 'titi', 'value' ] : ['toto'];
          };
          battles.clear(value, getter, cleaner);
        })

        it('should call "cleaner" if "getter" returns an array containing "value"', function() {
          expect(cleaner.calls.count()).toBe(1);
          expect(cleaner).toHaveBeenCalledWith(value);
          // test that cleaner has been applied on battles.list[1]
          expect(battles.list[1].test_value).toBe(value);
        });

        it('should update the list', function() {
          expect(battles.update).toHaveBeenCalled();
        });

      });

    });

  });

});
