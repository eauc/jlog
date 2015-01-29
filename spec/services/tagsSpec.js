'use strict';

describe('services', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('tags', function() {

    var tags;
    beforeEach(inject([
      'tags',
      function(_tags) {
        tags = _tags;
      }
    ]));

    describe('fromBattles(<battles>)', function() {
      it('should extract tag list from <battles>', function() {
        expect(tags.fromBattles([
          // sort
          { tags: [ 'tag3', 'tag1' ] },
          { tags: [ 'tag2' ] },
          // uniq
          { tags: [ 'tag1' ] },
          // without null
          { tags: [ null ] },
          // without undefined
          { tags: [] },
          { toto: [ 'tag1' ] },
        ])).toEqual([ 'tag1', 'tag2', 'tag3' ]);
      });
    });

    describe('add(<tag>)', function() {
      beforeEach(function() {
        this.coll = [ 'tag1', 'tag2', 'tag3' ];
      });

      using([
        [ 'tag'   , 'result'                                    ],
        // sort
        [ 'tag11' , [ 'tag1', 'tag11', 'tag2', 'tag3' ] ],
        [ 'tag22' , [ 'tag1', 'tag2', 'tag22', 'tag3' ] ],
        [ 'tag33' , [ 'tag1', 'tag2', 'tag3', 'tag33' ] ],
        // uniq
        [ 'tag2'  , [ 'tag1', 'tag2', 'tag3' ]            ],
        // without null
        [ null      , [ 'tag1', 'tag2', 'tag3' ]            ],
      ], function(e,d) {
        it('should add <tag> to list, '+d, function() {
          expect(tags.add(this.coll, e.tag))
            .toEqual(e.result);
        });
      });
    });

    describe('drop(<tags>)', function() {
      beforeEach(function() {
        this.coll = [ 'tag1', 'tag2', 'tag3' ];
      });

      using([
        [ 'tags'          , 'result'                   ],
        [ ['tag1','tag2'] , [ 'tag3' ]                 ],
        [ ['tag2']        , [ 'tag1', 'tag3' ]         ],
        // not in list
        [ ['tag22']       , [ 'tag1', 'tag2', 'tag3' ] ],
      ], function(e,d) {
        it('should remove <tags> from list, '+d, function() {
          expect(tags.drop(this.coll, e.tags))
            .toEqual(e.result);
        });
      });
    });
  });

});
