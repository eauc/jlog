'use strict';

angular.module('jlogApp.controllers')
  .controller('mainCtrl', [
    '$scope',
    '$state',
    '$q',
    'scores',
    'factions',
    'scenarios',
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
      scenarios
      // $timeout,
      // opponents,
      // events,
      // tags,
      // battles_display,
      // battle_sort,
      // filter
    ) {
      console.log('init mainCtrl');

      $scope.stateIs = $state.is;

      $scope.battles = {
        display_list: []
      };

      $q.all($q.when(scores.data()).then(function(_scores) {
        $scope.scores = _scores;
      }), $q.when(factions.data()).then(function(_factions) {
        $scope.factions = _factions;
      }), $q.when(scenarios.data()).then(function(_scenarios) {
        $scope.scenarios = _scenarios;
      })).then(function(_scores) {
        $scope.battles.display_list = _.range(200).map(function(i) {
          return {
            index: i,
            date: { year: 2015, month: 1, day: 27 },
            my_army: { faction: 'cygnar', caster: 'nemo1' },
            opponent: { name: 'kevin', faction: 'cryx', caster: 'gaspy1' },
            setup: { size: 50, scenario: 'sr15inco', event: 'amical' },
            score: 'va'
          };
        });
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
