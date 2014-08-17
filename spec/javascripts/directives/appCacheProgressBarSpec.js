'use strict';

describe('directive', function() {

  beforeEach(function() {
    module('jlogApp.directives');
    module('jlogApp.test_services');
    console.log = jasmine.createSpy('log');
  });

  describe('appCache', function(c) {

    var appCache;

    beforeEach(inject([
      '$window',
      'appCache',
      function(_window, _appCache) {
        c.appCache = _window.applicationCache;
        appCache = _appCache;
      }
    ]));

    it('should init progress to 0', function() {
      expect(appCache.progress).toBe(0);
    });

    it('should register all events listeners', function() {
      expect(c.appCache.addEventListener.calls.count() > 0).toBe(true);
      var listener = c.appCache.addEventListener.calls.first().args[1];
      // same listener for all events
      expect(c.appCache.addEventListener)
        .toHaveBeenCalledWith('cached', listener, false);
      expect(c.appCache.addEventListener)
        .toHaveBeenCalledWith('checking', listener, false);
      expect(c.appCache.addEventListener)
        .toHaveBeenCalledWith('downloading', listener, false);
      expect(c.appCache.addEventListener)
        .toHaveBeenCalledWith('error', listener, false);
      expect(c.appCache.addEventListener)
        .toHaveBeenCalledWith('noupdate', listener, false);
      expect(c.appCache.addEventListener)
        .toHaveBeenCalledWith('obsolete', listener, false);
      expect(c.appCache.addEventListener)
        .toHaveBeenCalledWith('progress', listener, false);
      // except for updateready
      expect(c.appCache.addEventListener)
        .toHaveBeenCalledWith('updateready', jasmine.any(Function), false);
    });

    describe('generic event listener', function() {

      beforeEach(function() {
        appCache.onProgress = jasmine.createSpy('onProgress');
        c.listener = c.appCache.addEventListener.calls.first().args[1];
      });

      describe('when event.type != "progress"', function() {

        beforeEach(function() {
          appCache.progress = 1234;

          c.listener({ type: 'cached' });
        });

        it('should reset appCache.progress', function() {
          expect(appCache.progress).toBe(0);
        });

        it('should call onProgress(false)', function() {
          expect(appCache.onProgress).toHaveBeenCalledWith(false);
        });

      });

      describe('when event.type == "progress"', function() {

        beforeEach(function() {
          appCache.progress = 98;

          c.listener({ type: 'progress' });
        });

        it('should increment appCache.progress % 100', function() {
          expect(appCache.progress).toBe(99);

          c.listener({ type: 'progress' });
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

        _.each(c.appCache.addEventListener.calls.all(), function(call) {
          if(call.args[0] === 'updateready') {
            c.listener = call.args[1];
          }
        });
        expect(c.listener).toBeA('Function');
      });

      describe('when appCache.status !== UPDATEREADY', function() {

        beforeEach(function() {
          c.appCache.UPDATEREADY = 1;
          c.appCache.status = 0;
          appCache.progress = 56;

          c.listener({ type: 'updateready' });
        });

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

      describe('when appCache.status === UPDATEREADY', function() {

        beforeEach(function() {
          appCache.UPDATEREADY = 1;
          appCache.status = 1;
          appCache.PROGRESS = 56;

          c.listener({ type: 'updateready' });
        });

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
