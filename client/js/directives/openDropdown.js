'use strict';

angular.module('jlogApp.directives')
  .directive('openDropdown', [
    '$document',
    function($document) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var target_id = attrs.openDropdown;
          var target = angular.element(document.getElementById(target_id));
          if(!_.exists(target)) {
            console.log('openDropdown : cannot find target', target_id);
            return;
          }
          element.on('click', function() {
            console.log('coucouc');
            target.toggleClass('open');
          });
        }
      };
    }
  ]);
