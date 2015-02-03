'use strict';

angular.module('jlogApp.controllers')
  .controller('listCtrl', [
    '$scope',
    // '$state',
    // '$timeout',
    // 'scenarios',
    function(
      $scope
      // $state,
      // $timeout,
      // scenarios
    ) {
      console.log('init listCtrl');

      // $scope.bottom_bar.show = true;
      // $scope.filter_state.previous = 'battle';

      $scope.doViewBattle = function(index) {
        $scope.stateGo('battle.view', { index: index });
      };

      // $scope.resetListDisplay();
      // $scope.$watch('sort', $scope.resetListDisplay, true);

      // $scope.show_list = true;
      // $scope.$on('$stateChangeSuccess', 
      //            function(event, toState, toParams, fromState, fromParams) {
      //              $scope.show_list = ('battle' === toState.name);
      //            });
      // // $scope.selectionRemove = function() {
      // //     if ($scope.selection.remove($scope.battles)) {
      // //         $scope.updateBattles();
      // //     }
      // // };
      // // $scope.selectionSet = function(type) {
      // //     if ($scope.selection.set(type, $scope.battles)) {
      // //         $scope.updateBattles();
      // //     }
      // // };
      // // $scope.selectionUnset = function(type) {
      // //     if ($scope.selection.unset(type, $scope.battles)) {
      // //         $scope.updateBattles();
      // //     }
      // // };

      // // $scope.$watch('list_display.sorted_battles|filter:{selected:true}', function(nv) {
      // //     selection.update(nv);
      // // }, true);

      // // $scope.selection.reset($scope.battles);
    }
  ])
  .controller('listBottomCtrl', [
    '$scope',
    'battles',
    'fileExport',
    // '$state',
    // 'battles_display',
    function($scope,
             battles,
             fileExport
      // $state,
      // battles_display
            ) {
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
            url: fileExport.generate('json', $scope.battles.display_list),
            label: 'JSON'
          },
          csv: {
            name: 'battles_'+now+'.csv',
            url: fileExport.generate('csv', battles.toTable($scope.battles.display_list)),
            label: 'CSV'
          },
          bb: {
            name: 'battles_'+now+'.txt',
            url: fileExport.generate('bb', battles.toTable($scope.battles.display_list)),
            label: 'BB Code'
          }
        };
      };
    }
  ]);
