'use strict';

angular.module('jlogApp.services')
  .service('stats', [
    'statEntryMyCaster',
    'statEntryOppName',
    'statEntryOppCaster',
    'statEntryEvent',
    'statEntryScenario',
    'statEntrySize',
    'statEntryInit',
    'statEntryResult',
    'statEntryPointScenario',
    'statEntryPointArmy',
    'statEntryPointKill',
    'statEntryTag',
    'statSelectorMyCaster',
    'statSelectorOppName',
    'statSelectorOppCaster',
    'statSelectorEvent',
    'statSelectorScenario',
    'statSelectorSize',
    'statSelectorInit',
    'statSelectorResult',
    'statSelectorTag',
    'battles_display',
    function(statEntryMyCaster,
             statEntryOppName,
             statEntryOppCaster,
             statEntryEvent,
             statEntryScenario,
             statEntrySize,
             statEntryInit,
             statEntryResult,
             statEntryPointScenario,
             statEntryPointArmy,
             statEntryPointKill,
             statEntryTag,
             statSelectorMyCaster,
             statSelectorOppName,
             statSelectorOppCaster,
             statSelectorEvent,
             statSelectorScenario,
             statSelectorSize,
             statSelectorInit,
             statSelectorResult,
             statSelectorTag,
             battles_display) {
      function total(battles, entryFactory) {
        var entry = entryFactory();
        _.each(battles, function(battle) {
          entry.addBattle(battle);
        });
        return entry;
      }
      return {
        ENTRIES: {
          my_caster: {
            desc: "My Caster",
            factory: statEntryMyCaster
          },
          opp_name: {
            desc: "Opp. Name",
            factory: statEntryOppName
          },
          opp_caster: {
            desc: "Opp. Caster",
            factory: statEntryOppCaster
          },
          event: {
            desc: "Event",
            factory: statEntryEvent
          },
          scenario: {
            desc: "Scenario",
            factory: statEntryScenario
          },
          size: {
            desc: "Size",
            factory: statEntrySize
          },
          initiative: {
            desc: "Initiative",
            factory: statEntryInit
          },
          result: {
            desc: "Result",
            factory: statEntryResult
          },
          point_scenario: {
            desc: "Scenario Points",
            factory: statEntryPointScenario
          },
          point_army: {
            desc: "Army Points",
            factory: statEntryPointArmy
          },
          point_Kill: {
            desc: "Kill Points",
            factory: statEntryPointKill
          },
          tag: {
            desc: "Tag",
            factory: statEntryTag
          },
        },
        SELECTORS: {
          my_caster: {
            desc: "My Caster",
            factory: statSelectorMyCaster
          },
          opp_name: {
            desc: "Opp. Name",
            factory: statSelectorOppName
          },
          opp_caster: {
            desc: "Opp. Caster",
            factory: statSelectorOppCaster
          },
          event: {
            desc: "Event",
            factory: statSelectorEvent
          },
          scenario: {
            desc: "Scenario",
            factory: statSelectorScenario
          },
          size: {
            desc: "Size",
            factory: statSelectorSize
          },
          init: {
            desc: "Initiative",
            factory: statSelectorInit
          },
          result: {
            desc: "Result",
            factory: statSelectorResult
          },
          tag: {
            desc: "Tag",
            factory: statSelectorTag
          },
        },
        collections: {},
        legends: {},
        colors: {},
        generate: function(entry, selector) {
          if(!_.has(this.ENTRIES, entry)) return;
          if(!_.has(this.SELECTORS, selector)) return;

          this.collections[entry] = this.collections[entry] || {};

          this.collections[entry].all = this.collections[entry].all ||
            total(battles_display.sorted_list,
                  this.ENTRIES[entry].factory);

          this.collections[entry][selector] = this.collections[entry][selector] ||
            this.SELECTORS[selector].factory(battles_display.sorted_list,
                                             this.ENTRIES[entry].factory);

          console.log(this.collections);
        }
      };
    }
  ]);
