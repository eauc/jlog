'use strict';

angular.module('jlogApp.services')
    .service('tags', [function() {
        var tags = {
            'list': []
        };
        var storage_tags_key = 'jlog_tags';
        var store = function tagsStore() {
            console.log('save tags in localStorage');
            localStorage.setItem(storage_tags_key, tags.list);
        };
        var load = function tagsLoad() {
            console.log('load tags from localStorage');
            return JSON.parse(localStorage.getItem(storage_tags_key)).sort();
        };
        var storageContainsTags = function tagsStorageContainsTags() {
            return 'string' === typeof localStorage.getItem(storage_tags_key);
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
        return tags;
    }]);
