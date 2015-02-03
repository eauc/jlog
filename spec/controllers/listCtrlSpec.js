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
            list: [ 'b1','b2','b3','b4' ],
            display_list: [ 'b2','b4' ]
        };
      });

      it('should go to battle edit', function() {
        this.scope.doAddBattle();
        expect(this.scope.stateGo)
          .toHaveBeenCalledWith('battle.edit', {
            index: this.scope.battles.list.length
          });
      });
    });

    describe('doSortBy(<type>)', function() {
      beforeEach(function() {
        this.scope.sort_types = 'sort_types';
        this.scope.battles = { sort: 'sort_by' };
        this.battlesService = spyOnService('battles');

        this.scope.doSortBy('type');
      });

      it('should update battles sort', function() {
        expect(this.battlesService.updateSortBy)
          .toHaveBeenCalledWith('sort_types', 'sort_by', 'type');
        expect(this.scope.battles.sort)
          .toBe('battles.updateSortBy.returnValue');
      });

      it('should update battles list', function() {
        expect(this.scope.updateBattles).toHaveBeenCalled();
      });
    });

    describe('doExportOpen()', function() {
      beforeEach(function() {
        this.fileExportService = spyOnService('fileExport');
        this.battlesService = spyOnService('battles');
        this.scope.battles = { display_list: ['display_list'] };

        this.scope.doExportOpen();
      });

      it('should create JSON export', function() {
        expect(this.fileExportService.generate)
          .toHaveBeenCalledWith('json', ['display_list']);

        expect(this.scope.exports.json.name).toMatch(/battles_\d+\.json/);
        expect(this.scope.exports.json.label).toBe('JSON');
        expect(this.scope.exports.json.url)
          .toBe('fileExport.generate.returnValue');
      });

      it('should create CSV export', function() {
        expect(this.battlesService.toTable)
          .toHaveBeenCalledWith(['display_list']);
        expect(this.fileExportService.generate)
          .toHaveBeenCalledWith('csv', 'battles.toTable.returnValue');

        expect(this.scope.exports.csv.name).toMatch(/battles_\d+\.csv/);
        expect(this.scope.exports.csv.label).toBe('CSV');
        expect(this.scope.exports.csv.url)
          .toBe('fileExport.generate.returnValue');
      });

      it('should create BBCode export', function() {
        expect(this.battlesService.toTable)
          .toHaveBeenCalledWith(['display_list']);
        expect(this.fileExportService.generate)
          .toHaveBeenCalledWith('bb', 'battles.toTable.returnValue');

        expect(this.scope.exports.bb.name).toMatch(/battles_\d+\.txt/);
        expect(this.scope.exports.bb.label).toBe('BB Code');
        expect(this.scope.exports.bb.url)
          .toBe('fileExport.generate.returnValue');
      });
    });
  });

});
