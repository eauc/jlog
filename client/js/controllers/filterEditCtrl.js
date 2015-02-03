'use strict';

angular.module('jlogApp.controllers')
  .controller('filterEditCtrl', [
    '$scope',
    function($scope) {
      console.log('init filterEditCtrl');

      // $scope.bottom_bar.show = true;

      // $scope.$watch('filter', function() {
      //   filter.clearCache();
      //   filter.update();
      // }, true);
    }
  ])
  .controller('filterEditBottomCtrl', [
    '$scope',
    '$window',
    function($scope,
             $window) {
      console.log('init filterEditBottomCtrl');

      $scope.doBack = function() {
        $scope.updateBattles();
        $window.history.back();
      };
    }
  ]);
