'use strict';

angular.module('grudgeApp.services', [])
    .value('version', '0.1');
angular.module('grudgeApp.filters', []);
angular.module('grudgeApp.controllers', []);
angular.module('grudgeApp.directives', []);
angular.module('grudgeApp', [
    'ui.router',
    'grudgeApp.controllers',
    'grudgeApp.filters',
    'grudgeApp.services',
    'grudgeApp.directives'
]);
    // .config(['$routeProvider', function($routeProvider) {
    //     $routeProvider
    //         .when('/', {
    //             templateUrl: 'partials/home.html',
    //             controller: 'homeCtrl'
    //         })
    //         // .when('/clock/:id', {
    //         //     templateUrl: 'partials/clock.html',
    //         //     controller: 'clockCtrl'
    //         // })
    //         .otherwise({redirectTo: '/'});
    // }]);
