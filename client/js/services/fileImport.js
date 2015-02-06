'use strict';

angular.module('jlogApp.services')
  .factory('jsonParser', [
    function() {
      return {
        parse: function(string) {
          return [JSON.parse(string), []];
        }
      };
    }
  ])
  .factory('fileImport', [
    '$window',
    '$q',
    'jsonParser',
    'igParser',
    function($window,
             $q,
             jsonParser,
             igParser) {
      var parsers = {
        'json': jsonParser,
        'ig': igParser,
      };
      return {
        read: function(type, file, factions) {
          var reader = new $window.FileReader();
          var defer = $q.defer();
          reader.onload = function(e) {
            var data;
            try {
              data = parsers[type].parse(e.target.result, factions);
              defer.resolve(data);
            }
            catch (event) {
              defer.reject(['invalid file : '+event.message]);
            }
          };
          reader.onerror = function(e) {
            defer.reject(['error reading file']);
          };
          reader.onabort = function(e) {
            defer.reject(['abort reading file']);
          };
          reader.readAsText(file);
          return defer.promise;
        }
      };
    }
  ]);
