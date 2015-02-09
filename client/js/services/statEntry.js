'use strict';

angular.module('jlogApp.services')
  .service('statEntryFaction', [
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
        reduce: function(coll, title, key) {
          var values = _.chain(coll)
            .countBy(_.partial(_.getPath, _, key))
            .reduce(function(mem, c, f) {
              mem[factions.nameFor(fs, f)] = c;
              return mem;
            }, {})
            .value();
          var hues = _.chain(fs)
            .reduce(function(mem, f) {
              mem[f.name] = f.hue;
              return mem;
            }, {})
            .value();
          return {
            title: title,
            hues: hues,
            values: values
          };
        }
      };
    }
  ])
  .service('statEntryCaster', [
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
        reduce: function(coll, title, key) {
          var values = _.chain(coll)
              .groupBy(_.partial(_.getPath, _, key+'.faction'))
              .reduce(function(mem, bs, f) {
                mem[factions.nameFor(fs, f)] = _.chain(bs)
                  .countBy(_.partial(_.getPath, _, key+'.caster'))
                  .value();
                return mem;
              }, {})
              .value();
          var hues = _.chain(fs)
              .reduce(function(mem, f) {
                mem[f.name] = f.hue;
                return mem;
              }, {})
              .value();
          console.log('hues', hues);
          return {
            title: title,
            hues: hues,
            values: values
          };
        }
      };
    }
  ])
  .service('statEntrySimple', [
    function() {
      return {
        reduce: function(coll, title, getter) {
          return {
            title: title,
            values: _.chain(coll)
              .countBy(getter)
              // .spy('countBy')
              .value()
          };
        }
      };
    }
  ])
  .service('statEntryScenario', [
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
        reduce: function(coll, title) {
          return {
            title: title,
            values: _.chain(coll)
              .countBy(_.partial(_.getPath, _, 'setup.scenario'))
              // .spy('countBy')
              .reduce(function(mem, val, key) {
                mem[scenarios.nameFor(sc, key)] = val;
                return mem;
              }, {})
              .value()
          };
        }
      };
    }
  ])
  .service('statEntryInit', [
    function() {
      return {
        reduce: function(coll, title) {
          return {
            title: title,
            legends: [ "Won Roll, Started Game",
                       "Won Roll, Chose Side",
                       "Lost Roll, Started Game",
                       "Lost Roll, Chose Side" ],
            colors: [ '#4AE34D',
                      '#39B03C',
                      '#B02817',
                      '#E3341D' ],
            values: _.chain(coll)
              .reduce(function(mem, b) {
                var wr = _.getPath(b, 'setup.initiative.won_roll');
                var sg = _.getPath(b, 'setup.initiative.started');
                if(_.isString(wr) && _.isString(sg)) {
                  mem[(wr === 'true' ? 'wr' : 'lr')+
                      '_'+
                      (sg === 'true' ? 'sg' : 'cs')]++;
                }
                return mem;
              }, { wr_sg:0, wr_cs:0, lr_sg:0, lr_cs:0 })
              .apply(function(obj) {
                return [obj.wr_sg,obj.wr_cs, obj.lr_sg,obj.lr_cs];
              })
              .value()
          };
        }
      };
    }
  ])
  .service('statEntryResult', [
    function() {
      return {
        reduce: function(coll, title) {
          return {
            title: title,
            legends: [ "Assassination Victory",
                       "Clock Victory",
                       "Scenario Victory",
                       "Tiebreakers Victory",
                       "Dice Down Draw",
                       "Tiebreakers Defeat",
                       "Scenario Defeat",
                       "Clock Defeat",
                       "Assassination Defeat" ],
            colors: [ '#91E893',
                      '#4AE34D',
                      '#39B03C',
                      '#3E633F',
                      '#E2E345',
                      '#63312B',
                      '#B02817',
                      '#E3341D',
                      '#E87263' ],
            values: _.chain(coll)
              .reduce(function(mem, b) {
                mem[b.score]++;
                return mem;
              }, { va:0, vc:0, vs:0, vt:0, dd:0, da:0, dc:0, ds:0, dt:0 })
              .apply(function(obj) {
                return [obj.va,obj.vc,obj.vs,obj.vt,
                        obj.dd,
                        obj.dt,obj.ds,obj.dc,obj.da];
              })
              .value()
          };
        }
      };
    }
  ])
  .service('statEntryTimeResult', [
    'battles',
    '$q',
    function(battles,
             $q) {
      var sorts;
      return {
        init: function() {
          $q.when(battles.sortTypes()).then(function(_sorts) {
            sorts = _sorts;
          });
        },
        reduce: function(coll, title) {
          return {
            title: title,
            legends: [ "Assassination Victory",
                       "Clock Victory",
                       "Scenario Victory",
                       "Tiebreakers Victory",
                       "Dice Down Draw",
                       "Tiebreakers Defeat",
                       "Scenario Defeat",
                       "Clock Defeat",
                       "Assassination Defeat" ],
            colors: [ '#91E893',
                      '#4AE34D',
                      '#39B03C',
                      '#3E633F',
                      '#E2E345',
                      '#63312B',
                      '#B02817',
                      '#E3341D',
                      '#E87263' ],
            values: _.chain(coll)
              .apply(battles.sort, sorts, 'date', false)
              .reductions(function(mem, b) {
                var ret = _.clone(mem);
                ret[b.score]++;
                return ret;
              }, { va:0, vc:0, vs:0, vt:0, dd:0, da:0, dc:0, ds:0, dt:0 })
              .mapWith(function(obj) {
                return [obj.va,obj.vc,obj.vs,obj.vt,
                        obj.dd,
                        obj.dt,obj.ds,obj.dc,obj.da];
              })
              // .spy('reductions')
              .value()
          };
        }
      };
    }
  ])
  .service('statEntryPoints', [
    function() {
      return {
        reduce: function(coll,title) {
          return {
            title: title,
            colors: [ '#4AE34D',
                      '#E3341D' ],
            values: _.chain(coll)
              .reduce(function(mem, b) {
                if(_.isNumber(_.getPath(b,'points.my_army.scenario')) &&
                   _.isNumber(_.getPath(b,'points.opponent.scenario'))) {
                  mem.Scenario[0] += b.points.my_army.scenario;
                  mem.Scenario[1] += b.points.opponent.scenario;
                  mem.Scenario[2]++;
                }
                if(_.isNumber(_.getPath(b,'points.my_army.army')) &&
                   _.isNumber(_.getPath(b,'points.opponent.army'))) {
                  mem.Army[0] += b.points.my_army.army;
                  mem.Army[1] += b.points.opponent.army;
                  mem.Army[2]++;
                }
                if(_.isNumber(_.getPath(b,'points.my_army.kill')) &&
                   _.isNumber(_.getPath(b,'points.opponent.kill'))) {
                  mem.Kill[0] += b.points.my_army.kill;
                  mem.Kill[1] += b.points.opponent.kill;
                  mem.Kill[2]++;
                }
                return mem;
              }, { Scenario:[0,0,0], Army:[0,0,0], Kill:[0,0,0] })
              .reduce(function(mem, value, key) {
                mem[key] = [Math.round(value[0]/value[2]*100)/100,
                            Math.round(value[1]/value[2]*100)/100];
                return mem;
              }, {})
              .value()
          };
        }
      };
    }
  ])
  .service('statEntryTag', [
    'tags',
    function(tags) {
      return {
        reduce: function(coll, title) {
          return {
            title: title,
            values: _.chain(coll)
              // .spy('coll')
              .apply(tags.fromBattles)
              // .spy('tags')
              .reduce(function(mem, t) {
                mem[s.capitalize(t)] = _.filter(coll, function(b) {
                  return 0 <= _.indexOf(b.tags, t);
                }).length;
                return mem;
              }, {})
              // .spy('reduce')
              .value()
          };
        }
      };
    }
  ]);
