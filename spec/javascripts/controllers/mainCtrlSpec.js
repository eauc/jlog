'use strict';

describe('controllers', function() {

    beforeEach(function() {
        module('ngRoute');
        module('clockApp.test_services');
        module('clockApp.controllers');
    });

    describe('mainCtrl', function() {

        var $location;
        var $window;
        var core;
        var api;

        var scope;
        var ctrl;

        beforeEach(inject([
            '$rootScope',
            '$controller',
            '$location',
            '$window',
            'core',
            'api',
            function($rootScope,
                     $controller,
                     __$location__,
                     __$window__,
                     __core__,
                     __api__) {
                $location = __$location__;
                spyOn($location, 'path');

                $window = __$window__;

                core = __core__;
                spyOn(core.error, 'watch');

                api = __api__;
                spyOn(api, 'init');

                scope = $rootScope.$new();
                scope.setAllErrors = function() {
                    this.error.creating = true;
                    this.error.searching = true;
                };
                scope.hasError = function() {
                    return this.error.creating
                        || this.error.searching;
                };

                ctrl = $controller('mainCtrl', { '$scope': scope });
            }]));

        it('should set version', function() {
            expect(scope.version).toEqual('0.1');
        });

        it('should reset working flags', function() {
            expect(scope.creating).toEqual(false);
            expect(scope.searching).toEqual(false);
        });

        it('should reset error flags', function() {
            expect(scope.error.creating).toEqual(false);
            expect(scope.error.searching).toEqual(false);
            expect(scope.error.connection).toEqual(false);
        });

        it('should reset online flag', function() {
            expect(scope.online).toEqual(false);
        });

        it('should force path to "/"', function() {
            expect($location.path).toHaveBeenCalledWith('/');
        });

        it('should watch error', function() {
            expect(core.error.watch)
                .toHaveBeenCalledWith(jasmine.any(Function));
        });

        it('should subscribe to "update statusResource" event', function() {
            core.event.publish('update statusResource', { toto: 'titi' });
            expect(scope.status).toEqual({ toto: 'titi' });
         });

        it('should subscribe to "statusResource.href" event', function() {
            core.event.publish('update statusResource.href', '/test/url/status');
            expect(scope.status.href).toEqual('/test/url/status');
        });

        it('should subscribe to "clockCollection.href" event', function() {
            core.event.publish('update clockCollection.href', '/test/url/clock');
            expect(scope.clock_collection.href).toEqual('/test/url/clock');
        });

        it('should subscribe to "online status" event', function() {
            core.event.publish('online status', true);
            expect(scope.online).toEqual(true);

            core.event.publish('online status', false);
            expect(scope.online).toEqual(false);
        });

        it('should subscribe to "application cache" event', function() {
            core.event.publish('application cache', 'update ready');
            expect($window.location.reload).toHaveBeenCalled();
        });

        it('should init api', function() {
            expect(api.init).toHaveBeenCalledWith('api');
        });

        it('should set "connecting"', function() {
            expect(scope.connecting).toBeTruthy();
        });

        it('should subscribe to "online status" event', function() {
            core.event.publish('online status', false);
            expect(scope.connecting).toBeFalsy();
            expect(scope.online).toBeFalsy();
            scope.connecting = true;
            core.event.publish('online status', true);
            expect(scope.connecting).toBeFalsy();
            expect(scope.online).toBeTruthy();
        });

        describe('workOffline', function() {

            beforeEach(function() {
                spyOn(core.event, 'publish');
                scope.workOffline();
            });

            it('should publish "online status" event', function() {
                expect(core.event.publish).toHaveBeenCalledWith('online status', false);
            });

        });

        describe('workOnline', function() {

            beforeEach(function() {
                scope.connecting = false;
                scope.workOnline();
            });

            it('should set "connecting"', function() {
                expect(scope.connecting).toBeTruthy();
            });

            it('should init api', function() {
                expect(api.init).toHaveBeenCalledWith('api');
            });

        });

        describe('createClock', function() {

            var tpcrService;
            var create_promise;

            beforeEach(inject(function(twoPlayerClockResource) {
                $location.path.calls.reset();
                tpcrService = twoPlayerClockResource;
                scope.creating = false;
                create_promise = jasmine.createSpyObj('create_promise', ['then']);
                spyOn(tpcrService, 'create').and.returnValue(create_promise);
                core.event.publish('update clockCollection.href', '/test/url/clock');
            }));

            it('should clear errors', function() {
                scope.setAllErrors();

                scope.createClock();

                expect(scope.hasError()).toBe(false);
            });

            it('should fold navbar', function() {
                scope.navbar = false;

                scope.createClock();

                expect(scope.navbar).toBe(true);
            });

            it('should set creating', function() {
                scope.createClock();
                expect(scope.creating).toBe(true);
            });

            it('should call twoPlayerClockResource.create', function() {
                scope.createClock();
                expect(tpcrService.create).toHaveBeenCalledWith('/test/url/clock');
            });

            it('should set promise handlers', function() {
                scope.createClock();
                expect(create_promise.then)
                    .toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));
            });

            describe('success handler', function() {

                var success_handler;

                beforeEach(function() {
                    scope.createClock();
                    success_handler = create_promise.then.calls.first().args[0];

                    scope.creating = true;
                });

                it('should reset creating', function() {
                    var test_clock = { 'id': 42 };
                    success_handler(test_clock);
                    expect(scope.creating).toBe(false);
                });

                it('should set clock', function() {
                    scope.clock = null;
                    var test_clock = { 'id': 42 };
                    success_handler(test_clock);
                    expect(scope.clock).toBe(test_clock);
                });

                it('should force path to "/clock/:id"', function() {
                    var test_clock = { 'id': 42 };
                    success_handler(test_clock);
                    expect($location.path).toHaveBeenCalledWith('/clock/42');
                });

            });

            describe('error handler', function() {

                var error_handler;

                beforeEach(function() {
                    scope.createClock();
                    error_handler = create_promise.then.calls.first().args[1];

                    scope.creating = true;
                });

                it('should reset creating', function() {
                    error_handler();
                    expect(scope.creating).toBe(false);
                });

                it('should reset clock', function() {
                    scope.clock = {};
                    error_handler();
                    expect(scope.clock).toBe(null);
                });

                it('should set creating error', function() {
                    error_handler();
                    expect(scope.error.creating).toBe(true);
                });

                it('should force path to "/"', function() {
                    error_handler();
                    expect($location.path).toHaveBeenCalledWith('/');
                });

            });

        });

        describe('searchClock', function() {

            beforeEach(function() {
                $location.path.calls.reset();
            });

            var should_reset_view = function() {

                it('should force path to "/"', function() {
                    scope.searchClock();

                    expect($location.path).toHaveBeenCalledWith('/');
                });

                it('should reset clock', function() {
                    scope.clock = {};

                    scope.searchClock();

                    expect(scope.clock).toBe(null);
                });

            };

            it('should clear errors', function() {
                scope.setAllErrors();

                scope.searchClock();

                expect(scope.hasError()).toBe(false);
            });

            it('should fold navbar', function() {
                scope.navbar = false;

                scope.searchClock();

                expect(scope.navbar).toBe(true);
            });

            describe('if id_search is null', function() {

                beforeEach(function() {
                    scope.search = { id: null };
                });

                should_reset_view();

            });

            describe('if id_search is not a string', function() {

                beforeEach(function() {
                    scope.search = { id: 1234 };
                });

                should_reset_view();

            });

            describe('if id_search is an empty string', function() {

                beforeEach(function() {
                    scope.search = { id: '' };
                });

                should_reset_view();

            });

            describe('if id_search is a string', function() {

                var tpcrService;
                var search_promise;

                beforeEach(inject(function(twoPlayerClockResource) {
                    tpcrService = twoPlayerClockResource;
                    scope.search = { id: '42' };
                    scope.searching = false;
                    search_promise = jasmine.createSpyObj('search_promise', ['then']);
                    spyOn(tpcrService, 'search').and.returnValue(search_promise);
                    core.event.publish('update clockCollection.href', '/test/url/clock');
                }));

                it('should set searching', function() {
                    scope.searchClock();
                    expect(scope.searching).toBe(true);
                });

                it('should call twoPlayerClockResource.search', function() {
                    scope.searchClock();
                    expect(tpcrService.search)
                        .toHaveBeenCalledWith('/test/url/clock', scope.search);
                });

                it('should set promise handlers', function() {
                    scope.searchClock();
                    expect(search_promise.then)
                        .toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));
                });

                describe('success handler', function() {

                    var success_handler;

                    beforeEach(function() {
                        scope.searchClock();
                        success_handler = search_promise.then.calls.first().args[0];

                        scope.searching = true;
                    });

                    it('should reset searching', function() {
                        var test_clock = { 'id': 42 };
                        success_handler(test_clock);
                        expect(scope.searching).toBe(false);
                    });

                    it('should set clock', function() {
                        scope.clock = null;
                        var test_clock = { 'id': 42 };
                        success_handler(test_clock);
                        expect(scope.clock).toBe(test_clock);
                    });

                    it('should force path to "/clock/:id"', function() {
                        var test_clock = { 'id': 42 };
                        success_handler(test_clock);
                        expect($location.path).toHaveBeenCalledWith('/clock/42');
                    });

                });

                describe('error handler', function() {

                    var error_handler;

                    beforeEach(function() {
                        scope.searchClock();
                        error_handler = search_promise.then.calls.first().args[1];

                        scope.searching = true;
                    });

                    it('should reset searching', function() {
                        error_handler();
                        expect(scope.searching).toBe(false);
                    });

                    it('should reset clock', function() {
                        scope.clock = {};
                        error_handler();
                        expect(scope.clock).toBe(null);
                    });

                    it('should set searching error', function() {
                        error_handler();
                        expect(scope.error.searching).toBe(true);
                    });

                    it('should force path to "/"', function() {
                        error_handler();
                        expect($location.path).toHaveBeenCalledWith('/');
                    });

                });

            });

        });

    });

});
