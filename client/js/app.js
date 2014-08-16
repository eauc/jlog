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
    $urlRouterProvider.otherwise('/battle');
    $stateProvider
      .state('battle', {
        url: '/battle',
        views: {
          'page': {
            templateUrl: 'partials/battle_list.html',
            controller: 'listCtrl'
          },
          'bottom-bar@': {
            templateUrl: 'partials/battle_list_menu.html',
            controller: 'listBottomCtrl'
          }
        },
        data: {}
      })
      .state('battle.view', {
        url: '/view/:index',
        views: {
          'battle': {
            templateUrl: 'partials/battle_view.html',
            controller: 'listViewCtrl'
          },
          'bottom-bar@': {
            templateUrl: 'partials/battle_view_menu.html',
            controller: 'listViewBottomCtrl'
          }
        },
        data: {}
      })
      .state('battle.edit', {
        url: '/edit/:index',
        views: {
          'battle': {
            templateUrl: 'partials/battle_edit.html',
            controller: 'listEditCtrl'
          },
          'bottom-bar@': {
            templateUrl: 'partials/battle_edit_menu.html',
            controller: 'listEditBottomCtrl'
          }
        },
        data: {}
      })
      .state('filter', {
        url: '/filter',
        views: {
          'page': {
            templateUrl: 'partials/filter.html',
            controller: 'filterEditCtrl'
          },
          'bottom-bar@': {
            templateUrl: 'partials/filter_menu.html',
            controller: 'filterEditBottomCtrl'
          }
        },
        data: {}
      })
      .state('backup', {
        url: '/backup',
        views: {
          'page': {
            templateUrl: 'partials/backup.html',
            controller: 'backupCtrl'
          }
        }
      })
      .state('stats', {
        url: '/stats',
        views: {
          'page': {
            templateUrl: 'partials/stats.html',
            controller: 'statsCtrl'
          },
          'bottom-bar@': {
            templateUrl: 'partials/stats_menu.html',
            controller: 'statsBottomCtrl'
          }
        },
        data: {}
      });
  }
]).config([
  '$compileProvider',
  function($compileProvider) {   
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob):/);
  }
]);
