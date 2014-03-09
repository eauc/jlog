'use strict';

angular.module('jlogApp.services')
    .factory('battle', [function() {
        function normalizeCaster(caster) {
            if (!angular.isString(caster)) return null;
            var last_char = caster.charAt(caster.length - 1);
            if ('0' > last_char || '9' < last_char) {
                caster += '1';
            }
            return caster;
        };
        return function(data) {
            var today = new Date();
            data = data || {};
            var instance = angular.extend({
                'date': {
                    'year': today.getFullYear(),
                    'month': today.getMonth() + 1,
                    'day': today.getDate()
                },
                'my_army': {
                    'caster': null,
                    'faction': null
                },
                'opponent': {
                    'name': null,
                    'caster': null,
                    'faction':null
                },
                'points': {
                    'my_army': {
                        'scenario': null,
                        'army': null,
                        'kill': null
                    },
                    'opponent': {
                        'scenario': null,
                        'army': null,
                        'kill': null
                    }
                },
                'setup': {
                    'size': null,
                    'scenario': null,
                    'event': null,
                },
                'score': null,
                'comment':null,
                'initiative': {
                    'dice': null,
                    'start': null
                }
            }, data);
            instance.my_army.caster = normalizeCaster(instance.my_army.caster);
            instance.opponent.caster = normalizeCaster(instance.opponent.caster);
            return instance;
        };
    }])
    .service('battles', [ 'battle', function(battle) {
        var battles = {
            'list': []
        };
        var storage_battles_key = 'jlog_battles';
        var store = function battlesStore() {
            console.log('save battles in localStorage');
            localStorage.setItem(storage_battles_key, battles.list);
        };
        var load = function battlesLoad() {
            console.log('load battles from localStorage');
            return JSON.parse(localStorage.getItem(storage_battles_key));
        };
        var storageContainsBattles = function battlesStorageContainsBattles() {
            return 'string' === typeof localStorage.getItem(storage_battles_key);
        };
        var buildIndex = function buildIndex() {
            var i = 0;
            for (i = 0 ; i < battles.list.length ; i++) {
                battles.list[i].index = i;
            }
        };
        battles.update = function battlesUpdate() {
            buildIndex();
            store();
        };
        battles.create = function battlesCreate(list) {
            this.list = [];
            if (angular.isArray(list)) {
                var i = 0;
                for (i = 0 ; i < list.length ; i++) {
                    this.list.push(battle(list[i]));
                }
            }
            this.update();
        };
        battles.init = function battlesInit() {
            if (storageContainsBattles()) {
                this.create(load());
            }
            else {
                this.create([]);
            }
        };
        return battles;
    }]);
