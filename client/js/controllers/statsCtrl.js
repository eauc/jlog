'use strict';

angular.module('jlogApp.controllers')
    .controller('statsCtrl', [
        '$scope',
        'stats',
        function($scope, 
                 stats) {
            console.log('init statsCtrl');

            $scope.stats.refresh($scope.battles, $scope.filter);

            $scope.$watch('stats.show', function() {
                $scope.stats.refresh($scope.battles,
                                     $scope.filter,
                                     $scope.filter_active,
                                     $scope.filter_invert);
            }, true);
            $scope.$watch('stats.percent', function() {
                $scope.stats.refresh($scope.battles,
                                     $scope.filter,
                                     $scope.filter_active,
                                     $scope.filter_invert);
            });
            $scope.$watch('filter_active', function() {
                $scope.stats.refresh($scope.battles,
                                     $scope.filter,
                                     $scope.filter_active,
                                     $scope.filter_invert);
            });
            $scope.$watch('filter_invert', function() {
                $scope.stats.refresh($scope.battles,
                                     $scope.filter,
                                     $scope.filter_active,
                                     $scope.filter_invert);
            });
        }]);