'use strict';

angular.module('jlogApp.services')
  .factory('jsonStringifier', [
    function() {
      var jsonStringifier = {
        stringify: function(data) {
          return JSON.stringify(data, function(key,value) {
            if(s.startsWith(key, '$$')) {
              return undefined;
            }
            return value;
          });
        }
      };
      return jsonStringifier;
    }
  ])
  .factory('fileExport', [
    '$window',
    'csvStringifier',
    'bbStringifier',
    'jsonStringifier',
    function($window,
             csvStringifier,
             bbStringifier,
             jsonStringifier) {
      $window.URL = $window.URL || $window.webkitURL;
      var stringifiers = {
        csv: csvStringifier,
        bb: bbStringifier,
        json: jsonStringifier
      };
      return {
        generate: function(type, data) {
          return _.chain(data)
            .apply(stringifiers[type].stringify)
            .apply(function(string) {
              return new $window.Blob([string], {type: 'text/plain'});
            })
            .apply($window.URL.createObjectURL)
            .value();
        },
        cleanup: function(url) {
          if(_.exists(url)) {
            $window.URL.revokeObjectURL(url);
          }
        }
      };
    }
  ]);
