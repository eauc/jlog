'use strict';

angular.module('jlogApp.services')
  .factory('appCache', [
    '$window',
    '$rootScope',
    'pubsub',
    function($window,
             $rootScope,
             pubsub) {
      var state = {
        status: null,
        online: null,
        progress: 0,
      };
      var appCache = $window.applicationCache;
      var channel = pubsub('appCache');
      
      function handleCacheEvent(e) {
        console.log('appcache ' + e.type);

        state.status = 'checking';
        state.online = 'Checking';

        switch(e.type) {
        case 'checking':
          {
            state.progress = 0;
            break;
          }
        case 'downloading':
          {
            state.online = 'Online';
            state.progress = 0;
            break;
          }
        case 'progress':
          {
            state.online = 'Online';
            state.progress = (state.progress + 1) % 100;
            break;
          }
        case 'cached':
        case 'noupdate':
        case 'obsolete':
          {
            state.online = 'Online';
            state.status = 'done';
            state.progress = 0;
            break;
          }
        case 'updateready':
          {
            state.online = 'Online';
            state.status = 'ready';
            state.progress = 0;
            break;
          }
        case 'error':
          {
            state.status = 'error';
            state.online = 'Offline';
            state.progress = 0;
            break;
          }
        }
        channel.publish('statusChange', _.clone(state));
      }
      // Fired after the first cache of the manifest.
      appCache.addEventListener('cached', handleCacheEvent, false);
      // Checking for an update. Always the first event fired in the sequence.
      appCache.addEventListener('checking', handleCacheEvent, false);
      // An update was found. The browser is fetching resources.
      appCache.addEventListener('downloading', handleCacheEvent, false);
      // The manifest returns 404 or 410, the download failed,
      // or the manifest changed while the download was in progress.
      appCache.addEventListener('error', handleCacheEvent, false);
      // Fired after the first download of the manifest.
      appCache.addEventListener('noupdate', handleCacheEvent, false);
      // Fired if the manifest file returns a 404 or 410.
      // This results in the application cache being deleted.
      appCache.addEventListener('obsolete', handleCacheEvent, false);
      // Fired for each resource listed in the manifest as it is being fetched.
      appCache.addEventListener('progress', handleCacheEvent, false);
      // Fired when the manifest resources have been newly redownloaded.
      appCache.addEventListener('updateready', handleCacheEvent, false);

      channel.update = function() {
        appCache.update();
      };

      return channel;
    }
  ]);
