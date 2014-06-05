'use strict';

angular.module('jlogApp.controllers')
  .controller('listCtrl', [
    '$scope',
    '$state',
    '$timeout',
    'scenarios',
    function($scope,
             $state,
             $timeout,
             scenarios) {
      console.log('init listCtrl');

      $scope.scenarios = scenarios.list;

      $scope.onViewBattle = function onViewBattle(index) {
        $state.go('battle.view', { index: index });
      };

      function showMore() {
        $scope.battles.showMore();
        if($scope.battles.more) {
          $timeout(showMore, 100);
        }
      }
      function resetListDisplay() {
        $scope.battles.reset($scope.filter,
                             $scope.filter_active,
                             $scope.filter_invert,
                             $scope.sort);
        $timeout(showMore, 100);
      }
      resetListDisplay();
      $scope.$watch('sort', resetListDisplay, true);

      $scope.show_list = true;
      $scope.$on('$stateChangeSuccess', 
                 function(event, toState, toParams, fromState, fromParams) {
                   $scope.show_list = ('battle' === toState.name);
                 });
      // $scope.selectionRemove = function() {
      //     if ($scope.selection.remove($scope.battles)) {
      //         $scope.updateBattles();
      //     }
      // };
      // $scope.selectionSet = function(type) {
      //     if ($scope.selection.set(type, $scope.battles)) {
      //         $scope.updateBattles();
      //     }
      // };
      // $scope.selectionUnset = function(type) {
      //     if ($scope.selection.unset(type, $scope.battles)) {
      //         $scope.updateBattles();
      //     }
      // };

      // $scope.$watch('filter_active', function() {
      //     $scope.list_display.reset($scope.battles,
      //                               $scope.filter,
      //                               $scope.filter_active,
      //                               $scope.filter_invert,
      //                               $scope.sort);
      // });
      // $scope.$watch('filter_invert', function() {
      //     $scope.list_display.reset($scope.battles,
      //                               $scope.filter,
      //                               $scope.filter_active,
      //                               $scope.filter_invert,
      //                               $scope.sort);
      // });
      // $scope.$watch('list_display.sorted_battles|filter:{selected:true}', function(nv) {
      //     selection.update(nv);
      // }, true);

      // $scope.selection.reset($scope.battles);
    }])
  .controller('listBottomCtrl', [
    '$scope',
    '$state',
    function($scope,
             $state) {
      console.log('init listBottomCtrl');

      $scope.onAddBattle = function onAddBattle() {
        $state.go('battle.edit', { index: -1 });
      };
      // $scope.onClose = function onClose() {
      //   $state.go('battle');
      // };

    }]);
