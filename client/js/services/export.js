'use strict';

angular.module('jlogApp.services')
    .service('export_csv', [
        'battle',
        function(battle) {
            function exportKeys(object, base, keys) {
                var key;
                var result = '';
                if (!angular.isString(base)) base = '';
                for (key in object) {
                    if ( object.hasOwnProperty(key) &&
                         '$' !== key[0] ) {
                        keys[key] = {};
                        if (!angular.isObject(object[key])) {
                            result += base + key + ',';
                        }
                        else {
                            result += exportKeys(object[key], base + key + '.', keys[key]);
                        }
                    }
                }
                return result;
            };
            function exportValues(object, keys) {
                var key;
                var result = '';
                for (key in keys) {
                    if (object.hasOwnProperty(key)) {
                        if (angular.isObject(object[key])) {
                            result += exportValues(object[key], keys[key]);
                        }
                        else if (angular.isArray(object[key])) {
                            var i;
                            for (i = 0 ; i < object[key].length ; i++) {
                                result += object[key][i] + ':';
                            }
                            result = result.slice(0, result.length - 1);
                            result += ',';
                        }
                        else {
                            result += object[key] + ',';
                        }
                    }
                }
                return result;
            };
            return function exportCsv(battles_list)
            {
                var result = '', keys = {};
                result += exportKeys(battle({}), '', keys) + '\r\n';
                var i;
                for (i = 0 ; i < battles_list.length ; i++) {
                    result += exportValues(battles_list[i], keys) + '\r\n';
                }
                return result;
            };
        }])
    .service('export_bb', [
        'battle',
        function(battle) {
            function exportKeys(object, base, keys) {
                var key;
                var result = '';
                if (!angular.isString(base)) base = '';
                for (key in object) {
                    if ( object.hasOwnProperty(key) &&
                         '$' !== key[0] ) {
                        keys[key] = {};
                        if (!angular.isObject(object[key])) {
                            result += '[th]' + base + key + '[/th]';
                        }
                        else {
                            result += exportKeys(object[key], base + key + '.', keys[key]);
                        }
                    }
                }
                return result;
            };
            function exportValues(object, keys) {
                var key;
                var result = '';
                for (key in keys) {
                    if (object.hasOwnProperty(key)) {
                        if (angular.isObject(object[key])) {
                            result += exportValues(object[key], keys[key]);
                        }
                        else if (angular.isArray(object[key])) {
                            var i;
                            result += '[td]';
                            for (i = 0 ; i < object[key].length ; i++) {
                                result += object[key][i] + ',';
                            }
                            result = result.slice(0, result.length - 1);
                            result += '[/td]';
                        }
                        else {
                            result += '[td]' + object[key] + '[/td]';
                        }
                    }
                }
                return result;
            };
            return function exportBB(battles_list)
            {
                var result = '[table]\r\n', keys = {};
                result += '[tr]' + exportKeys(battle({}), '', keys) + '[/tr]\r\n';
                var i;
                for (i = 0 ; i < battles_list.length ; i++) {
                    result += '[tr]' + exportValues(battles_list[i], keys) + '[/tr]\r\n';
                }
                result += '[/table]\r\n';
                return result;
            };
        }]);
