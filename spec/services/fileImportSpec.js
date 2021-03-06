'use strict';

describe('service', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('fileImport', function() {

    var fileImport;

    beforeEach(inject([ 'fileImport', function(_fileImport) {
      fileImport = _fileImport;
    }]));

    describe('read(<type>, <file>)', function() {
      beforeEach(inject(function($window) {
        var ctxt = this;
        this.window = $window;
        this.FileReader = {
          readAsText: jasmine.createSpy('readAsText').and.callFake(function() {
            ctxt.reader = this;
          })
        };
        $window.FileReader = jasmine.createSpy('FileReader')
          .and.returnValue(this.FileReader);
      }));

      it('should use a file reader to read file', function() {
        fileImport.read('json', 'file');

        expect(this.window.FileReader).toHaveBeenCalled();
        expect(this.FileReader.readAsText).toHaveBeenCalledWith('file');
      });

      describe('on error', function() {
        beforeEach(inject(function($rootScope) {
          this.successCbk = jasmine.createSpy('successCbk');
          this.errorCbk = jasmine.createSpy('errorCbk');
          fileImport.read('json', 'file')
            .then(this.successCbk, this.errorCbk);

          this.reader.onerror('error');
          $rootScope.$digest();
        }));

        it('should reject promise', function() {
          expect(this.successCbk).not.toHaveBeenCalled();
          expect(this.errorCbk).toHaveBeenCalledWith(['error reading file']);
        });
      });

      describe('on abort', function() {
        beforeEach(inject(function($rootScope) {
          this.successCbk = jasmine.createSpy('successCbk');
          this.errorCbk = jasmine.createSpy('errorCbk');
          fileImport.read('json', 'file')
            .then(this.successCbk, this.errorCbk);

          this.reader.onabort('error');
          $rootScope.$digest();
        }));

        it('should reject promise', function() {
          expect(this.successCbk).not.toHaveBeenCalled();
          expect(this.errorCbk).toHaveBeenCalledWith(['abort reading file']);
        });
      });

      describe('on load', function() {
        beforeEach(inject(function($rootScope) {
          var ctxt = this;

          this.jsonParserService = spyOnService('jsonParser');

          this.successCbk = jasmine.createSpy('successCbk');
          this.errorCbk = jasmine.createSpy('errorCbk');
          fileImport.read('json', 'file')
            .then(this.successCbk, this.errorCbk);

          this.testOnLoad = function() {
            ctxt.reader.onload({ target: { result: 'result' } });
            $rootScope.$digest();
          };
        }));

        using([
          [ 'type' ],
          [ 'json'   ],
        ], function(e, d) {
          it('should try to parse file using <type> parser, '+d, function() {
            this[e.type+'ParserService'].parse.calls.reset();
            fileImport.read(e.type, 'file')
              .then(this.successCbk, this.errorCbk);

            this.testOnLoad();

            expect(this[e.type+'ParserService'].parse)
              .toHaveBeenCalledWith('result');
          });
        });

        when('a parse error happens', function() {
          this.jsonParserService.parse.and.throwError('parse error');

          this.testOnLoad();
        }, function() {
          it('should reject promise', function() {
            expect(this.errorCbk)
              .toHaveBeenCalledWith(['invalid file : parse error']);
          });
        });

        when('a parse succeeds', function() {
          this.jsonParserService.parse.and.returnValue([ 'players', 'errors' ]);

          this.testOnLoad();
        }, function() {
          it('should resolve promise', function() {
            expect(this.successCbk)
              .toHaveBeenCalledWith(['players', 'errors']);
          });
        });
      });
    });
  });

});
