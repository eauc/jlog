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

    describe('statusReset', function(c) {
      
      beforeEach(function() {
        backup.upload.id = 1234;
        backup.upload.status = 'ok';
        backup.upload.msg = 'no problem';
        backup.download.id = 1234;
        backup.download.status = 'ok';
        backup.download.msg = 'no problem';
        
        backup.statusReset();
      });

      it('should reset all status information', function() {
        expect(backup.upload.id).toBe(null);
        expect(backup.upload.status).toBe(null);
        expect(backup.upload.msg).toBe(null);
        expect(backup.download.id).toBe(null);
        expect(backup.download.status).toBe(null);
        expect(backup.download.msg).toBe(null);
      });

    });

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

    describe('upload', function(c) {

      var $http;

      beforeEach(inject([
        '$http',
        '$q',
        function(http, $q) {
          c.deferred = $q.defer();
          $http = http;
          spyOn($http, 'post').and.returnValue(c.deferred.promise);
        }
      ]));
      
      it('should POST battles to /api/log', function() {
        var battles = { 'test': 'data' };

        backup.upload(battles);

        expect($http.post).toHaveBeenCalledWith('/api/log', { battles: battles });
      });

      describe('on POST success', function() {

        beforeEach(inject([
          '$rootScope',
          function($rootScope) {
            c.success_cbk = jasmine.createSpy('success_cbk');

            var battles = { 'test': 'data' };
            backup.upload(battles).then(c.success_cbk);

            c.data = { id: '1234' };
            c.deferred.resolve({
              data: c.data
            });
            $rootScope.$digest();
          }
        ]));

        it('should set successfull upload status', function() {
          expect(backup.upload.status).toBe(true);
          expect(backup.upload.msg).toBe('data uploaded');
          expect(backup.upload.id).toBe('1234');
        });

        it('should resolve returned promise with post data', function() {
          expect(c.success_cbk).toHaveBeenCalledWith(c.data);
        });

      });

      describe('on POST failure', function() {

        beforeEach(inject([
          '$rootScope',
          function($rootScope) {
            c.error_cbk = jasmine.createSpy('error_cbk');

            var battles = { 'test': 'data' };
            backup.upload(battles).then(null, c.error_cbk);

            c.error_response = {
              status: 500
            };
            c.deferred.reject(c.error_response);
            $rootScope.$digest();
          }
        ]));

        it('should set failed upload status', function() {
          expect(backup.upload.status).toBe(false);
          expect(backup.upload.msg).toBe('upload failure (500)');
        });

        it('should reject returned promise with post response', function() {
          expect(c.error_cbk).toHaveBeenCalledWith(c.error_response);
        });

      });

    });

    describe('download', function(c) {

      var $http;

      beforeEach(inject([
        '$http',
        '$q',
        function(http, $q) {
          c.deferred = $q.defer();

          $http = http;
          spyOn($http, 'get').and.returnValue(c.deferred.promise);
        }
      ]));
      
      it('should GET /api/log/{download.id}', function() {
        backup.download.id = '1234';

        backup.download();

        expect($http.get).toHaveBeenCalledWith('/api/log/1234');
      });

      describe('on GET success', function(c) {

        beforeEach(inject([
          '$rootScope',
          function($rootScope) {
            c.success_cbk = jasmine.createSpy();

            backup.download.id = '1234';
            backup.download().then(c.success_cbk);

            c.battles = ['1234', '5678'];

            c.deferred.resolve({
              data: { battles: c.battles }
            });
            $rootScope.$digest();
          }
        ]));

        it('should set success download status', function() {
          expect(backup.download.status).toBe(true);
          expect(backup.download.msg).toBe('data downloaded');
        });

        it('should resolve returned promise with battles list', function() {
          expect(c.success_cbk).toHaveBeenCalledWith(c.battles);
        });

      });

      describe('on GET failure', function(c) {

        beforeEach(inject([
          '$rootScope',
          function($rootScope) {
            c.error_cbk = jasmine.createSpy();

            backup.download.id = '1234';
            backup.download().then(null, c.error_cbk);

            c.error_response = {
              status: 404
            };

            c.deferred.reject(c.error_response);
            $rootScope.$digest();
          }
        ]));

        it('should set failed download status', function() {
          expect(backup.download.status).toBe(false);
          expect(backup.download.msg).toBe('download failure (404)');
        });

        it('should reject returned promise with get response', function() {
          expect(c.error_cbk).toHaveBeenCalledWith(c.error_response);
        });

      });

    });

  });

});
