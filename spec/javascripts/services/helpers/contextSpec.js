'use strict';

describe('helper', function() {

  describe('describe context', function(context) {

    it('"describe" function should be passed a "context" object', function() {
      expect(context).toBeAn('Object');
    });

    describe('setting context data in "beforeEach"', function(context) {

      beforeEach(function() {
        context.data = 'data';
      });

      it('should be reset between examples', function() {
        context.data = 'changed';
        expect(context.data).toBe('changed');
      });

      it('should be available in examples', function() {
        expect(context.data).toBe('data');
      });

      describe('in sub "describe"', function(context) {

        beforeEach(function() {
          context.sub_data = 'sub_data';
        });

        it('"context" data defined in parent describe should be available', function() {
          expect(context.data).toBe('data');
        });

      });

      it('"context" data defined in sub "describe" should not be available', function() {
        expect(context.sub_data).toBe(undefined);
      });
          
    });

    describe('in "describe" block', function(context) {

      it('"context" data defined in another describe should not be available', function() {
        expect(context.data).toBe(undefined);
      });

    });

    it('context should be empty at top level', function() {
      expect(_.keys(context).length).toBe(0);
    });

  });

});
