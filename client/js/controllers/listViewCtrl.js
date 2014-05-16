'use strict';

angular.module('jlogApp.controllers')
  .controller('listViewCtrl', [
    '$scope',
    '$state',
    '$window',
    function($scope,
             $state,
             $window) {
      console.log('init listViewCtrl ' + $scope.battle_index);
      console.log($scope.battle);

      if (undefined === $scope.battle) {
        $state.go('battle.list');
      }

      $scope.editBattle = function editBattle() {
        $state.go('battle.edit');
      };
      $scope.deleteBattle = function deleteBattle() {
        var confirm = $window.confirm('You sure you wanna delete this battle ?');
        if (!confirm) return;
        $scope.battles.splice($scope.battle_index, 1);
        $scope.updateBattles();
        $scope.close();
      };
    }]);
