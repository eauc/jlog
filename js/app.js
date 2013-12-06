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
]).config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/list');
    $stateProvider
        .state('list', {
            url: '/list',
            templateUrl: 'partials/battle_list.html'
        })
        .state('edit', {
            url: '/edit',
            templateUrl: 'partials/battle_edit.html'
        })
        .state('view', {
            url: '/view',
            templateUrl: 'partials/battle_view.html'
        });
});

