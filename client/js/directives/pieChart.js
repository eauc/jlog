'use strict';

angular.module('jlogApp.directives')
  .controller('pieChartCtrl', [
    '$scope',
    function($scope) {
      $scope.$watch('values', function(values) {
        $scope.center = { x: $scope.width/2, y: $scope.height/2 };
        $scope.radius = Math.min($scope.width, $scope.height) / 2 *  0.95;
        if(!_.exists(values)) return;
        // console.log('pieChart values', values);
        $scope.legends = _.chain(values.legends)
          .map(function(l, i) {
            return {
              label: l,
              count: '#'+values.values[i],
              color: values.colors[i]
            };
          })
          .filter(function(p,i) { return values.values[i] > 0; })
          .value();
        $scope.total = _.reduce(values.values, function(mem, v) {
          return mem+v;
        }, 0);
        var current = 0;
        // console.log('total', total);
        $scope.paths = _.chain(values.values)
          .map(function(v, i) {
            var angle_start = 2 * Math.PI * current / $scope.total;
            var angle_end = 2 * Math.PI * (current+v) / $scope.total;
            // saturate pie width to slightly less than 100% in case therw is only one value
            var angle_diff = Math.min(2 * Math.PI * 0.999, Math.abs(angle_end - angle_start));
            angle_end = angle_start + angle_diff;
            var large = angle_diff > Math.PI ? 1 : 0;
            // console.log('angles', angle_start, angle_end, large);
            current += v;
            return {
              large: large,
              start: { x: $scope.center.x + $scope.radius * Math.sin(angle_start),
                       y: $scope.center.y - $scope.radius * Math.cos(angle_start) },
              end: { x: $scope.center.x + $scope.radius * Math.sin(angle_end),
                     y: $scope.center.y - $scope.radius * Math.cos(angle_end) },
              color: values.colors[i]
            };
          })
          .filter(function(p,i) { return values.values[i] > 0; })
          .value();
        // console.log('pieChart scope', $scope);
      });
    }
  ])
  .directive('pieChart', [
    function() {
      return {
        restrict: 'E',
        templateUrl: 'partials/directives/pieChart.html',
        scope: {
          values: '=pieValues',
        },
        controller: 'pieChartCtrl',
        link: function(scope, element, attrs) {
          scope.width = element[0].querySelector('.pie-container').offsetWidth >> 0;
          scope.height = scope.width;
          // console.log(element);
        }
      };
    }
  ]);
