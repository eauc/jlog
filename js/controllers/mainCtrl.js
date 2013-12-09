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
        'sort_types',
        function($scope, $state, factions, opponents, events, scenarios, scores, battles, sort_types) {

            var buildIndex = function buildIndex(array) {
                var i = 0;
                for(i = 0 ; i < array.length ; i++) {
                    array[i].index = i;
                }
            }
            console.log('init mainCtrl');
            $scope.factions = factions;
            $scope.opponents = opponents;
            $scope.events = events;
            $scope.scenarios = scenarios;
            $scope.scores = scores;
            $scope.battles = battles;
            buildIndex($scope.battles);
            $scope.sort_types = sort_types;

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
                buildIndex($scope.battles);
                $state.go('list');
            };
            $scope.saveBattle = function saveBattle() {
                if($scope.battles.length > $scope.battle_index) {

                    $scope.battles[$scope.battle_index] = $scope.battle;

                }
                else {

                    $scope.battles.push($scope.battle);

                }
                buildIndex($scope.battles);
                $state.go('list');
            };
            $scope.close = function close() {
                $state.go('list');
            };

            $scope.sort = {
                type: 'date',
                reverse: false,
                sortBy: function sortBy(type) {
                    if($scope.sort.type === type) {
                        $scope.sort.reverse = !$scope.sort.reverse;
                    }
                    else {
                        $scope.sort.type = type;
                        $scope.sort.reverse = false;
                    }
                }
            };
        }]);
