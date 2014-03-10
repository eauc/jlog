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
                }
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
                    .toHaveBeenCalledWith('jlog_battles', battles.list);
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

    });

});
