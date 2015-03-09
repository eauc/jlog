'use strict';

describe('services', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('igParser', function() {

    var igParser;
    beforeEach(inject([
      'igParser',
      'factions',
      'scenarios',
      '$rootScope',
      function(_igParser,
               factions,
               scenarios,
               $rootScope) {
        igParser = _igParser;

        spyOn(factions, 'data').and.returnValue([
          { key: 'cryx', name: 'Cryx' },
          { key: 'khador', name: 'Khador' },
          { key: 'loe', name: 'Legion of Everblight' },
        ]);
        spyOn(scenarios, 'data').and.returnValue([]);
        igParser.init();
        $rootScope.$digest();
      }
    ]));

    describe('parse(<string>)', function() {
      it('should return battles list', function() {
        expect(igParser.parse('"0","Cryx","terminus","kevin","Khador","vlad1","1","2","3","4","5","6","7","scenar","50","amical","1","comment"\r\n'))
          .toEqual([ [ { index : 0, date : { year : 1970, month : 1, day : 1 }, my_army : { faction : 'cryx', caster : 'terminus1' }, opponent : { name : 'kevin', faction : 'khador', caster : 'vlad1' }, setup : { size : 50, scenario : 'scenar', event : 'amical', initiative : { won_roll : 'true', started : 'true' } }, score : 'va', points : { my_army : { scenario : 2, army : 3, kill : 4 }, opponent : { scenario : 5, army : 6, kill : 7 } }, tags : [  ], comment : 'comment' } ], [] ]);
      });

      it('should ignore NULL fields', function() {
        var ret = igParser.parse('"0", NULL , null,Null ,NulL,"vlad1",, NULL , null,Null ,nUlL,,,Null,,null,,NULL\r\n');

        expect(ret[0][0].my_army).toEqual({
          faction: null,
          caster: null
        });
        expect(ret[0][0].opponent).toEqual({
          name: '',
          faction: null,
          caster: "vlad1"
        });
        expect(ret[0][0].points.opponent).toEqual({
          scenario: null,
          army: null,
          kill: null
        });
        expect(ret[0][0].setup.scenario).toBe(null);
        expect(ret[0][0].setup.event).toBe('');
        expect(ret[0][0].comment).toBe('');
      });

      it('should parse factions correctly', function() {
        var ret = igParser.parse('"0","Toto","terminus","kevin","Khador","vlad1","-7",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Toto","vlad1","-7",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","-7",,,,,,,,,,,\r\n'+
                                 '"0","Khador","terminus","kevin","Khador","vlad1","-7",,,,,,,,,,,\r\n'+
                                 '"0","Legion of Everblight","terminus","kevin","Khador","vlad1","-7",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Cryx","vlad1","-7",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","-7",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Legion of Everblight","vlad1","-7",,,,,,,,,,,\r\n');
        var battles = ret[0];
        var errors = ret[1];
        expect(errors[0]).toMatch(/line 1.*unknown faction Toto/);
        expect(errors[1]).toMatch(/line 2.*unknown faction Toto/);
        expect(battles[0].my_army.faction).toBe(null);
        expect(battles[1].opponent.faction).toBe(null);
        expect(battles[2].my_army.faction).toBe('cryx');
        expect(battles[3].my_army.faction).toBe('khador');
        expect(battles[4].my_army.faction).toBe('loe');
        expect(battles[5].opponent.faction).toBe('cryx');
        expect(battles[6].opponent.faction).toBe('khador');
        expect(battles[7].opponent.faction).toBe('loe');
      });

      it('should parse score correctly', function() {
        var ret = igParser.parse('"0","Cryx","terminus","kevin","Khador","vlad1","-8",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","-7",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","-6",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","-5",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","-4",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","-3",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","-2",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","-1",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","0",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","1",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","2",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","3",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","4",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","5",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","6",,,,,,,,,,,\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","7",,,,,,,,,,,\r\n');
        var battles = ret[0];
        var errors = ret[1];
        expect(errors[0]).toMatch(/unknown score -8/);
        expect(battles[0].score).toBe(null);
        expect(battles[1].score).toBe('dc');
        expect(battles[2].score).toBe('dt');
        expect(battles[3].score).toBe('dt');
        expect(battles[4].score).toBe('dt');
        expect(battles[5].score).toBe('dt');
        expect(battles[6].score).toBe('ds');
        expect(battles[7].score).toBe('da');
        expect(battles[8].score).toBe('dd');
        expect(battles[9].score).toBe('va');
        expect(battles[10].score).toBe('vs');
        expect(battles[11].score).toBe('vt');
        expect(battles[12].score).toBe('vt');
        expect(battles[13].score).toBe('vt');
        expect(battles[14].score).toBe('vt');
        expect(battles[15].score).toBe('vc');
      });

      it('should parse initiative correctly', function() {
        var ret = igParser.parse('"0","Cryx","terminus","kevin","Khador","vlad1","1",,,,,,,,,,"0",\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","1",,,,,,,,,,"1",\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","1",,,,,,,,,,"2",\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","1",,,,,,,,,,"3",\r\n'+
                                 '"0","Cryx","terminus","kevin","Khador","vlad1","1",,,,,,,,,,"4",\r\n');
        var battles = ret[0];
        var errors = ret[1];
        expect(errors[0]).toMatch(/unknown initiative 0/);
        expect(battles[0].setup.initiative).toEqual({ won_roll: null, started: null });
        expect(battles[1].setup.initiative).toEqual({ won_roll: 'true', started: 'true' });
        expect(battles[2].setup.initiative).toEqual({ won_roll: 'true', started: 'false' });
        expect(battles[3].setup.initiative).toEqual({ won_roll: 'false', started: 'true' });
        expect(battles[4].setup.initiative).toEqual({ won_roll: 'false', started: 'false' });
      });
    });
  });

});
