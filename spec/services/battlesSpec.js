'use strict';

describe('services', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('battles', function() {

    var battles;
    beforeEach(inject([
      'battles',
      function(_battles) {
        battles = _battles;
      }
    ]));

    describe('drop(<index>)', function() {
      it('should drop <index> from list', function() {
        expect(battles.drop(['battle1','battle2','battle3'], 1))
          .toEqual(['battle1','battle3']);
      });
    });

    describe('save(<index>, <battle>)', function() {
      beforeEach(function() {
        this.coll = ['battle1','battle2','battle3'];
      });

      using([
        [ 'index' , 'result'                                      ],
        [ 0       , ['new_battle','battle2','battle3']            ],
        [ 1       , ['battle1','new_battle','battle3']            ],
        // index === list length
        [ 3       , ['battle1','battle2','battle3', 'new_battle'] ],
        // index > list length
        [ 4       , ['battle1','battle2','battle3', 'new_battle'] ],
        // index < 0
        [ -1       , ['battle1','battle2','new_battle']           ],
        [ -2       , ['battle1','new_battle','battle3']           ],
      ], function(e, d) {
        it('should insert <battle> into list at <index>, '+d, function() {
          expect(battles.save(this.coll, e.index, 'new_battle'))
            .toEqual(e.result);
        });
      });
    });
  });

});
