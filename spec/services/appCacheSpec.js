'use strict';

describe('service', function() {

  beforeEach(function() {
    this.windowService = {
      applicationCache: jasmine.createSpyObj('applicationCache', [
        'addEventListener',
      ]),
    };
    module({
      '$window': this.windowService,
    });
    module('jlogApp.services');
  });

  describe('appCache', function(c) {

    beforeEach(inject([
      'appCache',
      function(appCache) {
        this.appCache = appCache;
        this.eventListener = this.windowService.applicationCache
          .addEventListener.calls.first().args[1];

        this.subscriber = jasmine.createSpy('subscriber');
        this.appCache.subscribe('statusChange', this.subscriber);
      }
    ]));

    using([
      [ 'event', 'state' ],
      [ 'cached', { online: 'Online', progress: 0, status: 'done', } ],
      [ 'checking', { online: 'Checking', progress: 0, status: 'checking', } ],
      [ 'downloading', { online: 'Online', progress: 0, status: 'checking', } ],
      [ 'error', { online: 'Offline', progress: 0, status: 'error', } ],
      [ 'noupdate', { online: 'Online', progress: 0, status: 'done', } ],
      [ 'obsolete', { online: 'Online', progress: 0, status: 'done', } ],
      [ 'progress', { online: 'Online', progress: 1, status: 'checking', } ],
      [ 'updateready', { online: 'Online', progress: 0, status: 'ready', } ],
    ], function(e, d) {
      describe('on "'+e.event+'" event', function() {
        beforeEach(function() {
          this.eventListener({ type: e.event });
        });
        
        it('should call subscriber with correct state', function() {
          expect(this.subscriber).toHaveBeenCalledWith(e.state);
        });
      });
    });

    describe('"progress" event should increment', function() {
      beforeEach(function() {
        this.eventListener({ type: "progress" });
        this.eventListener({ type: "progress" });
        this.eventListener({ type: "progress" });
      });
      
      it('should call subscriber with correct state', function() {
        expect(this.subscriber).toHaveBeenCalledWith({
          online: 'Online', progress: 1, status: 'checking'
        });
        expect(this.subscriber).toHaveBeenCalledWith({
          online: 'Online', progress: 2, status: 'checking'
        });
        expect(this.subscriber).toHaveBeenCalledWith({
          online: 'Online', progress: 3, status: 'checking'
        });
      });
    });
  });
});
