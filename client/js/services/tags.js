'use strict';

angular.module('jlogApp.services')
    .service('tags', [function() {
        var storage_tags_key = 'jlog_tags';
        var store = function tagsStore(list) {
            console.log('save tags in localStorage');
            localStorage[storage_tags_key] = JSON.stringify(list);
        };
        var load = function tagsLoad() {
            console.log('load tags from localStorage');
            return JSON.parse(localStorage[storage_tags_key]).sort();
        };
        var storageContainsTags = function tagsStorageContainsTags() {
            return 'string' === typeof localStorage[storage_tags_key];
        };
        var build = function tagsBuild(battles) {
            var i, j, temp = {}, event, result = [];
            for (i = 0 ; i < battles.length ; i++) {
                if (angular.isArray(battles[i].tags)) {
                   for (j = 0 ; j < battles[i].tags.length ; j++) {
                       temp[battles[i].tags[j]] = true;
                   }
                }
            }
            for (tag in temp) {
                result.push(tag);
            }
            return result.sort();
        };
        return {
            create: function tagsCreate(battles) {
                var list = build(battles);
                store(list);
                return list;
            },
            init: function tagsInit(battles) {
                if (storageContainsTags()) {
                    return load();
                }
                else {
                    return this.create(battles);
                }
            },
            store: store
        };
    }]);
