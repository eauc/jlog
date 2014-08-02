'use strict';

angular.module('jlogApp.services')
  .service('statEntryMyCaster', [
    function() {
      var factory = function() {
        var instance = {};
        instance.addBattle = function(battle) {
          var key = battle.my_army.faction+'|'+battle.my_army.caster;
          instance[key] = instance[key] || 0;
          instance[key]++;
        };
        return instance;
      };
      return factory;
    }
  ])
  .service('statEntryOppName', [
    function() {
      var factory = function() {
        var instance = {};
        instance.addBattle = function(battle) {
          var key = battle.opponent.name;
          instance[key] = instance[key] || 0;
          instance[key]++;
        };
        return instance;
      };
      return factory;
    }
  ])
  .service('statEntryOppCaster', [
    function() {
      var factory = function() {
        var instance = {};
        instance.addBattle = function(battle) {
          var key = battle.opponent.faction;//+'|'+battle.opponent.caster;
          instance[key] = instance[key] || 0;
          instance[key]++;
        };
        return instance;
      };
      return factory;
    }
  ])
  .service('statEntryEvent', [
    function() {
      var factory = function() {
        var instance = {};
        instance.addBattle = function(battle) {
          var key = battle.setup.event;
          instance[key] = instance[key] || 0;
          instance[key]++;
        };
        return instance;
      };
      return factory;
    }
  ])
  .service('statEntryEvent', [
    function() {
      var factory = function() {
        var instance = {};
        instance.addBattle = function(battle) {
          var key = battle.setup.event;
          instance[key] = instance[key] || 0;
          instance[key]++;
        };
        return instance;
      };
      return factory;
    }
  ])
  .service('statEntryScenario', [
    function() {
      var factory = function() {
        var instance = {};
        instance.addBattle = function(battle) {
          var key = battle.setup.scenario;
          instance[key] = instance[key] || 0;
          instance[key]++;
        };
        return instance;
      };
      return factory;
    }
  ])
  .service('statEntrySize', [
    function() {
      var factory = function() {
        var instance = {};
        instance.addBattle = function(battle) {
          var key = battle.setup.size;
          instance[key] = instance[key] || 0;
          instance[key]++;
        };
        return instance;
      };
      return factory;
    }
  ])
  .service('statEntryInit', [
    function() {
      var factory = function() {
        var instance = { rw:0, rl:0, pf:0, ps:0 };
        instance.addBattle = function(battle) {
          if('true' === battle.setup.initiative.won_roll) instance.rw++;
          if('false' === battle.setup.initiative.won_roll) instance.rl++;
          if('true' === battle.setup.initiative.started) instance.pf++;
          if('false' === battle.setup.initiative.started) instance.ps++;
        };
        return instance;
      };
      factory.legend = function(entry) {
        return {
          rw: "Won Roll",
          rl: "Lost Roll",
          pf: "First Player",
          ps: "Second Player"
        };
      };
      factory.colors = function(entry) {
        return [ '#0C0',
                 '#C00',
                 '#06C',
                 '#048' ];
      };
      return factory;
    }
  ])
  .service('statEntryResult', [
    function() {
      var factory = function() {
        var instance = { va:0, vc:0, vs:0, vt:0, dd:0, da:0, dc:0, ds:0, dt:0 };
        instance.addBattle = function(battle) {
          instance[battle.score]++;
        };
        return instance;
      };
      factory.legend = function(entry) {
        return {
          va: "Assassination Victory",
          vc: "Clock Victory",
          vs: "Scenario Victory",
          vt: "Tiebreakers Victory",
          dd: "Dice Down Draw",
          da: "Assassination Defeat",
          dc: "Clock Defeat",
          ds: "Scenario Defeat",
          dt: "Tiebreakers Defeat"
        };
      };
      factory.colors = function(entry) {
        return [ '#0C0',
                 '#0A0',
                 '#080',
                 '#060',
                 '#CC0',
                 '#C00',
                 '#A00',
                 '#800',
                 '#600' ];
      };
      return factory;
    }
  ])
  .service('statEntryPointScenario', [
    function() {
      var factory = function() {
        var instance = { my_army:0, opponent:0 };
        instance.addBattle = function(battle) {
          if(_.isNumber(battle.points.my_army.scenario) &&
             _.isNumber(battle.points.opponent.scenario)) {
            instance.my_army += battle.points.my_army.scenario;
            instance.opponent += battle.points.opponent.scenario;
          }
        };
        return instance;
      };
      return factory;
    }
  ])
  .service('statEntryPointArmy', [
    function() {
      var factory = function() {
        var instance = { my_army:0, opponent:0 };
        instance.addBattle = function(battle) {
          if(_.isNumber(battle.points.my_army.army) &&
             _.isNumber(battle.points.opponent.army)) {
            instance.my_army += battle.points.my_army.army;
            instance.opponent += battle.points.opponent.army;
          }
        };
        return instance;
      };
      return factory;
    }
  ])
  .service('statEntryPointKill', [
    function() {
      var factory = function() {
        var instance = { my_army:0, opponent:0 };
        instance.addBattle = function(battle) {
          if(_.isNumber(battle.points.my_army.kill) &&
             _.isNumber(battle.points.opponent.kill)) {
            instance.my_army += battle.points.my_army.kill;
            instance.opponent += battle.points.opponent.kill;
          }
        };
        return instance;
      };
      return factory;
    }
  ])
  .service('statEntryTag', [
    function() {
      var factory = function() {
        var instance = {};
        instance.addBattle = function(battle) {
          _.each(battle.tags, function(key) {
            instance[key] = instance[key] || 0;
            instance[key]++;
          });
        };
        return instance;
      };
      return factory;
    }
  ]);
