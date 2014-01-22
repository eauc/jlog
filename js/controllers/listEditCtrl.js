'use strict';

angular.module('jlogApp.controllers')
    .controller('listEditCtrl', [
        '$scope',
        '$state',
        '$window',
        'battle',
        'opponents',
        'events',
        'scenarios',
        function($scope,
                 $state,
                 $window,
                 battle,
                 opponents,
                 events,
                 scenarios) {
            console.log('init listEditCtrl ' + $scope.battle_index);
            console.log($scope.battle);
                
            if(undefined === $scope.battle) {
                $state.go('battle.list');
            }

            $scope.saveBattle = function saveBattle() {
                if($scope.battles.length > $scope.battle_index) {

                    $scope.battles[$scope.battle_index] = $scope.battle;

                }
                else {

                    $scope.battles.push($scope.battle);

                }
                $scope.updateBattles();
                $scope.close();
            };

            $scope.addOpponent = function() {
                var name = $window.prompt("Enter new opponent name :");
                name = (name != null) ? name.trim().toLowerCase() : "";
                if(0 < name.length) {
                    $scope.opponents.push(name);
                    $scope.opponents.sort();
                    opponents.store($scope.opponents);
                    $scope.battle.opponent.name = name;
                }
            };
            $scope.addEvent = function() {
                var name = $window.prompt("Enter new event name :");
                name = (name != null) ? name.trim() : "";
                if(0 < name.length) {
                    $scope.events.push(name);
                    $scope.events.sort();
                    events.store($scope.events);
                    $scope.battle.setup.event = name;
                }
            };
            $scope.addScenario = function() {
                var name = $window.prompt("Enter new scenario name :");
                name = (name != null) ? name.trim() : "";
                var key = name.toLowerCase();
                if(0 < name.length) {
                    $scope.scenarios[key] = { name: name };
                    scenarios.store($scope.scenarios);
                    $scope.battle.setup.scenario = key;
                }
            };

            var remove_from_array = function(name, key, service) {
                var pos = $scope[key].indexOf(name);
                if(0 > pos) return;

                $scope[key].splice(pos, 1);
                service.store($scope[key]);
            }
            var del_key = {
                opp: {
                    get: function(battle) {
                        return battle.opponent.name;
                    },
                    set: function(battle, val) {
                        battle.opponent.name = val;
                    },
                    remove_from_list: function(name) {
                        remove_from_array(name, 'opponents', opponents);
                    }
                },
                event: {
                    list : 'event',
                    service : events,
                    get: function(battle) {
                        return battle.setup.event;
                    },
                    set: function(battle, val) {
                        battle.setup.event = val;
                    },
                    remove_from_list: function(name) {
                        remove_from_array(name, 'events', events);
                    }
                },
                scenario: {
                    get: function(battle) {
                        return battle.setup.scenario;
                    },
                    set: function(battle, val) {
                        battle.setup.scenario = val;
                    },
                    remove_from_list: function(name) {
                        if(!$scope.scenarios.hasOwnProperty(name)) return;
                        
                        delete $scope.scenarios[name];
                        scenarios.store($scope.scenarios);
                    }
                }
            };
            $scope.del = function(type) {
                if(!del_key.hasOwnProperty(type)) return;
                var get = del_key[type].get;
                var set = del_key[type].set;

                var name = get($scope.battle);
                name = (name != null) ? name : "";
                if(0 >= name.length) return;

                var confirm = $window.confirm('Forget everything about "' + name + '" ?');
                if(!confirm) return;

                set($scope.battle, null);
                var i;
                for(i = 0 ; i < $scope.battles.length ; i++) {
                    if(name === get($scope.battles[i])) {
                        set($scope.battles[i], null);
                    }
                }
                $scope.updateBattles();

                del_key[type].remove_from_list(name);
            };
            $scope.battle = angular.copy($scope.battle);
        }]);
