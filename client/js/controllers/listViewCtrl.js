'use strict';

angular.module('jlogApp.controllers')
  .controller('listViewCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$window',
    'battles',
    function($scope,
             $state,
             $stateParams,
             $window,
             battles) {
      $scope.bottom_bar.show = true;

      if(undefined === $stateParams.index) {
        // $scope.battle_index = 1;
        // $scope.battle = battles.list[1];
        $state.go('battle');
      }

      console.log('init listViewCtrl ' + $stateParams.index);

      $scope.battle = battles.list[$stateParams.index];
    }])
  .controller('listViewBottomCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$window',
    'battles',
    function($scope,
             $state,
             $stateParams,
             $window,
             battles) {
      console.log('init listViewBottomCtrl');

      $scope.onEditBattle = function onEditBattle() {
        $state.go('battle.edit', { index: $stateParams.index });
      };
      $scope.onDeleteBattle = function onDeleteBattle() {
        var confirm = $window.confirm('You sure you wanna delete this battle ?');
        if(!confirm) return;
        battles.remove($stateParams.index);
        $scope.onClose();
      };
      $scope.onClose = function onClose() {
        $state.go('battle');
      };
    }]);
