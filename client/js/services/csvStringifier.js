'use strict';

angular.module('jlogApp.services')
  .factory('csvStringifier', [
    function() {
      var EOL = '\r\n';
      var csvStringifier = {
        stringify: function(table) {
          return _.chain(table)
            .map(function(row) {
              return row.join(',');
            })
            .join(EOL)
            .value();
        }
      };
      return csvStringifier;
    }
  ]);
