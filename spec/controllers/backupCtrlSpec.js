'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.services');
    module('jlogApp.controllers');
  });

  describe('backupCtrl', function(c) {

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        this.scope = $rootScope.$new();
        this.scope.setBattles = jasmine.createSpy('setBattles');
        this.scope.stateGo = jasmine.createSpy('stateGo');
        this.scope.battles = {
          list: [ 'battles_list' ]
        };

        this.fileImportService = spyOnService('fileImport');
        this.igParserService = spyOnService('igParser');
        this.fileExportService = spyOnService('fileExport');
        this.serverService = spyOnService('server');

        $controller('backupCtrl', { 
          '$scope': this.scope,
        });
        $rootScope.$digest();
      }
    ]));

    it('should generate backup file', function() {
      expect(this.fileExportService.generate)
        .toHaveBeenCalledWith('json', this.scope.battles.list);
      expect(this.scope.backup.url)
        .toBe('fileExport.generate.returnValue');
      expect(this.scope.backup.name).toMatch(/jlog_\d+.json/);
    });

    it('should init igParser', function() {
      expect(this.igParserService.init).toHaveBeenCalled();
    });

    describe('doReadFile(<type>, <file>)', function() {
      beforeEach(inject(function($q) {
        this.read_defer = $q.defer();
        this.fileImportService.read._retVal = this.read_defer.promise;
      }));

      it('should reset read_result', function() {
        this.scope.read_result.type = ['previous'];

        this.scope.doReadFile('type', 'file');

        expect(this.scope.read_result.type).toEqual([]);
      });

      it('should import file', function() {
        this.scope.doReadFile('type', 'file');

        expect(this.fileImportService.read)
          .toHaveBeenCalledWith('type', 'file');
      });

      when('import fails', inject(function($rootScope) {
        this.scope.doReadFile('type', 'file');

        this.read_defer.reject(['errors']);
        $rootScope.$digest();
      }), function() {
        it('should update errors list', function() {
          expect(this.scope.read_result.type).toEqual(['errors']);
        });
      });

      when('import succeeds', inject(function($rootScope) {
        this.scope.doReadFile('type', 'file');

        this.read_defer.resolve([['battles'], ['errors']]);
        $rootScope.$digest();
      }), function() {
        it('should update battles list', function() {
          expect(this.scope.setBattles).toHaveBeenCalledWith(['battles']);
        });
        it('should update errors list', function() {
          expect(this.scope.read_result.type).toEqual(['errors', 'imported 1 battles']);
        });
        it('should show battles list', function() {
          expect(this.scope.stateGo).toHaveBeenCalledWith('battle');
        });
      });
    });

    describe('doUploadData()', function() {
      beforeEach(inject(function($q) {
        this.upload_defer = $q.defer();
        this.serverService.upload._retVal = this.upload_defer.promise;

        this.scope.battles = { list:['battles_list'] };
      }));

      it('should reset upload result', function() {
        this.scope.upload = { id:42, msg: 'toto' };

        this.scope.doUploadData();

        expect(this.scope.upload).toEqual({ id:null, msg:'Uploading...' });
      });

      it('should upload current battles list', function() {
        this.scope.doUploadData();

        expect(this.serverService.upload)
          .toHaveBeenCalledWith(['battles_list']);
      });

      when('upload is finished', inject(function($rootScope) {
        this.scope.doUploadData();

        this.upload_defer.resolve(['42', 'errors']);
        $rootScope.$digest();
      }), function() {
        it('should update upload result', function() {
          expect(this.scope.upload).toEqual({ id:'42', msg:'errors' });
        });
      });
    });

    describe('doDownloadData()', function() {
      beforeEach(inject(function($q) {
        this.download_defer = $q.defer();
        this.serverService.download._retVal = this.download_defer.promise;

        this.scope.download.id = '42';
      }));

      it('should download <id>', function() {
        this.scope.doDownloadData();

        expect(this.serverService.download)
          .toHaveBeenCalledWith('42');
      });

      when('download is finished', inject(function($rootScope) {
        this.scope.doDownloadData();
        this.rootScope = $rootScope;
      }), function() {
        it('should update download result', function() {
          this.download_defer.resolve([null, 'errors']);
          this.rootScope.$digest();

          expect(this.scope.download.msg).toBe('errors');
        });

        when('download succeeds', function() {
          this.download_defer.resolve([['battles_list'], 'errors']);
          this.rootScope.$digest();
        }, function() {
          it('should set battles', function() {
            expect(this.scope.setBattles)
              .toHaveBeenCalledWith(['battles_list']);
          });

          it('should display battles list', function() {
            expect(this.scope.stateGo)
              .toHaveBeenCalledWith('battle');
          });
        });
      });
    });

    describe('doClearStorage()', function() {
      beforeEach(inject(function($q) {
        this.battlesService = spyOnService('battles');
        this.filterService = spyOnService('filter');
      }));

      using([
        ['service'],
        ['battles'],
        ['filter' ],
      ], function(e, d) {
        it('should clear '+e.service+' storage', function() {
          this.scope.doClearStorage();
          
          expect(this[e.service+'Service'].clearStorage)
            .toHaveBeenCalled();
        });
      });
    });
  });

});
