'use strict';

describe('service', function() {

    beforeEach(function() {
        module('jlogApp.services');
    });

    describe('backup', function() {

        var backup;

        beforeEach(inject([ 'backup', function(_backup) {
            backup = _backup;
        }]));

        describe('read', function() {

            var readAsText;
            var file;
            var success_cbk;
            var error_cbk;
            var FileReader;

            beforeEach(function() {
                file = {};
                success_cbk = jasmine.createSpy();
                error_cbk = jasmine.createSpy();

                readAsText = jasmine.createSpy();
                FileReader = {
                    'readAsText': readAsText
                };
                spyOn(window, 'FileReader').and.returnValue(FileReader);
                
                backup.read(file, success_cbk, error_cbk);
            });

            it('should read "file" as text', function() {
                expect(readAsText).toHaveBeenCalledWith(file);
            });

            describe('on abort', function() {
                
                var onAbort;

                beforeEach(function() {
                    onAbort = FileReader.onabort;
                    expect(typeof onAbort).toBe('function');

                    onAbort();
                });

                it('should call error_cbk with abort msg', function() {
                    expect(error_cbk).toHaveBeenCalledWith('abort reading file');
                });

            });

            describe('on error', function() {
                
                var onError;

                beforeEach(function() {
                    onError = FileReader.onerror;
                    expect(typeof onError).toBe('function');

                    onError();
                });

                it('should call error_cbk with error msg', function() {
                    expect(error_cbk).toHaveBeenCalledWith('error reading file');
                });

            });

            describe('on load', function() {
                
                var onLoad;

                beforeEach(function() {
                    onLoad = FileReader.onload;
                    expect(typeof onLoad).toBe('function');
                });

                describe('when the file data is valid', function() {

                    var data;

                    beforeEach(function() {
                        data = { 'test': 'data' };
                        
                        onLoad({ 'target': { 'result': JSON.stringify(data) } });
                    });

                    it('should call success_cbk with the file data', function() {
                        expect(success_cbk).toHaveBeenCalled();
                        expect(success_cbk.calls.mostRecent().args[0]).toEqual(data);
                    });

                });

                describe('when the file data is invalid', function() {

                    beforeEach(function() {
                        onLoad({ 'target': { 'result': '{ test: "data' } });
                    });

                    it('should call error_cbk with "invalid file" msg', function() {
                        expect(error_cbk).toHaveBeenCalledWith('invalid file');
                    });

                });

            });

        });

        describe('generate', function() {

            var data_string;
            var previous_url;
            var blob;
            var url;

            beforeEach(function() {
                previous_url = 'previous_url';
                window.URL = jasmine.createSpyObj('url', [ 
                    'createObjectURL', 
                    'revokeObjectURL'
                ]);
                url = 'url';
                window.URL.createObjectURL.and.returnValue(url);

                blob = {};
                spyOn(window, 'Blob').and.returnValue(blob);

                backup.save_url = previous_url;

                data_string = '{"test":"data"}';

                backup.generate(JSON.parse(data_string));
            });

            it('should revoke previous url', function() {
                expect(window.URL.revokeObjectURL).toHaveBeenCalledWith(previous_url);
            });

            it('should create blob from data', function() {
                expect(window.Blob).toHaveBeenCalled();
                expect(window.Blob.calls.mostRecent().args[0]).toEqual([ data_string ]);
                expect(window.Blob.calls.mostRecent().args[1]).toEqual({ type: 'text/plain' });
            });

            it('should create url from blob', function() {
                expect(window.URL.createObjectURL).toHaveBeenCalled();
                expect(window.URL.createObjectURL.calls.mostRecent().args[0]).toBe(blob);

                expect(backup.save_url).toBe(url);
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

            describe('on GET success', function() {

                var data;
                var success_cbk;

                beforeEach(function() {
                    data = { 'test': 'data' };
                    success_cbk = jasmine.createSpy();

                    $httpBackend
                        .when('GET', '/api/log/1234')
                        .respond(200, JSON.stringify(data));

                    backup.download_id = '1234';
                    backup.download(success_cbk);

                    $httpBackend.flush();
                });

                it('should set "download_result" to success', function() {
                    expect(backup.download_result).toBe('downloaded data');
                });

                it('should call success_cbk with returned data', function() {
                    expect(success_cbk).toHaveBeenCalledWith(data);
                });

            });

            describe('on GET failure', function() {

                var data;
                var error_cbk;

                beforeEach(function() {
                    data = { 'test': 'data' };
                    error_cbk = jasmine.createSpy();

                    $httpBackend
                        .when('GET', '/api/log/1234')
                        .respond(500);

                    backup.download_id = '1234';
                    backup.download(null, error_cbk);

                    $httpBackend.flush();
                });

                it('should set "download_result" to failure', function() {
                    expect(backup.download_result).toBe('download failure');
                });

                it('should call error_cbk', function() {
                    expect(error_cbk).toHaveBeenCalled();
                });

            });

        });

    });

});
