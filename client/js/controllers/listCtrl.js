'use strict';

angular.module('jlogApp.controllers')
  .controller('listCtrl', [
    '$scope',
    function($scope) {
      console.log('init listCtrl');

      $scope.doViewBattle = function(index) {
        $scope.stateGo('battle.view', { index: index });
      };
    }
  ])
  .controller('listBottomCtrl', [
    '$scope',
    'battles',
    'fileExport',
    function($scope,
             battles,
             fileExport) {
      console.log('init listBottomCtrl');

      $scope.doAddBattle = function() {
        $scope.stateGo('battle.edit',
                       { index: $scope.battles.list.length });
      };

      $scope.doSortBy = function(type) {
        $scope.battles.sort = battles.updateSortBy($scope.sort_types,
                                                   $scope.battles.sort,
                                                   type);
        console.log('sortBy', $scope.battles.sort);
        $scope.updateBattles();
      };

      $scope.exports = {};
      $scope.doExportOpen = function() {
        // console.log('doExportOpen');
        var now = (new Date()).getTime();
        $scope.exports = {
          json: {
            name: 'battles_'+now+'.json',
            url: fileExport.generate('json', $scope.battles.sorted_list),
            label: 'JSON'
          },
          csv: {
            name: 'battles_'+now+'.csv',
            url: fileExport.generate('csv', battles.toTable($scope.battles.sorted_list)),
            label: 'CSV'
          },
          bb: {
            name: 'battles_'+now+'.txt',
            url: fileExport.generate('bb', battles.toTable($scope.battles.sorted_list)),
            label: 'BB Code'
          }
        };
      };
    }
  ]);
