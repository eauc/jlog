'use strict';

describe('services', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('opponents', function() {

    var opponents;
    beforeEach(inject([
      'opponents',
      function(_opponents) {
        opponents = _opponents;
      }
    ]));

    describe('fromBattles(<battles>)', function() {
      it('should extract opponent list from <battles>', function() {
        expect(opponents.fromBattles([
          // sort
          { opponent: { name: 'opponent3' } },
          { opponent: { name: 'opponent1' } },
          { opponent: { name: 'opponent2' } },
          // uniq
          { opponent: { name: 'opponent1' } },
          // without null
          { opponent: { name: null } },
          // without undefined
          { opponent: { titi: 'opponent1' } },
          { toto: 'opponent1' },
        ])).toEqual([ 'opponent1', 'opponent2', 'opponent3' ]);
      });
    });

    describe('add(<opponent>)', function() {
      beforeEach(function() {
        this.coll = [ 'opponent1', 'opponent2', 'opponent3' ];
      });

      using([
        [ 'opponent'   , 'result'                                    ],
        // sort
        [ 'opponent11' , [ 'opponent1', 'opponent11', 'opponent2', 'opponent3' ] ],
        [ 'opponent22' , [ 'opponent1', 'opponent2', 'opponent22', 'opponent3' ] ],
        [ 'opponent33' , [ 'opponent1', 'opponent2', 'opponent3', 'opponent33' ] ],
        // uniq
        [ 'opponent2'  , [ 'opponent1', 'opponent2', 'opponent3' ]            ],
        // without null
        [ null      , [ 'opponent1', 'opponent2', 'opponent3' ]            ],
      ], function(e,d) {
        it('should add <opponent> to list, '+d, function() {
          expect(opponents.add(this.coll, e.opponent))
            .toEqual(e.result);
        });
      });
    });

    describe('drop(<opponent>)', function() {
      beforeEach(function() {
        this.coll = [ 'opponent1', 'opponent2', 'opponent3' ];
      });

      using([
        [ 'opponent'   , 'result'                         ],
        // sort
        [ 'opponent1'  , [ 'opponent2', 'opponent3' ]           ],
        [ 'opponent2'  , [ 'opponent1', 'opponent3' ]           ],
        // not in list
        [ 'opponent22' , [ 'opponent1', 'opponent2', 'opponent3' ] ],
      ], function(e,d) {
        it('should remove <opponent> from list, '+d, function() {
          expect(opponents.drop(this.coll, e.opponent))
            .toEqual(e.result);
        });
      });
    });
  });

});
