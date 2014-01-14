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
            $scope.filter = filter.init();
            $scope.stats = stats;
            $scope.list_display = battle_list_display;
            $scope.sort = battle_sort();

            var onBattlesUpdate = function() {
                $scope.list_display.reset($scope.battles,
                                          $scope.filter,
                                          $scope.filter_active,
                                          $scope.filter_invert,
                                          $scope.sort);
                $scope.filter.clearCache();
                $scope.stats.reset();
            };
            $scope.updateBattles = function updateBattles() {
                battles.update($scope.battles);
                onBattlesUpdate();
            };
            $scope.newBattles = function newBattles(data) {
                $scope.battles = battles.create(data);
                $scope.opponents = opponents.create($scope.battles);
                $scope.events = events.create($scope.battles);
                $scope.scenarios = scenarios.create($scope.battles);
            };
            $scope.battles = battles.init();
            $scope.opponents = opponents.init($scope.battles);
            $scope.events = events.init($scope.battles);
            $scope.scenarios = scenarios.init($scope.battles);
            onBattlesUpdate();

            $scope.$watch('filter', function() {
                $scope.filter.clearCache();
                $scope.stats.filtered.reset();
                $scope.filter.update();
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
