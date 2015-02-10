'use strict';

describe('services', function() {

  beforeEach(function() {
    angular.module('jlogApp.services')
      .factory('$window', [
        function() {
          return {
            localStorage: jasmine.createSpyObj('localStorage', [
              'setItem',
              'getItem',
              'removeItem'
            ])
          };
        }
      ]);
    module('jlogApp.services');
  });

  describe('filter', function() {

    var filter;
    beforeEach(inject([
      'filter',
      '$window',
      function(_filter, $window) {
        filter = _filter;
        this.windowService = $window;
      }
    ]));

    describe('init()', function() {
      it('should retrieve filter_v2 from localStorage', function() {
        this.ret = filter.init();

        expect(this.windowService.localStorage.getItem)
          .toHaveBeenCalledWith('jlog_filter_v2');
      });

      when('filter_v2 does not exist in localStorage', function() {
        this.windowService.localStorage.getItem.and.returnValue(null);
      }, function() {
        it('should return default filter', function() {
          expect(filter.init()).toEqual({ 
            date: { active: false, is: '==', value: { year : 2015, month : 2, day : 10 } },
            my_army: { active: false, is: 'true', value: { faction : null, caster : [  ] } },
            opp_name: { active: false, is: 'true', value: [  ] },
            opp_caster: { active: false, is: 'true', value: { faction : null, caster : [  ] } },
            result: { active: false, is: 'true', value: [  ] },
            scenario: { active: false, is: 'true', value : [  ] },
            initiative: { active: false, is: 'true', value: { won_roll: '', started: '' } },
            size: { active: false, is: '==', value: 50 },
            event: { active: false, is: 'true', value: [  ] },
            tags: { active: false, is: 'any', value: [  ] }
          });
        });
      });

      when('filter_v2 exists in localStorage', function() {
        this.windowService.localStorage.getItem
          .and.returnValue('{"event": { "active": true, "is": "false", "value": ["toto"] }}');
      }, function() {
        it('should create filter state from stored filter', function() {
          expect(filter.init()).toEqual({ 
            date: { active: false, is: '==', value: { year : 2015, month : 2, day : 10 } },
            my_army: { active: false, is: 'true', value: { faction : null, caster : [  ] } },
            opp_name: { active: false, is: 'true', value: [  ] },
            opp_caster: { active: false, is: 'true', value: { faction : null, caster : [  ] } },
            result: { active: false, is: 'true', value: [  ] },
            scenario: { active: false, is: 'true', value : [  ] },
            initiative: { active: false, is: 'true', value: { won_roll: '', started: '' } },
            size: { active: false, is: '==', value: 50 },
            // event state has been merged with stored data
            event: { active: true, is: 'false', value: [ 'toto' ] },
            tags: { active: false, is: 'any', value: [  ] }
          });
        });
      });
    });

    describe('store()', function() {
      it('should store state in localStorage', function() {
        filter.store(['state']);
        expect(this.windowService.localStorage.setItem)
          .toHaveBeenCalledWith('jlog_filter_v2', '["state"]');
      });
    });

    describe('clearStorage()', function() {
      it('should clear filter in localStorage', function() {
        filter.clearStorage();
        expect(this.windowService.localStorage.removeItem)
          .toHaveBeenCalledWith('jlog_filter');
        expect(this.windowService.localStorage.removeItem)
          .toHaveBeenCalledWith('jlog_filter_v2');
      });
    });

    describe('match(<state>, <battle>, <invert>, <cache>)', function() {
      beforeEach(function() {
        this.invert = false;
      });

      when('<invert> is true', function() {
        this.invert = true;
      }, function() {
        var battles = [
          { index: 0, date: { year:2015, month:10, day:15 } },
        ];
        
        it('should invert match result', function() {
          this.state = {
            date: { active: true, is: '==', value: { year:2015, month:10, day:15 } },
          };
          expect(_.map(battles, _.partial(filter.match, this.state, _, true, {})))
            .toEqual([false]);
        });
      });

      when('<cache[battle.index]> exists', function() {
      }, function() {
        var battles = [
          { index: 0, date: { year:2015, month:10, day:15 } },
        ];
        
        it('should return cache entry', function() {
          this.state = {
            date: { active: true, is: '==', value: { year:2015, month:10, day:15 } },
          };
          expect(_.map(battles, _.partial(filter.match, this.state, _, this.invert, { 0:true })))
            .toEqual([true]);
          expect(_.map(battles, _.partial(filter.match, this.state, _, this.invert, { 0:false })))
            .toEqual([false]);
        });
      });

      describe('on date', function() {
        var battles = [
          { index: 0, date: { year:2016, month:10, day:15 } },
          { index: 1, date: { year:2015, month:11, day:15 } },
          { index: 2, date: { year:2015, month:10, day:16 } },
          { index: 3, date: { year:2015, month:10, day:15 } },
          { index: 4, date: { year:2015, month:10, day:14 } },
          { index: 5, date: { year:2015, month:9, day:15 } },
          { index: 6, date: { year:2014, month:10, day:15 } },
        ];
        
        using([
          [ 'is' , 'result' ],
          [ '==' , [ false, false, false, true, false, false, false, ] ],
          [ '!=' , [ true, true, true, false, true, true, true, ] ],
          [ '>'  , [ true, true, true, false, false, false, false, ] ],
          [ '>=' , [ true, true, true, true, false, false, false, ] ],
          [ '<'  , [ false, false, false, false, true, true, true, ] ],
          [ '<=' , [ false, false, false, true, true, true, true, ] ],
        ], function(e, d) {
          it(d, function() {
            this.state = {
              date: { active: true, is: e.is, value: { year:2015, month:10, day:15 } },
            };
            expect(_.map(battles, _.partial(filter.match, this.state, _, this.invert, {})))
              .toEqual(e.result);
          });
        });
      });

      describe('on my army', function() {
        var battles = [
          { index: 0, my_army: { faction: 'cryx', caster: 'venetrax1' } },
          { index: 1, my_army: { faction: 'cryx', caster: 'coven1' } },
          { index: 2, my_army: { faction: 'khador', caster: 'vlad1' } },
          { index: 3, my_army: { faction: 'cryx', caster: null } },
          { index: 4, my_army: { faction: 'khador', caster: null } },
          { index: 5, my_army: { faction: null, caster: null } },
        ];
        
        using([
          [ 'is'    , 'faction' , 'caster'      , 'result' ],
          [ 'true'  , 'cryx'    , ['venetrax1'] , [ true, false, false, false, false, false, ] ],
          [ 'false' , 'cryx'    , ['venetrax1'] , [ false, true, true, true, true, true, ] ],
          [ 'true'  , 'cryx'    , ['venetrax1',
                                   'coven1'   ] , [ true, true, false, false, false, false, ] ],
          [ 'true'  , 'cryx'    , ['asphy1',
                                   'coven1'   ] , [ false, true, false, false, false, false, ] ],
          [ 'true'  , 'cryx'    , ['asphy1',
                                   'denny1'   ] , [ false, false, false, false, false, false, ] ],
          [ 'true'  , 'cryx'    , []            , [ true, true, false, true, false, false, ] ],
          [ 'true'  , null      , []            , [ false, false, false, false, false, true, ] ],
        ], function(e, d) {
          it(d, function() {
            this.state = {
              my_army: { active: true, is: e.is, value: { faction:e.faction, caster:e.caster } },
            };
            expect(_.map(battles, _.partial(filter.match, this.state, _, this.invert, {})))
              .toEqual(e.result);
          });
        });
      });

      describe('on opp name', function() {
        var battles = [
          { index: 0, opponent: { name: 'kevin' } },
          { index: 1, opponent: { name: 'wood' } },
          { index: 2, opponent: { name: null } },
        ];
        
        using([
          [ 'is'    , 'names'          , 'result' ],
          [ 'true'  , ['kevin','wood'] , [ true, true, false, ] ],
          [ 'false' , ['kevin','wood'] , [ false, false, true, ] ],
          [ 'true'  , ['kevin']        , [ true, false, false, ] ],
          [ 'false' , ['kevin']        , [ false, true, true, ] ],
          [ 'true'  , []               , [ true, true, true, ] ],
          [ 'false' , []               , [ false, false, false, ] ],
        ], function(e, d) {
          it(d, function() {
            this.state = {
              opp_name: { active: true, is: e.is, value: e.names },
            };
            expect(_.map(battles, _.partial(filter.match, this.state, _, this.invert, {})))
              .toEqual(e.result);
          });
        });
      });

      describe('on opp caster', function() {
        var battles = [
          { index: 0, opponent: { faction: 'cryx', caster: 'venetrax1' } },
          { index: 1, opponent: { faction: 'cryx', caster: 'coven1' } },
          { index: 2, opponent: { faction: 'khador', caster: 'vlad1' } },
          { index: 3, opponent: { faction: 'cryx', caster: null } },
          { index: 4, opponent: { faction: 'khador', caster: null } },
          { index: 5, opponent: { faction: null, caster: null } },
        ];
        
        using([
          [ 'is'    , 'faction' , 'caster'      , 'result' ],
          [ 'true'  , 'cryx'    , ['venetrax1'] , [ true, false, false, false, false, false, ] ],
          [ 'false' , 'cryx'    , ['venetrax1'] , [ false, true, true, true, true, true, ] ],
          [ 'true'  , 'cryx'    , ['venetrax1',
                                   'coven1'   ] , [ true, true, false, false, false, false, ] ],
          [ 'true'  , 'cryx'    , ['asphy1',
                                   'coven1'   ] , [ false, true, false, false, false, false, ] ],
          [ 'true'  , 'cryx'    , ['asphy1',
                                   'denny1'   ] , [ false, false, false, false, false, false, ] ],
          [ 'true'  , 'cryx'    , []            , [ true, true, false, true, false, false, ] ],
          [ 'true'  , null      , []            , [ false, false, false, false, false, true, ] ],
        ], function(e, d) {
          it(d, function() {
            this.state = {
              opp_caster: { active: true, is: e.is, value: { faction:e.faction, caster:e.caster } },
            };
            expect(_.map(battles, _.partial(filter.match, this.state, _, this.invert, {})))
              .toEqual(e.result);
          });
        });
      });

      describe('on result', function() {
        var battles = [
          { index: 0, score: 'va' },
          { index: 1, score: 'dc' },
          { index: 2, score: null },
        ];
        
        using([
          [ 'is'    , 'scores'     , 'result' ],
          [ 'true'  , ['va','dc'] , [ true, true, false, ] ],
          [ 'false' , ['va','dc'] , [ false, false, true, ] ],
          [ 'true'  , ['va']      , [ true, false, false, ] ],
          [ 'false' , ['va']      , [ false, true, true, ] ],
          [ 'true'  , []          , [ true, true, true, ] ],
          [ 'false' , []          , [ false, false, false, ] ],
        ], function(e, d) {
          it(d, function() {
            this.state = {
              result: { active: true, is: e.is, value: e.scores },
            };
            expect(_.map(battles, _.partial(filter.match, this.state, _, this.invert, {})))
              .toEqual(e.result);
          });
        });
      });

      describe('on scenario', function() {
        var battles = [
          { index: 0, setup : { scenario: 'sr15inco' } },
          { index: 1, setup : { scenario: 'sr14inco' } },
          { index: 2, setup : { scenario: null } },
        ];
        
        using([
          [ 'is'    , 'scenarios'             , 'result' ],
          [ 'true'  , ['sr15inco','sr14inco'] , [ true, true, false, ] ],
          [ 'false' , ['sr15inco','sr14inco'] , [ false, false, true, ] ],
          [ 'true'  , ['sr15inco']            , [ true, false, false, ] ],
          [ 'false' , ['sr15inco']            , [ false, true, true, ] ],
          [ 'true'  , []                      , [ true, true, true, ] ],
          [ 'false' , []                      , [ false, false, false, ] ],
        ], function(e, d) {
          it(d, function() {
            this.state = {
              scenario: { active: true, is: e.is, value: e.scenarios },
            };
            expect(_.map(battles, _.partial(filter.match, this.state, _, this.invert, {})))
              .toEqual(e.result);
          });
        });
      });

      describe('on initiative', function() {
        var battles = [
          { index: 0, setup : { initiative: { won_roll: 'true', started: 'true' } } },
          { index: 1, setup : { initiative: { won_roll: 'false', started: 'true' } } },
          { index: 2, setup : { initiative: { won_roll: null, started: 'true' } } },
          { index: 4, setup : { initiative: { won_roll: 'true', started: 'false' } } },
          { index: 5, setup : { initiative: { won_roll: 'true', started: null } } },
          { index: 6, setup : { initiative: { won_roll: null, started: null } } },
        ];
        
        using([
          [ 'is'    , 'initiative'                     , 'result' ],
          [ 'true'  , {won_roll:'true',started:'true'} , [true,false,false,false,false,false] ],
          [ 'false' , {won_roll:'true',started:'true'} , [false,true,true,true,true,true] ],
          [ 'true'  , {won_roll:'',started:'true'}     , [true,true,true,false,false,false,] ],
          [ 'false' , {won_roll:'',started:'true'}     , [false,false,false,true,true,true,] ],
          [ 'true'  , {won_roll:'false',started:''}    , [false,true,false,false,false,false,] ],
          [ 'false' , {won_roll:'false',started:''}    , [true,false,true,true,true,true,] ],
          [ 'true'  , {won_roll:'',started:''}         , [true,true,true,true,true,true,] ],
        ], function(e, d) {
          it(d, function() {
            this.state = {
              initiative: { active: true, is: e.is, value: e.initiative },
            };
            expect(_.map(battles, _.partial(filter.match, this.state, _, this.invert, {})))
              .toEqual(e.result);
          });
        });
      });

      describe('on size', function() {
        var battles = [
          { index: 0, setup: { size:50 } },
          { index: 1, setup: { size:35 } },
          { index: 2, setup: { size:25 } },
        ];
        
        using([
          [ 'is' , 'result' ],
          [ '==' , [ false, true, false, ] ],
          [ '!=' , [ true, false, true, ] ],
          [ '>'  , [ true, false, false, ] ],
          [ '>=' , [ true, true, false, ] ],
          [ '<'  , [ false, false, true, ] ],
          [ '<=' , [ false, true, true, ] ],
        ], function(e, d) {
          it(d, function() {
            this.state = {
              size: { active: true, is: e.is, value:35 },
            };
            expect(_.map(battles, _.partial(filter.match, this.state, _, this.invert, {})))
              .toEqual(e.result);
          });
        });
      });

      describe('on event', function() {
        var battles = [
          { index: 0, setup : { event: 'amical' } },
          { index: 1, setup : { event: 'wtc' } },
          { index: 2, setup : { event: null } },
        ];
        
        using([
          [ 'is'    , 'events'         , 'result' ],
          [ 'true'  , ['amical','wtc'] , [ true, true, false, ] ],
          [ 'false' , ['amical','wtc'] , [ false, false, true, ] ],
          [ 'true'  , ['amical']       , [ true, false, false, ] ],
          [ 'false' , ['amical']       , [ false, true, true, ] ],
          [ 'true'  , []               , [ true, true, true, ] ],
          [ 'false' , []               , [ false, false, false, ] ],
        ], function(e, d) {
          it(d, function() {
            this.state = {
              event: { active: true, is: e.is, value: e.events },
            };
            expect(_.map(battles, _.partial(filter.match, this.state, _, this.invert, {})))
              .toEqual(e.result);
          });
        });
      });

      describe('on tags', function() {
        var battles = [
          { index: 0, tags: ['tag1', 'tag2'] },
          { index: 1, tags: ['tag1'] },
          { index: 2, tags: ['tag2'] },
          { index: 3, tags: ['tag1', 'tag3'] },
          { index: 4, tags: ['tag3'] },
          { index: 5, tags: [] },
        ];
        
        using([
          [ 'is'      , 'tags'                     , 'result' ],
          [ 'all'     , ['tag1','tag2'] , [true,false,false,false,false,false] ],
          [ 'any'     , ['tag1','tag2'] , [true,true,true,true,false,false] ],
          [ 'not_all' , ['tag1','tag2'] , [false,true,true,true,true,true] ],
          [ 'none'    , ['tag1','tag2'] , [false,false,false,false,true,true] ],
        ], function(e, d) {
          it(d, function() {
            this.state = {
              tags: { active: true, is: e.is, value: e.tags },
            };
            expect(_.map(battles, _.partial(filter.match, this.state, _, this.invert, {})))
              .toEqual(e.result);
          });
        });
      });
    });

    describe('clearCache(<cache>, <index>)', function() {
      when('<index> is undefined', function() {
      }, function() {
        it('should return an empty cache object', function() {
          expect(filter.clearCache({ cache:'cache' })).toEqual({});
        });
      });

      when('<index> is defined', function() {
      }, function() {
        it('should return the cache object without <index> entry', function() {
          expect(filter.clearCache({
            0:'cache0',
            1:'cache1',
            2:'cache2',
          }, 1)).toEqual({
            0:'cache0',
            2:'cache2',
          });
        });
      });
    });
  });

});
