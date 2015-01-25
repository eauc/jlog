'use strict';

angular.module('jlogApp.directives')
  .directive('pieChart', [
    '$timeout',
    '$document',
    function($timeout,
             $document) {
      var COLORS = [
        '#2f69bf',
        '#a2bf2f',
        '#bf5a2f',
        '#bfa22f',
        '#772fbf',
        '#bf2f2f',
        '#00327f',
        '#667f00',
      ];
      var SVG_NS = "http://www.w3.org/2000/svg";
      function createSvg(element, width, height) {
        var svg = $document.createElementNS(SVG_NS, "svg");
        // svg.style.backgroundColor = "#fee";
        svg.style.width = width+"px";
        svg.style.height = height+"px";
        svg.style.display = "inline-block";
        element.appendChild(svg);
        return svg;
      }
      function createLegend(element) {
        var legend = $document.createElement("div");
        // legend.style.backgroundColor = "#efe";
        // legend.style.maxHeight = attrs['height']+"px";
        legend.style.display = "inline-block";
        legend.style.verticalAlign = "top";
        legend.style.textAlign = "left";
        legend.style.paddingLeft = "10px";
        element.appendChild(legend);
        return legend;
      }
      function reset(svg, legend) {
        while(svg.firstChild) {
          svg.removeChild(svg.firstChild);
        }
        while(legend.firstChild) {
          legend.removeChild(legend.firstChild);
        }
      }
      function computeTotal(values) {
        return _.reduce(values, function(mem, val) {
          return mem + (_.isNumber(val) ? val : 0);
        }, 0);
      }
      function buildEntries(values, colors, legends) {
        var entries = [];
        var i = 0;
        _.each(values, function(val, key) {
          if(_.isNumber(val) && val > 0) {
            entries.push({
              value: val,
              color: _.isObject(colors) ? colors[key] : COLORS[i % COLORS.length],
              legend: _.isObject(legends) ? legends[key] : key
            });
            i++;
          }
        });
        return entries;
      }
      function createFullPie(svg, width, height, entry) {
        var circle = $document.createElementNS(SVG_NS,"circle");
        circle.setAttributeNS(null,"style",
                              "stroke: #fff; "+
                              "stroke-width:1.5; "+
                              "fill:"+entry.color+";");
        circle.setAttributeNS(null,"cx",width/2+"");
        circle.setAttributeNS(null,"cy",height/2+"");
        circle.setAttributeNS(null,"r",width/2+"");
        svg.appendChild(circle);
      }
      function createPiePortion(svg, width, height, total, state, entry) {
        var delta = entry.value * 2 * Math.PI / total;
        state.angle += delta;

        var new_x = width/2 + width/2 * Math.sin(state.angle);
        var new_y = height/2 - height/2 * Math.cos(state.angle);
        var big = (delta >= Math.PI) ? 1 : 0;

        var path = $document.createElementNS(SVG_NS,"path");
        path.setAttributeNS(null,"style",
                            "stroke: #fff; "+
                            "stroke-width:1.5; "+
                            "fill:"+entry.color+";");
        path.setAttributeNS(null,"d",
                            "M"+width/2+","+height/2+" "+
                            "L"+state.portion[0]+","+state.portion[1]+" "+
                            "A"+width/2+","+height/2+" 0 "+big+",1 "+new_x+","+new_y+" Z");
        svg.appendChild(path);

        state.portion = [new_x, new_y];
      }
      function createEntryLegend(legend, entry) {
        var div = $document.createElement("div");
        div.innerHTML = '<span style="background-color:'+entry.color+';'+
          'border-radius:1em;width:0.75em;height:0.75em;'+
          'display:inline-block;vertical-align:middle;">&nbsp;</span> '+
          entry.legend;
        legend.appendChild(div);
      }
      function createPie(scope, svg, legend, width, height) {
        var has_values = _.isObject(scope.values);
        if(!has_values) return;

        var colors = null;
        if(_.isObject(scope.options) &&
           _.isFunction(scope.options.colors)) {
          colors = scope.options.colors(scope.values);
        }
        var legends = null;
        if(_.isObject(scope.options) &&
           _.isFunction(scope.options.legends)) {
          legends = scope.options.legends(scope.values);
        }

        var total = computeTotal(scope.values);
        var entries = buildEntries(scope.values, colors, legends);

        if(entries.length == 1) {
          createFullPie(svg, width, height, entries[0]);
          return;
        }

        var state = {
          angle: 0,
          portion: [width/2, 0]
        };
        _.each(entries, function(entry) {
          createPiePortion(svg, width, height, total, state, entry);
          createEntryLegend(legend, entry);
        });
        // var circle = $document.createElementNS(SVG_NS,"circle");
        // circle.setAttributeNS(null,"style",
        //                       "stroke: #fff; "+
        //                       "stroke-width:1.5; "+
        //                       "fill:#fff;");
        // circle.setAttributeNS(null,"cx",width/2+"");
        // circle.setAttributeNS(null,"cy",height/2+"");
        // circle.setAttributeNS(null,"r",width/3+"");
        // svg.appendChild(circle);
      }
      return {
        restrict: 'A',
        scope: {
          values: '=',
          options: '='
        },
        link: function(scope, element, attrs) {
          var width = attrs['width']>>0;
          var height = attrs['height']>>0;

          var svg = createSvg(element[0], width, height);
          var legend = createLegend(element[0]);

          createPie(scope, svg, legend, width, height);

          scope.$watch('values', function() {
            reset(svg, legend);
            createPie(scope, svg, legend, width, height);
          });
        }
      };
    }
  ]);
