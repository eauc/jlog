'use strict';

describe('service', function() {

    beforeEach(function() {
        module('jlogApp.services');
    });

    describe('tags', function() {

        var tags;
        var battle;
        var storage;

        beforeEach(inject([
            'tags', 'battle',
            function(_tags, _battle) {
                tags = _tags;
                battle = _battle;
                storage = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'clear']);
                Object.defineProperty(window, 'localStorage', {
                    value: storage,
                    configurable: true,
                    enumerable: true,
                    writable:true
                });
            }]));
        
        it('list should be created empty', function() {
            expect(tags.list).toEqual([]);
        });

        describe('update', function() {

            it('should store current list', function() {
                tags.list = [ 'amical', 'tournament', 'tiers4' ];

                tags.update();

                expect(storage.setItem)
                    .toHaveBeenCalledWith('jlog_tags',
                                          JSON.stringify([ 'amical', 'tournament', 'tiers4' ]));
            });

        });

        describe('create', function() {

            it('should create list empty if argument is not an array', function() {
                tags.create('toto');

                expect(tags.list).toEqual([]);
            });

            it('should fill and sort list with tag names if argument is an array', function() {
                tags.create([
                    battle({ tags: [ 'amical' ]}),
                    battle({ tags: [ 'tournament', 'tiers4']}),
                    battle({ tags: [ 'tiers4', 'amical' ]})
                ]);

                expect(tags.list.length).toBe(3);
                expect(tags.list[0]).toEqual('amical');
                expect(tags.list[1]).toEqual('tiers4');
                expect(tags.list[2]).toEqual('tournament');
            });

            it('should guard against invalid entries in argument', function() {
                tags.create([
                    battle({ tags: null }),
                    battle({ tags: 'tutu' }),
                    battle({ tags: [ 41, 42 ]}),
                    battle({ setup: 'tutu' })
                ]);

                expect(tags.list).toEqual([]);
            });

            it('should store result', function() {
                tags.create([
                    battle({ tags: [ 'amical' ]}),
                    battle({ tags: [ 'tournament', 'tiers4']}),
                    battle({ tags: [ 'tiers4', 'amical' ]})
                ]);

                expect(storage.setItem)
                    .toHaveBeenCalledWith('jlog_tags',
                                          JSON.stringify([ 'amical', 'tiers4', 'tournament' ]));
            });

        });

        describe('init', function() {

            it('should use stored list and sort it if present', function() {
                storage.getItem.and.returnValue('[ "bcd", "abc", "cde" ]');

                tags.init([
                    battle({ tags: [ 'amical' ]}),
                    battle({ tags: [ 'tournament', 'tiers4']}),
                    battle({ tags: [ 'tiers4', 'amical' ]})
                ]);

                expect(tags.list).toEqual([ 'abc', 'bcd', 'cde' ]);
            });

            it('should use argument if list not present in storage', function() {
                tags.init([
                    battle({ tags: [ 'amical' ]}),
                    battle({ tags: [ 'tournament', 'tiers4']}),
                    battle({ tags: [ 'tiers4', 'amical' ]})
                ]);

                expect(tags.list).toEqual([ 'amical', 'tiers4', 'tournament' ]);
            });

        });

    });

});
