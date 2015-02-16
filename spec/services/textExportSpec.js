'use strict';

describe('service', function() {

  beforeEach(function() {
    this.windowService = {
      Blob: jasmine.createSpy('Blob').and.callFake(function() {
        this.blob = 'blob';
      }),
      URL: {
        createObjectURL: jasmine.createSpy('createObjectURL').and.returnValue('test_url')
      }
    };
    module({
      '$window': this.windowService,
    });
    module('jlogApp.services');
  });

  describe('textExport', function() {

    var textExport;

    beforeEach(inject([ 'textExport', function(_textExport) {
      textExport = _textExport;
    }]));

    describe('generate(<type>, <data>)', function() {
      beforeEach(function() {
        this.csvStringifierService = spyOnService('csvStringifier');
      });

      it('should call <type> stringifier', function() {
        expect(textExport.generate('csv', 'data'))
          .toBe('csvStringifier.stringify.returnValue');

        expect(this.csvStringifierService.stringify)
          .toHaveBeenCalledWith('data');
      });
    });
  });

});
