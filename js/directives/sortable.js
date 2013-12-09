'use strict';

angular.module('grudgeApp.directives')
    .directive('sortable', function() {
        return {
            restrict: 'A',
            transclude: true,
            scope: {
                type: '@sortable',
                sort: '='
            },
            template: '\
<span class="clickable" ng-click="sort.sortBy(type)">\
  <span ng-transclude></span>\
  <span class="hidden-xs-inline" ng-show="sort.type === type">\
    <span ng-hide="sort.reverse"\
          class="glyphicon glyphicon-collapse-down"></span>\
    <span ng-show="sort.reverse"\
          class="glyphicon glyphicon-collapse-up"></span>\
  </span>\
</span>\
',
            controller: ['$scope', function($scope) {
            }],
            link: function(scope, iElement, iAttrs) {
            }
        }
    });
