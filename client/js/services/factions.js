'use strict';

angular.module('jlogApp.services')
  .factory('factions', [
    '$http',
    '$q',
    function($http,
             $q) {
      function normaliseCaster(caster) {
        if (!angular.isString(caster)) return null;
        var last_char = caster.charAt(caster.length - 1);
        if ('0' > last_char || '9' < last_char) {
          caster += '1';
        }
        return caster;
      }
      var data;
      var factions = {
        data: function() {
          if(_.exists(data)) return data;
          return $http.get('data/factions.json').then(function(response) {
            data = _.chain(response.data)
              .map(function(f, k) {
                return {
                  key:k,
                  name: f.name,
                  icon: f.icon,
                  casters: _.map(f.casters, function(c, k) {
                    var normed_caster_key = normaliseCaster(k);
                    return {
                      key: normed_caster_key,
                      name: c.name
                    };
                  })
                };
              })
              .value();
            return data;
          }, function(response) {
            console.log('factions get data error', response);
            return $q.reject(response);
          });
        },
        iconFor: function(coll, f) {
          return _.chain(coll)
            .where({ key: f })
            .first()
            .getPath('icon') 
            .apply(function(i) {
              return _.exists(i) ? 'data/img/'+i : i;
            })
            .value();
        }
      };
      return factions;
    }
  ]);
