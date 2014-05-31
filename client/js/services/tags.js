'use strict';

angular.module('jlogApp.services')
  .service('tags', [
    '$window',
    function($window) {
      var tags = {
        'list': []
      };
      var storage_tags_key = 'jlog_tags';
      var store = function tagsStore() {
        console.log('save tags in localStorage');
        $window.localStorage.setItem(storage_tags_key, JSON.stringify(tags.list));
      };
      var load = function tagsLoad() {
        console.log('load tags from localStorage');
        return JSON.parse($window.localStorage.getItem(storage_tags_key)).sort();
      };
      var storageContainsTags = function tagsStorageContainsTags() {
        var data = $window.localStorage.getItem(storage_tags_key);
        return ('string' === typeof data &&
                data.length > 0);
      };
      var build = function tagsBuild(battles) {
        tags.list = [];
        if (!angular.isArray(battles)) return;
        var i, j, temp = {}, tag;
        for (i = 0 ; i < battles.length ; i++) {
          if (angular.isArray(battles[i].tags)) {
            for (j = 0 ; j < battles[i].tags.length ; j++) {
              if (angular.isString(battles[i].tags[j])) {
                temp[battles[i].tags[j]] = true;
              }
            }
          }
        }
        for (tag in temp) {
          tags.list.push(tag);
        }
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
