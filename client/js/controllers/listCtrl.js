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

      $scope.bottom_bar.show = true;

      $scope.onViewBattle = function onViewBattle(index) {
        $state.go('battle.view', { index: index });
      };

      $scope.resetListDisplay();
      $scope.$watch('sort', $scope.resetListDisplay, true);

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

      // $scope.$watch('list_display.sorted_battles|filter:{selected:true}', function(nv) {
      //     selection.update(nv);
      // }, true);

      // $scope.selection.reset($scope.battles);
    }])
  .controller('listBottomCtrl', [
    '$scope',
    '$state',
    'export',
    'battles_display',
    function($scope,
             $state,
             _export,
             battles_display) {
      console.log('init listBottomCtrl');

      $scope.onAddBattle = function onAddBattle() {
        $state.go('battle.edit', { index: -1 });
      };

      $scope['export'] = _export;
      $scope.onExportOpen = function(event) {
        _export.generate(battles_display.sorted_list);
        $scope.drop_down.toggle('battle_list_export', event);
      };
    }]);
