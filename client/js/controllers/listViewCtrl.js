'use strict';

angular.module('jlogApp.controllers')
  .controller('listViewCtrl', [
    '$scope',
    '$state',
    '$window',
    'battles',
    function($scope,
             $state,
             $window,
             battles) {
      if(undefined === $scope.battle) {
        // $scope.battle_index = 1;
        // $scope.battle = battles.list[1];
        $state.go('battle.list');
      }

      console.log('init listViewCtrl ' + $scope.battle_index);
      console.log($scope.battle);

      $scope.bottom_bar.onEditBattle = function onEditBattle() {
        $state.go('battle.edit');
      };
      $scope.bottom_bar.onDeleteBattle = function onDeleteBattle() {
        var confirm = $window.confirm('You sure you wanna delete this battle ?');
        if(!confirm) return;
        battles.remove($scope.battle_index);
        $scope.bottom_bar.onClose();
      };
    }]);
