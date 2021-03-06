'use strict';

describe('service', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('bbStringifier', function() {

    var bbStringifier;

    beforeEach(inject([
      'bbStringifier',
      function(_bbStringifier) {
        bbStringifier = _bbStringifier;
      }
    ]));

    describe('stringify(<tables>)', function() {
      it('should convert <tables> to bb code', function() {
        expect(bbStringifier.stringify([
          [ 'field1', 'field2', 'field3' ],
          [ '11', '12', 3 ],
          [ '21', '22', 4 ],
        ])).toBe('[table][tr][td][b]field1[/b][/td][td][b]field2[/b][/td][td][b]field3[/b][/td][/tr]\r\n'+
                 '[tr][td]11[/td][td]12[/td][td]3[/td][/tr]\r\n'+
                 '[tr][td]21[/td][td]22[/td][td]4[/td][/tr][/table]');
      });
    });
  });

});
