'use strict';

angular.module('jlogApp.controllers')
    .controller('listViewCtrl', [
        '$scope',
        '$state',
        function($scope,
                 $state) {
            console.log('init listViewCtrl ' + $scope.battle_index);
            console.log($scope.battle);

            $scope.editBattle = function editBattle() {
                $state.go('list.edit');
            };
            $scope.deleteBattle = function deleteBattle() {
                $scope.battles.splice($scope.battle_index, 1);
                $scope.updateBattles();
                $scope.close();
            };
        }]);
