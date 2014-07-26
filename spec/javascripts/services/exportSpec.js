'use strict';

describe('service', function() {

  beforeEach(function() {
    module('jlogApp.services');
    console.log = jasmine.createSpy('log');
  });

  describe('export', function() {

    var battle;
    var battle_list;

    beforeEach(inject([
      'battle',
      function(_battle) {
        battle = _battle;
        battle_list = [
          battle({
            'date': {
              'year': 1983,
              'month': 1,
              'day': 27
            },
            'my_army': {
              'caster': 'thagrosh1',
              'faction': 'loe'
            },
            'opponent': {
              'name': 'fred',
              'caster': 'ravyn',
              'faction': 'scyrah'
            }
          }),
          battle({
            'points': {
              'my_army': {
                'scenario': 1,
                'army': 50,
                'kill': 20
              },
              'opponent': {
                'scenario': 2,
                'army': 25,
                'kill': 10
              }
            },
            'setup': {
              'size': 50,
              'scenario': 'sr13inco',
              'event': 'amical',
            }
          }),
          battle({
            'score': 'va',
            'comment': 'toto',
            'initiative': {
              'dice': 'true',
              'start': 'false'
            }
          })
        ];
      }]));
    
    describe('csv', function() {

      var export_csv;

      beforeEach(inject([
        'export_csv',
        function(_export_csv) {
          export_csv = _export_csv;
        }]));
      
      it('should export default battle keys', function() {
        expect(export_csv.generate([])).toBe('date.year,date.month,date.day,my_army.caster,my_army.faction,opponent.name,opponent.caster,opponent.faction,points.my_army.scenario,points.my_army.army,points.my_army.kill,points.opponent.scenario,points.opponent.army,points.opponent.kill,setup.size,setup.scenario,setup.event,setup.initiative.started,setup.initiative.won_roll,score,comment,tags,\r\n');
      });

      it('should export empty fields as "null"', function() {
        expect(export_csv.generate([ battle() ]).split('\n')[1]).toMatch(/^\d{4},\d{1,2},\d{1,2},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,,\r$/);
      });

      it('should export battle list', function() {
        var exported_list = export_csv.generate(battle_list);
        var lines = exported_list.split('\n');
        expect(lines[1]).toMatch(/^1983,1,27,thagrosh1,loe,fred,ravyn1,scyrah,null,null,null,null,null,null,null,null,null,null,null,null,null,,\r$/);
        expect(lines[2]).toMatch(/^\d{4},\d{1,2},\d{1,2},null,null,null,null,null,1,50,20,2,25,10,50,sr13inco,amical,null,null,null,null,,\r$/);
        expect(lines[3]).toMatch(/^\d{4},\d{1,2},\d{1,2},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,va,toto,,\r$/);
      });
    });
    
    describe('bb', function() {

      var export_bb;

      beforeEach(inject([
        'export_bb',
        function(_export_bb) {
          export_bb = _export_bb;
        }]));
      
      it('should export default battle keys', function() {
        expect(export_bb.generate([])).toBe('[table]\r\n[tr][th]date.year[/th][th]date.month[/th][th]date.day[/th][th]my_army.caster[/th][th]my_army.faction[/th][th]opponent.name[/th][th]opponent.caster[/th][th]opponent.faction[/th][th]points.my_army.scenario[/th][th]points.my_army.army[/th][th]points.my_army.kill[/th][th]points.opponent.scenario[/th][th]points.opponent.army[/th][th]points.opponent.kill[/th][th]setup.size[/th][th]setup.scenario[/th][th]setup.event[/th][th]setup.initiative.started[/th][th]setup.initiative.won_roll[/th][th]score[/th][th]comment[/th][th]tags[/th][/tr]\r\n[/table]\r\n');
      });

      it('should export empty fields as "null"', function() {
        expect(export_bb.generate([ battle() ]).split('\n')[2]).toMatch(/^\[tr\]\[td\]\d+\[\/td\]\[td\]\d+\[\/td\]\[td\]\d+\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]\[\/td\]\[\/tr\]\r$/);
      });

      it('should export battle list', function() {
        var exported_list = export_bb.generate(battle_list);
        var lines = exported_list.split('\n');
        expect(lines[2]).toMatch(/^\[tr\]\[td\]1983\[\/td\]\[td\]1\[\/td\]\[td\]27\[\/td\]\[td\]thagrosh1\[\/td\]\[td\]loe\[\/td\]\[td\]fred\[\/td\]\[td\]ravyn1\[\/td\]\[td\]scyrah\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]\[\/td\]\[\/tr\]\r$/);
        expect(lines[3]).toMatch(/^\[tr\]\[td\]\d+\[\/td\]\[td\]\d+\[\/td\]\[td\]\d+\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]1\[\/td\]\[td\]50\[\/td\]\[td\]20\[\/td\]\[td\]2\[\/td\]\[td\]25\[\/td\]\[td\]10\[\/td\]\[td\]50\[\/td\]\[td\]sr13inco\[\/td\]\[td\]amical\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]\[\/td\]\[\/tr\]\r$/);
        expect(lines[4]).toMatch(/^\[tr\]\[td\]\d+\[\/td\]\[td\]\d+\[\/td\]\[td\]\d+\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]null\[\/td\]\[td\]va\[\/td\]\[td\]toto\[\/td\]\[td\]\[\/td\]\[\/tr\]\r$/);
      });
    });

    describe('generate', function(c) {

      var $window;
      var _export;
      var export_csv;
      var export_bb;

      beforeEach(inject([
        '$window',
        'export',
        'export_csv',
        'export_bb',
        function(_$window,
                 _export_,
                 _export_csv,
                 _export_bb) {
          $window = _$window;
          spyOn($window, 'Blob').and.callFake(function(arr) { this.data = arr[0]+'_blob'; });
          $window.URL = jasmine.createSpyObj('URL', [
            'createObjectURL',
            'revokeObjectURL',
          ]);
          $window.URL.createObjectURL.and.callFake(function(blob) { return blob.data+'_url'; });

          var export_csv = _export_csv;
          var export_bb = _export_bb;
          spyOn(export_csv, 'generate').and.returnValue('csv_string');
          spyOn(export_bb, 'generate').and.returnValue('bb_string');

          _export = _export_;
          _export.name = null;
          _export.bb_url = 'toto';
          _export.csv_url = 'tata';
          _export.json_url = 'titi';

          c.list = { toto: 'titi' };
          _export.generate(c.list);
        }
      ]));

      it('should define export files base name', function() {
        expect(_export.name).toMatch(/^battle_list_\d+$/);
      });

      it('should revoke existing urls', function() {
        expect($window.URL.revokeObjectURL).toHaveBeenCalledWith('toto');
        expect($window.URL.revokeObjectURL).toHaveBeenCalledWith('tata');
        expect($window.URL.revokeObjectURL).toHaveBeenCalledWith('titi');
      });

      it('should create blobs with each format string', function() {
        expect($window.Blob)
          .toHaveBeenCalledWith([ 'csv_string' ], { type: 'text/plain' });
        expect($window.Blob)
          .toHaveBeenCalledWith([ 'bb_string' ], { type: 'text/plain' });
        expect($window.Blob)
          .toHaveBeenCalledWith([ '{"toto":"titi"}' ], { type: 'text/plain' });
      });

      it('should create urls with each format blob', function() {
        expect($window.URL.createObjectURL)
          .toHaveBeenCalledWith({ data: 'csv_string_blob'});
        expect($window.URL.createObjectURL)
          .toHaveBeenCalledWith({ data: 'bb_string_blob'});
        expect($window.URL.createObjectURL)
          .toHaveBeenCalledWith({ data: '{"toto":"titi"}_blob'});
        
        expect(_export.bb_url).toBe('bb_string_blob_url');
        expect(_export.csv_url).toBe('csv_string_blob_url');
        expect(_export.json_url).toBe('{"toto":"titi"}_blob_url');
      });

    });

  });

});
