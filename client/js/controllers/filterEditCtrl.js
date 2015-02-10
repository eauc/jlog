'use strict';

angular.module('jlogApp.controllers')
  .controller('filterEditCtrl', [
    '$scope',
    function($scope) {
      console.log('init filterEditCtrl');
    }
  ])
  .controller('filterEditBottomCtrl', [
    '$scope',
    '$window',
    'filter',
    function($scope,
             $window,
             filter) {
      console.log('init filterEditBottomCtrl');

      $scope.doBack = function() {
        $scope.battles.filter.cache = filter.clearCache($scope.battles.filter.cache);
        $scope.battles.filter.active = true;
        $scope.updateBattles();
        $window.history.back();
      };
    }
  ]);
