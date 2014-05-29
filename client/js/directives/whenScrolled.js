angular.module('jlogApp.directives')
  .directive('whenScrolled', function() {
    return function(scope, elm, attr) {
      var raw = elm[0];

      var funCheckBounds = function(evt) {
        console.log('event fired: ' + evt.type);
        var rectObject = raw.getBoundingClientRect();
        if (rectObject.bottom === window.innerHeight) {
          scope.$apply(attr.whenScrolled);
        }

      };
      
      angular.element(window).bind('scroll load', funCheckBounds);
    };
  });
