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

  describe('listBottomCtrl', function(c) {

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        this.scope = $rootScope.$new();
        this.scope.stateGo = jasmine.createSpy('stateGo');
        this.scope.updateBattles = jasmine.createSpy('updateBattles');

        $controller('listBottomCtrl', { 
          '$scope': this.scope,
        });
        $rootScope.$digest();
      }
    ]));

    describe('doAddBattle()', function() {
      beforeEach(function() {
        this.scope.battles = {
            display_list: [ 'b1','b2','b3','b4' ]
        };
      });

      it('should go to battle edit', function() {
        this.scope.doAddBattle();
        expect(this.scope.stateGo)
          .toHaveBeenCalledWith('battle.edit', {
            index: this.scope.battles.display_list.length
          });
      });
    });

    describe('doSortBy(<type>)', function() {
      beforeEach(function() {
        this.scope.sort_types = 'sort_types';
        this.scope.battles = { sort: 'sort_by' };
        this.battles = spyOnService('battles');

        this.scope.doSortBy('type');
      });

      it('should update battles sort', function() {
        expect(this.battles.updateSortBy)
          .toHaveBeenCalledWith('sort_types', 'sort_by', 'type');
        expect(this.scope.battles.sort)
          .toBe('battles.updateSortBy.returnValue');
      });

      it('should update battles list', function() {
        expect(this.scope.updateBattles).toHaveBeenCalled();
      });
    });
  });

});
