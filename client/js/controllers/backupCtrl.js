'use strict';

angular.module('jlogApp.controllers')
    .controller('backupCtrl', [
        '$scope',
        'backup',
        function($scope,
                 backup) {

            console.log('init backupCtrl');

            $scope.backup = backup;
            $scope.readBackupFile = function readBackupFile(file) {
                $scope.backup.read(file, function(data) {
                    $scope.newBattles(data);
                    backup.generate($scope.battles);
                    $scope.$apply("backup.read_result = 'loaded file'");
                }, function(error) {
                    $scope.$apply("backup.read_result = '" + error + "'");
                });
            };

            $scope.uploadData = function uploadData() {
                $scope.backup.upload($scope.battles);
            };
            $scope.downloadData = function downloadData() {
                $scope.backup.download(function(data) {
                    $scope.newBattles(data.battles);
                    backup.generate($scope.battles);
                }, function(error) {
                });
            };

            backup.generate($scope.battles);
        }]);
