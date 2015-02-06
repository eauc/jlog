'use strict';

angular.module('jlogApp.services')
  .factory('factions', [
    '$http',
    '$q',
    function($http,
             $q) {
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
                    var normed_caster_key = factions.normaliseCaster(k);
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
        normaliseCaster: function(caster) {
          if (!angular.isString(caster)) return null;
          var last_char = caster.charAt(caster.length - 1);
          if ('0' > last_char || '9' < last_char) {
            caster += '1';
          }
          return caster.toLowerCase();
        },
        keyForName: function(coll, name) {
          return _.chain(coll)
            .where({ name: name })
            .first()
            .getPath('key') 
            .value();
        },
        nameFor: function(coll, f) {
          return _.chain(coll)
            .where({ key: f })
            .first()
            .getPath('name') 
            .value();
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
        },
        castersFor: function(coll, f) {
          return _.chain(coll)
            .where({ key: f })
            .first()
            .getPath('casters') 
            .value();
        },
        casterNameFor: function(coll, f, c) {
          return _.chain(coll)
            .where({ key: f })
            .first()
            .getPath('casters') 
            .where({ key: c })
            .first()
            .getPath('name') 
            .value();
        }
      };
      return factions;
    }
  ]);
