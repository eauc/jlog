'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.services');
    module('jlogApp.controllers');
  });

  describe('listCtrl', function(c) {

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        this.scope = $rootScope.$new();
        this.scope.stateGo = jasmine.createSpy('stateGo');

        $controller('listCtrl', { 
          '$scope': this.scope,
        });
        $rootScope.$digest();
      }
    ]));

    describe('doViewBattle(<index>)', function() {
      it('should go to battle view', function() {
        this.scope.doViewBattle(4);
        expect(this.scope.stateGo)
          .toHaveBeenCalledWith('battle.view', {index: 4});
      });
    });
  });

});
