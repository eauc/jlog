'use strict';

describe('services', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('scores', function() {

    var scores;
    beforeEach(inject([
      'scores',
      function(_scores) {
        scores = _scores;
      }
    ]));

    describe('data()', function() {
      beforeEach(inject(function($httpBackend) {
        this.httpBackend = $httpBackend;
      }));

      it('should get scores data', function() {
        this.httpBackend.expectGET('data/scores.json')
          .respond(200, { data : 'scores' });

        scores.data();

        this.httpBackend.flush();
      });

      when('request fails', function() {
        this.httpBackend.expectGET('data/scores.json')
          .respond(404);
        this.errorCbk = jasmine.createSpy('errorCbk');
        scores.data().then(null, this.errorCbk);
        this.httpBackend.flush();
      }, function() {
        it('should reject promise', function() {
          expect(this.errorCbk)
            .toHaveBeenCalledWith(jasmine.any(Object));
        });
      });

      when('request succeeds', function() {
        this.response_data = { data : 'scores' };
        this.httpBackend.expectGET('data/scores.json')
          .respond(200, this.response_data);
        this.successCbk = jasmine.createSpy('successCbk');
        scores.data().then(this.successCbk);
        this.httpBackend.flush();
      }, function() {
        it('should resolve promise with data', function() {
          expect(this.successCbk)
            .toHaveBeenCalledWith(this.response_data);
        });

        it('should store data for next calls', function() {
          this.httpBackend.resetExpectations();
          expect(scores.data()).toEqual(this.response_data);
        });
      });
    });

    describe('letterFor(<key>)', function() {
      beforeEach(function() {
        this.coll = {
          va: { letter: 'A' },
          vc: { letter: 'C' },
          vs: { letter: 'S' },
          dd: { letter: 'D' }
        };
      });

      using([
        [ 'key' , 'letter' ],
        [ 'va'  , 'A'      ],
        [ 'vc'  , 'C'      ],
        [ 'vs'  , 'S'      ],
        [ 'dd'  , 'D'      ],
        // undefined key
        [ 'dc'  , undefined],
      ], function(e, d) {
        it('should find the letter for <key>, '+d, function() {
          expect(scores.letterFor(this.coll, e.key)).toBe(e.letter);
        });
      });
    });

    describe('classFor(<key>)', function() {
      beforeEach(function() {
        this.coll = {
          va: { 'class': 'success' },
          vc: { 'class': 'success' },
          vs: { 'class': 'danger' },
          dd: { 'class': 'warning' }
        };
      });

      using([
        [ 'key' , 'class'   ],
        [ 'va'  , 'success' ],
        [ 'vc'  , 'success' ],
        [ 'vs'  , 'danger'  ],
        [ 'dd'  , 'warning' ],
        // undefined key
        [ 'dc'  , undefined],
      ], function(e, d) {
        it('should find the class for <key>, '+d, function() {
          expect(scores.classFor(this.coll, e.key)).toBe(e['class']);
        });
      });
    });
  });

});
