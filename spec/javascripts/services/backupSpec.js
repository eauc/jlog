'use strict';

describe('service', function() {

  beforeEach(function() {
    module('jlogApp.services');
    console.log = jasmine.createSpy('log');
  });

  describe('backup', function() {

    var backup;

    beforeEach(inject([ 'backup', function(_backup) {
      backup = _backup;
    }]));

    describe('read', function(c) {

      beforeEach(function() {
        c.file = {};
        c.success_cbk = jasmine.createSpy();
        c.error_cbk = jasmine.createSpy();

        c.readAsText = jasmine.createSpy();
        c.FileReader = {
          'readAsText': c.readAsText
        };
        spyOn(window, 'FileReader').and.returnValue(c.FileReader);
        
        backup.read(c.file, c.success_cbk, c.error_cbk);
      });

      it('should read "file" as text', function() {
        expect(c.readAsText).toHaveBeenCalledWith(c.file);
      });

      describe('on abort', function(c) {
        
        beforeEach(function() {
          c.onAbort = c.FileReader.onabort;
          expect(c.onAbort).toBeA('Function');

          c.onAbort();
        });

        it('should call error_cbk with abort msg', function() {
          expect(c.error_cbk).toHaveBeenCalledWith('abort reading file');
        });

      });

      describe('on error', function(c) {
        
        beforeEach(function() {
          c.onError = c.FileReader.onerror;
          expect(c.onError).toBeA('Function');

          c.onError();
        });

        it('should call error_cbk with error msg', function() {
          expect(c.error_cbk).toHaveBeenCalledWith('error reading file');
        });

      });

      describe('on load', function(c) {
        
        beforeEach(function() {
          c.onLoad = c.FileReader.onload;
          expect(c.onLoad).toBeA('Function');
        });

        describe('when the file data is valid', function(c) {

          beforeEach(function() {
            c.data = { 'test': 'data' };
            
            c.onLoad({ 'target': { 'result': JSON.stringify(c.data) } });
          });

          it('should call success_cbk with the file data', function() {
            expect(c.success_cbk).toHaveBeenCalled();
            expect(c.success_cbk.calls.mostRecent().args[0]).toEqual(c.data);
          });

        });

        describe('when the file data is invalid', function() {

          beforeEach(function() {
            c.onLoad({ 'target': { 'result': '{ test: "data' } });
          });

          it('should call error_cbk with "invalid file" msg', function() {
            expect(c.error_cbk).toHaveBeenCalledWith('invalid file');
          });

        });

      });

    });

    describe('generate', function(c) {

      beforeEach(function() {
        c.previous_url = 'previous_url';
        window.URL = jasmine.createSpyObj('url', [ 
          'createObjectURL', 
          'revokeObjectURL'
        ]);
        c.url = 'url';
        window.URL.createObjectURL.and.returnValue(c.url);

        c.blob = {};
        spyOn(window, 'Blob').and.returnValue(c.blob);

        backup.save_url = c.previous_url;

        c.data_string = '{"test":"data"}';

        backup.generate(JSON.parse(c.data_string));
      });

      it('should revoke previous url', function() {
        expect(window.URL.revokeObjectURL).toHaveBeenCalledWith(c.previous_url);
      });

      it('should create blob from data', function() {
        expect(window.Blob).toHaveBeenCalled();
        expect(window.Blob.calls.mostRecent().args[0]).toEqual([ c.data_string ]);
        expect(window.Blob.calls.mostRecent().args[1]).toEqual({ type: 'text/plain' });
      });

      it('should create url from blob', function() {
        expect(window.URL.createObjectURL).toHaveBeenCalled();
        expect(window.URL.createObjectURL.calls.mostRecent().args[0]).toBe(c.blob);

        expect(backup.save_url).toBe(c.url);
      });

      it('should provide a default name for the file', function() {
        expect(backup.save_name).toMatch(/battle_list_\d+.txt/);
      });

    });

    describe('upload', function() {

      var $httpBackend;

      beforeEach(inject(['$httpBackend', function(httpBackend) {
        $httpBackend = httpBackend;
      }]));
      
      it('should POST battles to /api/log', function() {
        var battles = { 'test': 'data' };
        $httpBackend
          .expect('POST', '/api/log', { 'battles': battles })
          .respond(201, '');

        backup.upload(battles);

        $httpBackend.flush();
      });

      describe('on POST success', function() {

        beforeEach(function() {
          var battles = { 'test': 'data' };
          $httpBackend
            .when('POST', '/api/log', { 'battles': battles })
            .respond(201, '{"id":"1234"}');

          backup.upload(battles);

          $httpBackend.flush();
        });

        it('should set "upload_result" to success', function() {
          expect(backup.upload_result).toBe('uploaded data');
        });

        it('should set "upload_id" to returned id', function() {
          expect(backup.upload_id).toBe('1234');
        });

      });

      describe('on POST failure', function() {

        beforeEach(function() {
          var battles = { 'test': 'data' };
          $httpBackend
            .when('POST', '/api/log', { 'battles': battles })
            .respond(500);

          backup.upload(battles);

          $httpBackend.flush();
        });

        it('should set "upload_result" to failure', function() {
          expect(backup.upload_result).toBe('upload failure');
        });

      });

    });

    describe('download', function() {

      var $httpBackend;

      beforeEach(inject(['$httpBackend', function(httpBackend) {
        $httpBackend = httpBackend;
      }]));
      
      it('should GET /api/log/{download_id}', function() {
        backup.download_id = '1234';
        $httpBackend
          .expect('GET', '/api/log/1234')
          .respond(200, '');

        backup.download();

        $httpBackend.flush();
      });

      describe('on GET success', function(c) {

        beforeEach(function() {
          c.data = { 'test': 'data' };
          c.success_cbk = jasmine.createSpy();

          $httpBackend
            .when('GET', '/api/log/1234')
            .respond(200, JSON.stringify(c.data));

          backup.download_id = '1234';
          backup.download(c.success_cbk);

          $httpBackend.flush();
        });

        it('should set "download_result" to success', function() {
          expect(backup.download_result).toBe('downloaded data');
        });

        it('should call success_cbk with returned data', function() {
          expect(c.success_cbk).toHaveBeenCalledWith(c.data);
        });

      });

      describe('on GET failure', function(c) {

        beforeEach(function() {
          c.data = { 'test': 'data' };
          c.error_cbk = jasmine.createSpy();

          $httpBackend
            .when('GET', '/api/log/1234')
            .respond(500);

          backup.download_id = '1234';
          backup.download(null, c.error_cbk);

          $httpBackend.flush();
        });

        it('should set "download_result" to failure', function() {
          expect(backup.download_result).toBe('download failure');
        });

        it('should call error_cbk', function() {
          expect(c.error_cbk).toHaveBeenCalled();
        });

      });

    });

  });

});
