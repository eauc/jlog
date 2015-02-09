'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.directives');
  });

  describe('pieChartCtrl', function(c) {

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        this.scope = $rootScope.$new();
        spyOn(this.scope, '$watch');
        this.scope.width = 200;
        this.scope.height = 200;

        $controller('pieChartCtrl', { 
          '$scope': this.scope,
        });
        $rootScope.$digest();

        var watcher = findCallByArgs(this.scope.$watch, function(args) {
          return args[0] === 'values';
        }).args[1];
        watcher({
          legends: ['legend1','legend2','legend3'],
          colors: ['color1','color2','color3'],
          values: [1,2,3]
        });
      }
    ]));

    it('should calculate total, center and radius', function() {
      expect(this.scope.total).toEqual(6);
      expect(this.scope.center).toEqual({ x : 100, y : 100 });
      expect(this.scope.radius).toEqual(95);
    });

    it('should build legends', function() {
      expect(this.scope.legends).toEqual([
        { label : 'legend1', count : '#1', color : 'color1' },
        { label : 'legend2', count : '#2', color : 'color2' },
        { label : 'legend3', count : '#3', color : 'color3' }
      ]);
    });

    it('should build paths', function() {
      expect(this.scope.paths).toEqual([
        { large : 0,
          start : { x : 100, y : 5 },
          end : { x : 182.27241335952166, y : 52.49999999999999 },
          color : 'color1' },
        { large : 0,
          start : { x : 182.27241335952166, y : 52.49999999999999 },
          end : { x : 100.00000000000001, y : 195 },
          color : 'color2' },
        { large : 0,
          start : { x : 100.00000000000001, y : 195 },
          end : { x : 99.99999999999997, y : 5 },
          color : 'color3' }
      ]);
    });
  });

});
