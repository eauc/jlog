'use strict';

describe('services', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('parseSync', function() {

    beforeEach(inject([
      'parseSync',
      function(parseSync) {
        this.parseSyncService = parseSync;

        spyOn(self.localStorage, 'getItem');
        spyOn(self.localStorage, 'setItem');
        spyOn(self.localStorage, 'removeItem');
      }
    ]));

    describe('init()', function() {
      beforeEach(inject([
        '$rootScope',
        function($rootScope) {
          self.localStorage.getItem
            .and.returnValue('{ "sync": "sync" }');
          
          this.parseSyncService.init()
            .then((function(result) {
              this.result = result;
            }).bind(this));

          $rootScope.$digest();
        }
      ]));

      it('should retrieve sync state from local storage', function() {
        expect(self.localStorage.getItem)
          .toHaveBeenCalledWith('jlogApp.parse.sync');
      });

      it('should return stored state extended with default values', function() {
        expect(this.result)
          .toEqual({
            last: null,
            current: null,
            sync: 'sync'
          });
      });
    });

    describe('validate(<at>)', function() {
      beforeEach(function() {
        this.ret = this.parseSyncService.validate('at');
      });

      it('should store validated state in local storage', function() {
        expect(self.localStorage.setItem)
          .toHaveBeenCalledWith('jlogApp.parse.sync', '{"last":"at","current":"at"}');
      });

      it('should return validated state', function() {
        expect(this.ret)
          .toEqual({
            last: 'at',
            current: 'at'
          });
      });
    });

    describe('unvalidate(<sync>)', function() {
      beforeEach(function() {
        this.ret = this.parseSyncService.unvalidate({
          last: 'last',
          current: 'current'
        });
      });

      it('should store unvalidated state in local storage', function() {
        expect(self.localStorage.setItem)
          .toHaveBeenCalledWith('jlogApp.parse.sync', '{"last":"last","current":null}');
      });

      it('should return unvalidated state', function() {
        expect(this.ret)
          .toEqual({
            last: 'last',
            current: null
          });
      });
    });

    describe('clear()', function() {
      beforeEach(function() {
        this.parseSyncService.clear();
      });

      it('should remove sync state from local storage', function() {
        expect(self.localStorage.removeItem)
          .toHaveBeenCalledWith('jlogApp.parse.sync');
      });
    });
  });
});
