'use strict';

angular.module('jlogApp.services')
    .service('events', [function() {
        var events = {
            'list': []
        };
        var storage_events_key = 'jlog_events';
        var store = function eventsStore() {
            console.log('save events in localStorage');
            localStorage.setItem(storage_events_key, events.list);
        };
        var load = function eventsLoad() {
            console.log('load events from localStorage');
            return JSON.parse(localStorage.getItem(storage_events_key));
        };
        var storageContainsEvents = function eventsStorageContainsEvents() {
            return 'string' === typeof localStorage.getItem(storage_events_key);
        };
        var build = function eventsBuild(battles) {
            events.list = [];
            if (!angular.isArray(battles)) return;
            var i, temp = {}, event;
            for (i = 0 ; i < battles.length ; i++) {
                if (angular.isObject(battles[i].setup) &&
                    angular.isString(battles[i].setup.event)) {
                    temp[battles[i].setup.event] = true;
                }
            }
            for (event in temp) {
                events.list.push(event);
            }
            events.list.sort();
        };
        events.create = function eventsCreate(battles) {
            build(battles);
            store();
        };
        events.init = function eventsInit(battles) {
            if (storageContainsEvents()) {
                this.list = load().sort();
            }
            else {
                this.create(battles);
            }
        };
        events.update = store;
        return events;
    }]);
