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
        'stats',
        'battle_list_display',
        function($scope,
                 factions,
                 opponents,
                 events,
                 scenarios,
                 scores,
                 battles,
                 battle_sort,
                 filter,
                 stats,
                 battle_list_display
                ) {

            console.log('init mainCtrl');

            $scope.collapse_navbar = true;
            $scope.factions = factions;
            $scope.scores = scores;
            $scope.filter_active = false;
            $scope.filter_invert = false;
            $scope.filter = filter.create();
            $scope.stats = stats;
            $scope.list_display = battle_list_display;
            $scope.sort = battle_sort();

            var buildIndex = function buildIndex(array) {
                var i = 0;
                for(i = 0 ; i < array.length ; i++) {
                    array[i].index = i;
                }
            }
            $scope.rebuildBattlesIndex = function rebuildBattlesIndex() { 
                buildIndex($scope.battles);
                $scope.list_display.reset($scope.battles,
                                          $scope.filter,
                                          $scope.filter_active,
                                          $scope.filter_invert,
                                          $scope.sort);
                $scope.filter.clearCache();
                $scope.stats.reset();
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
                $scope.stats.filtered.reset();
            }, true);
            $scope.$watch('filter_invert', function() {
                $scope.stats.filtered.reset();
            });

            $scope.toggleFilter = function toggleFilter() {
                $scope.filter_active = !$scope.filter_active;
            };
            $scope.invertFilter = function invertFilter() {
                $scope.filter_invert = !$scope.filter_invert;
            };
        }]);
