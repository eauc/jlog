'use strict';

angular.module('jlogApp.controllers')
  .controller('listEditCtrl', [
    '$scope',
    '$state',
    '$window',
    'battle',
    'battles',
    'opponents',
    'events',
    'scenarios',
    'tags',
    function($scope,
             $state,
             $window,
             battle,
             battles,
             opponents,
             events,
             scenarios,
             tags) {
      if(undefined === $scope.battle) {
        $scope.battle_index = $scope.battles.list.length;
        $scope.battle = battle();
      }
      else {
        $scope.battle = angular.copy($scope.battle);
      }
      console.log('init listEditCtrl ' + $scope.battle_index);
      console.log($scope.battle);

      $scope.bottom_bar.save_enable = false;
      $scope.$watch('battle_edit.$valid', function(value) {
        $scope.bottom_bar.save_enable = value;
      });

      $scope.bottom_bar.onSave = function onSave() {
        battles.save($scope.battle_index, $scope.battle);
        $scope.bottom_bar.onClose();
      };

      $scope.opponents = opponents.list;
      $scope.onAddOpponent = function() {
        var name = $window.prompt('Enter new opponent name :');
        name = (name !== null) ? name.trim().toLowerCase() : '';
        opponents.add(name);
        $scope.battle.opponent.name = name;
      };
      $scope.events = events.list;
      $scope.onAddEvent = function() {
        var name = $window.prompt('Enter new event name :');
        name = (name !== null) ? name.trim() : '';
        events.add(name);
        $scope.battle.setup.event = name;
      };
      $scope.onAddScenario = function() {
        var name = $window.prompt('Enter new scenario name :');
        name = (name !== null) ? name.trim() : '';
        var key = scenarios.add(name);
        $scope.battle.setup.scenario = key;
      };
      $scope.tags = tags.list;
      $scope.onAddTag = function() {
        var name = $window.prompt('Enter new tag name :');
        name = (name !== null) ? name.trim() : '';
        tags.add(name);
        $scope.battle.addTag(name);
      };

      var delete_key = {
        'opponent': {
          get: function() {
            return angular.isString(this.opponent.name) ? this.opponent.name : '';
          },
          clear: function() {
            this.opponent.name = null;
          },
          service: opponents
        },
        'event': {
          get: function() {
            return angular.isString(this.setup.event) ? this.setup.event : '';
          },
          clear: function() {
            this.setup.event = null;
          },
          service : events
        },
        'scenario': {
          get: function() {
            return angular.isString(this.setup.scenario) ? this.setup.scenario : '';
          },
          clear: function() {
            this.setup.scenario = null;
          },
          service: scenarios
        },
        'tags': {
          get: function() {
            return this.tags;
          },
          clear: function(tag) {
            var index;
            while(0 <= (index = this.tags.indexOf(tag))) {
              this.tags.splice(index, 1);
            }
          },
          service: tags
        }
      };
      $scope.onDelete = function onDelete(type) {
        if(!delete_key.hasOwnProperty(type)) return;
        var get = delete_key[type].get;
        var clear = delete_key[type].clear;

        var name = get.call($scope.battle);
        name = (name !== null) ? name : '';
        if(0 >= name.length) return;

        var confirm = $window.confirm('Forget everything about "' + name + '" ?');
        if(!confirm) return;

        clear.call($scope.battle);
        battles.clear(name, get, clear);
        delete_key[type].service.remove(name);
      };
      $scope.onDeleteTag = function onDeleteTag() {
        var tags_to_delete = $scope.battle.tags;
        if(tags_to_delete.length <= 0) return;

        var confirm_msg = 'Forget everything about these tags ?\r\n';
        var i;
        for(i = 0 ; i < tags_to_delete.length ; i++) {
          confirm_msg += '\t' + tags_to_delete[i] + '\r\n';
        }
        var confirm = $window.confirm(confirm_msg);
        if(!confirm) return;

        $scope.battle.tags = [];
        for(i = 0 ; i < tags_to_delete.length ; i++) {
          battles.clear(tags_to_delete[i],
                        delete_key.tags.get,
                        delete_key.tags.clear);
          tags.remove(tags_to_delete[i]);
        }
      };
    }]);
