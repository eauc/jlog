'use strict';

describe('filter', function() {

    beforeEach(module('jlogApp.filters'));

    describe('initiative', function() {

        var initiativeFilter;

        beforeEach(inject([ 'initiativeFilter', function(_initiativeFilter) {
            initiativeFilter = _initiativeFilter;
        }]));

        it('should return "nil" if argument is invalid', function() {

            expect(initiativeFilter()).toEqual('nil');
            expect(initiativeFilter('toto')).toEqual('nil');
            expect(initiativeFilter({})).toEqual('nil');
            expect(initiativeFilter({ won_roll: 'true' })).toEqual('nil');
            expect(initiativeFilter({ started: 'false' })).toEqual('nil');
            expect(initiativeFilter({ won_roll: 'true', started: false })).toEqual('nil');
            expect(initiativeFilter({ won_roll: true, started: 'false' })).toEqual('nil');

        });

        it('should return correctly formatted string if argument is valid', function() {

            expect(initiativeFilter({ won_roll: 'true', started: 'false' }))
                .toEqual('Won roll, chose side');
            expect(initiativeFilter({ won_roll: 'true', started: 'true' }))
                .toEqual('Won roll, started game');
            expect(initiativeFilter({ won_roll: 'false', started: 'false' }))
                .toEqual('Lost roll, chose side');
            expect(initiativeFilter({ won_roll: 'false', started: 'true' }))
                .toEqual('Lost roll, started game');

        });

    });

});
