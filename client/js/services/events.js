'use strict';

angular.module('jlogApp.services')
  .service('events', [
    '$window',
    function($window) {
      var events = {
        'list': []
      };
      var storage_events_key = 'jlog_events';
      var store = function eventsStore() {
        console.log('save events in localStorage');
        $window.localStorage.setItem(storage_events_key, JSON.stringify(events.list));
      };
      var load = function eventsLoad() {
        console.log('load events from localStorage');
        return JSON.parse($window.localStorage.getItem(storage_events_key));
      };
      var storageContainsEvents = function eventsStorageContainsEvents() {
        var data = $window.localStorage.getItem(storage_events_key);
        return ('string' === typeof data &&
                data.length > 0);
      };
      var build = function eventsBuild(battles) {
        events.list = [];
        if (!_.isArray(battles)) return;
        var temp = {};
        _.each(battles, function(battle) {
          if (_.isObject(battle.setup) &&
              _.isString(battle.setup.event)) {
            temp[battle.setup.event] = true;
          }
        });
        events.list = _.keys(temp);
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
      events.add = function eventsAdd(name) {
        if(0 < name.length) {
          this.list.push(name);
          this.list.sort();
          store();
        }
      };
      events.remove = function eventsRemove(name) {
        var index = this.list.indexOf(name);
        if(0 <= index) {
          this.list.splice(index, 1);
          store();
        }
      };
      return events;
    }]);
