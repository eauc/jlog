'use strict';

angular.module('jlogApp.controllers')
    .controller('mainCtrl', [
        '$scope',
        'factions',
        'opponents',
        'events',
        'scenarios',
        'scores',
        'battles',
        'battle_sort',
        'filter',
        function($scope,
                 factions,
                 opponents,
                 events,
                 scenarios,
                 scores,
                 battles,
                 battle_sort,
                 filter
                ) {

            console.log('init mainCtrl');

            $scope.factions = factions;
            $scope.scores = scores;
            $scope.filter_active = false;
            $scope.filter = filter.create();
            $scope.sort = battle_sort();

            var buildIndex = function buildIndex(array) {
                var i = 0;
                for(i = 0 ; i < array.length ; i++) {
                    array[i].index = i;
                }
            }
            $scope.rebuildBattlesIndex = function rebuildBattlesIndex() {
                buildIndex($scope.battles);
                $scope.filter.clearCache();
            };
            $scope.newBattles = function newBattles(data) {
                $scope.battles = data;
                $scope.opponents = opponents($scope.battles);
                $scope.events = events($scope.battles);
                $scope.scenarios = scenarios($scope.battles);
                $scope.rebuildBattlesIndex();
            };
            $scope.newBattles(battles);

            $scope.$watch('filter', function() {
                $scope.filter.clearCache();
            }, true);

            $scope.toggleFilter = function toggleFilter() {
                $scope.filter_active = !$scope.filter_active;
            };

        }]);
