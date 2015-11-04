'use strict';

angular.module('jlogApp.directives')
  .directive('topMenu', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          console.log('top menu');
          var body = document.querySelector('body');
          var button = element[0].querySelector('button');
          var mask = element[0].querySelector('.top-menu-mask');
          button.addEventListener('click', function() {
            body.classList.add('top-menu-opened');
          });
          mask.addEventListener('click', function() {
            body.classList.remove('top-menu-opened');
          });
        }
      };
    }
  ]);
