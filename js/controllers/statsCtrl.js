'use strict';

angular.module('jlogApp.controllers')
    .controller('statsCtrl', [
        '$scope',
        'stats',
        function($scope, 
                 stats) {
            console.log('init statsCtrl');

            $scope.stats = stats;
            $scope.stats.refresh($scope.battles, $scope.filter);

            $scope.$watch('filter_active', function() {
                $scope.stats.refresh($scope.battles, $scope.filter, $scope.filter_active);
            });
        }]);
