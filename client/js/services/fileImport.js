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
  .factory('textImport', [
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
        read: function(type, text) {
          var defer = $q.defer();
          var data;
          try {
            data = parsers[type].parse(text);
            defer.resolve(data);
          }
          catch (event) {
            defer.reject(['invalid text : '+event.message]);
          }
          return defer.promise;
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
        read: function(type, file) {
          var reader = new $window.FileReader();
          var defer = $q.defer();
          reader.onload = function(e) {
            var data;
            try {
              data = parsers[type].parse(e.target.result);
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
