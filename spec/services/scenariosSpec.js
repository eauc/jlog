'use strict';

describe('services', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('scenarios', function() {

    var scenarios;
    beforeEach(inject([
      'scenarios',
      '$httpBackend',
      function(_scenarios,
               $httpBackend) {
        scenarios = _scenarios;
        this.httpBackend = $httpBackend;
      }
    ]));

    describe('data()', function() {
      beforeEach(function() {
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
      });

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

    describe('fromBattles(<battles>)', function() {
      beforeEach(function() {
        this.httpBackend.expectGET('data/scenarios.json')
          .respond(200, {
            "sr15des": {
              "name": "SR15 Destruction"
            } 
          });
        scenarios.data();
        this.httpBackend.flush();
      });

      it('should extract opponent list from <battles> and merge it with base data', function() {
        expect(scenarios.fromBattles([
          // sort
          { setup: { scenario: 'scenario3' } },
          { setup: { scenario: 'scenario1' } },
          { setup: { scenario: 'scenario2' } },
          // uniq
          { setup: { scenario: 'scenario1' } },
          // without null
          { setup: { scenario: null } },
          // without undefined
          { setup: { titi: 'scenario1' } },
          { toto: 'scenario1' },
        ])).toEqual([
          { key : 'sr15des', name : 'SR15 Destruction' }, 
          { key : 'scenario3', name : 'scenario3' },
          { key : 'scenario1', name : 'scenario1' },
          { key : 'scenario2', name : 'scenario2' }
        ]);
      });
    });

    describe('add(<key>)', function() {
      beforeEach(function() {
        this.coll = [
          { key: 'sc1', name: 'sc1' },
          { key: 'Sc2', name: 'Sc2' },
        ];
      });

      using([
        [ 'key' , 'result' ],
        [ 'sC3' , [ { key: 'sc1', name: 'sc1' },
                    { key: 'Sc2', name: 'Sc2' },
                    { key: 'sC3', name: 'sC3' }, ] ],
        // uniq
        [ 'Sc2' , [ { key: 'sc1', name: 'sc1' },
                    { key: 'Sc2', name: 'Sc2' }, ] ],
        // without null
        [ null  , [ { key: 'sc1', name: 'sc1' },
                    { key: 'Sc2', name: 'Sc2' }, ] ],
      ], function(e, d) {
        it('should add <key> to list, '+d, function() {
          expect(scenarios.add(this.coll, e.key)).toEqual(e.result);
        });
      });
    });

    describe('drop(<key>)', function() {
      beforeEach(function() {
        this.coll = [
          { key: 'sc1', name: 'Sc1' },
          { key: 'sc2', name: 'Sc2' },
          { key: 'sc1', name: 'Sc1b' },
        ];
      });

      using([
        [ 'key' , 'result' ],
        [ 'sc2' , [ { key: 'sc1', name: 'Sc1' },
                    { key: 'sc1', name: 'Sc1b' }, ] ],
        [ 'sc1' , [ { key: 'sc2', name: 'Sc2' }, ] ],
      ], function(e, d) {
        it('should drop all <key> from list, '+d, function() {
          expect(scenarios.drop(this.coll, e.key)).toEqual(e.result);
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
