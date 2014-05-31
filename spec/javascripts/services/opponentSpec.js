'use strict';

describe('service', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('opponents', function() {

    var opponents;
    var battle;
    var storage;

    beforeEach(inject([
      'opponents', 'battle',
      function(_opponents, _battle) {
        opponents = _opponents;
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
      expect(opponents.list).toEqual([]);
    });

    describe('update', function() {

      it('should store current list', function() {
        opponents.list = [ 'totot', 'henri', 'alphonse' ];

        opponents.update();

        expect(storage.setItem)
          .toHaveBeenCalledWith('jlog_opponents',
                                JSON.stringify([ 'totot' , 'henri', 'alphonse' ]));
      });

    });

    describe('create', function() {

      it('should create list empty if argument is not an array', function() {
        opponents.create('toto');

        expect(opponents.list).toEqual([]);
      });

      it('should fill and sort list with opponent names if argument is an array', function() {
        opponents.create([
          battle({ opponent: { name: 'totot' }}),
          battle({ opponent: { name: 'henri' }}),
          battle({ opponent: { name: 'alphonse' }})
        ]);

        expect(opponents.list.length).toBe(3);
        expect(opponents.list[0]).toEqual('alphonse');
        expect(opponents.list[1]).toEqual('henri');
        expect(opponents.list[2]).toEqual('totot');
      });

      it('should guard against invalid entries in argument', function() {
        opponents.create([
          battle({ opponent: { name: null }}),
          battle({ opponent: { name: 42 }}),
          battle({ opponent: { blah: 'alphonse' }}),
          battle({ opponent: 'tutu' })
        ]);

        expect(opponents.list).toEqual([]);
      });

      it('should store result', function() {
        opponents.create([
          battle({ opponent: { name: 'totot' }}),
          battle({ opponent: { name: 'henri' }}),
          battle({ opponent: { name: 'alphonse' }})
        ]);

        expect(storage.setItem)
          .toHaveBeenCalledWith('jlog_opponents',
                                JSON.stringify([ 'alphonse', 'henri', 'totot' ]));
      });

    });

    describe('init', function() {

      it('should use stored list and sort it if present', function() {
        storage.getItem.and.returnValue('[ "bcd", "abc", "cde" ]');

        opponents.init([
          battle({ opponent: { name: 'totot' }}),
          battle({ opponent: { name: 'henri' }}),
          battle({ opponent: { name: 'alphonse' }})
        ]);

        expect(opponents.list).toEqual([ 'abc', 'bcd', 'cde' ]);
      });

      it('should use argument if list not present in storage', function() {
        opponents.init([
          battle({ opponent: { name: 'totot' }}),
          battle({ opponent: { name: 'henri' }}),
          battle({ opponent: { name: 'alphonse' }})
        ]);

        expect(opponents.list).toEqual([ 'alphonse', 'henri', 'totot' ]);
      });

    });

    describe('add', function() {

      beforeEach(function() {
        opponents.init([
          battle({ opponent: { name: 'totot' }}),
          battle({ opponent: { name: 'henri' }}),
          battle({ opponent: { name: 'alphonse' }})
        ]);
        localStorage.setItem.calls.reset();

        opponents.add('dudule');
      });

      it('should add new opponent to the list and sort it', function() {
        expect(opponents.list).toEqual([ 'alphonse', 'dudule', 'henri', 'totot' ]);
      });

      it('should store the new list', function() {
        expect(localStorage.setItem)
          .toHaveBeenCalledWith('jlog_opponents',
                                JSON.stringify([ 'alphonse', 'dudule', 'henri', 'totot' ]));
      });

    });

    describe('remove', function() {

      beforeEach(function() {
        opponents.init([
          battle({ opponent: { name: 'totot' }}),
          battle({ opponent: { name: 'henri' }}),
          battle({ opponent: { name: 'alphonse' }})
        ]);
        localStorage.setItem.calls.reset();
      });

      describe('when the removed opponent is not in the list', function() {

        beforeEach(function() {
          opponents.remove('dudule');
        });

        it('should not change the list', function() {
          expect(opponents.list).toEqual([ 'alphonse', 'henri', 'totot' ]);
        });

        it('should not store the list', function() {
          expect(localStorage.setItem)
            .not.toHaveBeenCalled();
        });

      });

      describe('when the removed event is in the list', function() {

        beforeEach(function() {
          opponents.remove('henri');
        });

        it('should update the list', function() {
          expect(opponents.list).toEqual([ 'alphonse', 'totot' ]);
        });

        it('should store the updated list', function() {
          expect(localStorage.setItem)
            .toHaveBeenCalledWith('jlog_opponents',
                                  JSON.stringify([ 'alphonse', 'totot' ]));
        });

      });

    });

  });

});
