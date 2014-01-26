'use strict';

angular.module('jlogApp.controllers')
    .controller('listCtrl', [
        '$scope',
        '$state',
        'battle',
        'selection',
        function($scope,
                 $state,
                 battle,
                 selection) {
            console.log('init listCtrl');

            $scope.show_list = true;
            $scope.selection = selection;

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

            $scope.selectionRemove = function() {
                if($scope.selection.remove($scope.battles)) {
                    $scope.updateBattles();
                }
            };
            $scope.selectionSet = function(type) {
                if($scope.selection.set(type, $scope.battles)) {
                    $scope.updateBattles();
                }
            };
            $scope.selectionUnset = function(type) {
                if($scope.selection.unset(type, $scope.battles)) {
                    $scope.updateBattles();
                }
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

            $scope.$watch('list_display.sorted_battles|filter:{selected:true}', function(nv) {
                selection.update(nv);
            }, true);

            $scope.selection.reset($scope.battles);
        }]);
