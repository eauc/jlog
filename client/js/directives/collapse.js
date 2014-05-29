'use strict';

angular.module('jlogApp.directives')
  .directive('collapse', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.collapse, function(value) {
          if (value) {
            element.addClass('collapse');
          }
          else {
            element.removeClass('collapse');
          }
        });
      }
    };
  });
