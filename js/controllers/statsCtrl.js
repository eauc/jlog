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

            var old_toggleFilter = $scope.toggleFilter;
            $scope.toggleFilter = function statsToggleFilter() {
                old_toggleFilter();
                $scope.stats.refresh($scope.battles, $scope.filter);
            }

        }]);
