'use strict';

angular.module('jlogApp.controllers')
    .controller('listCtrl', [
        '$scope',
        '$state',
        'battle',
        function($scope,
                 $state,
                 battle) {
            console.log('init listCtrl');

            $scope.addBattle = function addBattle() {
                $scope.battle_index = $scope.battles.length;
                $scope.battle = battle.create();
                $scope.show_list = false;
                $state.go('list.edit');
            };
            $scope.viewBattle = function viewBattle(index) {
                $scope.battle_index = index;
                $scope.battle = $scope.battles[index];
                $scope.show_list = false;
                $state.go('list.view');
            };
            $scope.close = function close() {
                $scope.show_list = true;
                $state.go('list');
            };

            $scope.show_list = true;
        }]);
