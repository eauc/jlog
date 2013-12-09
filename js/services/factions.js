'use strict';

angular.module('grudgeApp.services')
    .value('factions', {
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
    });
