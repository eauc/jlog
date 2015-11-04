'use strict';

angular.module('jlogApp.controllers')
  .controller('listViewCtrl', [
    '$q',
    '$scope',
    '$stateParams',
    function($q,
             $scope,
             $stateParams) {
      $q.when($scope.ready).then(function() {
        $scope.battle = $scope.battles.list[$stateParams.index];
        console.log('init listViewCtrl', $stateParams.index, $scope.battle);
      });
    }])
  .controller('listViewBottomCtrl', [
    '$scope',
    '$stateParams',
    'prompt',
    'battles',
    function($scope,
             $stateParams,
             prompt,
             battles) {
      console.log('init listViewBottomCtrl');

      $scope.doEditBattle = function() {
        $scope.stateGo('battle.edit', { index: $stateParams.index });
      };
      $scope.doDeleteBattle = function() {
        prompt.prompt('confirm', 'You sure you wanna delete this battle ?')
          .then(function() {
            $scope.setBattles(battles.drop($scope.battles.list,
                                           parseFloat($stateParams.index)));
            $scope.doClose();
          });
      };
      $scope.doClose = function() {
        $scope.stateGo('battle');
      };
    }]);
