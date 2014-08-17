'use strict';

angular.module('jlogApp.controllers')
  .controller('statsCtrl', [
    '$scope',
    '$state',
    'stats',
    function($scope, 
             $state,
             stats) {
      console.log('init statsCtrl');

      $scope.bottom_bar.show = true;
      $scope.filter_state.previous = 'stats';

      $scope.resetListDisplay();

      $state.current.data.state = {
        entry: 'result',
        selector: 'my_caster',
        setEntry: function(id) {
          this.entry = id;
          this.doGenerate();
        },
        setSelector: function(id) {
          if(this.selector != id) {
            show = null;
          }
          this.selector = id;
          this.doGenerate();
        },
        doGenerate: function() {
          stats.generate(this.entry, this.selector);
        }
      };

      $scope.stats = stats;
      $scope.stats.collections = {};

      $scope.state = $state.current.data.state;
      $scope.state.doGenerate();

      $scope.$on('battles_reset', function() {
        stats.collections = {};
        $scope.state.doGenerate();
      });

      var show = null;
      $scope.doShow = function(id) {
        console.log('show '+id);
        show = id;
      };
      $scope.show = function(id) {
        return show == id;
      };
    }])
  .controller('statsBottomCtrl', [
    '$scope',
    '$state',
    'stats',
    function($scope,
             $state,
             stats) {
      $scope.stats = stats;
      $scope.state = $state.current.data.state;
    }
  ]);
