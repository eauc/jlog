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
            if (!_.isObject(value) ||
                _.isArray(value)) {
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
          if(_.has(object, key)) {
            if(_.isArray(object[key])) {
              _.each(object[key], function(val) {
                result += val + '::';
              });
              if(object[key].length > 0) result = result.slice(0, result.length - 2);
              result += ',';
            }
            else if(_.isObject(object[key])) {
              result += exportValues(object[key], value);
            }
            else {
              result += object[key] + ',';
            }
          }
          return result;
        }, '');
      }
      return {
        generate: function exportCsv(battles_list)
        {
          var result = '', keys = {};
          result += exportKeys(battle({}), '', keys) + '\r\n';
          return _.reduce(battles_list, function(result, battle) {
            result += exportValues(battle, keys) + '\r\n';
            return result;
          }, result);
        }
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
            if(!_.isObject(value) ||
               _.isArray(value)) {
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
            if(_.isArray(object[key])) {
              result += '[td]';
              _.each(object[key], function(val) {
                result += val + ',';
              });
              if(object[key].length > 0) result = result.slice(0, result.length - 1);
              result += '[/td]';
            }
            else if(_.isObject(object[key])) {
              result += exportValues(object[key], value);
            }
            else {
              result += '[td]' + object[key] + '[/td]';
            }
          }
          return result;
        }, '');
      }
      return {
        generate: function exportBB(battles_list)
        {
          var result = '[table]\r\n', keys = {};
          result += '[tr]' + exportKeys(battle({}), '', keys) + '[/tr]\r\n';
          result += _.reduce(battles_list, function(res, battle) {
            res += '[tr]' + exportValues(battle, keys) + '[/tr]\r\n';
            return res;
          }, '');
          result += '[/table]\r\n';
          return result;
        }
      };
    }])
  .service('export', [
    '$window',
    'export_csv',
    'export_bb',
    function($window,
             export_csv,
             export_bb) {
      function generateExportFile(type, cbk) {
        console.log('generate '+type+' export file');
        var old_url = this[type+'_url'];
        this[type+'_url'] = null;
        if (old_url !== null) {
          $window.URL.revokeObjectURL(old_url);
        }
        var string = cbk();
        var blob = new $window.Blob([string], {type: 'text/plain'});
        var url = $window.URL.createObjectURL(blob);
        this[type+'_url'] = url;
      }
      return {
        name: null,
        bb_url: null,
        csv_url: null,
        json_url: null,
        generate: function(list) {
          var now = new Date();
          this.name = 'battle_list_' + now.getTime();
          generateExportFile.call(this, 'bb', function() {
            return export_bb.generate(list);
          });
          generateExportFile.call(this, 'csv', function() {
            return export_csv.generate(list);
          });
          generateExportFile.call(this, 'json', function() {
            return JSON.stringify(list);
          });
        }
      };
    }]);
