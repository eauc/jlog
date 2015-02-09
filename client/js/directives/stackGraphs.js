'use strict';

angular.module('jlogApp.directives')
  .controller('stackGraphsCtrl', [
    '$scope',
    function($scope) {
      $scope.$watch('values', function(values) {
        if(!_.exists(values)) return;
        // console.log('sg values', values);
        var dx = $scope.width / (values.values.length-1);
        $scope.legends = _.chain(values.legends)
          .map(function(l,i) {
            return {
              label: l,
              color: values.colors[i]
            };
          })
          .value();
        $scope.polygons = _.chain(values.values)
          .map(function(s) {
            return _.reductions(s, function(mem, v) { return mem+v; }, 0);
          })
        // .spy('reduction')
          .apply(function(coll) {
            var N = coll[0].length;
            return _.chain(N)
              .range()
            // .spy('range')
              .map(function(i) {
                return _.map(coll, function(v) {
                  return [_.nth(v, i),_.last(v)];
                });
              })
            // .spy('pairs')
              .map(function(ps) {
                return _.map(ps, function(p,i) {
                  return [i*dx,$scope.height*(1-p[0]/p[1])];
                });
              })
            // .spy('points')
              .map(function(pts,i) {
                return {
                  color: values.colors[i],
                  points: '0,'+$scope.height+' '+pts.join(' ')+' '+$scope.width+','+$scope.height
                };
              })
              .value();
          })
        // .spy('paths')
          .reverse()
          .value();
        // console.log('sg scope', $scope);
      });
    }
  ])
  .directive('stackGraphs', [
    function() {
      return {
        restrict: 'E',
        templateUrl: 'partials/directives/stackGraphs.html',
        scope: {
          values: '=gphValues',
        },
        controller: 'stackGraphsCtrl',
        link: function(scope, element, attrs) {
          scope.width = element[0].querySelector('.gph-container').offsetWidth >> 0;
          scope.height = scope.width/2;
          // console.log(element);
        }
      };
    }
  ]);
