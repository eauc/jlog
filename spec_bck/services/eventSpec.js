'use strict';

describe('service', function() {

  beforeEach(function() {
    module('jlogApp.services');
    console.log = jasmine.createSpy('log');
  });

  describe('events', function() {

    var events;
    var battle;
    var storage;

    beforeEach(inject([
      'events', 'battle', 'storage',
      function(_events, _battle, _storage) {
        events = _events;
        battle = _battle;
        storage = _storage;
        spyOn(storage, 'getItem');
        spyOn(storage, 'setItem');
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

    describe('add', function() {

      beforeEach(function() {
        events.init([
          battle({ setup: { event: 'amical' }}),
          battle({ setup: { event: 'uc2013' }}),
          battle({ setup: { event: 'imd2014' }})
        ]);
        storage.setItem.calls.reset();

        events.add('toto');
      });

      it('should add new event to the list and sort it', function() {
        expect(events.list).toEqual([ 'amical', 'imd2014', 'toto', 'uc2013' ]);
      });

      it('should store the new list', function() {
        expect(storage.setItem)
          .toHaveBeenCalledWith('jlog_events',
                                JSON.stringify([ 'amical', 'imd2014', 'toto', 'uc2013' ]));
      });

    });

    describe('remove', function() {

      beforeEach(function() {
        events.init([
          battle({ setup: { event: 'amical' }}),
          battle({ setup: { event: 'uc2013' }}),
          battle({ setup: { event: 'imd2014' }})
        ]);
        storage.setItem.calls.reset();
      });

      describe('when the removed event is not in the list', function() {

        beforeEach(function() {
          events.remove('totot');
        });

        it('should not change the list', function() {
          expect(events.list).toEqual([ 'amical', 'imd2014', 'uc2013' ]);
        });

        it('should not store the list', function() {
          expect(storage.setItem)
            .not.toHaveBeenCalled();
        });

      });

      describe('when the removed event is in the list', function() {

        beforeEach(function() {
          events.remove('imd2014');
        });

        it('should update the list', function() {
          expect(events.list).toEqual([ 'amical', 'uc2013' ]);
        });

        it('should store the updated list', function() {
          expect(storage.setItem)
            .toHaveBeenCalledWith('jlog_events',
                                  JSON.stringify([ 'amical', 'uc2013' ]));
        });

      });

    });

  });

});
