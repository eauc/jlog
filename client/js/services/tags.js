'use strict';

angular.module('jlogApp.services')
  .service('tags', [
    'storage',
    function(storage) {
      var tags = {
        'list': []
      };
      var storage_tags_key = 'jlog_tags';
      var store = function tagsStore() {
        console.log('save tags in localStorage');
        storage.setItem(storage_tags_key, JSON.stringify(tags.list));
      };
      var load = function tagsLoad() {
        console.log('load tags from localStorage');
        return JSON.parse(storage.getItem(storage_tags_key)).sort();
      };
      var storageContainsTags = function tagsStorageContainsTags() {
        var data = storage.getItem(storage_tags_key);
        return ('string' === typeof data &&
                data.length > 0);
      };
      var build = function tagsBuild(battles) {
        tags.list = [];
        if (!_.isArray(battles)) return;
        var temp = {};
        _.each(battles, function(battle) {
          if (_.isArray(battle.tags)) {
            _.each(battle.tags, function(tag) {
              if (_.isString(tag)) {
                temp[tag] = true;
              }
            });
          }
        });
        tags.list = _.keys(temp);
        tags.list.sort();
      };
      tags.create = function tagsCreate(battles) {
        build(battles);
        store();
      };
      tags.init = function tagsInit(battles) {
        if (storageContainsTags()) {
          this.list = load();
        }
        else {
          this.create(battles);
        }
      };
      tags.update = store;
      tags.add = function(name) {
        if(0 < name.length) {
          this.list.push(name);
          this.list.sort();
          store();
        }
      };
      tags.remove = function(name) {
        var index = this.list.indexOf(name);
        if(0 <= index) {
          this.list.splice(index, 1);
          store();
        }
      };        
      return tags;
    }]);
