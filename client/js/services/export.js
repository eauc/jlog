'use strict';

angular.module('jlogApp.services')
  .service('export_csv', [
    'battle',
    function(battle) {
      function exportKeys(object, base, keys) {
        if (!_.isString(base)) base = '';
        return _.reduce(object, function(result, value, key) {
          if('$' !== key[0] &&
             !_.isFunction(value)) {
            keys[key] = {};
            if (!_.isObject(value)) {
              result += base + key + ',';
            }
            else {
              result += exportKeys(value, base + key + '.', keys[key]);
            }
          }
          return result;
        }, '');
      }
      function exportValues(object, keys) {
        return _.reduce(keys, function(result, value, key) {
          if(object.hasOwnProperty(key)) {
            if(_.isObject(object[key])) {
              result += exportValues(object[key], value);
            }
            else if(_.isArray(object[key])) {
              _.each(object[key], function(val) {
                result += val + ':';
              });
              result = result.slice(0, result.length - 1);
              result += ',';
            }
            else {
              result += object[key] + ',';
            }
          }
          return result;
        }, '');
      }
      return function exportCsv(battles_list)
      {
        var result = '', keys = {};
        result += exportKeys(battle({}), '', keys) + '\r\n';
        return _.reduce(battles_list, function(result, battle) {
          result += exportValues(battle, keys) + '\r\n';
          return result;
        }, result);
      };
    }])
  .service('export_bb', [
    'battle',
    function(battle) {
      function exportKeys(object, base, keys) {
        if(!_.isString(base)) base = '';
        return _.reduce(object, function(result, value, key) {
          if('$' !== key[0] &&
             !_.isFunction(value)) {
            keys[key] = {};
            if(!_.isObject(value)) {
              result += '[th]' + base + key + '[/th]';
            }
            else {
              result += exportKeys(value, base + key + '.', keys[key]);
            }
          }
          return result;
        }, '');
      }
      function exportValues(object, keys) {
        return _.reduce(keys, function(result, value, key) {
          if(object.hasOwnProperty(key)) {
            if(_.isObject(object[key])) {
              result += exportValues(object[key], value);
            }
            else if(_.isArray(object[key])) {
              result += '[td]';
              _.each(object[key], function(val) {
                result += val + ',';
              });
              result = result.slice(0, result.length - 1);
              result += '[/td]';
            }
            else {
              result += '[td]' + object[key] + '[/td]';
            }
          }
          return result;
        }, '');
      }
      return function exportBB(battles_list)
      {
        var result = '[table]\r\n', keys = {};
        result += '[tr]' + exportKeys(battle({}), '', keys) + '[/tr]\r\n';
        result += _.reduce(battles_list, function(res, battle) {
          res += '[tr]' + exportValues(battle, keys) + '[/tr]\r\n';
          return res;
        }, '');
        result += '[/table]\r\n';
        return result;
      };
    }]);
