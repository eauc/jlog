'use strict';

angular.module('jlogApp.controllers')
  .controller('mainCtrl', [
    '$scope',
    '$state',
    '$q',
    '$window',
    'scores',
    'factions',
    'scenarios',
    'battles',
    'events',
    'opponents',
    'tags',
    'filter',
    function(
      $scope,
      $state,
      $q,
      $window,
      scores,
      factions,
      scenarios,
      battles,
      events,
      opponents,
      tags,
      filter) {
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
        },
        filter: {
          state: filter.init(),
          active: false,
          invert: false,
          cache: {}
        }
      };
      $scope.updateBattles = function() {
        filter.store($scope.battles.filter.state);
        var filtered_list = $scope.battles.filter.active ?
          _.filter($scope.battles.list,
                   _.partial(filter.match,
                             $scope.battles.filter.state,
                             _,
                             $scope.battles.filter.invert,
                             $scope.battles.filter.cache)) :
          $scope.battles.list;
        $scope.battles.display_list = battles.sort(filtered_list,
                                                   $scope.sort_types,
                                                   $scope.battles.sort.type,
                                                   $scope.battles.sort.reverse);
        $scope.battles.size = $scope.battles.display_list.length;
      };
      $scope.setBattles = function(bs) {
        $scope.battles.list = battles.buildIndex(bs);
        battles.store($scope.battles.list);
        $scope.battles.opponents = opponents.fromBattles($scope.battles.list);
        $scope.battles.events = events.fromBattles($scope.battles.list);
        $scope.battles.tags = tags.fromBattles($scope.battles.list);
        $scope.battles.scenarios = scenarios.fromBattles($scope.battles.list);
        $scope.updateBattles();
      };

      $q.when(scores.data()).then(function(_scores) {
        $scope.scores = _scores;
        return $q.when(factions.data());
      }).then(function(_factions) {
        $scope.factions = _factions;
        return $q.when(scenarios.data());
      }).then(function(_scenarios) {
        return $q.when(battles.sortTypes());
      }).then(function(_sorts) {
        $scope.sort_types = _sorts;
        return;
      }).then(function() {
        var bs = battles.init();
        $scope.setBattles(bs);
        // $scope.setBattles(battles.test(100,
        //                                $scope.factions,
        //                                $scope.scores,
        //                                scenarios.data()));
        console.log('scope', $scope);
      });

      $scope.doToggleFilterActive = function() {
        $scope.battles.filter.active = !$scope.battles.filter.active;
        console.log('setFilterActive = '+$scope.battles.filter.active);
        $scope.updateBattles();
      };
      $scope.doToggleFilterInvert = function() {
        $scope.battles.filter.invert = !$scope.battles.filter.invert;
        console.log('setFilterInvert = '+$scope.battles.filter.invert);
        $scope.updateBattles();
      };

      $scope.doReload = function() {
        $window.location.reload();
      };
    }
  ]);
