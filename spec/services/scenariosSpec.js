'use strict';

describe('services', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('scenarios', function() {

    var scenarios;
    beforeEach(inject([
      'scenarios',
      function(_scenarios) {
        scenarios = _scenarios;
      }
    ]));

    describe('data()', function() {
      beforeEach(inject(function($httpBackend) {
        this.httpBackend = $httpBackend;
        this.data = {
          "sr15des": {
            "name": "SR15 Destruction"
          },
          "sr15tf": {
            "name": "SR15 Two Fronts"
          },
          "sr15cq": {
            "name": "SR15 Close Quarters"
          },
          "sr15fs": {
            "name": "SR15 Fire Support"
          },
        };
      }));

      it('should get scenarios data', function() {
        this.httpBackend.expectGET('data/scenarios.json')
          .respond(200, this.data);

        scenarios.data();

        this.httpBackend.flush();
      });

      when('request fails', function() {
        this.httpBackend.expectGET('data/scenarios.json')
          .respond(404);
        this.errorCbk = jasmine.createSpy('errorCbk');
        scenarios.data().then(null, this.errorCbk);
        this.httpBackend.flush();
      }, function() {
        it('should reject promise', function() {
          expect(this.errorCbk)
            .toHaveBeenCalledWith(jasmine.any(Object));
        });
      });

      when('request succeeds', function() {
        this.httpBackend.expectGET('data/scenarios.json')
          .respond(200, this.data);
        this.successCbk = jasmine.createSpy('successCbk');
        scenarios.data().then(this.successCbk);
        this.httpBackend.flush();
      }, function() {
        it('should resolve promise with data', function() {
          expect(this.successCbk)
            .toHaveBeenCalledWith(jasmine.any(Array));
        });

        it('should normalize scenarios entries', function() {
          var data = this.successCbk.calls.first().args[0];
          expect(data).toEqual([
            { 
              "key": "sr15des",
              "name": "SR15 Destruction"
            },
            { 
              "key": "sr15tf",
              "name": "SR15 Two Fronts"
            },
            { 
              "key": "sr15cq",
              "name": "SR15 Close Quarters"
            },
            { 
              "key": "sr15fs",
              "name": "SR15 Fire Support"
            },
          ]);
        });

        it('should store data for next calls', function() {
          this.httpBackend.resetExpectations();
          expect(scenarios.data()).toBeAn('Array');
        });
      });
    });

    describe('nameFor(<key>)', function() {
      beforeEach(function() {
        this.coll = [
          { key: 'a', name: 'alpha.jpg' },
          { key: 'b', name: 'bravo.jpg' },
          { key: 'c', name: 'charlie.jpg' },
        ];
      });

      using([
        [ 'key' , 'name'        ],
        [ 'a'   , 'alpha.jpg'   ],
        [ 'b'   , 'bravo.jpg'   ],
        [ 'c'   , 'charlie.jpg' ],
        // undefined key
        [ 'd'   , undefined     ],
      ], function(e, d) {
        it('should find the name for <key>, '+d, function() {
          expect(scenarios.nameFor(this.coll, e.key)).toBe(e.name);
        });
      });
    });
  });

});
