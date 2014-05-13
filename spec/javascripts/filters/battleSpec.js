'use strict';

describe('filter', function() {

    beforeEach(module('jlogApp.filters'));

    describe('battle', function() {

        var battleFilter;
        var mock_filter;
        var test_input;

        beforeEach(inject([ 'battleFilter', function(_battleFilter) {
            battleFilter = _battleFilter;
            mock_filter = jasmine.createSpyObj('mock_filter', ['match']);
        }]));

        describe('when input is not an array', function() {
            it('should return input', function() {
                expect(battleFilter('toto', mock_filter, true, false)).toBe('toto');
                var obj = {};
                expect(battleFilter(obj, mock_filter, true, false)).toBe(obj);
            });
        });

        describe('when not active', function() {
            it('should return input', function() {
                var input = [ 'toto', 'titi', 'tata' ];
                expect(battleFilter(input, mock_filter, false, false)).toBe(input);
            });
        });

        describe('when active and input is an array', function() {
            var input;
            beforeEach(function() {
                input = [ 'toto', 'titi', 'tata' ];
                mock_filter.match.and.callFake(function(el, inv) {
                    return el === 'toto';
                });
            });

            it('should call filter.match on each element of the array', function() {
                battleFilter(input, mock_filter, true, false);

                expect(mock_filter.match).toHaveBeenCalledWith('toto', false);
                expect(mock_filter.match).toHaveBeenCalledWith('titi', false);
                expect(mock_filter.match).toHaveBeenCalledWith('tata', false);
            });

            it('should call filter.match with invert', function() {
                battleFilter(input, mock_filter, true, false);
                battleFilter(input, mock_filter, true, true);

                expect(mock_filter.match).toHaveBeenCalledWith('toto', false);
                expect(mock_filter.match).toHaveBeenCalledWith('toto', true);
            });


            it('should filter input based on filter.match result', function() {
                var result = battleFilter(input, mock_filter, true, false);

                expect(result).toEqual(['toto']);
            });
        });

    });

});
