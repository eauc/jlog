'use strict';

angular.module('jlogApp.controllers')
  .controller('listEditCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$window',
    'battle',
    'events',
    'opponents',
    'scenarios',
    'tags',
    function($scope,
             $state,
             $stateParams,
             $window,
             battle,
             events,
             opponents,
             scenarios,
             tags) {
      var index = parseFloat($stateParams.index);
      if(index < $scope.battles.list.length) {
        $scope.battle = _.snapshot($scope.battles.list[index]);
      }
      else {
        $scope.battle = battle.create({ index: index });
      }
      $state.current.data.index = index;
      $state.current.data.battle = $scope.battle;
      // $scope.$watch('battles.sorted_list', function(val) {
      //   if(val.length > 0) {
      //     $scope.battle = battle.test(index,
      //                                 $scope.factions,
      //                                 $scope.scores,
      //                                 $scope.battles.scenarios);
      //     $state.current.data.battle = $scope.battle;
      //     console.log('init listEditCtrl test', index, $scope.battle);
      //   }
      // });
      console.log('init listEditCtrl', index, $scope.battle);

      $state.current.data.save_enable = false;
      $scope.$watch('battle_edit.$valid', function(value) {
        $state.current.data.save_enable = value;
      });

      var services = {
        opponent: opponents,
        event: events,
        scenario: scenarios,
      };
      var keys = {
        opponent: ['opponent','name'],
        event: ['setup','event'],
        scenario: ['setup','scenario'],
      };
      $scope.doAdd = function(type) {
        var name = $window.prompt('Enter new '+type+' name :');
        if(!_.exists(name)) return;
        name = s(name).clean().toLowerCase().value();
        if(s.isBlank(name)) return;
        $scope.battles[type+'s'] = services[type].add($scope.battles[type+'s'], name);
        $scope.battle = _.setPath($scope.battle, name, keys[type], {});
        $state.current.data.battle = $scope.battle;
      };
      $scope.doDelete = function(type) {
        var name = _.getPath($scope.battle, keys[type]);
        if(!_.exists(name)) return;

        var confirm = $window.confirm('All references to '+
                                      name+
                                      ' will be deleted.');
        if(!confirm) return;

        // $scope.setBattles(battles['drop'+s.capitalize(type)]($scope.battles.list,
        //                                                      name));
        $scope.battles[type+'s'] = services[type].drop($scope.battles[type+'s'],
                                                       name);
        $scope.battle = _.setPath($scope.battle, null, keys[type], {});
        $state.current.data.battle = $scope.battle;
      };

      $scope.doAddTag = function() {
        var name = $window.prompt('Enter new tag name :');
        if(!_.exists(name)) return;
        name = s(name).clean().toLowerCase().value();
        if(s.isBlank(name)) return;
        $scope.battles.tags = tags.add($scope.battles.tags, name);
        $scope.battle = battle.addTag($scope.battle, name);
        $state.current.data.battle = $scope.battle;
      };
      $scope.doDeleteTag = function() {
        var ts = $scope.battle.tags;
        if(_.isEmpty(ts)) return;

        var confirm = $window.confirm('All references to '+
                                      ts.join(',')+
                                      ' will be deleted.');
        if(!confirm) return;

        // $scope.setBattles(battles.dropTags($scope.battles.list,
        //                                    tags));
        $scope.battles.tags = tags.drop($scope.battles.tags,
                                        ts);
        $scope.battle.tags = [];
      };
    }
  ])
  .controller('listEditBottomCtrl', [
    '$scope',
    '$state',
    'battles',
    'filter',
    function($scope,
             $state,
             battles,
             filter) {
      console.log('init listEditBottomCtrl');

      $scope.state = $state.current.data;
      $scope.doSave = function() {
        $scope.battles.filter.cache = filter.clearCache($scope.battles.filter.cache,
                                                        $state.current.data.index);
        $scope.setBattles(battles.save($scope.battles.list,
                                       $state.current.data.index,
                                       $state.current.data.battle));
        $scope.doClose();
      };
      $scope.doClose = function() {
        $scope.stateGo('battle');
      };

    }
  ]);
