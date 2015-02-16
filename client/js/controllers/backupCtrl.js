'use strict';

angular.module('jlogApp.controllers')
  .controller('backupCtrl', [
    '$scope',
    '$window',
    'textImport',
    'fileImport',
    'igParser',
    'textExport',
    'fileExport',
    'server',
    'battles',
    'filter',
    function($scope,
             $window,
             textImport,
             fileImport,
             igParser,
             textExport,
             fileExport,
             server,
             battles,
             filter) {

      console.log('init backupCtrl');

      igParser.init();

      function generateBackup() {
        var now = (new Date()).getTime();
        $scope.backup = {
          text: textExport.generate('json', $scope.battles.list),
          url: fileExport.generate('json', $scope.battles.list),
          name: 'jlog_'+now+'.json'
        };
      }
      $scope.$watch('battles.list', function(list) {
        if(_.isEmpty(list)) return;
        generateBackup();
      });

      $scope.read_text = null;
      $scope.read_result = {};
      $scope.doReadFile = function(type, file) {
        console.log('readFile', type, file);
        $scope.read_result[type] = [ 'Loading file...' ];
        $scope.$digest();
        fileImport.read(type, file)
          .then(function(data) {
            var state = data[0];
            var error = data[1];
            var go_to_list = _.isEmpty(error);
            error.push('imported '+state.length+' battles');
            if(!_.isEmpty(state)) $scope.setBattles(state);
            $scope.read_result[type] = error;
            if(go_to_list) $scope.stateGo('battle');
          }, function(error) {
            $scope.read_result[type] = error;
          });
      };
      $scope.doReadText = function(type, text) {
        console.log('readFile', type, text);
        if(!_.isString(text) ||
           s.isBlank(text)) return;
        $scope.read_result[type] = [ 'Reading text...' ];
        textImport.read(type, text)
          .then(function(data) {
            var state = data[0];
            var error = data[1];
            var go_to_list = _.isEmpty(error);
            error.push('imported '+state.length+' battles');
            if(!_.isEmpty(state)) $scope.setBattles(state);
            $scope.read_result[type] = error;
            if(go_to_list) $scope.stateGo('battle');
          }, function(error) {
            $scope.read_result[type] = error;
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
        // $scope.$digest();
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
        $scope.download.msg = 'Downloading...';
        // $scope.$digest();
        server.download($scope.download.id)
          .then(function(data) {
            $scope.download.msg = data[1];
            if(_.exists(data[0])) {
              $scope.setBattles(data[0]);
              $scope.stateGo('battle');
            }
          });
      };

      $scope.doClearStorage = function() {
        battles.clearStorage();
        filter.clearStorage();
      };

      $scope.old_data = null;
      $scope.doReadOldDatabase = function() {
        $scope.old_data = $window.localStorage.getItem('jlog_battles');
      };
    }]);
