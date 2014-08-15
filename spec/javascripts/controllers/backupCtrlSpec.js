'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.filters');
    module('jlogApp.services');
    module('jlogApp.controllers');
    console.log = jasmine.createSpy('log');
  });

  describe('backupCtrl', function(c) {

    var scope;

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        c.battles = {
          list: ['1234', '6789']
        };
        
        c.backup = jasmine.createSpyObj('backup', [
          'read',
          'generate',
          'download',
          'upload',
          'statusReset'
        ]);

        scope = $rootScope.$new();
        spyOn(scope, '$emit');
        scope.battles = { list: 'battles_list' };
        $controller('backupCtrl', { 
          '$scope': scope,
          'backup': c.backup,
          'battles': c.battles,
        });
      }]));

    it('should initialize scope', function() {
      expect(scope.backup).toBe(c.backup);
      expect(scope.readBackupFile).toBeA('Function');
    });

    it('should generate a backup file', function() {
      expect(c.backup.generate).toHaveBeenCalledWith(scope.battles.list);
    });

    it('should reset backup status', function() {
      expect(c.backup.statusReset).toHaveBeenCalled();
    });

    describe('readBackupFile', function() {

      beforeEach(function() {
        scope.readBackupFile('file');
      });

      it('should read the file', function() {
        expect(c.backup.read)
          .toHaveBeenCalledWith('file', jasmine.any(Function), jasmine.any(Function));
      });

      describe('on success', function(c) {

        beforeEach(function() {
          c.backup.generate.calls.reset();

          var onSuccess = c.backup.read.calls.first().args[1];
          onSuccess('data');
        });

        it('should emit "newBattles" event', function() {
          expect(scope.$emit)
            .toHaveBeenCalledWith('newBattles', 'data');
        });

        it('should generate a new backup file', function() {
          expect(c.backup.generate)
            .toHaveBeenCalledWith('battles_list');
        });

        it('should update read result', function() {
          expect(c.backup.read_result).toBe('loaded file');
        });

      });

      describe('on error', function() {

        beforeEach(function() {
          var onError = c.backup.read.calls.first().args[2];
          onError('error');
        });

        it('should update read result', function() {
          expect(c.backup.read_result).toBe('error');
        });

      });

    });

    describe('uploadData', function() {

      beforeEach(function() {
        scope.uploadData();
      });

      it('should upload the battles list', function() {
        expect(c.backup.upload)
          .toHaveBeenCalledWith(c.battles.list);
      });

    });

    describe('downloadData', function() {

      beforeEach(inject([
        '$q',
        function($q) {
          c.deferred = $q.defer();
          c.backup.download.and.returnValue(c.deferred.promise);

          scope.downloadData();
        }
      ]));

      it('should download the battles list', function() {
        expect(c.backup.download).toHaveBeenCalled();
      });

      describe('on download success', function() {

        beforeEach(inject([
          '$rootScope',
          function($rootScope) {
            c.backup.generate.calls.reset();

            c.new_battles = [ 'toto', 'titi'];

            c.deferred.resolve(c.new_battles);
            $rootScope.$digest();
          }
        ]));

        it('should emit "newBattles" event', function() {
          expect(scope.$emit).toHaveBeenCalledWith('newBattles', c.new_battles);
        });

        it('should generate new backup file', function() {
          expect(c.backup.generate).toHaveBeenCalledWith(scope.battles.list);
        });

      });

    });

  });

});
