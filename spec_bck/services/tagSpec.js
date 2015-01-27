'use strict';

describe('service', function() {

  beforeEach(function() {
    module('jlogApp.services');
    console.log = jasmine.createSpy('log');
  });

  describe('tags', function() {

    var tags;
    var battle;
    var storage;

    beforeEach(inject([
      'tags', 'battle', 'storage',
      function(_tags, _battle, _storage) {
        tags = _tags;
        battle = _battle;
        storage = _storage;
        spyOn(storage, 'getItem');
        spyOn(storage, 'setItem');
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

    describe('add', function() {

      beforeEach(function() {
        tags.init([
          battle({ tags: [ 'amical' ]}),
          battle({ tags: [ 'tournament', 'tiers4']}),
          battle({ tags: [ 'tiers4', 'amical' ]})
        ]);
        storage.setItem.calls.reset();

        tags.add('dudule');
      });

      it('should add new tag to the list and sort it', function() {
        expect(tags.list).toEqual([ 'amical', 'dudule', 'tiers4', 'tournament' ]);
      });

      it('should store the new list', function() {
        expect(storage.setItem)
          .toHaveBeenCalledWith('jlog_tags',
                                JSON.stringify([ 'amical', 'dudule', 'tiers4', 'tournament' ]));
      });

    });

    describe('remove', function() {

      beforeEach(function() {
        tags.init([
          battle({ tags: [ 'amical' ]}),
          battle({ tags: [ 'tournament', 'tiers4']}),
          battle({ tags: [ 'tiers4', 'amical' ]})
        ]);
        storage.setItem.calls.reset();
      });

      describe('when the removed opponent is not in the list', function() {

        beforeEach(function() {
          tags.remove('dudule');
        });

        it('should not change the list', function() {
          expect(tags.list).toEqual([ 'amical', 'tiers4', 'tournament' ]);
        });

        it('should not store the list', function() {
          expect(storage.setItem)
            .not.toHaveBeenCalled();
        });

      });

      describe('when the removed event is in the list', function() {

        beforeEach(function() {
          tags.remove('tiers4');
        });

        it('should update the list', function() {
          expect(tags.list).toEqual([ 'amical', 'tournament' ]);
        });

        it('should store the updated list', function() {
          expect(storage.setItem)
            .toHaveBeenCalledWith('jlog_tags',
                                  JSON.stringify([ 'amical', 'tournament' ]));
        });

      });

    });

  });

});
