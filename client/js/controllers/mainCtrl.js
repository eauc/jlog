'use strict';

angular.module('jlogApp.controllers')
  .controller('mainCtrl', [
    '$scope',
    '$state',
    '$q',
    'scores',
    'factions',
    'scenarios',
    'battles',
    // '$timeout',
    // 'opponents',
    // 'events',
    // 'tags',
    // 'battles_display',
    // 'battle_sort',
    // 'filter',
    function(
      $scope,
      $state,
      $q,
      scores,
      factions,
      scenarios,
      battles
      // $timeout,
      // opponents,
      // events,
      // tags,
      // battles_display,
      // battle_sort,
      // filter
    ) {
      console.log('init mainCtrl');

      $scope.stateIs = _.bind($state.is, $state);
      $scope.stateGo = _.bind($state.go, $state);

      $scope.battles = {
        display_list: []
      };

      $q.when(scores.data()).then(function(_scores) {
        $scope.scores = _scores;
        return $q.when(factions.data());
      }).then(function(_factions) {
        $scope.factions = _factions;
        return $q.when(scenarios.data());
      }).then(function(_scenarios) {
        $scope.scenarios = _scenarios;
        return;
      }).then(function() {
        // $scope.battles.display_list = battles.test(200,
        //                                            $scope.factions,
        //                                            $scope.scores,
        //                                            $scope.scenarios);
        console.log('scope', $scope);
      });
      // battles_display.init();
      // opponents.init(battles_display.list);
      // events.init(battles_display.list);
      // scenarios.init(battles_display.list);
      // tags.init(battles_display.list);
      // filter.init();

      // $scope.battles = battles_display;
      // $scope.factions = factions;
      // $scope.scores = scores;
      // $scope.filter_state = {
      //   active: false,
      //   invert: false,
      //   previous: 'battle',
      // };
      // $scope.filter = filter.list;
      // $scope.sort = battle_sort;
      // $scope.opponents = opponents.list;
      // $scope.scenarios = scenarios.list;
      // $scope.events = events.list;
      // $scope.tags = tags.list;

      // $scope.$on('newBattles', function(event, data) {
      //   battles_display.create(data);
      //   opponents.create($scope.battles.list);
      //   events.create($scope.battles.list);
      //   scenarios.create($scope.battles.list);
      //   tags.create($scope.battles.list);

      //   $scope.opponents = opponents.list;
      //   $scope.scenarios = scenarios.list;
      //   $scope.events = events.list;
      //   $scope.tags = tags.list;
      // });

      // $scope.bottom_bar = {
      //   show: false
      // };
      // $scope.drop_down = {
      //   state: null,
      //   toggle: function(value, event) {
      //     this.state = this.state === value ? null : value;
      //     event.stopPropagation();
      //   },
      //   clear: function() {
      //     this.state = null;
      //   },
      //   active: function(value) {
      //     return this.state === value;
      //   }
      // };

      // function showMore() {
      //   $scope.battles.showMore();
      //   if($scope.battles.more) {
      //     $timeout(showMore, 100);
      //   }
      // }
      // $scope.resetListDisplay = function() {
      //   $scope.battles.reset($scope.filter_state.active,
      //                        $scope.filter_state.invert,
      //                        $scope.sort);
      //   $scope.$broadcast('battles_reset');
      //   $timeout(showMore, 100);
      // };
      // $scope.setFilterActive = function(bool) {
      //   var change = ($scope.filter_state.active != bool);
      //   console.log('setFilterActive('+bool+')->'+change);
      //   $scope.filter_state.active = bool;
      //   if(change) $scope.resetListDisplay();
      // };
      // $scope.setFilterInvert = function(bool) {
      //   var change = ($scope.filter_state.invert != bool);
      //   console.log('setFilterInvert('+bool+')->'+change);
      //   $scope.filter_state.invert = bool;
      //   if(change) $scope.resetListDisplay();
      // };
    }
  ]);
