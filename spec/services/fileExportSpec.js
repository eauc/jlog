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

  describe('fileExport', function() {

    var fileExport;

    beforeEach(inject([ 'fileExport', function(_fileExport) {
      fileExport = _fileExport;
    }]));

    describe('generate(<type>, <data>)', function() {
      beforeEach(function() {
        this.csvStringifierService = spyOnService('csvStringifier');
      });

      it('should call <type> stringifier', function() {
        fileExport.generate('csv', 'data');

        expect(this.csvStringifierService.stringify)
          .toHaveBeenCalledWith('data');
      });

      it('should generate URL from string', function() {
        expect(fileExport.generate('csv', 'data')).toBe('test_url');

        expect(this.windowService.Blob)
          .toHaveBeenCalledWith(['csvStringifier.stringify.returnValue'],
                                {type: 'text/plain'});
        // bug in SpecRunner
        // expect(this.windowService.URL.createObjectURL)
        //   .toHaveBeenCalledWith({ blob: 'blob' });
        expect(this.windowService.URL.createObjectURL).toHaveBeenCalled();
        expect(this.windowService.URL.createObjectURL.calls.first().args[0].blob).toBe('blob');
      });
    });
  });

});
