'use strict';

angular.module('jlogApp.services')
  .factory('parseLog', [
    '$window',
    '$http',
    '$q',
    'prompt',
    'parseUrls',
    'parseHeaders',
    'parseStorageKeys',
    function($window,
             $http,
             $q,
             promptService,
             parseUrls,
             parseHeaders,
             parseStorageKeys) {
      var parseLogService = {
        init: function() {
        },
        retrieveInfo: function(user) {
          var request = {
            method: 'GET',
            url: parseUrls.root+'/classes/Log',
            headers: _.extend({
              'X-Parse-Session-Token': user.sessionToken,
            }, parseHeaders),
            params: {
              where: { owner: { __type: "Pointer",
                                className: "_User",
                                objectId: user.objectId
                              }
                     },
              keys: 'updatedAt'
            }
          };
          console.log('Parse Log: get Info', request);
          return $http(request)
            .catch(function(error) {
              return $q.reject(error.data.error);
            })
            .then(function(response) {
              console.log('Parse Log: get Info: success', response);
              var results = response.data.results;
              if(_.isEmpty(results)) {
                return $q.reject('no result');
              }
              return results[0];
            })
            .catch(function(error) {
              console.log('Parse Log: get Info: error', error);
              return $q.reject(error);
            });
        },
        create: function(user, data) {
          data = {
            log: self.LZString.compressToUTF16(JSON.stringify(data)),
            owner: {
              __type: "Pointer",
              className: "_User",
              objectId: user.objectId,
            },
          };
          var request = {
            method: 'POST',
            url: 'https://api.parse.com/1/classes/Log',
            headers: _.extend({
              'X-Parse-Session-Token': user.sessionToken,
            }, parseHeaders),
            data: JSON.stringify(data)
          };
          console.log('Parse Log: create: ', request);
          return $http(request)
            .catch(function(error) {
              console.log('Parse Log: create error: ', error);
              return $q.reject(error.data.error);
            })
            .then(function(response) {
              console.log('Parse Log: create success: ', response);
              return {
                objectId: response.data.objectId,
                updatedAt: response.data.createdAt,
              };
            });
        },
        updateServerFromLocal: function(user, sync, data) {
          return parseLogService.retrieveInfo(user)
            .then(function(server_log) {
              var sync_cmp = {
                last: Date.parse(sync.last),
                current: Date.parse(sync.current),
                server: Date.parse(server_log.updatedAt),
              };
              var doUpdate = $q.when(server_log);
              if(sync_cmp.server > sync_cmp.last ||
                 isNaN(sync_cmp.last)) {
                doUpdate = promptService.prompt('confirm', [
                  'Local data & Online data diverge.',
                  'Do you want to update Online with Local data ?'
                ]).then(function() {
                  return server_log;
                });
              }
              return doUpdate;
            })
            .then(function(log) {
              data = { log: self.LZString.compressToUTF16(JSON.stringify(data)) };
              var request = {
                method: 'PUT',
                url: [ 'https://api.parse.com/1/classes/Log/',
                       log.objectId ].join(''),
                headers: _.extend({
                  'X-Parse-Session-Token': user.sessionToken,
                  'Content-Type': 'application/json',
                }, parseHeaders),
                data: JSON.stringify(data)
              };
              console.log('Parse Log: update: ', request);
              console.log('Parse Log: update: ', request.data.length);
              return $http(request)
                .catch(function(error) {
                  console.log('Parse Log: udpate error:', error.data.error);
                  return $q.reject(error.data.error);
                })
                .then(function(response) {
                  console.log('Parse Log: update success: ', response);
                  return [_.extend(log, { updatedAt: response.data.updatedAt })];
                });
            });
        },
        updateLocalFromServer: function(user, sync, data) {
          return parseLogService.retrieveInfo(user)
            .then(function(server_log) {
              var sync_cmp = {
                last: Date.parse(sync.last),
                current: Date.parse(sync.current),
                server: Date.parse(server_log.updatedAt),
              };
              var doUpdate = $q.when(server_log);
              if(sync_cmp.server <= sync_cmp.last) {
                return $q.reject('server is behind');
              }
              if(!_.isEmpty(data) &&
                 isNaN(sync_cmp.current) &&
                 ( sync_cmp.server > sync_cmp.last ||
                   isNaN(sync_cmp.last) )) {
                doUpdate = promptService.prompt('confirm', [
                  'Local data & Online data diverge.',
                  'Do you want to update Local with Online data ?'
                ]).then(function() {
                  return server_log;
                });
              }
              return promptService.prompt('confirm', [
                'Online data is newer than Local data.',
                'Do you want to update Local with Online data ?'
              ]).then(function() {
                return server_log;
              });
            })
            .then(function(log) {
              var request = {
                method: 'GET',
                url: [ parseUrls.root,
                       '/classes/Log/',
                       log.objectId ].join(''),
                headers: _.extend({
                  'X-Parse-Session-Token': user.sessionToken,
                }, parseHeaders),
                params: {
                  keys: 'log'
                }
              };
              console.log('Parse Log: update from server', request);
              return $http(request)
                .catch(function(error) { 
                  console.log('Parse Log: update from server: error: ', error.data.error);
                  return $q.reject(error.data.error);
                })
                .then(function(response) {
                  console.log('Parse Log: update from server: success: ', response);
                  return response.data;
                })
                .then(function(data) {
                  return [ {
                    objectId: data.objectId,
                    updatedAt: data.updatedAt,
                  }, JSON.parse(self.LZString.decompressFromUTF16(data.log)) ];
                });
            });
        },
        sync: function(user, sync, data) {
          return parseLogService.retrieveInfo(user)
            .catch(function() {
              return parseLogService.create(user, data)
                .then(function(log) {
                  sync = { last: log.updatedAt, current: log.updatedAt };
                  return log;
                });
            })
            .then(function(server_log) {
              if(sync.current === server_log.updatedAt) {
                console.log('Log Sync: local & server synced');
                return [server_log];
              }
              return parseLogService.updateLocalFromServer(user, sync, data)
                .catch(function() {
                  return parseLogService.updateServerFromLocal(user, sync, data);
                })
                .catch(function() {
                  console.log('Log Sync: local & server diverge');
                  return $q.reject('diverge');
                });
            });
        }
      };
      function serverIsAhead(sync) {
        return ( ( sync.server > sync.last &&
                   sync.last === sync.current
                 )
               );
      }
      function serverIsBehind(sync) {
        return (sync.server === sync.last &&
                isNaN(sync.current)
               );
      }
      return parseLogService;
    }
  ]);
