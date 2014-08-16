'use strict';

describe('service', function() {

  beforeEach(function() {
    module('jlogApp.services');
    console.log = jasmine.createSpy('log');
  });

  describe('storage', function(c) {

    var storage;

    beforeEach(inject([
      'storage',
      function(_storage) {
        storage = _storage;
        spyOn(storage, 'setItem');
        spyOn(storage, 'getItem');
      }]));
    
    describe('clearJLogKeys', function() {

      it('should clear all keys in localStorage', function() {
        storage.clearJLogKeys();

        expect(storage.setItem.calls.count()).toBe(6);

        expect(storage.setItem).toHaveBeenCalledWith('jlog_battles', '');
        expect(storage.setItem).toHaveBeenCalledWith('jlog_filter', '');
        expect(storage.setItem).toHaveBeenCalledWith('jlog_events', '');
        expect(storage.setItem).toHaveBeenCalledWith('jlog_opponents', '');
        expect(storage.setItem).toHaveBeenCalledWith('jlog_scenarios', '');
        expect(storage.setItem).toHaveBeenCalledWith('jlog_tags', '');
      });

    });

  });

});
