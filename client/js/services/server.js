'use strict';

angular.module('jlogApp.services')
  .factory('server', [
    '$http',
    function($http) {
      var server = {
        upload: function(battles) {
          return $http.post('/api/log', { battles: battles }, { timeout: 20000 })
            .then(function(response) {
              return [response.data.id, 'data uploaded'];
            }, function(response) {
              return [null, 'upload failure ('+response.status+')'];
            });
        },
        download: function(id) {
          return $http.get('/api/log/' + id, { timeout: 20000 })
            .then(function(response) {
              return [response.data.battles, 'data downloaded'];
            }, function(response) {
              return [null, 'download failure ('+response.status+')'];
            });
        },
      };
      return server;
    }]);
