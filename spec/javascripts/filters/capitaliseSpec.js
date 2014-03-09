'use strict';

describe('filter', function() {

    beforeEach(module('clockApp.filters'));

    describe('capitalise', function() {

        var capFilter;

        beforeEach(inject(function(capitaliseFilter) {
            capFilter = capitaliseFilter;
        }));

        it('should change first character to upper case if in lower case',
           function() {

               expect(capFilter('toto')).toEqual('Toto');
               expect(capFilter('tOtO')).toEqual('TOtO');
               expect(capFilter('tOTO')).toEqual('TOTO');

           });

        it('should not change first character if already in upper case',
           function() {

               expect(capFilter('Toto')).toEqual('Toto');
               expect(capFilter('TOtO')).toEqual('TOtO');
               expect(capFilter('TOTO')).toEqual('TOTO');

           });

    });

});
