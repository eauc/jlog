'use strict';

angular.module('jlogApp.controllers')
  .controller('mainCtrl', [
    '$scope',
    '$state',
    '$q',
    '$window',
    '$timeout',
    '$location',
    '$anchorScroll',
    'scores',
    'factions',
    'scenarios',
    'battles',
    'events',
    'opponents',
    'tags',
    'filter',
    'pubsub',
    'parseUser',
    'parseSync',
    'parseLog',
    function($scope,
             $state,
             $q,
             $window,
             $timeout,
             $location,
             $anchorScroll,
             scores,
             factions,
             scenarios,
             battles,
             events,
             opponents,
             tags,
             filter,
             pubsub,
             parseUser,
             parseSync,
             parseLog) {
      console.log('init mainCtrl');

      $scope.stateIs = _.bind($state.is, $state);
      $scope.stateGo = _.bind($state.go, $state);

      $scope.battles = {
        list: [],
        sorted_list: [],
        display_list: [],
        events: [],
        opponents: [],
        scenarios: [],
        tags: [],
        sort: {
          type: 'date',
          reverse: true
        },
        filter: {
          state: filter.init(),
          active: false,
          invert: false,
          cache: {}
        }
      };

      var timeout;
      function updateDisplayList() {
        if(_.exists(timeout)) {
          console.log('updateDisplayList cancel');
          $timeout.cancel(timeout);
          timeout = null;
        }

        // console.log('updateDisplayList sorted', $scope.battles.sorted_list);
        var chunked_list = _.chunkAll($scope.battles.sorted_list, 20);
        // console.log('updateDisplayList chunked', chunked_list);
        $scope.battles.display_list = [];

        var updateChunk = function() {
          $scope.battles.display_list = _.cat($scope.battles.display_list,
                                              _.first(chunked_list));
          chunked_list = _.rest(chunked_list);
          if(!_.isEmpty(chunked_list)) {
            timeout = $timeout(updateChunk, 200);
          }
          // else {
          //   console.log('updateDisplayList display', $scope.battles.display_list);
          // }
        };
        timeout = $timeout(updateChunk, 200);
      }

      $scope.updateBattles = function() {
        filter.store($scope.battles.filter.state);
        var filtered_list = $scope.battles.filter.active ?
          _.filter($scope.battles.list,
                   _.partial(filter.match,
                             $scope.battles.filter.state,
                             _,
                             $scope.battles.filter.invert,
                             $scope.battles.filter.cache)) :
          $scope.battles.list;
        $scope.battles.sorted_list = battles.sort(filtered_list,
                                                  $scope.sort_types,
                                                  $scope.battles.sort.type,
                                                  $scope.battles.sort.reverse);
        updateDisplayList();
      };
      $scope.setBattles = function(bs, onLoad) {
        $scope.battles.list = battles.normalise(bs);
        $scope.battles.list = battles.buildIndex($scope.battles.list);
        battles.store($scope.battles.list);
        $scope.battles.opponents = opponents.fromBattles($scope.battles.list);
        $scope.battles.events = events.fromBattles($scope.battles.list);
        $scope.battles.tags = tags.fromBattles($scope.battles.list);
        $scope.battles.scenarios = scenarios.fromBattles($scope.battles.list);
        $scope.updateBattles();
        $scope.initParseSync(onLoad);
      };

      $scope.ready = $q.when(scores.data())
        .then(function(_scores) {
          $scope.scores = _scores;
          return $q.when(factions.data());
        }).then(function(_factions) {
          $scope.factions = _factions;
          return $q.when(scenarios.data());
        }).then(function(_scenarios) {
          return $q.when(battles.sortTypes());
        }).then(function(_sorts) {
          $scope.sort_types = _sorts;
          return;
        }).then(function() {
          var bs = battles.init();
          $scope.setBattles(bs, true);
          // $scope.setBattles(battles.test(100,
          //                                $scope.factions,
          //                                $scope.scores,
          //                                scenarios.data()));
          console.log('scope', $scope);
        });

      $scope.parse = {
        channel: pubsub('parse'),
        state: null,
        user: null,
        sync: null,
      };
      $scope.initParseSync = function(onLoad) {
        $scope.parse.state = 'Init Sync';
        $scope.parse.state_class = null;
        $scope.parse.user = null;
        $scope.parse.sync = null;
        parseSync.init()
          .then(function(sync) {
            $scope.parse.sync = sync;
            if(!onLoad) {
              $scope.parse.sync = parseSync.unvalidate($scope.parse.sync);
            }
            $scope.parse.state = 'LogIn Sync';
            $scope.parse.state_class = 'info';
            return parseUser.init();
          })
          .then(function(user) {
            $scope.parse.user = user;
            $scope.parse.channel.publish('login');
          })
          .catch(function(error) {
            $scope.parse.channel.publish('logout');
          });
      };
      $scope.parse.channel.subscribe('login', function() {
        $scope.parse.state = 'Syncing...';
        $scope.parse.state_class = 'info';
        parseLog.sync($scope.parse.user, $scope.parse.sync, $scope.battles.list)
          .then(function(result) {
            var log = result[0];
            var data = result[1];
            console.log('Parse Sync: result: ', log, data);

            $scope.parse.sync = parseSync.validate(log.updatedAt);
            $scope.parse.state = 'Synced';
            $scope.parse.state_class = 'success';
            if(data) {
              $scope.setBattles(data, true);
            }
          })
          .catch(function() {
            $scope.parse.state = 'Sync Failed';
            $scope.parse.state_class = 'danger';
          });
      });
      $scope.parse.channel.subscribe('logout', function() {
        $scope.parse.state = 'Sync Off';
        $scope.parse.state_class = null;
      });

      $scope.doToggleFilterActive = function() {
        $scope.battles.filter.active = !$scope.battles.filter.active;
        console.log('setFilterActive = '+$scope.battles.filter.active);
        $scope.updateBattles();
      };
      $scope.doToggleFilterInvert = function() {
        $scope.battles.filter.invert = !$scope.battles.filter.invert;
        console.log('setFilterInvert = '+$scope.battles.filter.invert);
        $scope.updateBattles();
      };

      $scope.doReload = function() {
        $window.location.reload();
      };
      $scope.scrollTo = function(id) {
        // console.log('scrollTo', id);
        $location.hash(id);
        $anchorScroll();
      };
    }
  ]);
