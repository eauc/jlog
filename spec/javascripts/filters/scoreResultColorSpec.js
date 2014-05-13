'use strict';

describe('filter', function() {

    beforeEach(module('jlogApp.filters'));

    describe('scoreResultColor', function() {

        var colorFilter;

        beforeEach(inject([ 'scoreResultColorFilter', function(_colorFilter) {
            colorFilter = _colorFilter;
        }]));

        it('should return empty string if it argument is not a string', function() {

            expect(colorFilter(42)).toEqual('');
            expect(colorFilter([ '42' ])).toEqual('');
            expect(colorFilter({ 'result': '42' })).toEqual('');

        });

        it('should return "text-success" if it argument is "victory"', function() {

            expect(colorFilter('victory')).toEqual('text-success');

        });

        it('should return "text-danger" if it argument is "defeat"', function() {

            expect(colorFilter('defeat')).toEqual('text-danger');

        });

        it('should return "text-warning" otherwise', function() {

            expect(colorFilter('draw')).toEqual('text-warning');
            expect(colorFilter('toto')).toEqual('text-warning');

        });

    });

});
