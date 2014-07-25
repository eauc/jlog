'use strict';

describe('filter', function() {

  beforeEach(module('jlogApp.services'));
  beforeEach(module('jlogApp.filters'));

  describe('battle', function() {

    var battleFilter;
    var filter;
    var test_input;

    beforeEach(inject([
      'filter',
      'battleFilter',
      function(_filter,
               _battleFilter) {
        filter = _filter;
        spyOn(filter, 'match');

        battleFilter = _battleFilter;
      }]));

    describe('when input is not an array', function() {
      it('should return input', function() {
        expect(battleFilter('toto', true, false)).toBe('toto');
        var obj = {};
        expect(battleFilter(obj, true, false)).toBe(obj);
      });
    });

    describe('when not active', function() {
      it('should return input', function() {
        var input = [ 'toto', 'titi', 'tata' ];
        expect(battleFilter(input, false, false)).toBe(input);
      });
    });

    describe('when active and input is an array', function() {
      var input;
      beforeEach(function() {
        input = [ 'toto', 'titi', 'tata' ];
        filter.match.and.callFake(function(el, inv) {
          return el === 'toto';
        });
      });

      it('should call filter.match on each element of the array', function() {
        battleFilter(input, true, false);

        expect(filter.match).toHaveBeenCalledWith('toto', false);
        expect(filter.match).toHaveBeenCalledWith('titi', false);
        expect(filter.match).toHaveBeenCalledWith('tata', false);
      });

      it('should call filter.match with invert', function() {
        battleFilter(input, true, false);
        battleFilter(input, true, true);

        expect(filter.match).toHaveBeenCalledWith('toto', false);
        expect(filter.match).toHaveBeenCalledWith('toto', true);
      });

      it('should filter input based on filter.match result', function() {
        var result = battleFilter(input, true, false);

        expect(result).toEqual(['toto']);
      });
    });

  });

});
