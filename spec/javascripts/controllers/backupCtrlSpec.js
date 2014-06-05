'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.filters');
    module('jlogApp.services');
    module('jlogApp.controllers');
  });

  describe('backupCtrl', function() {

    var scope;
    var backup;
    var battles;

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {

        backup = jasmine.createSpyObj('backup', ['read', 'generate']);

        scope = $rootScope.$new();
        spyOn(scope, '$emit');
        scope.battles = { list: 'battles_list' };
        $controller('backupCtrl', { 
          '$scope': scope,
          'backup': backup
        });
      }]));

    it('should initialize scope', function() {
      expect(scope.backup).toBe(backup);
      expect(angular.isFunction(scope.readBackupFile)).toBe(true);
    });

    it('should generate a backup file', function() {
      expect(backup.generate).toHaveBeenCalledWith(scope.battles.list);
    });

    describe('readBackupFile', function() {

      beforeEach(function() {
        scope.readBackupFile('file');
      });

      it('should read the file', function() {
        expect(backup.read)
          .toHaveBeenCalledWith('file', jasmine.any(Function), jasmine.any(Function));
      });

      describe('on success', function() {

        var onSuccess;

        beforeEach(function() {
          backup.generate.calls.reset();

          onSuccess = backup.read.calls.first().args[1];
          onSuccess('data');
        });

        it('should emit "newBattles" event', function() {
          expect(scope.$emit)
            .toHaveBeenCalledWith('newBattles', 'data');
        })

        it('should generate a new backup file', function() {
          expect(backup.generate)
            .toHaveBeenCalledWith('battles_list');
        })

        it('should update read result', function() {
          expect(backup.read_result).toBe('loaded file');
        })

      });

      describe('on error', function() {

        var onError;

        beforeEach(function() {
          onError = backup.read.calls.first().args[2];
          onError('error');
        });

        it('should update read result', function() {
          expect(backup.read_result).toBe('error');
        })

      });

    });

  });

});
