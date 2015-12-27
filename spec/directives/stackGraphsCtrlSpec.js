'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.directives');
  });

  describe('stackGraphsCtrl', function() {

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        this.scope = $rootScope.$new();
        spyOn(this.scope, '$watch');
        this.scope.width = 200;
        this.scope.height = 200;

        $controller('stackGraphsCtrl', { 
          '$scope': this.scope,
        });
        $rootScope.$digest();

        var watcher = findCallByArgs(this.scope.$watch, function(args) {
          return args[0] === 'values';
        }).args[1];
        watcher({
          legends: ['legend1','legend2','legend3'],
          colors: ['color1','color2','color3'],
          values: [
            [1,2,3],
            [4,5,6],
            [7,8,9],
          ]
        });
      }
    ]));

    it('should build legends', function() {
      expect(this.scope.legends).toEqual([
        { label : 'legend1', color : 'color1' },
        { label : 'legend2', color : 'color2' },
        { label : 'legend3', color : 'color3' }
      ]);
    });

    it('should build polygons', function() {
      expect(this.scope.polygons).toEqual([
        { color : 'color3', points : '0,200 0,0 100,0 200,0 200,200' },
        { color : 'color2', points : '0,200 0,100 100,80 200,75 200,200' },
        { color : 'color1', points : '0,200 0,166.66666666666669 100,146.66666666666669 200,141.66666666666666 200,200' }
      ]);
    });
  });

});
