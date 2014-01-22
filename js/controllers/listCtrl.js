'use strict';

angular.module('jlogApp.controllers')
    .controller('listCtrl', [
        '$scope',
        '$state',
        'battle',
        function($scope,
                 $state,
                 battle) {
            console.log('init listCtrl');

            $scope.addBattle = function addBattle() {
                $scope.battle_index = $scope.battles.length;
                $scope.battle = battle.create();
                $state.go('battle.edit');
            };
            $scope.viewBattle = function viewBattle(index) {
                $scope.battle_index = index;
                $scope.battle = $scope.battles[index];
                $state.go('battle.view');
            };
            $scope.close = function close() {
                $scope.show_list = true;
                $state.go('battle.list');
            };

            $scope.$watch('filter_active', function() {
                $scope.list_display.reset($scope.battles,
                                          $scope.filter,
                                          $scope.filter_active,
                                          $scope.filter_invert,
                                          $scope.sort);
            });
            $scope.$watch('filter_invert', function() {
                $scope.list_display.reset($scope.battles,
                                          $scope.filter,
                                          $scope.filter_active,
                                          $scope.filter_invert,
                                          $scope.sort);
            });
            $scope.$watch('sort', function() {
                $scope.list_display.reset($scope.battles,
                                          $scope.filter,
                                          $scope.filter_active,
                                          $scope.filter_invert,
                                          $scope.sort);
            }, true);

            $scope.show_list = true;
        }]);
