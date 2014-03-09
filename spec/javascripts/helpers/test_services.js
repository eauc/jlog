'use strict';

angular.module('jlogApp.test_services', ['jlogApp.services']);
    // .factory('$window', function() {
    //     return {
    //         location: {
    //             reload: jasmine.createSpy()
    //         },
    //         applicationCache: {
    //             addEventListener: jasmine.createSpy()
    //         }
    //     };
    // })
    // .factory('$timeout', function() {
    //     return jasmine.createSpy('timeout');
    // })
    // .factory('MockDate', function() {
    //     var MockDate = function() {};
    //     MockDate.prototype = jasmine.createSpyObj('date', ['getTime']);
    //     return MockDate;
    // })
    // .factory('testTimestamp', [
    //     'MockDate',
    //     'timestamp',
    //     function(MockDate, timestamp) {
    //         return function(stamp) {
    //             MockDate.prototype.getTime.and.returnValue(stamp * 1000);
    //             return timestamp.now(MockDate);
    //         };
    //     }])
    // .factory('testTime', [
    //     'MockDate',
    //     'testTimestamp',
    //     'time',
    //     function(MockDate, testTimestamp, time) {
    //         return function(stamp) {
    //             return time.create(testTimestamp(stamp));
    //         };
    //     }
    // ])
    // .factory('customMatchers', [function() {
    //     return {
    //         toImplementPubsubInterface: function(util, customEqualityTesters) {
    //             return {
    //                 compare: function(actual, expected) {
    //                     var result = {};
    //                     result.pass = angular.isObject(actual)
    //                         && actual.hasOwnProperty('subscribe')
    //                         && typeof actual.subscribe === 'function'
    //                         && actual.hasOwnProperty('watch')
    //                         && typeof actual.watch === 'function'
    //                         && actual.hasOwnProperty('publish')
    //                         && typeof actual.publish === 'function';
    //                     var not = result.pass ? 'not ' : '';
    //                     result.message = 'Expected '
    //                         + JSON.stringify(actual)
    //                         + ' ' + not
    //                         + 'to implement pubsub interface (subscribe/watch/publish)';
    //                     return result;
    //                 }
    //             };
    //         },
    //         toImplementResourceInterface: function(util, customEqualityTesters) {
    //             return {
    //                 compare: function(actual, expected) {
    //                     var result = {};
    //                     result.pass = angular.isObject(actual)
    //                         && actual.hasOwnProperty('get')
    //                         && typeof actual.get === 'function'
    //                         && actual.hasOwnProperty('save')
    //                         && typeof actual.save === 'function'
    //                         && actual.hasOwnProperty('remove')
    //                         && typeof actual.remove === 'function';
    //                     var not = result.pass ? 'not ' : '';
    //                     result.message = 'Expected '
    //                         + JSON.stringify(actual)
    //                         + ' ' + not
    //                         + 'to implement resource interface (get/save/remove)';
    //                     return result;
    //                 }
    //             };
    //         }
    //     };
    // }]);
