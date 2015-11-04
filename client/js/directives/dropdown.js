'use strict';

angular.module('jlogApp.directives')
  .directive('openDropdown', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          console.log('open-dropdown');
          var parent = element[0].parentElement;
          var mask = parent.querySelector('.drop-mask');
          element[0].addEventListener('click', function() {
            parent.classList.toggle('open');
          });
          mask.addEventListener('click', function() {
            parent.classList.remove('open');
          });
        }
      };
    }
  ]);
