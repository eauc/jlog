'use strict';

angular.module('jlogApp.controllers')
  .controller('backupCtrl', [
    '$scope',
    'fileImport',
    'fileExport',
    'server',
    // 'battles',
    // 'storage',
    function($scope,
             fileImport,
             fileExport,
             server
             // battles,
             // storage
            ) {

      console.log('init backupCtrl');

      // $scope.bottom_bar.show = false;

      function generateBackup() {
        var now = (new Date()).getTime();
        $scope.backup = {
          url: fileExport.generate('json', $scope.battles.list),
          name: 'jlog_'+now+'.json'
        };
      }
      generateBackup();

      $scope.read_result = [];
      $scope.doReadBackupFile = function(file) {
        console.log('readBackupFile', file);
        $scope.read_result = [];
        fileImport.read('json', file)
          .then(function(data) {
            var state = data[0];
            var error = data[1];
            $scope.setBattles(state);
            $scope.read_result = error;
            $scope.stateGo('battle');
          }, function(error) {
            $scope.read_result = error;
          });
      };
      
      $scope.upload = {
        id: null,
        msg: null
      };
      $scope.doUploadData = function() {
        $scope.upload = {
          id: null,
          msg: 'Uploading...'
        };
        server.upload($scope.battles.list)
          .then(function(data) {
            $scope.upload = {
              id: data[0],
              msg: data[1]
            };
          });
      };

      $scope.download = {
        id: null,
        msg: null
      };
      $scope.doDownloadData = function() {
        if(!_.isString($scope.download.id) ||
           s.isBlank($scope.download.id)) return;
        server.download($scope.download.id)
          .then(function(data) {
            $scope.download.msg = data[1];
            if(_.exists(data[0])) {
              $scope.setBattles(data[0]);
              $scope.stateGo('battle');
            }
          });
      };

      // $scope.onClearStorage = function() {
      //   storage.clearJLogKeys();
      // };

      // backup.statusReset();
      // backup.generate($scope.battles.list);
    }]);
