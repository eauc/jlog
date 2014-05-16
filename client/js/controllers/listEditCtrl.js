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
        'tags',
        function($scope,
                 $state,
                 $window,
                 battle,
                 opponents,
                 events,
                 scenarios,
                 tags) {
            console.log('init listEditCtrl ' + $scope.battle_index);
            console.log($scope.battle);
                
            if (undefined === $scope.battle) {
                $state.go('battle.list');
            }

            $scope.saveBattle = function saveBattle() {
                if ($scope.battles.length > $scope.battle_index) {

                    $scope.battles[$scope.battle_index] = $scope.battle;

                }
                else {

                    $scope.battles.push($scope.battle);

                }
                $scope.updateBattles();
                $scope.close();
            };

            $scope.addOpponent = function() {
                var name = $window.prompt('Enter new opponent name :');
                name = (name !== null) ? name.trim().toLowerCase() : '';
                if (0 < name.length) {
                    $scope.opponents.push(name);
                    $scope.opponents.sort();
                    opponents.store($scope.opponents);
                    $scope.battle.opponent.name = name;
                }
            };
            $scope.addEvent = function() {
                var name = $window.prompt('Enter new event name :');
                name = (name !== null) ? name.trim() : '';
                if (0 < name.length) {
                    $scope.events.push(name);
                    $scope.events.sort();
                    events.store($scope.events);
                    $scope.battle.setup.event = name;
                }
            };
            $scope.addScenario = function() {
                var name = $window.prompt('Enter new scenario name :');
                name = (name !== null) ? name.trim() : '';
                var key = name.toLowerCase();
                if (0 < name.length) {
                    $scope.scenarios[key] = { name: name };
                    scenarios.store($scope.scenarios);
                    $scope.battle.setup.scenario = key;
                }
            };
            $scope.addTag = function() {
                var name = $window.prompt('Enter new tag name :');
                name = (name !== null) ? name.trim() : '';
                if (0 < name.length) {
                    $scope.tags.push(name);
                    $scope.tags.sort();
                    tags.store($scope.tags);
                    $scope.battle.tags = angular.isArray($scope.battle.tags) ? 
                        $scope.battle.tags : [];
                    $scope.battle.tags.push(name);
                    $scope.battle.tags.sort();
                }
            };

            var remove_from_array = function(name, key, service) {
                var pos = $scope[key].indexOf(name);
                if (0 > pos) return;

                $scope[key].splice(pos, 1);
                service.store($scope[key]);
            };
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
                        if (!$scope.scenarios.hasOwnProperty(name)) return;
                        
                        delete $scope.scenarios[name];
                        scenarios.store($scope.scenarios);
                    }
                }
            };
            $scope.del = function(type) {
                if (!del_key.hasOwnProperty(type)) return;
                var get = del_key[type].get;
                var set = del_key[type].set;

                var name = get($scope.battle);
                name = (name !== null) ? name : '';
                if (0 >= name.length) return;

                var confirm = $window.confirm('Forget everything about "' + name + '" ?');
                if (!confirm) return;

                set($scope.battle, null);
                var i;
                for (i = 0 ; i < $scope.battles.length ; i++) {
                    if (name === get($scope.battles[i])) {
                        set($scope.battles[i], null);
                    }
                }
                $scope.updateBattles();

                del_key[type].remove_from_list(name);
            };
            $scope.delTag = function() {
                var tags = $scope.battle.tags;
                if (!angular.isArray(tags) ||
                   tags.length <= 0) return;

                var confirm_msg = 'Forget everything about these tags ?\r\n';
                var i;
                for (i = 0 ; i < tags.length ; i++) {
                    confirm_msg += '\t' + tags[i] + '\r\n';
                }
                var confirm = $window.confirm(confirm_msg);
                if (!confirm) return;

                $scope.battle.tags = [];
                var index;
                var t, b, tag, battle;
                for (t = 0 ; t < tags.length ; t++) {
                    tag = tags[t];
                    for (b = 0 ; b < $scope.battles.length ; b++) {
                        battle = $scope.battles[b];
                        if (angular.isArray(battle.tags)) {
                            while (0 <= (index = battle.tags.indexOf(tag))) {
                                battle.tags.splice(index, 1);
                            }
                        }
                    }
                }
                $scope.updateBattles();

                for (i = 0 ; i < tags.length ; i++) {
                    while (0 <= (index = $scope.tags.indexOf(tags[i]))) {
                        $scope.tags.splice(index, 1);
                    }
                }
            };
            $scope.battle = angular.copy($scope.battle);
        }]);
