'use strict';

angular.module('jlogApp.services')
    .service('events', [function() {
        var storage_events_key = 'jlog_events';
        var store = function eventsStore(list) {
            console.log('save events in localStorage');
            localStorage[storage_events_key] = JSON.stringify(list);
        };
        var load = function eventsLoad() {
            console.log('load events from localStorage');
            return JSON.parse(localStorage[storage_events_key]);
        };
        var storageContainsEvents = function eventsStorageContainsEvents() {
            return 'string' === typeof localStorage[storage_events_key];
        };
        var build = function eventsBuild(battles) {
            var i, temp = {}, event, result = [];
            for(i = 0 ; i < battles.length ; i++) {
                temp[battles[i].setup.event] = true;
            }
            for(event in temp) {
                result.push(event);
            }
            return result.sort();
        };
        return {
            create: function eventsCreate(battles) {
                var list = build(battles);
                store(list);
                return list;
            },
            init: function eventsInit(battles) {
                if(storageContainsEvents()) {
                    return load();
                }
                else {
                    return this.create(battles);
                }
            },
            store: store
        };
    }]);
