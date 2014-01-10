'use strict';

angular.module('jlogApp.controllers')
    .controller('listEditCtrl', [
        '$scope',
        '$state',
        'battle',
        function($scope,
                 $state,
                 battle) {
            console.log('init listEditCtrl ' + $scope.battle_index);
            console.log($scope.battle);

            $scope.saveBattle = function saveBattle() {
                if($scope.battles.length > $scope.battle_index) {

                    $scope.battles[$scope.battle_index] = $scope.battle;

                }
                else {

                    $scope.battles.push($scope.battle);

                }
                $scope.updateBattles();
                $scope.close();
            };

            $scope.battle = angular.copy($scope.battle);
        }]);
