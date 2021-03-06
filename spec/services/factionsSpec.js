'use strict';

describe('services', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('factions', function() {

    var factions;
    beforeEach(inject([
      'factions',
      function(_factions) {
        factions = _factions;
      }
    ]));

    describe('data()', function() {
      beforeEach(inject(function($httpBackend) {
        this.httpBackend = $httpBackend;
        this.data = {
          "cephalyx": {
            "name": "Cephalyx",
            "casters": {
              "thexus1": {"name": "Exulon Thexus"}
            },
            "icon": "mercs_50.png",
            "hue": [0,1]
          },
          "cygnar": {
            "name": "Cygnar",
            "casters": {
              "blaize": {"name": "Constance Blaize,  Knight of the Prophet"},
              "siege": {"name": "Major Markus 'Siege' Brisbane"},
            },
            "icon": "cygnar_50.png",
            "hue": [10,11]
          },
          "menoth": {
            "name": "The Protectorate of Menoth",
            "casters": {
              "kreoss1": {"name": "High Exemplar Kreoss"},
              "kreoss2": {"name": "Grand Exemplar Kreoss"},
            },
            "icon": "menoth_50.png",
            "hue": [20,21]
          }
        };
      }));

      it('should get factions data', function() {
        this.httpBackend.expectGET('data/factions.json')
          .respond(200, this.data);

        factions.data();

        this.httpBackend.flush();
      });

      when('request fails', function() {
        this.httpBackend.expectGET('data/factions.json')
          .respond(404);
        this.errorCbk = jasmine.createSpy('errorCbk');
        factions.data().then(null, this.errorCbk);
        this.httpBackend.flush();
      }, function() {
        it('should reject promise', function() {
          expect(this.errorCbk)
            .toHaveBeenCalledWith(jasmine.any(Object));
        });
      });

      when('request succeeds', function() {
        this.httpBackend.expectGET('data/factions.json')
          .respond(200, this.data);
        this.successCbk = jasmine.createSpy('successCbk');
        factions.data().then(this.successCbk);
        this.httpBackend.flush();
      }, function() {
        it('should resolve promise with data', function() {
          expect(this.successCbk)
            .toHaveBeenCalledWith(jasmine.any(Array));
        });

        it('should normalize factions entries', function() {
          var data = this.successCbk.calls.first().args[0];
          expect(data[0]).toEqual({
            "key": "cephalyx",
            "name": "Cephalyx",
            "casters": [
              { "key": "thexus1", "name": "Exulon Thexus" }
            ],
            "icon": "mercs_50.png",
            "hue": [0,1]
          });
        });

        using([
          [ 'faction' , 'caster' , 'key'     ],
          [ 1         , 0        , 'blaize1' ],
          [ 1         , 1        , 'siege1' ],
          // already normalized
          [ 0         , 0        , 'thexus1' ],
          [ 2         , 0        , 'kreoss1' ],
          [ 2         , 1        , 'kreoss2' ],
        ], function(e, d) {
          it('should normalize caster keys, '+d, function() {
            var data = this.successCbk.calls.first().args[0];
            expect(data[e.faction].casters[e.caster].key).toBe(e.key);
          });
        });

        it('should store data for next calls', function() {
          this.httpBackend.resetExpectations();
          expect(factions.data()).toBeAn('Array');
        });
      });
    });

    describe('normaliseCaster(<caster>)', function() {
      it('should lowerCase <caster>', function() {
        expect(factions.normaliseCaster('Vayl1')).toBe('vayl1');
      });

      it('should return null if <caster> is invalid', function() {
        // not a string
        expect(factions.normaliseCaster(123)).toBe(null);
        // blank string
        expect(factions.normaliseCaster(' ')).toBe(null);
      });

      it('should append "1" to <caster> if necessary', function() {
        expect(factions.normaliseCaster('saeryn')).toBe('saeryn1');
      });

      it('should not append "1" to <caster> if number already present', function() {
        expect(factions.normaliseCaster('vayl1')).toBe('vayl1');
        expect(factions.normaliseCaster('vayl2')).toBe('vayl2');
      });
    });

    describe('nameFor(<key>)', function() {
      beforeEach(function() {
        this.coll = [
          { key: 'a', name: 'alpha' },
          { key: 'b', name: 'bravo' },
          { key: 'c', name: 'charlie' },
        ];
      });

      using([
        [ 'key' , 'name'    ],
        [ 'a'   , 'alpha'   ],
        [ 'b'   , 'bravo'   ],
        [ 'c'   , 'charlie' ],
        // undefined key
        [ 'd'   , undefined ],
      ], function(e, d) {
        it('should find the name for <key>, '+d, function() {
          expect(factions.nameFor(this.coll, e.key)).toBe(e.name);
        });
      });
    });

    describe('keyForName(<name>)', function() {
      beforeEach(function() {
        this.coll = [
          { key: 'a', name: 'alpha' },
          { key: 'b', name: 'bravo' },
          { key: 'c', name: 'charlie' },
        ];
      });

      using([
        [ 'key' , 'name'    ],
        [ 'a'   , 'alpha'   ],
        [ 'b'   , 'bravo'   ],
        [ 'c'   , 'charlie' ],
        // undefined key
        [ undefined, 'delta' ],
      ], function(e, d) {
        it('should find the name for <key>, '+d, function() {
          expect(factions.keyForName(this.coll, e.name)).toBe(e.key);
        });
      });
    });

    describe('iconFor(<key>)', function() {
      beforeEach(function() {
        this.coll = [
          { key: 'a', icon: 'alpha.jpg' },
          { key: 'b', icon: 'bravo.jpg' },
          { key: 'c', icon: 'charlie.jpg' },
        ];
      });

      using([
        [ 'key' , 'icon'        ],
        [ 'a'   , 'data/img/alpha.jpg'   ],
        [ 'b'   , 'data/img/bravo.jpg'   ],
        [ 'c'   , 'data/img/charlie.jpg' ],
        // undefined key
        [ 'd'   , undefined     ],
      ], function(e, d) {
        it('should find the icon for <key>, '+d, function() {
          expect(factions.iconFor(this.coll, e.key)).toBe(e.icon);
        });
      });
    });

    describe('castersFor(<key>)', function() {
      beforeEach(function() {
        this.coll = [
          { key: 'a', casters: 'alphas' },
          { key: 'b', casters: 'bravos' },
          { key: 'c', casters: 'charlies' },
        ];
      });

      using([
        [ 'key' , 'casters'  ],
        [ 'a'   , 'alphas'   ],
        [ 'b'   , 'bravos'   ],
        [ 'c'   , 'charlies' ],
        // undefined key
        [ 'd'   , undefined  ],
      ], function(e, d) {
        it('should find the casters for <key>, '+d, function() {
          expect(factions.castersFor(this.coll, e.key)).toBe(e.casters);
        });
      });
    });

    describe('casterNameFor(<fkey>, <ckey>)', function() {
      beforeEach(function() {
        this.coll = [
          { key: 'a', casters: [ { key:'a1', name:'alpha1' },
                                 { key:'a2', name:'alpha2' },
                                 { key:'a3', name:'alpha3' } ] },
          { key: 'b', casters: [ { key:'b1', name:'bravo1' },
                                 { key:'b2', name:'bravo2' },
                                 { key:'b3', name:'bravo3' } ] },
        ];
      });

      using([
        [ 'fkey' , 'ckey' , 'name'    ],
        [ 'a'    , 'a2'   , 'alpha2'  ],
        [ 'a'    , 'a3'   , 'alpha3'  ],
        [ 'b'    , 'b1'   , 'bravo1'  ],
        // undefined faction key
        [ 'd'    , 'd1'   , undefined ],
        // undefined caster key
        [ 'a'    , 'b1'   , undefined ],
      ], function(e, d) {
        it('should find the name for <ckey> in <fkey>, '+d, function() {
          expect(factions.casterNameFor(this.coll, e.fkey, e.ckey)).toBe(e.name);
        });
      });
    });

    describe('hueFor(<key>)', function() {
      beforeEach(function() {
        this.coll = [
          { key: 'a', hue: 'alpha' },
          { key: 'b', hue: 'bravo' },
          { key: 'c', hue: 'charlie' },
        ];
      });

      using([
        [ 'key' , 'hue'     ],
        [ 'a'   , 'alpha'   ],
        [ 'b'   , 'bravo'   ],
        [ 'c'   , 'charlie' ],
        // undefined key
        [ 'd'   , undefined  ],
      ], function(e, d) {
        it('should find the hue for <key>, '+d, function() {
          expect(factions.hueFor(this.coll, e.key)).toBe(e.hue);
        });
      });
    });
  });

});
