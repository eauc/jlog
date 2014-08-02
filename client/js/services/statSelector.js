'use strict';

angular.module('jlogApp.services')
  .service('statSelectorMyCaster', [
    function() {
      return function(battles, entryFactory) {
        var collection = {};
        _.each(battles, function(battle) {
          var faction = battle.my_army.faction;
          var caster = battle.my_army.caster;
          if(undefined === collection[faction]) {
            collection[faction] = {
              all: entryFactory(),
              casters: {}
            };
          }
          if(undefined === collection[faction].casters[caster]) {
            collection[faction].casters[caster] = entryFactory();
          }
          collection[faction].all.addBattle(battle);
          collection[faction].casters[caster].addBattle(battle);
        });
        return collection;
      };
    }
  ])
  .service('statSelectorOppName', [
    function() {
      return function(battles, entryFactory) {
        var collection = {};
        _.each(battles, function(battle) {
          var name = battle.opponent.name;
          if(undefined === collection[name]) {
            collection[name] = entryFactory();
          }
          collection[name].addBattle(battle);
        });
        return collection;
      };
    }
  ])
  .service('statSelectorOppCaster', [
    function() {
      return function(battles, entryFactory) {
        var collection = {};
        _.each(battles, function(battle) {
          var faction = battle.opponent.faction;
          var caster = battle.opponent.caster;
          if(undefined === collection[faction]) {
            collection[faction] = {
              all: entryFactory(),
              casters: {}
            };
          }
          if(undefined === collection[faction].casters[caster]) {
            collection[faction].casters[caster] = entryFactory();
          }
          collection[faction].all.addBattle(battle);
          collection[faction].casters[caster].addBattle(battle);
        });
        return collection;
      };
    }
  ])
  .service('statSelectorEvent', [
    function() {
      return function(battles, entryFactory) {
        var collection = {};
        _.each(battles, function(battle) {
          var event = battle.setup.event;
          if(undefined === collection[event]) {
            collection[event] = entryFactory();
          }
          collection[event].addBattle(battle);
        });
        return collection;
      };
    }
  ])
  .service('statSelectorScenario', [
    function() {
      return function(battles, entryFactory) {
        var collection = {};
        _.each(battles, function(battle) {
          var scenario = battle.setup.scenario;
          if(undefined === collection[scenario]) {
            collection[scenario] = entryFactory();
          }
          collection[scenario].addBattle(battle);
        });
        return collection;
      };
    }
  ])
  .service('statSelectorSize', [
    function() {
      return function(battles, entryFactory) {
        var collection = {};
        _.each(battles, function(battle) {
          var size = battle.setup.size + 'pts';
          if(undefined === collection[size]) {
            collection[size] = entryFactory();
          }
          collection[size].addBattle(battle);
        });
        return collection;
      };
    }
  ])
  .service('statSelectorInit', [
    function() {
      return function(battles, entryFactory) {
        var collection = {
          rw: entryFactory(),
          rl: entryFactory(),
          pf: entryFactory(),
          ps: entryFactory()
        };
        _.each(battles, function(battle) {
          if('true' === battle.setup.initiative.won_roll) collection.rw.addBattle(battle);
          if('false' === battle.setup.initiative.won_roll) collection.rl.addBattle(battle);
          if('true' === battle.setup.initiative.started) collection.pf.addBattle(battle);
          if('false' === battle.setup.initiative.started) collection.ps.addBattle(battle);
        });
        return collection;
      };
    }
  ])
  .service('statSelectorResult', [
    function() {
      return function(battles, entryFactory) {
        var collection = {};
        _.each(battles, function(battle) {
          var score = battle.score;
          if(undefined === collection[score]) {
            collection[score] = entryFactory();
          }
          collection[score].addBattle(battle);
        });
        return collection;
      };
    }
  ])
  .service('statSelectorTag', [
    function() {
      return function(battles, entryFactory) {
        var collection = {};
        _.each(battles, function(battle) {
          _.each(battle.tags, function(tag) {
            if(undefined === collection[tag]) {
              collection[tag] = entryFactory();
            }
            collection[tag].addBattle(battle);
          });
        });
        return collection;
      };
    }
  ]);
