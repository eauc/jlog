'use strict';

angular.module('jlogApp.services')
  .factory('scores', [
    '$http',
    '$q',
    function($http,
             $q) {
      var data;
      var scores = {
        data: function() {
          if(_.exists(data)) return data;
          return $http.get('data/scores.json')
            .then(function(response) {
              data = response.data;
              return response.data;
            }, function(response) {
              console.log('scores get data error', response);
              return $q.reject(response);
            });
        },
        letterFor: function(coll, sc) {
          return _.getPath(coll, sc+'.letter');
        },
        classFor: function(coll, sc) {
          return _.getPath(coll, sc+'.class');
        }
      };
      return scores;
    }
  ]);
