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
                $scope.rebuildBattlesIndex();
                $scope.close();
            };
            $scope.battleIsValid = function battleIsValid() {
                $scope.battle_is_valid = battle.isValid($scope.battle);
            };

            $scope.battle = angular.copy($scope.battle);
            $scope.battleIsValid();
        }]);
