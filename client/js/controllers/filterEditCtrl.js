'use strict';

angular.module('jlogApp.controllers')
  .controller('filterEditCtrl', [
    '$scope',
    'filter',
    function($scope,
             filter) {
      console.log('init filterEditCtrl');

      $scope.$watch('filter', function() {
        filter.clearCache();
        filter.update();
      }, true);
    }]);
