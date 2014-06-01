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
        views: {
          'page': {
            template: '<div ui-view></div>',
            controller: 'listCtrl'
          }
        }
      })
      .state('battle.list', {
        url: '/list',
        views: {
          '@battle': {
            templateUrl: 'partials/battle_list.html'
          },
          'bottom-bar@': {
            templateUrl: 'partials/battle_list_menu.html'
          }
        }
      })
      .state('battle.view', {
        url: '/view',
        views: {
          '@battle': {
            templateUrl: 'partials/battle_view.html',
            controller: 'listViewCtrl'
          },
          'bottom-bar@': {
            templateUrl: 'partials/battle_view_menu.html'
          }
        }
      })
      .state('battle.edit', {
        url: '/edit',
        views: {
          '@battle': {
            templateUrl: 'partials/battle_edit.html',
            controller: 'listEditCtrl'
          },
          'bottom-bar@': {
            templateUrl: 'partials/battle_edit_menu.html'
          }
        }
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
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob):/);
  }
]);
