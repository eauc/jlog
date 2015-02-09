'use strict';

angular.module('jlogApp.controllers')
  .controller('statsCtrl', [
    '$scope',
    '$state',
    'stats',
    function($scope,
             $state,
             stats) {
      console.log('init statsCtrl', $scope);

      stats.init();

      $scope.stats = {};
      $state.current.data = {
        entry: 'result',
        selector: 'total',
        selector_arg: null,
        doGenerate: function() {
          $scope.stats = stats.generate($scope.stats,
                                        $scope.battles.display_list,
                                        this.entry, this.selector, this.selector_arg);
        }
      };

      $scope.state = $state.current.data;

      $scope.$watch('battles.display_list', function(l) {
        if(_.isEmpty(l)) return;
        $scope.state.doGenerate();
      });
    }
  ])
  .controller('statsBottomCtrl', [
    '$scope',
    '$state',
    'stats',
    function($scope,
             $state,
             stats) {
      $scope.SELECTORS = stats.SELECTORS;
      $scope.ENTRIES = stats.ENTRIES;

      $scope.state = $state.current.data;

      $scope.doSetEntry = function(id) {
        $scope.state.entry = id;
        $scope.state.doGenerate();
      };
      $scope.doSetSelector = function(id) {
        $scope.state.selector_arg = ($scope.state.selector === id) ?
          $scope.state.selector_arg : null;
        $scope.state.selector = id;
        $scope.state.doGenerate();
      };
    }
  ]);
