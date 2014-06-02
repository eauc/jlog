'use strict';

angular.module('jlogApp.directives')
  .directive('sortBy', [
    'battle_sort',
    function(battle_sort) {
      return {
        restrict: 'A',
        transclude: true,
        scope: {
          type: '@sortBy',
        },
        template: '\
<span class="clickable" ng-click="sort.sortBy(type)">\
<span ng-transclude></span>\
<span class="sort-indicator" ng-show="sort.type === type">\
<span ng-hide="sort.reverse"\
class="glyphicon glyphicon-collapse-down"></span>\
<span ng-show="sort.reverse"\
class="glyphicon glyphicon-collapse-up"></span>\
</span>\
</span>',
      controller: ['$scope', function($scope) {
        $scope.sort = battle_sort;
      }],
      link: function(scope, iElement, iAttrs) {
      }
    };
  }]);
