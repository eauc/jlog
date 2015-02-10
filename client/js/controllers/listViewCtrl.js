'use strict';

angular.module('jlogApp.controllers')
  .controller('listViewCtrl', [
    '$scope',
    '$stateParams',
    function($scope,
             $stateParams) {
      $scope.battle = $scope.battles.list[$stateParams.index];
      console.log('init listViewCtrl', $stateParams.index, $scope.battle);
    }])
  .controller('listViewBottomCtrl', [
    '$scope',
    '$stateParams',
    '$window',
    'battles',
    function($scope,
             $stateParams,
             $window,
             battles) {
      console.log('init listViewBottomCtrl');

      $scope.doEditBattle = function() {
        $scope.stateGo('battle.edit', { index: $stateParams.index });
      };
      $scope.doDeleteBattle = function() {
        var confirm = $window.confirm('You sure you wanna delete this battle ?');
        if(!confirm) return;
        $scope.setBattles(battles.drop($scope.battles.list,
                                       parseFloat($stateParams.index)));
        $scope.doClose();
      };
      $scope.doClose = function() {
        $scope.stateGo('battle');
      };
    }]);
