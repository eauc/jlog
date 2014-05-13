'use strict';

describe('service', function() {

    beforeEach(function() {
        module('jlogApp.services');
    });

    describe('sort', function() {

        var sort;

        beforeEach(inject([
            'battle_sort',
            function(_sort) {
                sort = _sort();
            }]));
        
        it('should sort by reverse date by default', function() {
            expect(sort.type).toEqual('date');
            expect(sort.reverse).toBe(true);
        });

        describe('sortBy', function() {

            it('should set type to argument', function() {
                sort.sortBy('result');

                expect(sort.type).toEqual('result');
            });

            it('should do nothing if argument is not a known sort type', function() {
                sort.sortBy('toto');

                expect(sort.type).toEqual('date');
                expect(sort.reverse).toBe(true);
            });

            it('should set reverse to false if type changes', function() {
                sort.sortBy('result');

                expect(sort.reverse).toBe(false);
            });

            it('should toggle reverse if type does not change', function() {
                sort.sortBy('result');
                sort.sortBy('result');

                expect(sort.reverse).toBe(true);
            });

        });

    });

});
