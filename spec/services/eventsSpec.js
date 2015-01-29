'use strict';

describe('services', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('events', function() {

    var events;
    beforeEach(inject([
      'events',
      function(_events) {
        events = _events;
      }
    ]));

    describe('fromBattles(<battles>)', function() {
      it('should extract event list from <battles>', function() {
        expect(events.fromBattles([
          // sort
          { setup: { event: 'event3' } },
          { setup: { event: 'event1' } },
          { setup: { event: 'event2' } },
          // uniq
          { setup: { event: 'event1' } },
          // without null
          { setup: { event: null } },
          // without undefined
          { setup: { titi: 'event1' } },
          { toto: 'event1' },
        ])).toEqual([ 'event1', 'event2', 'event3' ]);
      });
    });

    describe('add(<event>)', function() {
      beforeEach(function() {
        this.coll = [ 'event1', 'event2', 'event3' ];
      });

      using([
        [ 'event'   , 'result'                                    ],
        // sort
        [ 'event11' , [ 'event1', 'event11', 'event2', 'event3' ] ],
        [ 'event22' , [ 'event1', 'event2', 'event22', 'event3' ] ],
        [ 'event33' , [ 'event1', 'event2', 'event3', 'event33' ] ],
        // uniq
        [ 'event2'  , [ 'event1', 'event2', 'event3' ]            ],
        // without null
        [ null      , [ 'event1', 'event2', 'event3' ]            ],
      ], function(e,d) {
        it('should add <event> to list, '+d, function() {
          expect(events.add(this.coll, e.event))
            .toEqual(e.result);
        });
      });
    });

    describe('drop(<event>)', function() {
      beforeEach(function() {
        this.coll = [ 'event1', 'event2', 'event3' ];
      });

      using([
        [ 'event'   , 'result'                         ],
        // sort
        [ 'event1'  , [ 'event2', 'event3' ]           ],
        [ 'event2'  , [ 'event1', 'event3' ]           ],
        // not in list
        [ 'event22' , [ 'event1', 'event2', 'event3' ] ],
      ], function(e,d) {
        it('should remove <event> from list, '+d, function() {
          expect(events.drop(this.coll, e.event))
            .toEqual(e.result);
        });
      });
    });
  });

});
