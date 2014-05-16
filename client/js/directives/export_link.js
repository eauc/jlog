'use strict';

angular.module('jlogApp.directives')
  .directive('exportLink', function() {
    return {
      restrict: 'A',
      transclude: true,
      scope: {
        name: '@',
        type: '@',
        source: '='
      },
      template: '\
<a> \
</a> \
<a class="clickable" \
ng-click="exportSource()" \
ng-transclude> \
</a>',
      controller: ['$scope', '$window', function($scope, $window) {
        $scope.file_url = null;
        $scope.file_name = $scope.name + '.' + $scope.type;

        $scope.exportSource = function() {
          var data = $scope.source['export']($scope.type);

          console.log('generate ' + $scope.type + ' file');
          var old_url = $scope.file_url;
          $scope.file_url = null;
          if (old_url !== null) {
            $window.URL.revokeObjectURL(old_url);
          }
          var blob = new $window.Blob([data], {type: 'text/plain'});
          $window.URL = $window.URL || $window.webkitURL;
          var url = $window.URL.createObjectURL(blob);
          $scope.file_url = url;

          var today = new Date();
          $scope.file_name = $scope.name +
            '_' + today.getTime() +
            '.' + $scope.type;

          $scope.launchDownload();
        };

      }],
      link: function(scope, iElement, iAttrs) {
        var download_link = iElement.find('a')[0];
        scope.launchDownload = function() {
          download_link.href = scope.file_url;
          download_link.download = scope.file_name;
          download_link.click();
        };
      }
    };
  });
