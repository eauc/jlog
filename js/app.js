'use strict';

angular.module('jlogApp.services', [])
    .value('version', '0.1');
angular.module('jlogApp.filters', []);
angular.module('jlogApp.controllers', []);
angular.module('jlogApp.directives', []);
angular.module('jlogApp', [
    'ui.router',
    'jlogApp.controllers',
    'jlogApp.filters',
    'jlogApp.services',
    'jlogApp.directives'
]).config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/list');
        $stateProvider
            .state('list', {
                url: '/list',
                templateUrl: 'partials/battle_list.html',
                controller: 'listCtrl'
            })
            .state('list.view', {
                // url: '/view',
                templateUrl: 'partials/battle_view.html',
                controller: 'listViewCtrl'
            })
            .state('list.edit', {
                // url: '/edit',
                templateUrl: 'partials/battle_edit.html',
                controller: 'listEditCtrl'
            })
            .state('filter', {
                url: '/filter',
                templateUrl: 'partials/filter.html'
            })
            .state('backup', {
                url: '/backup',
                templateUrl: 'partials/backup.html',
                controller: 'backupCtrl'
            })
            .state('stats', {
                url: '/stats',
                templateUrl: 'partials/stats.html',
                controller: 'statsCtrl'
            });
    }
]).config([
    '$compileProvider',
    function($compileProvider) {   
        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob):/);
    }
]);
