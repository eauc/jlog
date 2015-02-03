'use strict';

angular.module('jlogApp.services')
  .factory('bbStringifier', [
    function() {
      var EOL = '\r\n';
      function inTag(string, tag) {
        return '['+tag+']'+string+'[/'+tag+']';
      }
      var bbStringifier = {
        stringify: function(table) {
          return _.chain(table)
            .map(function(row, j) {
              return _.chain(row)
                .map(function(c) { return j === 0 ? inTag(c, 'b') : c; })
                .mapWith(inTag, 'td')
                .join('')
                .apply(inTag, 'tr')
                .value();
            })
            .join(EOL)
            .apply(inTag, 'table')
            .value();
        }
      };
      return bbStringifier;
    }
  ]);
