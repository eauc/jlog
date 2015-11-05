'use strict';

angular.module('jlogApp.services')
  .factory('pubsub', [
    function() {
      // Subscribe to this event to see all events
      var WATCH_EVENT = '#watch#';

      return function(name) {
        var cache = {};
        function addListener(event, listener) {
          cache[event] = cache[event] || [];
          cache[event].push(listener);
        }
        function unsubscribe(event, listener) {
          return function() {
            cache[event] = _.without(cache[event], listener);
          };
        }
        function signalListeners(event, args) {
          if(!_.isArray(cache[event])) return;

          _.each(cache[event], function(listener) {
            listener.apply(null, args);
          });
        }

        return {
          subscribe: function(event, callback) {
            if(!_.isFunction(callback)) return;
            
            addListener(event, callback);
            return unsubscribe(event, callback);
          },
          publish: function(event) {
            var args = Array.prototype.slice.call(arguments, 0);
            console.log('publish ' + name + '[' + event + ']', args);

            signalListeners(event, _.rest(args));
            signalListeners(WATCH_EVENT, args);
          }
        };
      };
    }
  ]);
