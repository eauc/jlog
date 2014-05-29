'use strict';

describe('service', function() {

    beforeEach(function() {
        module('jlogApp.services');
    });

    describe('events', function() {

        var events;
        var battle;
        var storage;

        beforeEach(inject([
            'events', 'battle',
            function(_events, _battle) {
                events = _events;
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
            expect(events.list).toEqual([]);
        });

        describe('update', function() {

            it('should store current list', function() {
                events.list = [ 'amical', 'uc2013', 'imd2014' ];

                events.update();

                expect(storage.setItem)
                    .toHaveBeenCalledWith('jlog_events',
                                          JSON.stringify([ 'amical', 'uc2013', 'imd2014' ]));
            });

        });

        describe('create', function() {

            it('should create list empty if argument is not an array', function() {
                events.create('toto');

                expect(events.list).toEqual([]);
            });

            it('should fill and sort list with event names if argument is an array', function() {
                events.create([
                    battle({ setup: { event: 'amical' }}),
                    battle({ setup: { event: 'uc2013' }}),
                    battle({ setup: { event: 'imd2014' }})
                ]);

                expect(events.list.length).toBe(3);
                expect(events.list[0]).toEqual('amical');
                expect(events.list[1]).toEqual('imd2014');
                expect(events.list[2]).toEqual('uc2013');
            });

            it('should guard against invalid entries in argument', function() {
                events.create([
                    battle({ setup: { event: null }}),
                    battle({ setup: { event: 42 }}),
                    battle({ setup: { events: 'alphonse' }}),
                    battle({ setup: 'tutu' })
                ]);

                expect(events.list).toEqual([]);
            });

            it('should store result', function() {
                events.create([
                    battle({ setup: { event: 'amical' }}),
                    battle({ setup: { event: 'uc2013' }}),
                    battle({ setup: { event: 'imd2014' }})
                ]);

                expect(storage.setItem)
                    .toHaveBeenCalledWith('jlog_events',
                                          JSON.stringify([ 'amical', 'imd2014', 'uc2013' ]));
            });

        });

        describe('init', function() {

            it('should use stored list and sort it if present', function() {
                storage.getItem.and.returnValue('[ "bcd", "abc", "cde" ]');

                events.init([
                    battle({ setup: { event: 'amical' }}),
                    battle({ setup: { event: 'uc2013' }}),
                    battle({ setup: { event: 'imd2014' }})
                ]);

                expect(events.list).toEqual([ 'abc', 'bcd', 'cde' ]);
            });

            it('should use argument if list not present in storage', function() {
                events.init([
                    battle({ setup: { event: 'amical' }}),
                    battle({ setup: { event: 'uc2013' }}),
                    battle({ setup: { event: 'imd2014' }})
                ]);

                expect(events.list).toEqual([ 'amical', 'imd2014', 'uc2013' ]);
            });

        });

    });

});
