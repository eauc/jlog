'use strict';

describe('services', function() {

  beforeEach(function() {
    angular.module('jlogApp.services')
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
      function(_battles) {
        battles = _battles;
      }
    ]));

    describe('buildIndex()', function() {
      it('should set indices in battles', function() {
        expect(battles.buildIndex([
          { name: 'battle1' },
          { name: 'battle2' },
          { name: 'battle3' },
        ])).toEqual([
          { index: 0, name: 'battle1' },
          { index: 1, name: 'battle2' },
          { index: 2, name: 'battle3' },
        ]);
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
  });

});
