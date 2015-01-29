'use strict';

describe('services', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('battle', function() {

    var battle;
    beforeEach(inject([
      'battle',
      function(_battle) {
        battle = _battle;
      }
    ]));

    describe('create(<data>)', function() {
      it('should extend data with default battle fields', function() {
        expect(battle.create({
          index: 42,
          date: { year: 2013,
                  month: 27,
                  day: 1
                },
          points: {
            my_army: { scenario: 42,
                       army: 75,
                       kill: 31 },
          },
        })).toEqual({
          index: 42,
          date: { year: 2013,
                  month: 27,
                  day: 1
                },
          my_army: { faction: null,
                     caster: null
                   },
          opponent: { name: null,
                      faction: null,
                      caster: null
                    },
          setup: { size: null,
                   scenario: null,
                   event: null,
                   initiative: {
                     won_roll: null,
                     started: null
                   } },
          score: null,
          points: {
            my_army: { scenario: 42,
                       army: 75,
                       kill: 31 },
            opponent: { scenario: null,
                        army: null,
                        kill: null }
          },
          tags: [],
          comment: null
        });
      });
    });

    describe('addTag(<new_tag>)', function() {
      beforeEach(function() {
        this.battle = {
          tags: [ 'current1', 'tag1' ]
        };
      });

      using([
        [ 'new_tag' , 'tags'                         ],
        [ 'new1'    , [ 'current1', 'new1', 'tag1' ] ],
        // result is sorted
        [ 'aaa1'    , [ 'aaa1', 'current1', 'tag1' ] ],
        [ 'xxx1'    , [ 'current1', 'tag1', 'xxx1' ] ],
        // uniq
        [ 'current1', [ 'current1', 'tag1' ]         ],
      ], function(e,d) {
        it('should append <new_tag> to battle tags, '+d, function() {
          expect(battle.addTag(this.battle, e.new_tag).tags)
            .toEqual(e.tags);
        });
      });
    });

    describe('initRollDescFor', function() {
      using([
        [ 'won_roll' , 'desc'      ],
        [ 'true'     , 'Won Roll'  ],
        [ 'false'    , 'Lost Roll' ],
      ], function(e, d) {
        it('should describe whether player won the start roll, '+d, function() {
          expect(battle.initRollDescFor({
            setup: { initiative: { won_roll: e.won_roll } }
          })).toBe(e.desc);
        });
      });
    });

    describe('initStartDescFor', function() {
      using([
        [ 'started' , 'desc'         ],
        [ 'true'    , 'Started Game' ],
        [ 'false'   , 'Chose Side'   ],
      ], function(e, d) {
        it('should describe whether player started game, '+d, function() {
          expect(battle.initStartDescFor({
            setup: { initiative: { started: e.started } }
          })).toBe(e.desc);
        });
      });
    });
  });

});
