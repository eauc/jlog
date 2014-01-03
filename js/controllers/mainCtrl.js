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
        'sort_types',
        'filter',
        function($scope,
                 factions,
                 opponents,
                 events,
                 scenarios,
                 scores,
                 battles,
                 sort_types,
                 filter) {

            console.log('init mainCtrl');

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
                buildIndex($scope.battles);
                $scope.opponents = opponents($scope.battles);
                $scope.events = events($scope.battles);
                $scope.scenarios = scenarios($scope.battles);
            };
            $scope.newBattles(battles);
            $scope.factions = factions;
            $scope.scores = scores;
            $scope.sort_types = sort_types;
            $scope.filter_active = false;
            $scope.filter = filter.create();
            $scope.$watch('filter', function() {
                $scope.filter.clearCache();
            }, true);

            $scope.toggleFilter = function toggleFilter() {
                $scope.filter_active = !$scope.filter_active;
            }
        }]);
