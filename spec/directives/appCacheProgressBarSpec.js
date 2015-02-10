'use strict';

describe('directive', function() {

  beforeEach(function() {
    angular.module('jlogApp.directives')
      .factory('$window', [
        function() {
          return {
            applicationCache: jasmine.createSpyObj('applicationCache', [
              'addEventListener',
            ]),
          };
        }
      ]);
    module('jlogApp.directives');
  });

  describe('appCache', function(c) {

    var appCache;

    beforeEach(inject([
      '$window',
      'appCache',
      function(_window, _appCache) {
        this.appCacheService = _window.applicationCache;
        appCache = _appCache;
      }
    ]));

    it('should init progress to 0', function() {
      expect(appCache.progress).toBe(0);
    });

    it('should register all events listeners', function() {
      expect(this.appCacheService.addEventListener.calls.count() > 0).toBe(true);
      var listener = this.appCacheService.addEventListener.calls.first().args[1];
      // same listener for all events
      expect(this.appCacheService.addEventListener)
        .toHaveBeenCalledWith('cached', listener, false);
      expect(this.appCacheService.addEventListener)
        .toHaveBeenCalledWith('checking', listener, false);
      expect(this.appCacheService.addEventListener)
        .toHaveBeenCalledWith('downloading', listener, false);
      expect(this.appCacheService.addEventListener)
        .toHaveBeenCalledWith('error', listener, false);
      expect(this.appCacheService.addEventListener)
        .toHaveBeenCalledWith('noupdate', listener, false);
      expect(this.appCacheService.addEventListener)
        .toHaveBeenCalledWith('obsolete', listener, false);
      expect(this.appCacheService.addEventListener)
        .toHaveBeenCalledWith('progress', listener, false);
      // except for updateready
      expect(this.appCacheService.addEventListener)
        .toHaveBeenCalledWith('updateready', jasmine.any(Function), false);
    });

    describe('generic event listener', function() {
      beforeEach(function() {
        appCache.onProgress = jasmine.createSpy('onProgress');
        this.listener = this.appCacheService.addEventListener.calls.first().args[1];
      });

      when('event.type != "progress"', function() {
        appCache.progress = 1234;
        this.listener({ type: 'cached' });
      }, function() {
        it('should reset appCache.progress', function() {
          expect(appCache.progress).toBe(0);
        });

        it('should call onProgress(false)', function() {
          expect(appCache.onProgress).toHaveBeenCalledWith(false);
        });
      });

      when('event.type == "progress"', function() {
        appCache.progress = 98;
        this.listener({ type: 'progress' });
      }, function() {
        it('should increment appCache.progress % 100', function() {
          expect(appCache.progress).toBe(99);

          this.listener({ type: 'progress' });
          expect(appCache.progress).toBe(0);
        });

        it('should call onProgress(true)', function() {
          expect(appCache.onProgress).toHaveBeenCalledWith(true);
        });
      });
    });

    describe('"updateready" event listener', function() {
      beforeEach(function() {
        appCache.onProgress = jasmine.createSpy('onProgress');
        appCache.onUpdateReady = jasmine.createSpy('onUpdateReady');

        var ctxt = this;
        _.each(this.appCacheService.addEventListener.calls.all(), function(call) {
          if(call.args[0] === 'updateready') {
            ctxt.listener = call.args[1];
          }
        });
        expect(this.listener).toBeA('Function');
      });

      when('appCache.status !== UPDATEREADY', function() {
        this.appCacheService.UPDATEREADY = 1;
        this.appCacheService.status = 0;
        appCache.progress = 56;

        this.listener({ type: 'updateready' });
      }, function() {
        it('should reset appCache.progress', function() {
          expect(appCache.progress).toBe(0);
        });

        it('should not call onUpdateReady', function() {
          expect(appCache.onUpdateReady).not.toHaveBeenCalled();
        });

        it('should call onProgress(false)', function() {
          expect(appCache.onProgress).toHaveBeenCalledWith(false);
        });
      });

      when('appCache.status === UPDATEREADY', function() {
        appCache.UPDATEREADY = 1;
        appCache.status = 1;
        appCache.PROGRESS = 56;

        this.listener({ type: 'updateready' });
      }, function() {
        it('should reset appCache.progress', function() {
          expect(appCache.progress).toBe(0);
        });

        it('should call onUpdateReady', function() {
          expect(appCache.onUpdateReady).toHaveBeenCalled();
        });

        it('should call onProgress(false)', function() {
          expect(appCache.onProgress).toHaveBeenCalledWith(false);
        });
      });
    });
  });

});
