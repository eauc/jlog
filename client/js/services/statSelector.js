'use strict';

angular.module('jlogApp.services')
  .service('statSelectorMyCaster', [
    function() {
      return function(battles, entryFactory) {
        var collection = { all: entryFactory(), factions: {} };
        _.each(battles, function(battle) {
          var faction = battle.my_army.faction;
          var caster = battle.my_army.caster;
          if(undefined === collection.factions[faction]) {
            collection.factions[faction] = {
              all: entryFactory(),
              casters: {}
            };
          }
          if(undefined === collection.factions[faction].casters[caster]) {
            collection.factions[faction].casters[caster] = entryFactory();
          }
          collection.all.addBattle(battle);
          collection.factions[faction].all.addBattle(battle);
          collection.factions[faction].casters[caster].addBattle(battle);
        });
        return collection;
      };
    }
  ])
  .service('statSelectorOppName', [
    function() {
      return function(battles, entryFactory) {
        var collection = { all: entryFactory(), names: {} };
        _.each(battles, function(battle) {
          var name = battle.opponent.name;
          if(undefined === collection.names[name]) {
            collection.names[name] = entryFactory();
          }
          collection.all.addBattle(battle);
          collection.names[name].addBattle(battle);
        });
        return collection;
      };
    }
  ])
  .service('statSelectorOppCaster', [
    function() {
      return function(battles, entryFactory) {
        var collection = { all: entryFactory(), factions: {} };
        _.each(battles, function(battle) {
          var faction = battle.opponent.faction;
          var caster = battle.opponent.caster;
          if(undefined === collection.factions[faction]) {
            collection.factions[faction] = {
              all: entryFactory(),
              casters: {}
            };
          }
          if(undefined === collection.factions[faction].casters[caster]) {
            collection.factions[faction].casters[caster] = entryFactory();
          }
          collection.all.addBattle(battle);
          collection.factions[faction].all.addBattle(battle);
          collection.factions[faction].casters[caster].addBattle(battle);
        });
        return collection;
      };
    }
  ])
  .service('statSelectorEvent', [
    function() {
      return function(battles, entryFactory) {
        var collection = { all: entryFactory(), events: {} };
        _.each(battles, function(battle) {
          var event = battle.setup.event;
          if(undefined === collection.events[event]) {
            collection.events[event] = entryFactory();
          }
          collection.all.addBattle(battle);
          collection.events[event].addBattle(battle);
        });
        return collection;
      };
    }
  ])
  .service('statSelectorScenario', [
    function() {
      return function(battles, entryFactory) {
        var collection = { all: entryFactory(), scenarios: {} };
        _.each(battles, function(battle) {
          var scenario = battle.setup.scenario;
          if(undefined === collection.scenarios[scenario]) {
            collection.scenarios[scenario] = entryFactory();
          }
          collection.all.addBattle(battle);
          collection.scenarios[scenario].addBattle(battle);
        });
        return collection;
      };
    }
  ])
  .service('statSelectorSize', [
    function() {
      return function(battles, entryFactory) {
        var collection = { all: entryFactory(), sizes: {} };
        _.each(battles, function(battle) {
          var size = battle.setup.size + 'pts';
          if(undefined === collection.sizes[size]) {
            collection.sizes[size] = entryFactory();
          }
          collection.all.addBattle(battle);
          collection.sizes[size].addBattle(battle);
        });
        return collection;
      };
    }
  ])
  .service('statSelectorInit', [
    function() {
      return function(battles, entryFactory) {
        var collection = {
          all: entryFactory(),
          rw: entryFactory(),
          rl: entryFactory(),
          pf: entryFactory(),
          ps: entryFactory()
        };
        _.each(battles, function(battle) {
          collection.all.addBattle(battle);
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
        var collection = { all: entryFactory(), results: {} };
        _.each(battles, function(battle) {
          var score = battle.score;
          if(undefined === collection.results[score]) {
            collection.results[score] = entryFactory();
          }
          collection.all.addBattle(battle);
          collection.results[score].addBattle(battle);
        });
        return collection;
      };
    }
  ])
  .service('statSelectorTag', [
    function() {
      return function(battles, entryFactory) {
        var collection = { all: entryFactory(), tags: {} };
        _.each(battles, function(battle) {
          _.each(battle.tags, function(tag) {
            if(undefined === collection.tags[tag]) {
              collection.tags[tag] = entryFactory();
            }
            collection.tags[tag].addBattle(battle);
          });
          collection.all.addBattle(battle);
        });
        return collection;
      };
    }
  ]);
