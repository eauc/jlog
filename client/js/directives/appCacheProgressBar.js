'use strict';

angular.module('jlogApp.directives')
  .directive('appCacheProgressBar', function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/directives/appCacheProgressBar.html',
      scope: true,
      controller: [
        '$scope',
        '$window',
        'prompt',
        'appCache',
        function($scope,
                 $window,
                 prompt,
                 appCache) {
          appCache.subscribe('statusChange', function(state) {
            $scope.appCache = state;
            if(state.status === 'ready') {
              prompt.prompt('confirm', [
                'A new version of this site is available. Load it?',
                '(You might want to save your battles first, if so click Cancel)'
              ]).then(function() {
                $window.location.reload();
              });
            }
            $scope.$digest();
          });
        }
      ],
      link: function(scope, iElement, iAttrs) {
      }
    };
  });
