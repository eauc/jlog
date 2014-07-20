'use strict';

describe('helper', function() {

  describe('matcher toBeA[n]', function(context) {

    it('should test the type of the variable', function() {
      expect(function(){}).toBeA('Function');
      expect(function(){}).not.toBeAn('Array');

      expect([]).toBeAn('Array');
      expect([]).toBeAn('Object');
      expect([]).not.toBeAn('String');

      expect({}).toBeAn('Object');
      expect({}).not.toBeAn('Function');
    });

  });

});
