'use strict';

angular.module('jlogApp.services')
  .service('statSelectorTotal', [
    function() {
      return {
        sort: function(coll) {
          return { "Total": coll };
        }
      };
    }
  ])
  .service('statSelectorFaction', [
    'factions',
    '$q',
    function(factions,
             $q) {
      var fs;
      return {
        init: function() {
          $q.when(factions.data()).then(function(_fs) {
            fs = _fs;
          });
        },
        sort: function(coll, key) {
          return _.chain(coll)
            .groupBy(_.partial(_.getPath, _, key))
            // .spy('groupBy')
            .reduce(function(mem, val, key) {
              mem[factions.nameFor(fs, key)] = val;
              return mem;
            }, {})
            // .spy('reduce')
            .value();
        }
      };
    }
  ])
  .service('statSelectorCaster', [
    'factions',
    '$q',
    function(factions,
             $q) {
      var fs;
      return {
        init: function() {
          $q.when(factions.data()).then(function(_fs) {
            fs = _fs;
          });
        },
        sort: function(coll, f, key) {
          if(!_.exists(f)) return [];
          return _.chain(coll)
            .filter(function(b) { return _.getPath(b, key+'.faction') === f; })
            // .spy('filter')
            .groupBy(_.partial(_.getPath, _, key+'.caster'))
            // .spy('groupBy')
            .reduce(function(mem, val, key) {
              mem[factions.casterNameFor(fs, f, key)] = val;
              return mem;
            }, {})
            // .spy('reduce')
            .value();
        }
      };
    }
  ])
  .service('statSelectorSimple', [
    function() {
      return {
        sort: function(coll, getter) {
          return _.chain(coll)
            .groupBy(getter)
            // .spy('groupBy')
            .reduce(function(mem, val, key) {
              mem[s.capitalize(key)] = val;
              return mem;
            }, {})
            // .spy('reduce')
            .value();
        }
      };
    }
  ])
  .service('statSelectorScenario', [
    'scenarios',
    '$q',
    function(scenarios,
             $q) {
      var sc;
      return {
        init: function() {
          $q.when(scenarios.data()).then(function(_sc) {
            sc = _sc;
          });
        },
        sort: function(coll) {
          return _.chain(coll)
            .groupBy(_.partial(_.getPath, _, 'setup.scenario'))
            // .spy('groupBy')
            .reduce(function(mem, val, key) {
              mem[scenarios.nameFor(sc, key)] = val;
              return mem;
            }, {})
            // .spy('reduce')
            .value();
        }
      };
    }
  ])
  .service('statSelectorInit', [
    function() {
      return {
        sort: function(coll) {
          return _.chain(coll)
            .filter(function(b) {
              return ( _.exists(_.getPath(b, 'setup.initiative.won_roll')) &&
                       _.exists(_.getPath(b, 'setup.initiative.started')) );
            })
            .groupBy(function(b) {
              return ((_.getPath(b, 'setup.initiative.won_roll') === 'true' ?
                       'Won Roll' : 'Lost Roll')+
                      ', '+
                      (_.getPath(b, 'setup.initiative.started') === 'true' ?
                       'Started Game' : 'Chose Side'));
                      
            })
            // .spy('groupBy')
            .value();
        }
      };
    }
  ])
  .service('statSelectorResult', [
    'scores',
    '$q',
    function(scores,
             $q) {
      var sc;
      return {
        init: function() {
          $q.when(scores.data()).then(function(_sc) {
            sc = _sc;
          });
        },
        sort: function(coll) {
          return _.chain(coll)
            .groupBy(_.partial(_.getPath, _, 'score'))
            // .spy('groupBy')
            .reduce(function(mem, val, key) {
              var result = scores.resultFor(sc,key);
              var type = scores.typeFor(sc,key);
              if(_.exists(result) &&
                 _.exists(type)) {
                mem[s.capitalize(scores.resultFor(sc,key))+
                    ' '+
                    s.capitalize(scores.typeFor(sc,key))] = val;
              }
              return mem;
            }, {})
            // .spy('reduce')
            .value();
        }
      };
    }
  ])
  .service('statSelectorTag', [
    'tags',
    function(tags) {
      return {
        sort: function(coll) {
          var ts = tags.fromBattles(coll);
          return _.chain(coll)
            .apply(tags.fromBattles)
            .reduce(function(mem, t) {
              mem[s.capitalize(t)] = _.filter(coll, function(b) {
                return 0 <= _.indexOf(b.tags, t);
              });
              return mem;
            }, {})
            // .spy('reduce')
            .value();
        }
      };
    }
  ]);
