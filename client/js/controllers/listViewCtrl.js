'use strict';

angular.module('jlogApp.controllers')
  .controller('listViewCtrl', [
    '$scope',
    // '$state',
    '$stateParams',
    // '$window',
    // 'battles',
    function($scope,
             $stateParams
             // $state,
             // $window,
             // battles
            ) {
      // $scope.bottom_bar.show = true;

      // if(undefined === $stateParams.index) {
      //   // $scope.battle_index = 1;
      //   // $scope.battle = battles.list[1];
      //   $state.go('battle');
      // }

      $scope.battle = $scope.battles.display_list[$stateParams.index];
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
        $scope.battles.display_list = battles.drop($scope.battles.display_list,
                                                   parseFloat($stateParams.index));
        $scope.doClose();
      };
      $scope.doClose = function() {
        $scope.stateGo('battle');
      };
    }]);
