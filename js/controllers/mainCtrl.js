'use strict';

angular.module('grudgeApp.controllers')
    .controller('mainCtrl', [
        '$scope',
        '$state',
        function($scope, $state) {

            console.log('init mainCtrl');
            $scope.factions = {
                'cryx': {
                    name: 'Cryx',
                    icon: 'cryx.png',
                    casters: {
                        gaspy1: {
                            name: 'Asphyxious 1'
                        },
                        gaspy2: {
                            name: 'Asphyxious 2'
                        },
                        gaspy3: {
                            name: 'Asphyxious 3'
                        },
                        denny1: {
                            name: 'Deneghra 1'
                        },
                        denny2: {
                            name: 'Deneghra 2'
                        },
                        gore1: {
                            name: 'Goreshade 1'
                        },
                        gore2: {
                            name: 'Goreshade 2'
                        },
                        morty1: {
                            name: 'Mortenebra'
                        },
                        scavy1: {
                            name: 'Scaverous'
                        },
                        skarre1: {
                            name: 'Skarre 1'
                        },
                        skarre2: {
                            name: 'Skarre 2'
                        },
                        termy1: {
                            name: 'Terminus'
                        },
                        veny1: {
                            name: 'Venethrax'
                        },
                        coven1: {
                            name: 'The Witch Coven of Garlghast'
                        }
                    }
                },
                'cygnar': {
                    name: 'Cygnar',
                    icon: 'cygnar.png'
                },
                'khador': {
                    name: 'Khador',
                    icon: 'khador.png'
                },
                'menoth': {
                    name: 'Protectorate of Menoth',
                    icon: 'menoth.png'
                },
                'scyrah': {
                    name: 'Retribution of Scyrah',
                    icon: 'scyrah.png'
                },
                'cyriss': {
                    name: 'Convergence of Cyriss',
                    icon: 'cyriss.png'
                },
                'mercs': {
                    name: 'Mercenaries',
                    icon: 'mercenaries.png'
                },
                'circle': {
                    name: 'Circle Oroboros',
                    icon: 'circle.png'
                },
                'loe': {
                    name: 'Legion of Everblight',
                    icon: 'loe.png',
                    casters: {
                        absylonia1: {
                            name: 'Absylonia'
                        },
                        bethayne1: {
                            name: 'Bethayne'
                        },
                        kallus1: {
                            name: 'Kallus'
                        },
                        lylyth1: {
                            name: 'Lylyth 1'
                        },
                        lylyth2: {
                            name: 'Lylyth 2'
                        },
                        lylyth3: {
                            name: 'Lylyth 3'
                        },
                        rhyas: {
                            name: 'Rhyas'
                        },
                        saeryn: {
                            name: 'Saeryn'
                        },
                        thags1: {
                            name: 'Thagrosh 1'
                        },
                        thags2: {
                            name: 'Thagrosh 2'
                        },
                        vayl1: {
                            name:'Vayl 1'
                        },
                        vayl2: {
                            name: 'Vayl 2'
                        }
                    }
                },
                'skorne': {
                    name: 'Skorne',
                    icon: 'skorne.png'
                },
                'troll': {
                    name: 'Trollbloods',
                    icon: 'trollbloods.png'
                },
                'minions': {
                    name: 'Minions',
                    icon: 'minions.png'
                }
            };
            $scope.opponents = [
                'kevin',
                'fred',
                'wood',
                'q2'
            ];
            $scope.events = [
                'amical',
                'baf131020',
                'gme2013'
            ];
            $scope.scenarios = {
                sr13des: {
                    name: 'SR13 Destruction'
                },
                sr13sad: {
                    name: 'SR13 Supply & Demand'
                },
                sr13cq: {
                    name: 'SR13 Close Quarters'
                },
                sr13ar: {
                    name: 'SR13 Ammunition Run'
                },
                sr13incu: {
                    name: 'SR13 Incursion'
                },
                sr13cr: {
                    name: 'SR13 Chemical Reaction'
                },
                sr13out: {
                    name: 'SR13 Outflank'
                },
                sr13inco: {
                    name: 'SR13 Incoming'
                },
                sr13itb: {
                    name: 'SR13 Into the Breach'
                },
                sr13rp: {
                    name: 'SR13 Rally Point'
                },
                sr13poe: {
                    name: 'SR13 Process of elimination'
                },
                sr13fs: {
                    name: 'SR13 Fire Support'
                }
            };
            $scope.scores = [
                {
                    result: 'victory',
                    type: 'assassination'
                },
                {
                    result: 'victory',
                    type: 'clock'
                },
                {
                    result: 'victory',
                    type: 'scenario'
                },
                {
                    result: 'draw',
                    type: 'dice down'
                },
                {
                    result: 'defeat',
                    type: 'assassination'
                },
                {
                    result: 'defeat',
                    type: 'clock'
                },
                {
                    result: 'defeat',
                    type: 'scenario'
                }
            ];
            $scope.battles = [
                {
                    'date': {
                        year: 2013,
                        month: 10,
                        day: 13
                    },
                    'my_army': {
                        faction: 'loe',
                        caster: 'vayl2'
                    },
                    'opponent': {
                        name: 'kevin',
                        faction: 'cryx',
                        caster: 'gaspy2'
                    },
                    'setup': {
                        size: 50,
                        scenario: 'sr13poe',
                        event: 'baf131020'
                    },
                    'score': $scope.scores[4],
                    'points': {
                        my_army: {
                            scenario: 1,
                            army: 10
                        },
                        opponent: {
                            scenario: 3,
                            army: 35
                        }
                    },
                    'comment': 'Cryx c\'est fume.'
                },
                {
                    'date': {
                        year: 2013,
                        month: 10,
                        day: 20
                    },
                    'my_army': {
                        faction: 'loe',
                        caster: 'kallus1'
                    },
                    'opponent': {
                        name: 'wood',
                        faction: 'scyrah',
                        caster: 'rahn1'
                    },
                    'setup': {
                        size: 35,
                        scenario: 'sr13cr',
                        event: 'amical'
                    },
                    'score': $scope.scores[3],
                    'points': {
                        my_army: {
                            scenario: 2,
                            army: 30
                        },
                        opponent: {
                            scenario: 2,
                            army: 30
                        }
                    }
                },
                {
                    'date': {
                        year: 2013,
                        month: 10,
                        day: 20
                    },
                    'my_army': {
                        faction: 'loe',
                        caster: 'vayl1'
                    },
                    'opponent': {
                        name: 'fred',
                        faction: 'skorne',
                        caster: 'hexeris2'
                    },
                    'setup': {
                        size: 50,
                        scenario: 'sr13inco',
                        event: 'amical'
                    },
                    'score': $scope.scores[2],
                    'points': {
                        my_army: {
                            scenario: 5,
                            army: 45
                        },
                        opponent: {
                            scenario: 0,
                            army: 20
                        }
                    }
                }
            ];

            $scope.viewBattle = function viewBattle(index) {
                console.log('view battle ' + index);
                $scope.battle = $scope.battles[index];
                $state.go('view');
            };
            $scope.editBattle = function editBattle(index) {
                $state.go('edit');
            };
            $scope.close = function close() {
                $state.go('list');
            };
                
        }]);
