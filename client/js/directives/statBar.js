'use strict';

angular.module('jlogApp.directives')
    .directive('statBar', function() {
        return {
            restrict: 'A',
            scope: {
                statBar: '=',
                type: '@',
                percent: '='
            },
            template: '\
<div class="bar bar-win" \
     style="width:{{percent.win[type]}}%;"> \
  {{statBar.win[type] ? statBar.win[type] : ""}} \
</div><div class="bar bar-draw" \
           style="width:{{percent.draw[type]}}%;"> \
  {{statBar.draw[type] ? statBar.draw[type] : ""}} \
</div><div class="bar bar-loss" \
           style="width:{{percent.loss[type]}}%;"> \
  {{statBar.loss[type] ? statBar.loss[type] : ""}} \
</div> \
'
        };
    });
