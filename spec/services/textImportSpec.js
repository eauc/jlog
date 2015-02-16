'use strict';

describe('service', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('textImport', function() {

    var textImport;

    beforeEach(inject([ 'textImport', function(_textImport) {
      textImport = _textImport;
    }]));

    describe('read(<type>, <text>)', function() {
      beforeEach(inject(function($rootScope) {
        var ctxt = this;

        this.jsonParserService = spyOnService('jsonParser');

        this.successCbk = jasmine.createSpy('successCbk');
        this.errorCbk = jasmine.createSpy('errorCbk');

        this.testRead = function(type) {
          ctxt[type+'ParserService'].parse.calls.reset();
          textImport.read(type, 'text')
            .then(ctxt.successCbk, ctxt.errorCbk);
          $rootScope.$digest();
        };
      }));

      using([
        [ 'type' ],
        [ 'json'   ],
      ], function(e, d) {
        it('should try to parse text using <type> parser, '+d, function() {
          this.testRead(e.type);

          expect(this[e.type+'ParserService'].parse)
            .toHaveBeenCalledWith('text');
        });

        when('a parse error happens', function() {
          this.jsonParserService.parse.and.throwError('parse error');

          this.testRead(e.type);
        }, function() {
          it('should reject promise', function() {
            expect(this.errorCbk)
              .toHaveBeenCalledWith(['invalid text : parse error']);
          });
        });

        when('a parse succeeds', function() {
          this.jsonParserService.parse.and.returnValue([ 'players', 'errors' ]);

          this.testRead(e.type);
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
