'use strict';

var add_object_matcher = function(name, func) {
  this[name] = function(util, testers) {
    return {
      compare: function(actual, expected) {
        var result = { pass: true };
        result.pass = func.call(actual, expected, util, testers);
        return result;
      }
    };
  };
};

describe('service', function() {

  var test_filter = {};
  var custom_matchers = {};

  beforeEach(function() {
    module('jlogApp.services');
    module('jlogApp.test_services');
    jasmine.addMatchers(custom_matchers);
    console.log = jasmine.createSpy('log');
  });

  add_object_matcher.call(custom_matchers, 'toEqualDefaultFilterMatchSimple',
                          function(expected, util, testers) {
                            return angular.isObject(this) &&
                              (this.active === false) &&
                              (this.is === 'true') &&
                              (util.equals(this.value, [], testers));
                          });
  angular.extend(test_filter, {
    opp_name: {
      active: true,
      is: 'false',
      value: [ 'toto', 'titi' ]
    },
    result: {
      active: true,
      is: 'false',
      value: [ 'tata', 'titi' ]
    },
    scenario: {
      active: true,
      is: 'false',
      value: [ 'tata', 'tutu' ]
    },
    event: {
      active: true,
      is: 'false',
      value: [ 'tete', 'titi' ]
    },
  });
  add_object_matcher.call(custom_matchers, 'toEqualTestFilterMatchSimple',
                          function(expected, util, testers) {
                            return angular.isObject(this) &&
                              (this.active === test_filter[expected].active) &&
                              (this.is === test_filter[expected].is) &&
                              (util.equals(this.value, test_filter[expected].value, testers));
                          });

  add_object_matcher.call(custom_matchers, 'toEqualTestFilterMatchDate', function() {
    return angular.isObject(this) &&
      (this.active === test_filter.date.active) &&
      (this.is === test_filter.date.is) &&
      (this.year === test_filter.date.year) &&
      (this.month === test_filter.date.month) &&
      (this.day === test_filter.date.day);
  });
  
  describe('filterMatchSimple', function() {
    
    var filterMatchSimple;
    
    beforeEach(inject([ 'filterMatchSimple', function(_filter) {
      filterMatchSimple = _filter;
    }]));

    it('is created with correct default values', function() {
      var default_filter = filterMatchSimple({});
      
      expect(default_filter).toEqualDefaultFilterMatchSimple();
    });

    it('values can be overriden by data argument', function() {
      var filter = filterMatchSimple(test_filter.opp_name);
      
      expect(filter).toEqualTestFilterMatchSimple('opp_name');
    });

    describe('match(battle)', function() {

      var filter;
      var battle;

      beforeEach(function() {
        battle = {
          field: ''
        };
        var get = function(data) { return data.field; };
        filter = filterMatchSimple({ value: ['toto', 'titi'] }, get);
      });

      describe('when filter is not active', function() {
        
        beforeEach(function() {
          filter.active = false;
          battle.field = 'tata';
        });

        it('should always match', function() {
          expect(filter.match(battle)).toBeTruthy();
        });

      });

      describe('when filter is active', function() {
        
        beforeEach(function() {
          filter.active = true;
        });

        describe('when "is" is "true"', function() {

          beforeEach(function() {
            filter.is = 'true';
          });

          it('should match if "filter.value" contains "battle.field" value', function() {
            battle.field = 'titi';
            expect(filter.match(battle)).toBeTruthy();

            battle.field = 'tata';
            expect(filter.match(battle)).toBeFalsy();
          });

        });

        describe('when "is" is "false"', function() {

          beforeEach(function() {
            filter.is = 'false';
          });

          it('should match if "filter.value" does not contain "battle.field" value', function() {
            battle.field = 'titi';
            expect(filter.match(battle)).toBeFalsy();

            battle.field = 'tata';
            expect(filter.match(battle)).toBeTruthy();
          });

        });

      });

    });

  });
  
  describe('filterMatchComp(type, comp)', function() {
    
    var filterMatchComp;

    beforeEach(inject([ 'filterMatchComp', function(_filter) {
      filterMatchComp = _filter;
    }]));

    describe('when "type" == "=="', function() {
      
      it('it should match if "comp" == 0', function() {
        expect(filterMatchComp(0,  0)).toBeTruthy();
        expect(filterMatchComp(0,  1)).toBeFalsy();
        expect(filterMatchComp(0, -1)).toBeFalsy();
      });

    });

    describe('when "type" == "!="', function() {
      
      it('it should match if "comp" != 0', function() {
        expect(filterMatchComp(1,  0)).toBeFalsy();
        expect(filterMatchComp(1,  1)).toBeTruthy();
        expect(filterMatchComp(1, -1)).toBeTruthy();
      });

    });

    describe('when "type" == ">"', function() {
      
      it('it should match if "comp" == -1', function() {
        expect(filterMatchComp(2,  0)).toBeFalsy();
        expect(filterMatchComp(2,  1)).toBeFalsy();
        expect(filterMatchComp(2, -1)).toBeTruthy();
      });

    });

    describe('when "type" == ">="', function() {
      
      it('it should match if "comp" != 1', function() {
        expect(filterMatchComp(3,  0)).toBeTruthy();
        expect(filterMatchComp(3,  1)).toBeFalsy();
        expect(filterMatchComp(3, -1)).toBeTruthy();
      });

    });

    describe('when "type" == "<"', function() {
      
      it('it should match if "comp" == 1', function() {
        expect(filterMatchComp(4,  0)).toBeFalsy();
        expect(filterMatchComp(4,  1)).toBeTruthy();
        expect(filterMatchComp(4, -1)).toBeFalsy();
      });

    });

    describe('when "type" == "<="', function() {
      
      it('it should match if "comp" != -1', function() {
        expect(filterMatchComp(5,  0)).toBeTruthy();
        expect(filterMatchComp(5,  1)).toBeTruthy();
        expect(filterMatchComp(5, -1)).toBeFalsy();
      });

    });

    describe('when "type" is invalid', function() {
      
      it('it should not match', function() {
        expect(filterMatchComp(-1,  0)).toBeFalsy();
        expect(filterMatchComp(6,  1)).toBeFalsy();
      });

    });

  });

  add_object_matcher.call(custom_matchers, 'toEqualDefaultFilterMatchDate', function() {
    return angular.isObject(this) &&
      (this.active === false) &&
      (this.is === '0') &&
      (typeof(this.year) === 'number') &&
      (typeof(this.month) === 'number') &&
      (typeof(this.day) === 'number');
  });
  test_filter.date = {
    active: true,
    is: '4',
    year: 2012,
    month: 11,
    day: 29
  };
  add_object_matcher.call(custom_matchers, 'toEqualTestFilterMatchDate', function() {
    return angular.isObject(this) &&
      (this.active === test_filter.date.active) &&
      (this.is === test_filter.date.is) &&
      (this.year === test_filter.date.year) &&
      (this.month === test_filter.date.month) &&
      (this.day === test_filter.date.day);
  });

  describe('filterMatchDate', function() {
    
    var filterMatchDate;

    beforeEach(inject([ 'filterMatchDate', function(_filter) {
      filterMatchDate = _filter;
    }]));


    it('is created with correct default values', function() {
      var default_filter = filterMatchDate({});

      expect(default_filter).toEqualDefaultFilterMatchDate();
    });

    it('values can be overriden by data argument', function() {
      var data = {
        active: true,
        is: '4',
        year: 2012,
        month: 11,
        day: 29
      };
      var filter = filterMatchDate(test_filter.date);
      
      expect(filter).toEqualTestFilterMatchDate(true);
    });

    describe('match(battle)', function() {

      var filter;
      var battle;

      beforeEach(function() {
        var data = {
          is: '4', // == '<'
          year: 2012,
          month: 11,
          day: 29
        };
        battle = {
          date: {
            year: 2012,
            month: 11,
            day: 29
          }
        };
        filter = filterMatchDate(data);
      });

      describe('when filter is not active', function() {

        beforeEach(function() {
          filter.active = false;
        });

        it('should match by default', function() {
          battle.date.year = 2011;
          expect(filter.match(battle)).toBeTruthy();
        });

      });

      describe('when filter is active', function() {

        beforeEach(function() {
          filter.active = true;
        });

        using(function(expected_result) {
          return 'expected_result=' + JSON.stringify(expected_result);
        }, [
          [ true, [ [ '0', { year: 2012, month: 11, day: 29 } ],
                    [ '1', { year: 2013, month: 11, day: 29 } ],
                    [ '1', { year: 2012, month: 12, day: 29 } ],
                    [ '1', { year: 2011, month: 11, day: 28 } ],
                    [ '2', { year: 2013, month: 11, day: 29 } ],
                    [ '2', { year: 2012, month: 12, day: 29 } ],
                    [ '2', { year: 2012, month: 11, day: 30 } ],
                    [ '3', { year: 2012, month: 11, day: 29 } ],
                    [ '3', { year: 2013, month: 11, day: 29 } ],
                    [ '3', { year: 2012, month: 12, day: 29 } ],
                    [ '3', { year: 2012, month: 11, day: 30 } ],
                    [ '4', { year: 2011, month: 11, day: 29 } ],
                    [ '4', { year: 2012, month: 10, day: 29 } ],
                    [ '4', { year: 2012, month: 11, day: 28 } ],
                    [ '5', { year: 2012, month: 11, day: 29 } ],
                    [ '5', { year: 2011, month: 11, day: 29 } ],
                    [ '5', { year: 2012, month: 10, day: 29 } ],
                    [ '5', { year: 2012, month: 11, day: 28 } ]
                  ]
          ],
          [ false, [ [ '0', { year: 2011, month: 11, day: 29 } ],
                     [ '0', { year: 2012, month: 10, day: 29 } ],
                     [ '0', { year: 2012, month: 11, day: 28 } ],
                     [ '1', { year: 2012, month: 11, day: 29 } ],
                     [ '2', { year: 2012, month: 11, day: 29 } ],
                     [ '2', { year: 2011, month: 11, day: 29 } ],
                     [ '2', { year: 2012, month: 10, day: 29 } ],
                     [ '2', { year: 2012, month: 11, day: 28 } ],
                     [ '3', { year: 2011, month: 11, day: 29 } ],
                     [ '3', { year: 2012, month: 10, day: 29 } ],
                     [ '3', { year: 2012, month: 11, day: 28 } ],
                     [ '4', { year: 2012, month: 11, day: 29 } ],
                     [ '4', { year: 2013, month: 11, day: 29 } ],
                     [ '4', { year: 2012, month: 12, day: 29 } ],
                     [ '4', { year: 2012, month: 11, day: 30 } ],
                     [ '5', { year: 2013, month: 11, day: 29 } ],
                     [ '5', { year: 2012, month: 12, day: 29 } ],
                     [ '5', { year: 2012, month: 11, day: 30 } ],
                   ]
          ]
        ], function(expected_result, data) {

          using(function(is, date) {
            return 'filter.is=' + JSON.stringify(is) +
              ', battle.date=' + JSON.stringify(date);
          }, data, function(is, date) {
            it('should match if "battle.date" match filter\'s date', function() {
              filter.is = is;
              battle.date = date;
              expect(filter.match(battle)).toBe(expected_result);
            });
          });
          
        });

      });

    });

  });

  add_object_matcher.call(custom_matchers, 'toEqualDefaultFilterMatchSize', function() {
    return angular.isObject(this) &&
      this.active === false &&
      this.is === '0' &&
      this.value === 50;
  });
  angular.extend(test_filter, {
    size: {
      active: true,
      is: '4',
      value: 35,
    }
  });
  add_object_matcher.call(custom_matchers, 'toEqualTestFilterMatchSize', function() {
    return angular.isObject(this) &&
      this.active === test_filter.size.active &&
      this.is === test_filter.size.is &&
      this.value === test_filter.size.value;
  });

  describe('filterMatchSize', function() {
    
    var filterMatchSize;

    beforeEach(inject([ 'filterMatchSize', function(_filter) {
      filterMatchSize = _filter;
    }]));


    it('is created with correct default values', function() {
      var default_filter = filterMatchSize({});
      
      expect(default_filter).toEqualDefaultFilterMatchSize();
    });

    it('values can be overriden by data argument', function() {
      var filter = filterMatchSize(test_filter.size);
      
      expect(filter).toEqualTestFilterMatchSize();
    });

    describe('match(battle)', function() {

      var filter;
      var battle;

      beforeEach(function() {
        var data = {
          is: '4', // == '<'
        };
        battle = {
          setup: {
            size: 75,
          }
        };
        filter = filterMatchSize(data);
      });

      describe('when filter is not active', function() {

        beforeEach(function() {
          filter.active = false;
        });

        it('should match by default', function() {
          battle.setup.size = 75;
          expect(filter.match(battle)).toBeTruthy();
        });

      });

      describe('when filter is active', function() {

        beforeEach(function() {
          filter.active = true;
        });

        it('should match if "battle.setup.size" match "filter.value"', function() {
          filter.is = '4'; // '<'
          battle.setup.size = 50;
          expect(filter.match(battle)).toBeFalsy();
          battle.setup.size = 35;
          expect(filter.match(battle)).toBeTruthy();

          filter.is = '1'; // '!='
          battle.setup.size = 50;
          expect(filter.match(battle)).toBeFalsy();
          battle.setup.size = 49;
          expect(filter.match(battle)).toBeTruthy();

          filter.is = '3'; // '>='
          battle.setup.size = 35;
          expect(filter.match(battle)).toBeFalsy();
          battle.setup.size = 50;
          expect(filter.match(battle)).toBeTruthy();
        });

      });

    });

  });

  add_object_matcher.call(custom_matchers, 'toEqualDefaultFilterMatchCaster',
                          function(expected, util, testers) {
                            return (angular.isObject(this)) &&
                              (this.active === false) &&
                              (this.is === 'true') &&
                              (this.faction === null) &&
                              (util.equals(this.caster, [], testers));
                          });
  angular.extend(test_filter, {
    my_army: {
      active: true,
      is: 'false',
      faction: 'cygnar',
      caster: [ 'toto', 'titi' ]
    },
    opp_caster: {
      active: true,
      is: 'false',
      faction: 'skorne',
      caster: [ 'tutu', 'titi' ]
    },
  });
  add_object_matcher.call(custom_matchers, 'toEqualTestFilterMatchCaster',
                          function(expected, util, testers) {
                            return (angular.isObject(this)) &&
                              (this.active === test_filter[expected].active) &&
                              (this.is === test_filter[expected].is) &&
                              (this.faction === test_filter[expected].faction) &&
                              (util.equals(this.caster, test_filter[expected].caster, testers));
                          });
  
  describe('filterMatchCaster', function() {
    
    var filterMatchCaster;

    beforeEach(inject([ 'filterMatchCaster', function(_filter) {
      filterMatchCaster = _filter;
    }]));


    it('is created with correct default values', function() {
      var default_filter = filterMatchCaster({});
      
      expect(default_filter).toEqualDefaultFilterMatchCaster();
    });

    it('values can be overriden by data argument', function() {
      var filter = filterMatchCaster(test_filter.my_army);
      
      expect(filter).toEqualTestFilterMatchCaster('my_army');
    });

    describe('match(battle)', function() {

      var filter;
      var battle;

      beforeEach(function() {
        var data = {
          faction: 'cygnar',
          caster: [ 'toto', 'titi' ]
        };
        battle = {
          field: {
            faction: 'cygnar',
            caster: 'haley2'
          }
        };
        var get = function(data) { return data.field; };
        filter = filterMatchCaster(data, get);
      });

      describe('when filter is not active', function() {

        beforeEach(function() {
          filter.active = false;
        });

        it('should match by default', function() {
          expect(filter.match(battle)).toBeTruthy();
        });

      });

      describe('when filter is active', function() {

        beforeEach(function() {
          filter.active = true;
        });

        using(null, [
          [ [ [ false, [ [ 'tata', 'tata' ],
                         [ 'cygnar', 'tata' ],
                         [ 'tata', 'toto' ]
                       ]
              ],
              [ true, [ [ 'cygnar', 'titi' ],
                        [ 'cygnar', 'toto' ]
                      ]
              ]
            ] ]
        ], function(value) {

          describe('when filter is "=="', function() {

            beforeEach(function() {
              filter.is = 'true';
            });

            using(function(result) {
              return 'expected_result=' + JSON.stringify(result);
            }, value, function(expected_result, values) {
              using('battle.field', values, function(faction, caster) {
                it('should match if "battle.field" matches filter\'s caster', function() {
                  battle.field.faction = faction;
                  battle.field.caster = caster;
                  expect(filter.match(battle)).toBe(expected_result);
                });
              });
            });

          });

          describe('when filter is "!="', function() {

            beforeEach(function() {
              filter.is = 'false';
            });

            using(function(result) {
              return 'expected_result=' + JSON.stringify(!result);
            }, value, function(expected_result, values) {
              using('battle.field', values, function(faction, caster) {
                it('should match if "battle.field" matches filter\'s caster', function() {
                  battle.field.faction = faction;
                  battle.field.caster = caster;
                  expect(filter.match(battle)).toBe(!expected_result);
                });
              });
            });

          });

        });

      });

    });

  });

  add_object_matcher.call(custom_matchers, 'toEqualDefaultFilterMatchInitiative', function() {
    return angular.isObject(this) &&
      (this.active === false) &&
      (this.is === 'true') &&
      (this.won_roll === '') &&
      (this.started === '');
  });
  angular.extend(test_filter, {
    initiative: {
      active: true,
      is: 'false',
      won_roll: 'true',
      started: 'false'
    }
  });
  add_object_matcher.call(custom_matchers, 'toEqualTestFilterMatchInitiative', function() {
    return angular.isObject(this) &&
      (this.active === test_filter.initiative.active) &&
      (this.is === test_filter.initiative.is) &&
      (this.won_roll === test_filter.initiative.won_roll) &&
      (this.started === test_filter.initiative.started);
  });

  describe('filterMatchInitiative', function() {
    
    var filterMatchInit;

    beforeEach(inject([ 'filterMatchInitiative', function(_filter) {
      filterMatchInit = _filter;
    }]));


    it('is created with correct default values', function() {
      var default_filter = filterMatchInit({});

      expect(default_filter).toEqualDefaultFilterMatchInitiative();
    });

    it('values can be overriden by data argument', function() {
      var filter = filterMatchInit(test_filter.initiative);
      
      expect(filter).toEqualTestFilterMatchInitiative();
    });

    describe('match(battle)', function() {

      var filter;
      var battle;

      beforeEach(function() {
        var data = {
          won_roll: 'true',
          caster: 'false'
        };
        battle = {
          setup: {
            initiative: {
              won_roll: 'true',
              caster: 'true'
            }
          }
        };
        filter = filterMatchInit(data);
      });

      describe('when filter is not active', function() {

        beforeEach(function() {
          filter.active = false;
        });

        it('should match by default', function() {
          expect(filter.match(battle)).toBeTruthy();
        });

      });

      describe('when filter is active', function() {

        beforeEach(function() {
          filter.active = true;
        });

        using(null, [
          [ [
            [ true, { won_roll: 'true', started: ''},  { won_roll: 'true', started: 'false'}  ],
            [ true, { won_roll: 'true', started: ''},  { won_roll: 'true', started: 'true'}   ],
            [ true, { won_roll: 'false', started: ''}, { won_roll: 'false', started: 'false'} ],
            [ true, { won_roll: 'false', started: ''}, { won_roll: 'false', started: 'true'}  ],
            [ true, { won_roll: '', started: 'true'},  { won_roll: 'false', started: 'true'}  ],
            [ true, { won_roll: '', started: 'true'},  { won_roll: 'true', started: 'true'}   ],
            [ true, { won_roll: '', started: 'false'}, { won_roll: 'false', started: 'false'} ],
            [ true, { won_roll: '', started: 'false'}, { won_roll: 'true', started: 'false'}  ],
            [ false, { won_roll: 'true', started: ''},  { won_roll: 'false', started: 'false'}  ],
            [ false, { won_roll: 'true', started: ''},  { won_roll: 'false', started: 'true'}   ],
            [ false, { won_roll: 'false', started: ''}, { won_roll: 'true', started: 'false'} ],
            [ false, { won_roll: 'false', started: ''}, { won_roll: 'true', started: 'true'}  ],
            [ false, { won_roll: '', started: 'true'},  { won_roll: 'false', started: 'false'}  ],
            [ false, { won_roll: '', started: 'true'},  { won_roll: 'true', started: 'false'}   ],
            [ false, { won_roll: '', started: 'false'}, { won_roll: 'false', started: 'true'} ],
            [ false, { won_roll: '', started: 'false'}, { won_roll: 'true', started: 'true'}  ]
          ] ]
        ], function(value) {
          
          describe('when filter is "=="', function() {

            beforeEach(function() {
              filter.is = 'true';
            });

            using(function(match, filter_init, battle_init) {
              return 'filter=' + JSON.stringify(filter_init) +
                ', battle.setup.initiative=' + JSON.stringify(battle_init) +
                ', expected_result=' + JSON.stringify(match);
            }, value, function(match, filter_init, battle_init) {
              it('should match if "battle.setup.initiative" matches filter', function() {
                filter.won_roll = filter_init.won_roll;
                filter.started = filter_init.started;
                battle.setup.initiative.won_roll = battle_init.won_roll;
                battle.setup.initiative.started = battle_init.started;

                expect(filter.match(battle)).toEqual(match);
              });
            });

          });
          
          describe('when filter is "!="', function() {

            beforeEach(function() {
              filter.is = 'false';
            });

            using(function(match, filter_init, battle_init) {
              return 'filter=' + JSON.stringify(filter_init) +
                ', battle.setup.initiative=' + JSON.stringify(battle_init) +
                ', expected_result=' + JSON.stringify(!match);
            }, value, function(match, filter_init, battle_init) {
              it('should match if "battle.setup.initiative" matches filter', function() {
                filter.won_roll = filter_init.won_roll;
                filter.started = filter_init.started;
                battle.setup.initiative.won_roll = battle_init.won_roll;
                battle.setup.initiative.started = battle_init.started;

                expect(filter.match(battle)).toEqual(!match);
              });
            });

          });

        });

      });

    });

  });

  add_object_matcher.call(custom_matchers, 'toEqualDefaultFilterMatchTag',
                          function(expected, util, testers) {
                            return angular.isObject(this) &&
                              (this.active === false) &&
                              (this.is === 'any') &&
                              (util.equals(this.value, [], testers));
                          });
  angular.extend(test_filter, {
    tags: {
      active: true,
      is: 'all',
      value: [ 'toto', 'titi' ]
    }
  });
  add_object_matcher.call(custom_matchers, 'toEqualTestFilterMatchTag',
                          function(expected, util, testers) {
                            return angular.isObject(this) &&
                              (this.active === test_filter.tags.active) &&
                              (this.is === test_filter.tags.is) &&
                              (util.equals(this.value, test_filter.tags.value, testers));
                          });

  describe('filterMatchTags', function() {
    
    var filterMatchTags;

    beforeEach(inject([ 'filterMatchTags', function(_filter) {
      filterMatchTags = _filter;
    }]));


    it('is created with correct default values', function() {
      var default_filter = filterMatchTags({});
      
      expect(default_filter).toEqualDefaultFilterMatchTag();
    });

    it('values can be overriden by data argument', function() {
      var filter = filterMatchTags(test_filter.tags);
      
      expect(filter).toEqualTestFilterMatchTag();
    });

    describe('match(battle)', function() {

      var filter;
      var battle;

      beforeEach(function() {
        var data = {
          value: [ 'toto', 'titi' ]
        };
        battle = {
          tags: []
        };
        filter = filterMatchTags(data);
      });

      describe('when filter is not active', function() {

        beforeEach(function() {
          filter.active = false;
        });

        it('should match by default', function() {
          expect(filter.match(battle)).toBeTruthy();
        });

      });

      describe('when filter is active', function() {
        
        beforeEach(function() {
          filter.active = true;
        });

        using(function(value) {
          return 'expected_result=' + JSON.stringify(value.result);
        }, [
          { result: true, values: [ 
            { is: 'any', filter: [], battle: [] },
            { is: 'any', filter: [], battle: [ 'toto', 'tata' ] },
            { is: 'all', filter: [], battle: [ 'toto', 'tata' ] },
            { is: 'not_all', filter: [], battle: [ 'toto', 'tata' ] },
            { is: 'none', filter: [], battle: [ 'toto', 'tata' ] },
            { is: 'not_all', filter: [ 'titi', 'tata' ], battle: [] },
            { is: 'none', filter: [ 'titi', 'tata' ], battle: [] },
            { is: 'any', filter: [ 'toto' ], battle: [ 'toto', 'tata' ] },
            { is: 'any', filter: [ 'titi', 'toto' ], battle: [ 'toto', 'tata' ] },
            { is: 'all', filter: [ 'tata', 'toto' ], battle: [ 'toto', 'tata' ] },
            { is: 'not_all', filter: [ 'titi' ], battle: [ 'toto', 'tata' ] },
            { is: 'not_all', filter: [ 'titi', 'toto' ], battle: [ 'toto', 'tata' ] },
            { is: 'none', filter: [ 'titi' ], battle: [ 'toto', 'tata' ] },
            { is: 'none', filter: [ 'titi', 'tutu' ], battle: [ 'toto', 'tata' ] },
          ] },
          { result: false, values: [
            { is: 'any', filter: [ 'titi', 'toto' ], battle: [] },
            { is: 'all', filter: [ 'titi', 'toto' ], battle: [] },
            { is: 'any', filter: [ 'titi' ], battle: [ 'toto', 'tata' ] },
            { is: 'any', filter: [ 'titi', 'tutu' ], battle: [ 'toto', 'tata' ] },
            { is: 'all', filter: [ 'titi' ], battle: [ 'toto', 'tata' ] },
            { is: 'all', filter: [ 'titi', 'toto' ], battle: [ 'toto', 'tata' ] },
            { is: 'not_all', filter: [ 'tata', 'toto' ], battle: [ 'toto', 'tata' ] },
            { is: 'none', filter: [ 'titi', 'toto' ], battle: [ 'toto', 'tata' ] },
          ] },
        ], function(value) {

          var expected_result = value.result;
          using('tags', value.values, function(value) {

            it('should match if "battle.tags" matches filter', function() {
              filter.is = value.is;
              filter.value = value.filter;
              battle.tags = value.battle;
              expect(filter.match(battle)).toBe(expected_result);
            });

          });

        });

      });

    });

  });

  describe('filter', function() {

    var filter;
    var storage;

    beforeEach(inject([
      'filter', 'storage',
      function(_filter, _storage) {
        filter = _filter;
        storage = _storage;
      }]));
    
    describe('init', function() {

      it('should look for filter in storage', function() {
        filter.init();

        expect(storage.getItem).toHaveBeenCalledWith('jlog_filter');
      });

      describe('when filter is not present in storage', function() {

        beforeEach(function() {
          storage.getItem.and.returnValue(null);

          filter.init();
        });

        it('should create default filter', function() {
          expect(angular.isObject(filter.list)).toBeTruthy();

          expect(filter.list.date).toEqualDefaultFilterMatchDate();
          expect(filter.list.my_army).toEqualDefaultFilterMatchCaster();
          expect(filter.list.opp_caster).toEqualDefaultFilterMatchCaster();
          expect(filter.list.opp_name).toEqualDefaultFilterMatchSimple();
          expect(filter.list.result).toEqualDefaultFilterMatchSimple();
          expect(filter.list.scenario).toEqualDefaultFilterMatchSimple();
          expect(filter.list.event).toEqualDefaultFilterMatchSimple();
          expect(filter.list.initiative).toEqualDefaultFilterMatchInitiative();
          expect(filter.list.size).toEqualDefaultFilterMatchSize();
          expect(filter.list.tags).toEqualDefaultFilterMatchTag();
        });

        it('should store created filter', function() {
          expect(storage.setItem).toHaveBeenCalledWith('jlog_filter', jasmine.any(Object));
        });

      });

      describe('when filter is present in storage', function() {

        beforeEach(function() {
          storage.getItem.and.returnValue(JSON.stringify(test_filter));

          filter.init();
        });

        it('should initialize filter from stored data', function() {
          expect(angular.isObject(filter.list)).toBeTruthy();

          expect(filter.list.date).toEqualTestFilterMatchDate();
          expect(filter.list.my_army).toEqualTestFilterMatchCaster('my_army');
          expect(filter.list.opp_caster).toEqualTestFilterMatchCaster('opp_caster');
          expect(filter.list.opp_name).toEqualTestFilterMatchSimple('opp_name');
          expect(filter.list.result).toEqualTestFilterMatchSimple('result');
          expect(filter.list.scenario).toEqualTestFilterMatchSimple('scenario');
          expect(filter.list.event).toEqualTestFilterMatchSimple('event');
          expect(filter.list.initiative).toEqualTestFilterMatchInitiative();
          expect(filter.list.size).toEqualTestFilterMatchSize();
          expect(filter.list.tags).toEqualTestFilterMatchTag();
        });

      });

    });
    
    describe('update', function() {
      
      it('should store current list', function() {
        filter.list = [ 'totot', 'henri', 'alphonse' ];
        
        filter.update();
        
        expect(storage.setItem)
          .toHaveBeenCalledWith('jlog_filter',
                                [ 'totot' , 'henri', 'alphonse' ]);
      });
      
    });
    
    describe('match(battle, invert)', function() {
      
      var battle;
      
      beforeEach(function() {
        battle = {
          index: 1,
          date: {
            year: 2012,
            month: 11,
            day: 29
          },
          my_army: {
            faction: 'loe',
            caster: 'vayl2'
          },
          opponent: {
            name: 'wood',
            faction: 'scyrah',
            caster: 'rahn'
          },
          setup: {
            size: 50,
            scenario: 'sr13_inc',
            event: 'amical'
          },
          score: 'da',
          tags: ['toto', 'titi']
        };
        filter.init();
      });

      using('invert, filter, expected_result', [
        [ false, { match: 'date', value: { is:'1', year: 2012, month: 10, day: 29 } }, true ],
        [ true, { match: 'date', value: { is:'1', year: 2012, month: 10, day: 29 } }, false ],
        [ false, { match: 'my_army', value: { is:'true', faction: 'loe', caster: 'vayl2' } }, true ],
        [ true, { match: 'my_army', value: { is:'true', faction: 'loe', caster: 'vayl2' } }, false ],
        [ false, { match: 'opp_name', value: { is:'false', value: 'fred' } }, true ],
        [ true, { match: 'opp_name', value: { is:'false', value: 'fred' } }, false ],
        [ false, { match: 'opp_caster', value: { is:'true', faction: 'scyrah', caster: 'rahn' } }, true ],
        [ true, { match: 'opp_caster', value: { is:'true', faction: 'scyrah', caster: 'rahn' } }, false ],
        [ false, { match: 'result', value: { is:'true', value: 'da' } }, true ],
        [ true, { match: 'result', value: { is:'true', value: 'da' } }, false ],
        [ false, { match: 'scenario', value: { is:'true', value: 'sr13_inc' } }, true ],
        [ true, { match: 'scenario', value: { is:'true', value: 'sr13_inc' } }, false ],
        [ false, { match: 'size', value: { is:'1', value: 35 } }, true ],
        [ true, { match: 'size', value: { is:'1', value: 35 } }, false ],
        [ false, { match: 'event', value: { is:'true', value: 'amical' } }, true ],
        [ true, { match: 'event', value: { is:'true', value: 'amical' } }, false ],
        [ false, { match: 'tags', value: { is:'any', value: ['toto'] } }, true ],
        [ true, { match: 'tags', value: { is:'any', value: ['toto'] } }, false ],
      ], function(invert, filter_value, expected_result) {

        it('should match when "battle" matches "filter.list"', function() {
          angular.extend(filter.list[filter_value.match], filter_value.value);
          filter.list[filter_value.match].active = true;

          expect(filter.match(battle, invert)).toBe(expected_result);
        });

      });
      
    });
    
    describe('cache', function() {
      
      var battle;
      
      beforeEach(function() {
        battle = {
          index: 1,
          date: {
            year: 2012,
            month: 11,
            day: 29
          },
          my_army: {
            faction: 'loe',
            caster: 'vayl2'
          },
          opponent: {
            name: 'wood',
            faction: 'scyrah',
            caster: 'rahn'
          },
          setup: {
            size: 50,
            scenario: 'sr13_inc',
            event: 'amical'
          },
          score: 'da',
          tags: ['toto', 'titi']
        };
        filter.init();

        angular.extend(filter.list.size, { is:'1', value: 35 });
        filter.list.size.active = true;

        expect(filter.match(battle, false)).toBe(true);
      });

      it('match() should always return the first result while cache has not been cleared', function() {
        angular.extend(filter.list.size, { is:'0', value: 35 });

        expect(filter.match(battle, false)).toBe(true);
      });

      it('match() should update the result after cache has been cleared', function() {
        angular.extend(filter.list.size, { is:'0', value: 35 });

        filter.clearCache();

        expect(filter.match(battle, false)).toBe(false);
      });

    });

  });

});
