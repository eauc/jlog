'use strict';

angular.module('jlogApp.controllers')
  .controller('backupCtrl', [
    '$scope',
    'backup',
    'battles',
    'storage',
    function($scope,
             backup,
             battles,
             storage) {

      console.log('init backupCtrl');

      $scope.bottom_bar.show = false;

      $scope.backup = backup;
      $scope.readBackupFile = function readBackupFile(file) {
        $scope.backup.read(file, function(data) {
          storage.clearJLogKeys();
          $scope.$emit('newBattles', data);
          backup.generate($scope.battles.list);
          $scope.$apply("backup.read_result = 'loaded file'");
        }, function(error) {
          $scope.$apply("backup.read_result = '" + error + "'");
        });
      };

      $scope.uploadData = function() {
        backup.upload(battles.list);
      };
      $scope.downloadData = function downloadData() {
        $scope.backup.download()
          .then(function(data) {
            storage.clearJLogKeys();
            $scope.$emit('newBattles', data);
            backup.generate($scope.battles.list);
          });
      };

      $scope.onClearStorage = function() {
        storage.clearJLogKeys();
      };

      backup.statusReset();
      backup.generate($scope.battles.list);
    }]);
