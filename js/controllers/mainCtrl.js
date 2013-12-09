'use strict';

angular.module('grudgeApp.controllers')
    .controller('mainCtrl', [
        '$scope',
        '$state',
        'factions',
        'opponents',
        'events',
        'scenarios',
        'scores',
        'battles',
        function($scope, $state, factions, opponents, events, scenarios, scores, battles) {

            console.log('init mainCtrl');
            $scope.factions = factions;
            $scope.opponents = opponents;
            $scope.events = events;
            $scope.scenarios = scenarios;
            $scope.scores = scores;
            $scope.battles = battles;

            $scope.addBattle = function addBattle() {
                $scope.battle_index = $scope.battles.length;
                $scope.battle = {};
                $state.go('edit');
            };
            $scope.viewBattle = function viewBattle(index) {
                console.log('view battle ' + index);
                $scope.battle_index = index;
                $scope.battle = $scope.battles[index];
                $state.go('view');
            };
            $scope.editBattle = function editBattle() {
                $scope.battle = angular.copy($scope.battle);
                $state.go('edit');
            };
            $scope.deleteBattle = function deleteBattle() {
                $scope.battles.splice($scope.battle_index, 1);
                $state.go('list');
            };
            $scope.saveBattle = function saveBattle() {
                if($scope.battles.length > $scope.battle_index) {

                    $scope.battles[$scope.battle_index] = $scope.battle;

                }
                else {

                    $scope.battles.push($scope.battle);

                }
                $state.go('list');
            };
            $scope.close = function close() {
                $state.go('list');
            };

        }]);
