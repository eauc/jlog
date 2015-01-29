'use strict';

angular.module('jlogApp.services')
  .service('events', [
    // 'storage',
    function() {
      var events = {
        fromBattles: function(coll) {
          return _.chain(coll)
            .mapWith(_.getPath, 'setup.event')
            .without(null, undefined)
            .uniq()
            .sort()
            .value();
        },
        add: function(coll, e) {
          return _.chain(coll)
            .cat(e)
            .without(null, undefined)
            .uniq()
            .sort()
            .value();
        },
        drop: function(coll, e) {
          return _.without(coll, e);
        }
      };
      // var store = function eventsStore() {
      //   console.log('save events in localStorage');
      //   storage.setItem(storage.KEYS.EVENTS, JSON.stringify(events.list));
      // };
      // var load = function eventsLoad() {
      //   console.log('load events from localStorage');
      //   return JSON.parse(storage.getItem(storage.KEYS.EVENTS));
      // };
      // var storageContainsEvents = function eventsStorageContainsEvents() {
      //   var data = storage.getItem(storage.KEYS.EVENTS);
      //   return ('string' === typeof data &&
      //           data.length > 0);
      // };
      // var build = function eventsBuild(battles) {
      //   events.list = [];
      //   if (!_.isArray(battles)) return;
      //   var temp = {};
      //   _.each(battles, function(battle) {
      //     if (_.isObject(battle.setup) &&
      //         _.isString(battle.setup.event)) {
      //       temp[battle.setup.event] = true;
      //     }
      //   });
      //   events.list = _.keys(temp);
      //   events.list.sort();
      // };
      // events.create = function eventsCreate(battles) {
      //   build(battles);
      //   store();
      // };
      // events.init = function eventsInit(battles) {
      //   if (storageContainsEvents()) {
      //     this.list = load().sort();
      //   }
      //   else {
      //     this.create(battles);
      //   }
      // };
      // events.update = store;
      // events.add = function eventsAdd(name) {
      //   if(0 < name.length) {
      //     this.list.push(name);
      //     this.list.sort();
      //     store();
      //   }
      // };
      // events.remove = function eventsRemove(name) {
      //   var index = this.list.indexOf(name);
      //   if(0 <= index) {
      //     this.list.splice(index, 1);
      //     store();
      //   }
      // };
      return events;
    }
  ]);
