'use strict';

describe('service', function() {

  var battles;
  var battles_filtered;
  var battles_sorted;
  var mock_battle_filter;
  var mock_orderBy_filter;

  beforeEach(function() {
    var i;
    battles = {
      list: []
    };
    battles_filtered = [];
    battles_sorted = [];
    for(i = 0 ; i < 40; i++) {
      battles_sorted.push({});
    }
    mock_battle_filter = jasmine.createSpy('mock_battle_filter')
      .and.returnValue(battles_filtered);
    mock_orderBy_filter = jasmine.createSpy('mock_orderBy_filter')
      .and.returnValue(battles_sorted);
    angular.module('jlogApp.testServices', [])
      .service('battles', function() {
        return battles;
      })
      .filter('battle', function() {
        return mock_battle_filter;
      })
      .filter('orderBy', function() {
        return mock_orderBy_filter;
      });
    module('jlogApp.services');
    module('jlogApp.testServices');
    console.log = jasmine.createSpy('log');
  });

  describe('battles_display', function() {

    var battles_display;

    beforeEach(inject(['battles_display', function(_battles_display) {
      battles_display = _battles_display;
    }]));

    it('should extend battles service', function() {
      expect(battles.display_list).toEqual([]);
      expect(battles.reset).toBeA('Function');
      expect(battles.showMore).toBeA('Function');
    });

    describe('on reset', function() {

      var active;
      var invert;
      var sort;

      beforeEach(function() {
        active = {};
        invert = {};
        sort = {
          types: {
            test_type: { key: {} }
          },
          type: 'test_type',
          reverse: {}
        };
        
        battles.reset(active, invert, sort);
      });
      
      it('should filter list', function() {
        expect(mock_battle_filter).toHaveBeenCalledWith(battles.list,
                                                        active,
                                                        invert);
      });

      it('should sort list', function() {
        expect(mock_orderBy_filter).toHaveBeenCalledWith(battles_filtered,
                                                         sort.types.test_type.key,
                                                         sort.reverse);
      });

      it('should set display list to first slice of sorted battles', function() {
        var i;
        expect(battles.display_list.length).toBe(15);
        for(i = 0 ; i < 15 ; i++) {
          expect(battles.display_list[i]).toBe(battles_sorted[i]);
        }
      });

      describe('on showMore', function() {

        describe('when there is more than a slice of sorted battles left', function() {

          beforeEach(function() {
            battles.showMore();
          });

          it('should append next slice to display list', function() {
            var i;
            expect(battles.display_list.length).toBe(30);
            for(i = 0 ; i < 30 ; i++) {
              expect(battles.display_list[i]).toBe(battles_sorted[i]);
            }
          });

        });

        describe('when there is less than a slice of sorted battles left', function() {

          beforeEach(function() {
            battles.showMore();
            battles.showMore();
          });

          it('should append remaining battles to display list', function() {
            var i;
            expect(battles.display_list.length).toBe(40);
            for(i = 0 ; i < 40 ; i++) {
              expect(battles.display_list[i]).toBe(battles_sorted[i]);
            }
          });

        });

        describe('when there is no more sorted battles left', function() {

          beforeEach(function() {
            battles.showMore();
            battles.showMore();
            battles.showMore();
          });

          it('should do nothing', function() {
            var i;
            expect(battles.display_list.length).toBe(40);
            for(i = 0 ; i < 40 ; i++) {
              expect(battles.display_list[i]).toBe(battles_sorted[i]);
            }
          });

        });

      });

    });

  });

});
