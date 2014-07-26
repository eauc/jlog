'use strict';

describe('helper', function() {

  describe('matcher toHaveProperty', function(context) {

    it('should test the definition of the object property', function() {
      expect({ toto: 'titi' }).toHaveProperty('toto');
      expect({ toto: 'titi' }).not.toHaveProperty('titi');
    });

  });

});
