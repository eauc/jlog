'use strict';

angular.module('jlogApp.directives')
  .directive('onlineIndicator', function() {
    return {
      restrict: 'A',
      templateUrl: 'partials/directives/onlineIndicator.html',
      scope: true,
      controller: [
        '$scope',
        '$window',
        'appCache',
        function($scope,
                 $window,
                 appCache) {
          appCache.subscribe('statusChange', function(state) {
            $scope.appCache = state;
            $scope.$digest();
          });
          $scope.checkOnlineStatus = function() {
            appCache.update();
          };
        }
      ],
      link: function(scope, iElement, iAttrs) {
      }
    };
  });
