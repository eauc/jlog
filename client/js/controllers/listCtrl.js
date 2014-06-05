'use strict';

angular.module('jlogApp.controllers')
  .controller('listCtrl', [
    '$scope',
    '$state',
    function($scope,
             $state) {
      console.log('init listCtrl');

      // $scope.show_list = true;
      // $scope.selection = selection;

      $scope.onViewBattle = function onViewBattle(index) {
        $state.go('battle.view', { index: index });
      };

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
