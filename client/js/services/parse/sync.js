'use strict';

angular.module('jlogApp.services')
  .factory('parseSync', [
    '$window',
    '$http',
    '$q',
    'parseUrls',
    'parseHeaders',
    'parseStorageKeys',
    function($window,
             $http,
             $q,
             parseUrls,
             parseHeaders,
             parseStorageKeys) {
      function storeData(data) {
        $window.localStorage.setItem(parseStorageKeys.sync, JSON.stringify(data));
        console.log('Parse Sync: store data: ', data);
      }
      var parseSyncService = {
        init: function() {
          console.log('Parse Sync: load data from storage');
          return $q.when($window.localStorage.getItem(parseStorageKeys.sync))
            .then(JSON.parse)
            .catch(function(error) {
              console.log('Parse Sync: invalid data in storage', error);
            })
            .then(function(sync) {
              sync = sync || {};
              sync = _.extend({ last: null, current: null }, sync);
              console.log('Parse Sync: load data: ', sync);
              return sync;
            });
        },
        validate: function(at) {
          var sync = {
            last: at,
            current: at,
          };
          storeData(sync);
          return sync;
        },
        unvalidate: function(sync) {
          sync.current = null;
          storeData(sync);
          return sync;
        },
        clear: function() {
          $window.localStorage.removeItem(parseStorageKeys.sync);
        },
      };
      return parseSyncService;
    }
  ]);
