'use strict';

angular.module('jlogApp.controllers')
  .controller('mainCtrl', [
    '$scope',
    '$timeout',
    'factions',
    'opponents',
    'events',
    'scenarios',
    'tags',
    'scores',
    'battles_display',
    'battle_sort',
    // 'filter',
    // 'stats',
    // 'battles_display',
    function(
      $scope,
      $timeout,
      factions,
      opponents,
      events,
      scenarios,
      tags,
      scores,
      battles_display,
      battle_sort
      // filter,
      // stats,
      // battles_display
    ) {

      console.log('init mainCtrl');

      $scope.bottom_bar = {};

      battles_display.init();
      opponents.init(battles_display.list);
      events.init(battles_display.list);
      scenarios.init(battles_display.list);
      tags.init(battles_display.list);

      $scope.battles = battles_display;
      $scope.factions = factions;
      $scope.scenarios = scenarios.list;
      $scope.scores = scores;
      // $scope.collapse_navbar = true;
      // $scope.factions = factions;
      // $scope.scores = scores;
      // $scope.filter_active = false;
      // $scope.filter_invert = false;
      // $scope.filter = filter.init();
      // $scope.stats = stats;
      // $scope.battles_display = battles_display;
      $scope.sort = battle_sort;

      // var onBattlesUpdate = function() {
      //     $scope.filter.clearCache();
      //     $scope.list_display.reset($scope.battles,
      //                               $scope.filter,
      //                               $scope.filter_active,
      //                               $scope.filter_invert,
      //                               $scope.sort);
      //     $scope.stats.reset();
      // };
      // $scope.updateBattles = function updateBattles() {
      //     battles.update($scope.battles);
      //     onBattlesUpdate();
      // };
      // $scope.newBattles = function newBattles(data) {
      //     $scope.battles = battles.create(data);
      //     $scope.opponents = opponents.create($scope.battles);
      //     $scope.events = events.create($scope.battles);
      //     $scope.scenarios = scenarios.create($scope.battles);
      // };
      // $scope.battles = battles.init();
      // $scope.opponents = opponents.init($scope.battles);
      // $scope.events = events.init($scope.battles);
      // $scope.scenarios = scenarios.init($scope.battles);
      // $scope.tags = tags.init($scope.battles);
      // onBattlesUpdate();

      // $scope.$watch('filter', function() {
      //     $scope.filter.clearCache();
      //     $scope.stats.filtered.reset();
      //     $scope.filter.update();
      // }, true);
      // $scope.$watch('filter_invert', function() {
      //     $scope.stats.filtered.reset();
      // });

      // $scope.toggleFilter = function toggleFilter() {
      //     $scope.filter_active = !$scope.filter_active;
      // };
      // $scope.invertFilter = function invertFilter() {
      //     $scope.filter_invert = !$scope.filter_invert;
      // };
      // $scope.screen = window.screen;
      // $timeout(function() {
      //   $('#battle-list-body').niceScroll();
      // }, 500);

      $scope.drop_down = {
        state: null,
        toggle: function(value, event) {
          this.state = this.state === value ? null : value;
          event.stopPropagation();
        },
        clear: function() {
          this.state = null;
        },
        active: function(value) {
          return this.state === value;
        }
      };
            
    }]);
