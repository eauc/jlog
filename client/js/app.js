'use strict';

angular.module('jlogApp.services', [])
    .value('version', '0.1');
angular.module('jlogApp.filters', []);
angular.module('jlogApp.controllers', []);
angular.module('jlogApp.directives', []);
angular.module('jlogApp', [
    'ui.router',
    'pasvaz.bindonce',
    'jlogApp.controllers',
    'jlogApp.filters',
    'jlogApp.services',
    'jlogApp.directives'
]).config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/battle/list');
        $stateProvider
            .state('battle', {
                url: '/battle',
                template: '<div ui-view></div>',
                controller: 'listCtrl'
            })
            .state('battle.list', {
                url: '/list',
                templateUrl: 'partials/battle_list.html'
            })
            .state('battle.view', {
                url: '/view',
                templateUrl: 'partials/battle_view.html',
                controller: 'listViewCtrl'
            })
            .state('battle.edit', {
                url: '/edit',
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
