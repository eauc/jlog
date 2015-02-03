'use strict';

describe('service', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('csvStringifier', function() {

    var csvStringifier;

    beforeEach(inject([
      'csvStringifier',
      function(_csvStringifier, _player, _list) {
        csvStringifier = _csvStringifier;
      }
    ]));

    describe('stringify(<tables>)', function() {
      it('should convert <tables> to csv', function() {
        expect(csvStringifier.stringify([
          [ 'field1', 'field2', 'field3' ],
          [ '11', '12', 3 ],
          [ '21', '22', 4 ],
        ])).toBe('field1,field2,field3\r\n'+
                 '11,12,3\r\n'+
                 '21,22,4');
      });
    });
  });

});
