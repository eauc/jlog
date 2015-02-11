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
            ]),
            Blob: jasmine.createSpy('Blob').and.callFake(function() {
              this.blob = 'blob';
            }),
            URL: {
              createObjectURL: jasmine.createSpy('createObjectURL').and.returnValue('test_url')
            },
          };
        }
      ])
      .factory('orderByFilter', [
        function() {
          return jasmine.createSpy('orderByFilter')
            .and.returnValue('orderByFilter.returnValue');
        }
      ]);
    module('jlogApp.services');
  });

  describe('battles', function() {

    var battles;
    beforeEach(inject([
      'battles',
      '$window',
      function(_battles, $window) {
        battles = _battles;
        this.windowService = $window;
      }
    ]));

    describe('init()', function() {
      it('should retrieve battles_v2 from localStorage', function() {
        this.ret = battles.init();

        expect(this.windowService.localStorage.getItem)
          .toHaveBeenCalledWith('jlog_battles_v2');
      });

      when('battles_v2 do not exist in localStorage', function() {
        this.windowService.localStorage.getItem.and.returnValue(null);
      }, function() {
        it('should retrieve battles_v1 from localStorage', function() {
          this.ret = battles.init();

          expect(this.windowService.localStorage.getItem)
            .toHaveBeenCalledWith('jlog_battles');
        });

        when('battles_v1 do not exist in localStorage', function() {
          this.windowService.localStorage.getItem.and.returnValue(null);
        }, function() {
          it('should return empty list', function() {
            expect(battles.init()).toEqual([]);
          });
        });

        when('battles_v1 exist in localStorage', function() {
          this.windowService.localStorage.getItem.and.callFake(function(k) {
            return k === 'jlog_battles' ? '["stored_battles"]' : null;
          });
        }, function() {
          it('should return stored list', function() {
            expect(battles.init()).toEqual(['stored_battles']);
          });
        });
      });

      when('battles_v2 exist in localStorage', function() {
        this.windowService.localStorage.getItem.and.callFake(function(k) {
          return k === 'jlog_battles_v2' ? '["stored_battles_v2"]' : null;
        });
      }, function() {
        it('should return stored list', function() {
          expect(battles.init()).toEqual(['stored_battles_v2']);
        });
      });
    });

    describe('store()', function() {
      it('should store collection in localStorage', function() {
        battles.store(['coll']);
        expect(this.windowService.localStorage.setItem)
          .toHaveBeenCalledWith('jlog_battles_v2', '["coll"]');
      });
    });

    describe('clearStorage()', function() {
      it('should clear battles in localStorage', function() {
        battles.clearStorage();
        expect(this.windowService.localStorage.removeItem)
          .toHaveBeenCalledWith('jlog_battles');
        expect(this.windowService.localStorage.removeItem)
          .toHaveBeenCalledWith('jlog_battles_v2');
      });
    });

    describe('buildIndex()', function() {
      it('should set indices and hashed in battles', function() {
        var bs = battles.buildIndex([
          { name: 'battle1' },
          { name: 'battle2' },
          { name: 'battle3' },
        ]);
      expect(bs[0].name).toBe('battle1');
      expect(bs[0].index).toEqual(0);
      expect(bs[0].hash).toBeA('Number');

      expect(bs[1].name).toBe('battle2');
      expect(bs[1].index).toEqual(1);
      expect(bs[1].hash).toBeA('Number');

      expect(bs[2].name).toBe('battle3');
      expect(bs[2].index).toEqual(2);
      expect(bs[2].hash).toBeA('Number');
      });
    });

    describe('drop(<index>)', function() {
      it('should drop <index> from list', function() {
        expect(battles.drop(['battle1','battle2','battle3'], 1))
          .toEqual(['battle1','battle3']);
      });
    });

    describe('save(<index>, <battle>)', function() {
      beforeEach(function() {
        this.coll = ['battle1','battle2','battle3'];
      });

      using([
        [ 'index' , 'result'                                      ],
        [ 0       , ['new_battle','battle2','battle3']            ],
        [ 1       , ['battle1','new_battle','battle3']            ],
        // index === list length
        [ 3       , ['battle1','battle2','battle3', 'new_battle'] ],
        // index > list length
        [ 4       , ['battle1','battle2','battle3', 'new_battle'] ],
        // index < 0
        [ -1       , ['battle1','battle2','new_battle']           ],
        [ -2       , ['battle1','new_battle','battle3']           ],
      ], function(e, d) {
        it('should insert <battle> into list at <index>, '+d, function() {
          expect(battles.save(this.coll, e.index, 'new_battle'))
            .toEqual(e.result);
        });
      });
    });

    describe('sortTypes()', function() {
      beforeEach(inject(function($httpBackend) {
        this.httpBackend = $httpBackend;
        this.data = {
          "date": {
            "name": "Date",
            "key": ["date.year", "date.month", "date.day", "index"],
            "reverse": true
          },
          "my_caster": {
            "name": "My caster",
            "key": ["my_army.faction", "my_army.caster", "index"],
            "reverse": false
          },
        };
      }));

      it('should get sort types data', function() {
        this.httpBackend.expectGET('data/sorts.json')
          .respond(200, this.data);

        battles.sortTypes();

        this.httpBackend.flush();
      });

      when('request fails', function() {
        this.httpBackend.expectGET('data/sorts.json')
          .respond(404);
        this.errorCbk = jasmine.createSpy('errorCbk');
        battles.sortTypes().then(null, this.errorCbk);
        this.httpBackend.flush();
      }, function() {
        it('should reject promise', function() {
          expect(this.errorCbk)
            .toHaveBeenCalledWith(jasmine.any(Object));
        });
      });

      when('request succeeds', function() {
        this.httpBackend.expectGET('data/sorts.json')
          .respond(200, this.data);
        this.successCbk = jasmine.createSpy('successCbk');
        battles.sortTypes().then(this.successCbk);
        this.httpBackend.flush();
      }, function() {
        it('should resolve promise with data', function() {
          expect(this.successCbk)
            .toHaveBeenCalledWith(this.data);
        });

        it('should store data for next calls', function() {
          this.httpBackend.resetExpectations();
          expect(battles.sortTypes()).toBeAn('Object');
        });
      });
    });

    describe('updateSortBy(<sorts>, <by>, <type>)', function() {
      beforeEach(function() {
        this.sorts = {
          "date": {
            "name": "Date",
            "key": ["date.year", "date.month", "date.day", "index"],
            "reverse": true
          },
          "my_caster": {
            "name": "My caster",
            "key": ["my_army.faction", "my_army.caster", "index"],
            "reverse": false
          },
        };
      });

      when('<type> is not in <sorts>', function() {
        this.by = { type: 'by_type', reverse: 'by_rev' };
        this.type = 'unknown';
      }, function() {
        it('should not modify <by>', function() {
          expect(battles.updateSortBy(this.sorts, this.by, this.type))
            .toEqual(this.by);
        });
      });

      when('<type> is different from <by> type', function() {
        this.by = { type: 'by_type', reverse: 'by_rev' };
      }, function() {
        using([
          [ 'type'      , 'reverse' ],
          [ 'date'      , true      ],
          [ 'my_caster' , false     ],
        ], function(e, d) {
          it('should set <by> type to <type>, '+d, function() {
            expect(battles.updateSortBy(this.sorts, this.by, e.type))
              .toEqual({ type: e.type, reverse: e.reverse });
          });
        });
      });

      when('<type> is the same as <by> type', function() {
      }, function() {
        using([
          [ 'type'      , 'reverse' , 'expected_rev' ],
          [ 'date'      , true      , false          ],
          [ 'date'      , false     , true           ],
          [ 'my_caster' , false     , true           ],
        ], function(e, d) {
          it('should tggle <by> reverse, '+d, function() {
            this.by = { type: e.type, reverse: e.reverse };

            expect(battles.updateSortBy(this.sorts, this.by, e.type))
              .toEqual({ type: e.type, reverse: e.expected_rev });
          });
        });
      });
    });

    describe('sort(<sorts>, <type>, <reverse>)', function() {
      beforeEach(inject(function(orderByFilter) {
        this.orderByFilter = orderByFilter;

        this.battles = [ 'battles' ];
        this.sorts = { 'type': { key: 'type_key' } };
        this.type = 'type';
        this.reverse = 'reverse';
      }));

      it('should sort battles', function() {
        expect(battles.sort(this.battles, this.sorts, this.type, this.reverse))
          .toBe('orderByFilter.returnValue');
        expect(this.orderByFilter)
          .toHaveBeenCalledWith([ 'battles' ], 'type_key', 'reverse');
      });
    });

    describe('toTable()', function() {
      it('should export battles to table', function() {
        expect(battles.toTable([
          { date: { year: 2014, month: 2, day: 25 },
            my_army: { faction: 'cryx', caster: 'denny1' },
            opponent: { name: 'kevin', faction: 'khador', caster: 'vlad1' },
            setup: { size: 50, scenario: 'sr15inco', event: 'wtc',
                     initiative: { won_roll: 'true', started: 'false' } },
            score: 'va', points: { my_army: { scenario: 1, army: 2, kill: 3 },
                                   opponent: { scenario: 4, army: 5, kill: 6 } },
            tags: ['tag1','tag2'], comment: 'coucouc1' },
          { date: { year: 2015, month: 1, day: 15 },
            my_army: { faction: 'menoth', caster: 'severius1' },
            opponent: { name: 'wood', faction: 'scyrah', caster: 'ossyan1' },
            setup: { size: 25, scenario: 'sr15incu', event: 'wtc',
                     initiative: { won_roll: 'false', started: 'true' } },
            score: 'dc', points: { my_army: { scenario: 11, army: 12, kill: 13 },
                                   opponent: { scenario: 14, army: 15, kill: 16 } },
            tags: ['tag11','tag12'], comment: 'coucouc2' },
        ])).toEqual([
          [ 'date', 'my_faction', 'my_caster', 'opponent', 'opponent_faction', 'opponent_caster', 'size', 'scenario', 'event', 'initiative', 'result', 'my_cp', 'my_ap', 'my_kp', 'opponent_cp', 'opponent_ap', 'opponent_kp', 'tags', 'comment' ],
          [ '2014-2-25', 'cryx', 'denny1', 'kevin', 'khador', 'vlad1', 50, 'sr15inco', 'wtc', 'wonRoll-choseSide', 'va', 1, 2, 3, 4, 5, 6, 'tag1|tag2', 'coucouc1' ],
          [ '2015-1-15', 'menoth', 'severius1', 'wood', 'scyrah', 'ossyan1', 25, 'sr15incu', 'wtc', 'lostRoll-startedGame', 'dc', 11, 12, 13, 14, 15, 16, 'tag11|tag12', 'coucouc2' ]
        ]);
      });
    });
  });

});
