'use strict';

describe('services', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('statSelectorTotal', function() {

    var statSelectorTotal;
    beforeEach(inject([
      'statSelectorTotal',
      function(_statSelectorTotal) {
        statSelectorTotal = _statSelectorTotal;
      }
    ]));

    describe('sort(<collection>)', function() {
      beforeEach(function() {
        this.battles = [
          { key: 'cryx' },
          { key: 'loe' },
          { key: 'menoth' },
          { key: 'cryx' },
          { key: 'cryx' },
          { key: 'loe' },
          { key: 'unknown' },
        ];

        this.ret = statSelectorTotal.sort(this.battles);
      });

      it('should just return <collection>', function() {
        expect(this.ret.Total).toBe(this.battles);
      });
    });
  });

  describe('statSelectorFaction', function() {

    var statSelectorFaction;
    beforeEach(inject([
      'statSelectorFaction',
      function(_statSelectorFaction) {
        statSelectorFaction = _statSelectorFaction;
      }
    ]));

    describe('sort(<collection>)', function() {
      beforeEach(inject(function($rootScope, factions) {
        spyOn(factions, 'data').and.returnValue([
          { key: 'cryx', name: 'Cryx', hue: [0,0] },
          { key: 'loe', name: 'Legion of Everblight', hue: [10,0] },
          { key: 'menoth', name: 'The Protectorate of Menoth', hue: [0,10] },
        ]);
        statSelectorFaction.init();
        $rootScope.$digest();

        this.battles = [
          { key: 'cryx', name: 'battle1' },
          { key: 'loe', name: 'battle2' },
          { key: 'menoth', name: 'battle3' },
          { key: 'cryx', name: 'battle4' },
          { key: 'cryx', name: 'battle5' },
          { key: 'loe', name: 'battle6' },
          { key: 'unknown', name: 'battle7' },
        ];

        this.ret = statSelectorFaction.sort(this.battles, 'key');
      }));

      it('should sort <collection> by <key> faction name', function() {
        expect(this.ret).toEqual({
          'Cryx': [ { key : 'cryx', name : 'battle1' },
                    { key : 'cryx', name : 'battle4' },
                    { key : 'cryx', name : 'battle5' } ],
          'Legion of Everblight': [ { key : 'loe', name : 'battle2' },
                                    { key : 'loe', name : 'battle6' } ],
          'The Protectorate of Menoth': [ { key : 'menoth', name : 'battle3' } ],
          'undefined': [ { key : 'unknown', name : 'battle7' } ]
        });
      });
    });
  });

  describe('statSelectorCaster', function() {

    var statSelectorCaster;
    beforeEach(inject([
      'statSelectorCaster',
      function(_statSelectorCaster) {
        statSelectorCaster = _statSelectorCaster;
      }
    ]));

    describe('sort(<collection>)', function() {
      beforeEach(inject(function($rootScope, factions) {
        spyOn(factions, 'data').and.returnValue([
          { key: 'cryx', name: 'Cryx', hue: [0,0],
            casters: [ { key: 'coven1', name: 'Witch Coven' } ] },
          { key: 'loe', name: 'Legion of Everblight', hue: [10,0],
            casters: [ { key: 'saeryn1', name: 'Saeryn, Omen of Everblight' },
                       { key: 'vayl1', name: 'Vayl, Disciple of Everblight' } ] },
          { key: 'menoth', name: 'The Protectorate of Menoth', hue: [0,10],
            casters: [ { key: 'feora1', name: 'Feora the Flame' } ] },
        ]);
        statSelectorCaster.init();
        $rootScope.$digest();

        this.battles = [
          { key: { faction: 'cryx', caster: 'coven1' }, name: 'battle1' },
          { key: { faction: 'loe', caster: 'saeryn1' }, name: 'battle2' },
          { key: { faction: 'menoth', caster: 'feora1' }, name: 'battle3' },
          { key: { faction: 'cryx', caster: 'coven1' }, name: 'battle4' },
          { key: { faction: 'cryx', caster: null }, name: 'battle5' },
          { key: { faction: 'loe', caster: 'vayl1' }, name: 'battle6' },
          { key: { faction: 'unknown', caster: 'toto1' }, name: 'battle7' },
        ];
      }));

      it('should sort <collection> by <key> caster name', function() {
        this.ret = statSelectorCaster.sort(this.battles, 'cryx', 'key');
        expect(this.ret).toEqual({
          'Witch Coven': [ { key : { faction : 'cryx', caster : 'coven1' }, name : 'battle1' },
                           { key : { faction : 'cryx', caster : 'coven1' }, name : 'battle4' } ],
          'undefined': [ { key : { faction : 'cryx', caster : null }, name : 'battle5' } ]
        });

        this.ret = statSelectorCaster.sort(this.battles, 'loe', 'key');
        expect(this.ret).toEqual({
          'Saeryn, Omen of Everblight': [ { key : { faction : 'loe', caster : 'saeryn1' },
                                            name : 'battle2' } ],
          'Vayl, Disciple of Everblight': [ { key : { faction : 'loe', caster : 'vayl1' },
                                              name : 'battle6' } ]
        });

        this.ret = statSelectorCaster.sort(this.battles, 'menoth', 'key');
        expect(this.ret).toEqual({
          'Feora the Flame': [ { key : { faction : 'menoth', caster : 'feora1' },
                                 name : 'battle3' } ]
        });
      });
    });
  });

  describe('statSelectorSimple', function() {

    var statSelectorSimple;
    beforeEach(inject([
      'statSelectorSimple',
      function(_statSelectorSimple) {
        statSelectorSimple = _statSelectorSimple;
      }
    ]));

    describe('sort(<collection>)', function() {
      beforeEach(function() {
        this.battles = [
          { key: 'value1', name: 'battle1' },
          { key: 'value2', name: 'battle2' },
          { key: 'value3', name: 'battle3' },
          { key: 'value1', name: 'battle4' },
          { key: 'value1', name: 'battle5' },
          { key: 'value2', name: 'battle6' },
          { key: null, name: 'battle7' },
        ];

        this.ret = statSelectorSimple.sort(this.battles, _.partial(_.getPath, _, 'key'));
      });

      it('should sort <collection> by <key> value', function() {
        expect(this.ret).toEqual({
          'Value1': [ { key : 'value1', name : 'battle1' },
                      { key : 'value1', name : 'battle4' },
                      { key : 'value1', name : 'battle5' } ],
          'Value2': [ { key : 'value2', name : 'battle2' },
                      { key : 'value2', name : 'battle6' } ],
          'Value3': [ { key : 'value3', name : 'battle3' } ],
          'Null' : [ { key : null, name : 'battle7' } ]
        });
      });
    });
  });

  describe('statSelectorScenario', function() {

    var statSelectorScenario;
    beforeEach(inject([
      'statSelectorScenario',
      function(_statSelectorScenario) {
        statSelectorScenario = _statSelectorScenario;
      }
    ]));

    describe('sort(<collection>)', function() {
      beforeEach(inject(function($rootScope, scenarios) {
        spyOn(scenarios, 'data').and.returnValue([
          { key: 'sr15inco', name: 'SR2015 Incoming' },
          { key: 'sr15breach', name: 'SR2015 Into the Breach' },
          { key: 'custom', name: 'custom' },
        ]);
        statSelectorScenario.init();
        $rootScope.$digest();

        this.battles = [
          { setup: { scenario: 'sr15inco' }, name : 'battle1' },
          { setup: { scenario: 'sr15breach' }, name : 'battle2' },
          { setup: { scenario: 'sr15inco' }, name : 'battle3' },
          { setup: { scenario: 'sr15breach' }, name : 'battle4' },
          { setup: { scenario: null }, name : 'battle5' },
          { setup: { scenario: 'custom' }, name : 'battle6' },
          { setup: { scenario: 'unknown' }, name : 'battle7' },
        ];

        this.ret = statSelectorScenario.sort(this.battles);
      }));

      it('should sort <collection> by setup scenario name', function() {
        expect(this.ret).toEqual({
          'SR2015 Incoming': [ { setup : { scenario : 'sr15inco' }, name : 'battle1' },
                               { setup : { scenario : 'sr15inco' }, name : 'battle3' } ],
          'SR2015 Into the Breach': [ { setup : { scenario : 'sr15breach' }, name : 'battle2' },
                                      { setup : { scenario : 'sr15breach' }, name : 'battle4' } ],
          'undefined': [ { setup : { scenario : 'unknown' }, name : 'battle7' } ],
          'custom': [ { setup : { scenario : 'custom' }, name : 'battle6' } ]
        });
      });
    });
  });

  describe('statSelectorInit', function() {

    var statSelectorInit;
    beforeEach(inject([
      'statSelectorInit',
      function(_statSelectorInit) {
        statSelectorInit = _statSelectorInit;
      }
    ]));

    describe('sort(<collection>)', function() {
      beforeEach(function() {
        this.battles = [
          { setup: { initiative: { won_roll: 'true', started: 'true' } }, name: 'battle1' },
          { setup: { initiative: { won_roll: 'false', started: 'true' } }, name: 'battle2' },
          { setup: { initiative: { won_roll: 'true', started: 'false' } }, name: 'battle3' },
          { setup: { initiative: { won_roll: 'false', started: 'false' } }, name: 'battle4' },
          { setup: { initiative: { won_roll: 'true', started: 'true' } }, name: 'battle5' },
          { setup: { initiative: { won_roll: 'false', started: 'true' } }, name: 'battle6' },
          // ignored for stats
          { setup: { initiative: { won_roll: 'true', started: null } }, name: 'battle7' },
          { setup: { initiative: { won_roll: null, started: 'true' } }, name: 'battle8' },
        ];

        this.ret = statSelectorInit.sort(this.battles);
      });

      it('should sort <collection> by initiative', function() {
        expect(this.ret).toEqual({
          'Won Roll, Started Game': [ { setup : { initiative : { won_roll : 'true',
                                                                 started : 'true' } },
                                        name : 'battle1' },
                                      { setup : { initiative : { won_roll : 'true',
                                                                 started : 'true' } },
                                        name : 'battle5' } ],
          'Lost Roll, Started Game': [ { setup : { initiative : { won_roll : 'false',
                                                                  started : 'true' } },
                                         name : 'battle2' },
                                       { setup : { initiative : { won_roll : 'false',
                                                                  started : 'true' } },
                                         name : 'battle6' } ],
          'Won Roll, Chose Side' : [ { setup : { initiative : { won_roll : 'true',
                                                                started : 'false' } },
                                       name : 'battle3' } ],
          'Lost Roll, Chose Side': [ { setup : { initiative : { won_roll : 'false',
                                                                started : 'false' } },
                                       name : 'battle4' } ]
        });
      });
    });
  });

  describe('statSelectorResult', function() {

    var statSelectorResult;
    beforeEach(inject([
      'statSelectorResult',
      function(_statSelectorResult) {
        statSelectorResult = _statSelectorResult;
      }
    ]));

    describe('sort(<collection>)', function() {
      beforeEach(inject(function($rootScope, scores) {
        spyOn(scores, 'data').and.returnValue({
          "va": { "result": "victory", "type": "assassination", "letter": "A", "class": "success" },
          "vc": { "result": "victory", "type": "clock", "letter": "C", "class": "success" },
          "vs": { "result": "victory", "type": "scenario", "letter": "S", "class": "success" },
          "vt": { "result": "victory", "type": "tiebreaker", "letter": "T", "class": "success" },
          "dd": { "result": "draw", "type": "dice down", "letter": "D", "class": "warning" },
          "da": { "result": "defeat", "type": "assassination", "letter": "A", "class": "danger" },
          "dc": { "result": "defeat", "type": "clock", "letter": "C", "class": "danger" },
          "ds": { "result": "defeat", "type": "scenario", "letter": "S", "class": "danger" },
          "dt": { "result": "defeat", "type": "tiebreaker", "letter": "T", "class": "danger" }
        });
        statSelectorResult.init();
        $rootScope.$digest();

        this.battles = [
          { score: 'va', name : 'battle1' }, { score: 'vs', name : 'battle2' },
          { score: 'vc', name : 'battle3' }, { score: 'vt', name : 'battle4' },
          { score: 'dd', name : 'battle5' },
          { score: 'da', name : 'battle6' }, { score: 'ds', name : 'battle7' },
          { score: 'dc', name : 'battle8' }, { score: 'dt', name : 'battle9' },
          { score: 'va', name : 'battle10' }, { score: 'dd', name : 'battle11' },
          { score: 'dc', name : 'battle12' }, { score: 'vt', name : 'battle13' },
          // ignored for stats
          { score: 'toto', name : 'battle14' },
          { score: null, name : 'battle15' },
        ];

        this.ret = statSelectorResult.sort(this.battles);
      }));

      it('should sort <collection> by score', function() {
        expect(this.ret).toEqual({
          'Victory Assassination': [ { score : 'va', name : 'battle1' },
                                     { score : 'va', name : 'battle10' } ],
          'Victory Scenario': [ { score : 'vs', name : 'battle2' } ],
          'Victory Clock': [ { score : 'vc', name : 'battle3' } ],
          'Victory Tiebreaker': [ { score : 'vt', name : 'battle4' },
                                  { score : 'vt', name : 'battle13' } ],
          'Draw Dice down': [ { score : 'dd', name : 'battle5' },
                              { score : 'dd', name : 'battle11' } ],
          'Defeat Assassination': [ { score : 'da', name : 'battle6' } ],
          'Defeat Scenario': [ { score : 'ds', name : 'battle7' } ],
          'Defeat Clock': [ { score : 'dc', name : 'battle8' },
                            { score : 'dc', name : 'battle12' } ],
          'Defeat Tiebreaker': [ { score : 'dt', name : 'battle9' } ],
        });
      });
    });
  });

  describe('statSelectorTag', function() {

    var statSelectorTag;
    beforeEach(inject([
      'statSelectorTag',
      function(_statSelectorTag) {
        statSelectorTag = _statSelectorTag;
      }
    ]));

    describe('sort(<collection>)', function() {
      beforeEach(function() {
        this.battles = [
          { tags: ['tag1', 'tag2'], name : 'battle1' },
          { tags: ['tag3'], name : 'battle2' },
          { tags: ['tag1', 'tag2'], name : 'battle3' },
          { tags: ['tag1'], name : 'battle4' },
          { tags: ['tag2'], name : 'battle5' },
          { tags: [], name : 'battle6' },
          { tags: ['tag1'], name : 'battle7' },
        ];

        this.ret = statSelectorTag.sort(this.battles);
      });

      it('should sort <collection> by tag', function() {
        expect(this.ret).toEqual({
          'Tag1': [ { tags : [ 'tag1', 'tag2' ], name : 'battle1' },
                    { tags : [ 'tag1', 'tag2' ], name : 'battle3' },
                    { tags : [ 'tag1' ], name : 'battle4' },
                    { tags : [ 'tag1' ], name : 'battle7' } ],
          'Tag2': [ { tags : [ 'tag1', 'tag2' ], name : 'battle1' },
                    { tags : [ 'tag1', 'tag2' ], name : 'battle3' },
                    { tags : [ 'tag2' ], name : 'battle5' } ],
          'Tag3': [ { tags : [ 'tag3' ], name : 'battle2' } ]
        });
      });
    });
  });

});
