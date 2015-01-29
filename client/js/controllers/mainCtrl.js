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
    'events',
    'opponents',
    'tags',
    // '$timeout',
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
      battles,
      events,
      opponents,
      tags
      // $timeout,
      // battles_display,
      // battle_sort,
      // filter
    ) {
      console.log('init mainCtrl');

      $scope.stateIs = _.bind($state.is, $state);
      $scope.stateGo = _.bind($state.go, $state);

      $scope.battles = {
        list: [],
        display_list: [],
        events: [],
        opponents: [],
        scenarios: [],
        tags: [],
        sort: {
          type: 'date',
          reverse: true
        }
      };
      $scope.updateBattles = function() {
        $scope.battles.display_list = battles.sort($scope.battles.list,
                                                   $scope.sort_types,
                                                   $scope.battles.sort.type,
                                                   $scope.battles.sort.reverse);
      };
      $scope.setBattles = function(bs) {
        $scope.battles.list = battles.buildIndex(bs);
        $scope.updateBattles();
      };

      $q.when(scores.data()).then(function(_scores) {
        $scope.scores = _scores;
        return $q.when(factions.data());
      }).then(function(_factions) {
        $scope.factions = _factions;
        return $q.when(scenarios.data());
      }).then(function(_scenarios) {
        $scope.battles.scenarios = _scenarios;
        return $q.when(battles.sortTypes());
      }).then(function(_sorts) {
        $scope.sort_types = _sorts;
        return;
      }).then(function() {
        // $scope.setBattles(battles.test(100,
        //                                $scope.factions,
        //                                $scope.scores,
        //                                $scope.battles.scenarios));
        $scope.battles.opponents = opponents.fromBattles($scope.battles.display_list);
        $scope.battles.events = events.fromBattles($scope.battles.display_list);
        $scope.battles.tags = tags.fromBattles($scope.battles.display_list);
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
