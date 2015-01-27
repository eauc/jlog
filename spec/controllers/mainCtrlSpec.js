'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('ui.router');
    module('jlogApp.services');
    module('jlogApp.controllers');
  });

  describe('mainCtrl', function(c) {

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        this.scope = $rootScope.$new();

        this.factions = spyOnService('factions');
        this.scenarios = spyOnService('scenarios');
        this.scores = spyOnService('scores');

        $controller('mainCtrl', { 
          '$scope': this.scope,
        });
        $rootScope.$digest();
      }
    ]));

    it('stateIs should map to $state.is', inject(function($state) {
      expect(this.scope.stateIs).toBe($state.is);
    }));

    it('should store info lists', function() {
      expect(this.scope.scores).toBe('scores.data.returnValue');
      expect(this.scope.factions).toBe('factions.data.returnValue');
      expect(this.scope.scenarios).toBe('scenarios.data.returnValue');
    });
  });

});
