'use strict';

angular.module('jlogApp.services')
  .factory('igParser', [
    '$q',
    'battle',
    'factions',
    'scenarios',
    function($q,
             battle,
             factions,
             scenarios) {
      var fs;
      var sc;
      var SCORES = {
        0: 'dd',
        1: 'va', 2: 'vs', 3: 'vt', 4: 'vt', 5: 'vt', 6: 'vt', 7: 'vc',
        '-1': 'da', '-2': 'ds', '-3': 'dt', '-4': 'dt', '-5': 'dt', '-6': 'dt', '-7': 'dc',
      };
      var INITS = {
        1: { won_roll: 'true', started: 'true' },
        2: { won_roll: 'true', started: 'false' },
        3: { won_roll: 'false', started: 'true' },
        4: { won_roll: 'false', started: 'false' },
      };
      return {
        init: function() {
          $q.when(factions.data()).then(function(_fs) {
            fs = _fs;
          });
          $q.when(scenarios.data()).then(function(_sc) {
            sc = _sc;
          });
        },
        parse: function(string) {
          var errors = [];
          var new_sc = _.clone(sc);
          var battles = _.chain(string)
            .apply(s.lines)
            .map(function(l, i) {
              if(s.isBlank(l)) return undefined;
              var fields = _.chain(l.split(','))
                  .mapWith(_.unary(s.trim))
                  .map(function(field) {
                    return field.match(/null/i) ? null : field;
                  })
                  .mapWith(s.trim, '"')
                  .value();
              if(fields.length != 18) {
                errors.push('line '+(i+1)+
                            ': invalid nb of fields ('+fields.length+', expected 18)');
                return undefined;
              }
              var date = new Date(parseFloat(fields[0]));
              var my_faction = factions.keyForName(fs, fields[1]);
              if(!_.exists(my_faction)) errors.push('line '+(i+1)+
                                                    ': unknown faction '+fields[1]);
              var opp_faction = factions.keyForName(fs, fields[4]);
              if(!_.exists(opp_faction)) errors.push('line '+(i+1)+
                                                     ': unknown faction '+fields[4]);
              var score = _.getPath(SCORES, fields[6]);
              if(!_.exists(score)) errors.push('line '+(i+1)+
                                               ': unknown score '+fields[6]);
              var scenario = scenarios.nameFor(new_sc, fields[13]);
              if(_.exists(scenario)) {
                scenario = fields[13];
              }
              else if(!s.isBlank(fields[13])) {
                new_sc = scenarios.add(new_sc, fields[13]);
                scenario = fields[13];
              }
              else {
                scenario = null;
              }
              var init = _.getPath(INITS, fields[16]);
              if(!_.exists(init)) {
                if(!s.isBlank(fields[16])) errors.push('line '+(i+1)+
                                                       ': unknown initiative '+fields[16]);
                init = undefined;
              }
              else {
                init = _.clone(init);
              }
              return battle.create({
                date: { year: date.getFullYear(),
                        month: date.getMonth()+1,
                        day: date.getDate() },
                my_army: { faction: my_faction, caster: factions.normaliseCaster(fields[2]) },
                opponent: { name: fields[3],
                            faction: opp_faction, caster: factions.normaliseCaster(fields[5]) },
                score: score,
                points: {
                  my_army: { scenario: _.isNumeric(fields[7]) ? parseFloat(fields[7]) : null,
                             army: _.isNumeric(fields[8]) ? parseFloat(fields[8]) : null,
                             kill: _.isNumeric(fields[9]) ? parseFloat(fields[9]) : null },
                  opponent: { scenario: _.isNumeric(fields[10]) ? parseFloat(fields[10]) : null,
                              army: _.isNumeric(fields[11]) ? parseFloat(fields[11]) : null,
                              kill: _.isNumeric(fields[12]) ? parseFloat(fields[12]) : null }
                },
                setup: {
                  scenario: scenario,
                  size: _.isNumeric(fields[14]) ? parseFloat(fields[14]) : null,
                  event: fields[15],
                  initiative: init
                },
                comment: fields[17]
              });
            })
            .without(undefined)
            .spy('ig battles', errors)
            .value();
          return [battles, errors];
        }
      };
    }
  ]);
