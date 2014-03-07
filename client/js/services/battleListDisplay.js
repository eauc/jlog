'use strict';

angular.module('jlogApp.services')
    .service('battle_list_display', [
        'filterBattleFilter',
        'orderByFilter',
        'sort_types',
        function(filterBattleFilter,
                 orderByFilter,
                 sort_types) {
            function more() {
                console.log('display_battle_list more');
                var more_battles = this.sorted_battles.slice(this.last_index,
                                                             this.last_index + this.slice);
                this.battles = this.battles.concat(more_battles);
                this.last_index += this.slice;
                this.more = (this.last_index < this.sorted_battles.length);
            };
            function sortBattles(battles, filter, active, invert, sort) {
                this.sorted_battles = filterBattleFilter(battles, filter, active, invert);
                this.sorted_battles = orderByFilter(this.sorted_battles,
                                                    sort_types[sort.type].key,
                                                    sort.reverse);
            };
            function exportCsvKeys(battle, keys) {
                var key;
                var result = '';
                for (key in battle) {
                    if ( battle.hasOwnProperty(key) &&
                         '$' !== key[0] ) {
                        switch (key) {
                        case 'my_army':
                            {
                                result += 'my_army_faction' + ',';
                                result += 'my_army_caster' + ',';
                                break;
                            }
                        case 'opponent':
                            {
                                result += 'opponent_name' + ',';
                                result += 'opponent_faction' + ',';
                                result += 'opponent_caster' + ',';
                                break;
                            }
                        case 'points':
                            {
                                result += 'my_scenario_points' + ',';
                                result += 'my_army_points' + ',';
                                result += 'opponent_scenario_points' + ','; 
                                result += 'opponent_army_points' + ',';
                                break;
                            }
                        case 'setup':
                            {
                                result += 'size' + ',';
                                result += 'scenario' + ',';
                                result += 'event' + ','; 
                                result += 'initiative' + ','; 
                                break;
                            }
                        case 'initiative':
                            {
                                result += 'init_dice' + ',';
                                result += 'init_start' + ',';
                                break;
                            }
                        default:
                            {
                                result += key + ',';
                                break;
                            }
                        }
                        keys.push(key);
                    }
                }
                result = result.slice(0, result.length - 1);
                result += '\r\n';
                return result;
            };
            function exportBbKeys(battle, keys) {
                var key;
                var result = '[tr]';
                for (key in battle) {
                    if ( battle.hasOwnProperty(key) &&
                         '$' !== key[0] ) {
                        switch (key) {
                        case 'my_army':
                            {
                                result += '[th]' + 'my_army_faction' + '[/th]';
                                result += '[th]' + 'my_army_caster' + '[/th]';
                                break;
                            }
                        case 'opponent':
                            {
                                result += '[th]' + 'opponent_name' + '[/th]';
                                result += '[th]' + 'opponent_faction' + '[/th]';
                                result += '[th]' + 'opponent_caster' + '[/th]';
                                break;
                            }
                        case 'points':
                            {
                                result += '[th]' + 'my_scenario_points' + '[/th]';
                                result += '[th]' + 'my_army_points' + '[/th]';
                                result += '[th]' + 'opponent_scenario_points' + '[/th]'; 
                                result += '[th]' + 'opponent_army_points' + '[/th]';
                                break;
                            }
                        case 'setup':
                            {
                                result += '[th]' + 'size' + '[/th]';
                                result += '[th]' + 'scenario' + '[/th]';
                                result += '[th]' + 'event' + '[/th]'; 
                                result += '[th]' + 'initiative' + '[/th]'; 
                                break;
                            }
                        case 'initiative':
                            {
                                result += '[th]' + 'init_dice' + '[/th]';
                                result += '[th]' + 'init_start' + '[/th]';
                                break;
                            }
                        default:
                            {
                                result += '[th]' + key + '[/th]';
                                break;
                            }
                        }
                        keys.push(key);
                    }
                }
                result += '[/tr]\r\n';
                return result;
            };
            function exportCsvValues(battle, keys) {
                var key, j, result = '';
                for (j = 0 ; j < keys.length ; j++) {
                    key = keys[j];
                    var entry = battle[key];
                    if (undefined === entry) continue;
                    switch (key) {
                    case 'date':
                        {
                            result += entry.year + '/'
                                + entry.month + '/'
                                + entry.day + ',';
                            break;
                        }
                    case 'opponent':
                        {
                            result += entry.name + ',';
                            // FALLTHROUGH !!!
                        }
                    case 'my_army':
                        {
                            result += entry.faction + ',';
                            result += entry.caster + ',';
                            break;
                        }
                    case 'points':
                        {
                            result += entry.my_army.scenario + ',';
                            result += entry.my_army.army + ',';
                            result += entry.opponent.scenario + ',';
                            result += entry.opponent.army + ',';
                            break;
                        }
                    case 'setup':
                        {
                            result += entry.size + ',';
                            result += entry.scenario + ',';
                            result += entry.event + ',';
                            if (angular.isObject(entry.initiative)) {
                                result += ('true' === entry.initiative.won_roll ?
                                           'Won roll' : 'Lost roll') + ' - ';
                                result += ('true' === entry.initiative.started ?
                                           'Started game' : 'Chose side') + ',';
                            }
                            else {
                                result += ',';
                            }
                            break;
                        }
                    case 'initiative':
                        {
                            result += entry.dice + ',';
                            result += entry.start + ',';
                            break;
                        }
                    default:
                        {
                            result += entry + ',';
                            break;
                        }
                    }
                }
                result = result.slice(0, result.length - 1);
                result += '\r\n';
                return result;
            };
            function exportBbValues(battle, keys) {
                var key, j, result = '[tr]';
                for (j = 0 ; j < keys.length ; j++) {
                    key = keys[j];
                    var entry = battle[key];
                    if (undefined === entry) continue;
                    switch (key) {
                    case 'date':
                        {
                            result += '[td]' + entry.year + '/'
                                + entry.month + '/'
                                + entry.day + '[/td]';
                            break;
                        }
                    case 'opponent':
                        {
                            result += '[td]' + entry.name + '[/td]';
                            // FALLTHROUGH !!!
                        }
                    case 'my_army':
                        {
                            result += '[td]' + entry.faction + '[/td]';
                            result += '[td]' + entry.caster + '[/td]';
                            break;
                        }
                    case 'points':
                        {
                            result += '[td]' + entry.my_army.scenario + '[/td]';
                            result += '[td]' + entry.my_army.army + '[/td]';
                            result += '[td]' + entry.opponent.scenario + '[/td]';
                            result += '[td]' + entry.opponent.army + '[/td]';
                            break;
                        }
                    case 'setup':
                        {
                            result += '[td]' + entry.size + '[/td]';
                            result += '[td]' + entry.scenario + '[/td]';
                            result += '[td]' + entry.event + '[/td]';
                            if (angular.isObject(entry.initiative)) {
                                result += '[td]' + (entry.initiative.won_roll ?
                                                    'Won roll' : 'Lost roll') + ' - ';
                                result += (entry.initiative.started ?
                                           'Started game' : 'Chose side') + '[/td]';
                            }
                            else {
                                result += '[td][/td]';
                            }
                            break;
                        }
                    case 'initiative':
                        {
                            result += '[td]' + entry.dice + '[/td]';
                            result += '[td]' + entry.start + '[/td]';
                            break;
                        }
                    default:
                        {
                            result += '[td]' + entry + '[/td]';
                            break;
                        }
                    }
                }
                result += '[/tr]\r\n';
                return result;
            };
            var instance = {
                battles: [],
                sorted_battles: [],
                slice: 15,
                last_index: 0,
                reset: function displayBattleListReset(battles, filter, active, invert, sort) {
                    this.battles = [];
                    this.sorted_battles = [];
                    this.slice = 15;
                    this.last_index = 0;
                    this.more = false;
                    sortBattles.call(this, battles, filter, active, invert, sort);
                    more.call(this);
                },
                showMore: function displayBattleListShowMore() {
                    console.log('display_battle_list showMore');
                    if (this.more) {
                        more.call(this);
                    }
                },
                'export': function displayBattleExport(format) {
                    var result = '';
                    if (0 >= instance.sorted_battles.length) return result;
                    var list = instance.sorted_battles;
                    switch (format) {
                    case 'csv':
                        {
                            var keys = [];
                            result += exportCsvKeys(list[0], keys);
                            var i;
                            for (i = 0 ; i < list.length ; i++) {
                                result += exportCsvValues(list[i], keys);
                            }
                            break;
                        }
                    case 'bb':
                        {
                            var keys = [];
                            result += '[table]\r\n';
                            result += exportBbKeys(list[0], keys);
                            var i;
                            for (i = 0 ; i < list.length ; i++) {
                                result += exportBbValues(list[i], keys);
                            }
                            result += '[/table]\r\n';
                            break;
                        }
                    case 'json':
                        {
                            result += JSON.stringify(list);
                            break;
                        }
                    default:
                        {
                            console.log('displayBattleListExport unknown format ' + format);
                            break;
                        }
                    }
                    console.log(result);
                    return result;
                }
            };
            return instance;
        }]);
