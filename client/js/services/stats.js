'use strict';

angular.module('jlogApp.services')
  .service('stats', [
    'statEntryFaction',
    'statEntryCaster',
    'statEntrySimple',
    'statEntryScenario',
    'statEntryInit',
    'statEntryResult',
    'statEntryTimeResult',
    'statEntryPoints',
    'statEntryTag',
    'statSelectorTotal',
    'statSelectorFaction',
    'statSelectorCaster',
    'statSelectorSimple',
    'statSelectorScenario',
    'statSelectorInit',
    'statSelectorResult',
    'statSelectorTag',
    function(
      statEntryFaction,
      statEntryCaster,
      statEntrySimple,
      statEntryScenario,
      statEntryInit,
      statEntryResult,
      statEntryTimeResult,
      statEntryPoints,
      statEntryTag,
      statSelectorTotal,
      statSelectorFaction,
      statSelectorCaster,
      statSelectorSimple,
      statSelectorScenario,
      statSelectorInit,
      statSelectorResult,
      statSelectorTag
    ) {
      var stats = {
        ENTRIES: {
          my_faction: {
            desc: "My Faction",
            reduce: _.partial(statEntryFaction.reduce, _, _, 'my_army.faction')
          },
          my_caster: {
            desc: "My Caster",
            reduce: _.partial(statEntryCaster.reduce, _, _, 'my_army')
          },
          opp_name: {
            desc: "Opp. Name",
            reduce: _.partial(statEntrySimple.reduce, _, _, _.partial(_.getPath, _, 'opponent.name'))
          },
          opp_faction: {
            desc: "Opp Faction",
            reduce: _.partial(statEntryFaction.reduce, _, _, 'opponent.faction')
          },
          opp_caster: {
            desc: "Opp. Caster",
            reduce: _.partial(statEntryCaster.reduce, _, _, 'opponent')
          },
          event: {
            desc: "Event",
            reduce: _.partial(statEntrySimple.reduce, _, _, _.partial(_.getPath, _, 'setup.event'))
          },
          scenario: {
            desc: "Scenario",
            reduce: statEntryScenario.reduce
          },
          size: {
            desc: "Size",
            reduce: _.partial(statEntrySimple.reduce, _, _, function(b) {
              return _.getPath(b, 'setup.size')+'pts';
            })
          },
          initiative: {
            desc: "Initiative",
            reduce: statEntryInit.reduce
          },
          result: {
            desc: "Result",
            reduce: statEntryResult.reduce
          },
          result_time: {
            desc: "Result Over Time",
            reduce: statEntryTimeResult.reduce
          },
          points: {
            desc: "Points",
            reduce: statEntryPoints.reduce
          },
          tag: {
            desc: "Tag",
            reduce: statEntryTag.reduce
          },
        },
        SELECTORS: {
          total: {
            desc: "Total",
            sort: statSelectorTotal.sort
          },
          my_faction: {
            desc: "My Faction",
            sort: _.partial(statSelectorFaction.sort, _, 'my_army.faction')
          },
          my_caster: {
            desc: "My Caster",
            sort: _.partial(statSelectorCaster.sort, _, _, 'my_army')
          },
          opp_name: {
            desc: "Opp. Name",
            sort: _.partial(statSelectorSimple.sort, _, _.partial(_.getPath, _, 'opponent.name'))
          },
          opp_faction: {
            desc: "Opp. Faction",
            sort: _.partial(statSelectorFaction.sort, _, 'opponent.faction')
          },
          opp_caster: {
            desc: "Opp. Caster",
            sort: _.partial(statSelectorCaster.sort, _, _, 'opponent')
          },
          event: {
            desc: "Event",
            sort: _.partial(statSelectorSimple.sort, _, _.partial(_.getPath, _, 'setup.event'))
          },
          scenario: {
            desc: "Scenario",
            sort: statSelectorScenario.sort
          },
          size: {
            desc: "Size",
            sort: _.partial(statSelectorSimple.sort, _, function(b) {
              return _.getPath(b, 'setup.size')+'pts';
            })
          },
          init: {
            desc: "Initiative",
            sort: statSelectorInit.sort
          },
          result: {
            desc: "Result",
            sort: statSelectorResult.sort
          },
          tag: {
            desc: "Tag",
            sort: statSelectorTag.sort
          },
        },
        init: function() {
          statEntryFaction.init();
          statEntryCaster.init();
          statEntryScenario.init();
          statEntryTimeResult.init();

          statSelectorFaction.init();
          statSelectorCaster.init();
          statSelectorScenario.init();
          statSelectorResult.init();
        },
        generate: function(coll, bs, entry, selector, arg) {
          if(!_.has(stats.ENTRIES, entry)) return coll;
          if(!_.has(stats.SELECTORS, selector)) return coll;

          coll = _.clone(coll);
          coll[entry] = coll[entry] || {};
          coll[entry][selector+'.'+arg] = //coll[entry][selector] ||
            _.chain(bs)
            .apply(stats.SELECTORS[selector].sort, arg)
            .mapWith(stats.ENTRIES[entry].reduce)
            .sortBy(_.partial(_.getPath, _, 'title'))
            .value();
          return coll;
        }
      };
      return stats;
    }
  ]);
