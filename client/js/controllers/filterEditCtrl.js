'use strict';

angular.module('jlogApp.controllers')
  .controller('filterEditCtrl', [
    '$scope',
    'filter',
    function($scope,
             filter) {
      console.log('init filterEditCtrl');

      $scope.bottom_bar.show = true;

      $scope.$watch('filter', function() {
        filter.clearCache();
        filter.update();
      }, true);
    }
  ])
  .controller('filterEditBottomCtrl', [
    '$scope',
    '$state',
    function($scope,
             $state,
             filter) {
      console.log('init filterEditBottomCtrl');

      $scope.onBack = function() {
        $state.go($scope.filter_state.previous);
      };
    }
  ]);
