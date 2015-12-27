'use strict';

describe('services', function() {

  beforeEach(function() {
    this.promptService = jasmine.createSpyObj('prompt', [
      'prompt'
    ]);    
    module({
      'prompt': this.promptService
    });
    module('jlogApp.services');
  });

  describe('parseLog', function() {

    beforeEach(inject([
      'parseLog',
      '$httpBackend',
      function(parseLog,
               $httpBackend) {
        this.parseLogService = parseLog;

        this.$httpBackend = $httpBackend;
        spyOn(self.localStorage, 'getItem');
        spyOn(self.localStorage, 'setItem');
        spyOn(self.localStorage, 'removeItem');
        self.LZString = {
          compressToUTF16: jasmine.createSpy('compressToUTF16')
            .and.callFake(function(s) {
              return s+'_compressed';
            }),
          decompressFromUTF16: jasmine.createSpy('decompressFromUTF16')
            .and.callFake(function(s) {
              return s;
            })
        };
        mockReturnPromise(this.promptService.prompt);
      }
    ]));

    describe('sync(<user>, <sync>, <data>)', function() {
      beforeEach(function() {
        spyOn(this.parseLogService, 'retrieveInfo');
        mockReturnPromise(this.parseLogService.retrieveInfo);
        spyOn(this.parseLogService, 'create');
        mockReturnPromise(this.parseLogService.create);
        spyOn(this.parseLogService, 'updateLocalFromServer');
        mockReturnPromise(this.parseLogService.updateLocalFromServer);
        spyOn(this.parseLogService, 'updateServerFromLocal');
        mockReturnPromise(this.parseLogService.updateServerFromLocal);

        this.parseLogService.sync('user', { current: 'current' }, 'data')
          .then((function(result) {
            this.result = result;
          }).bind(this))
          .catch((function(error) {
            this.error = error;
          }).bind(this));
      });

      it('should retrieve sync info', function() {
        expect(this.parseLogService.retrieveInfo)
          .toHaveBeenCalledWith('user');
      });

      describe('when log does not exists for <user>', function() {
        beforeEach(function() {
          this.parseLogService.retrieveInfo.reject();
        });

        it('should create log for <user>', function() {
          expect(this.parseLogService.create)
            .toHaveBeenCalledWith('user', 'data');
        });

        describe('when creation succeeds', function() {
          beforeEach(function() {
            this.parseLogService.create.resolve({ updatedAt: 'updatedAt' });
          });

          it('should resolve with creation log', function() {
            expect(this.result)
              .toEqual([{ updatedAt: 'updatedAt' }]);
          });
        });

        describe('when creation fails', function() {
          beforeEach(function() {
            this.parseLogService.create.reject('reason');
          });

          it('should reject with creation error', function() {
            expect(this.error)
              .toEqual('reason');
          });
        });
      });
      
      describe('when log exists for <user>', function() {
        describe('when server is up2date', function() {
          beforeEach(function() {
            this.parseLogService.retrieveInfo
              .resolve({ updatedAt: 'current' });
          });

          it('should resolve with server log', function() {
            expect(this.result)
              .toEqual([{ updatedAt: 'current' }]);
          });
        });

        describe('when server is not up2date', function() {
          beforeEach(function() {
            this.parseLogService.retrieveInfo
              .resolve({ updatedAt: 'other' });
          });

          it('should try to update local from server', function() {
            expect(this.parseLogService.updateLocalFromServer)
              .toHaveBeenCalledWith('user', { current: 'current' }, 'data');
          });

          describe('when update succeeds', function() {
            beforeEach(function() {
              this.parseLogService.updateLocalFromServer
                .resolve('update_local_from_server');
            });

            it('should resolve with update result', function() {
              expect(this.result)
                .toBe('update_local_from_server');
            });
          });

          describe('when update fails', function() {
            beforeEach(function() {
              this.parseLogService.updateLocalFromServer
                .reject();
            });

            it('should try to update server from local', function() {
              expect(this.parseLogService.updateServerFromLocal)
                .toHaveBeenCalledWith('user', { current: 'current' }, 'data');
            });

            describe('when update succeeds', function() {
              beforeEach(function() {
                this.parseLogService.updateServerFromLocal
                  .resolve('update_server_from_local');
              });

              it('should resolve with update result', function() {
                expect(this.result)
                  .toBe('update_server_from_local');
              });
            });

            describe('when update fails', function() {
              beforeEach(function() {
                this.parseLogService.updateServerFromLocal
                  .reject();
              });

              it('should reject with "diverge"', function() {
                expect(this.error)
                  .toBe('diverge');
              });
            });
          });
        });
      });
    });
    
    describe('retrieveInfo(<user>)', function() {
      describe('when query succeeds', function() {
        beforeEach(function() {
          this.$httpBackend.expectGET('https://api.parse.com/1/classes/Log?keys=updatedAt&where=%7B%22owner%22:%7B%22__type%22:%22Pointer%22,%22className%22:%22_User%22,%22objectId%22:%22userObject%22%7D%7D', function(headers) {
            return headers['X-Parse-Session-Token'] === 'token';
          }).respond({ results: [{ objectId: 'logObject', createdAt: 'createdAt' }] });

          this.parseLogService.retrieveInfo({ objectId: 'userObject',
                                              sessionToken: 'token' })
            .then((function(result) {
              this.result = result;
            }).bind(this))
            .catch((function(error) {
              this.error = error;
            }).bind(this));

          this.$httpBackend.flush();
        });

        it('should return first log', function() {
          expect(this.result)
            .toEqual({ objectId: 'logObject', createdAt: 'createdAt' });
        });
      });

      describe('when query returns empty', function() {
        beforeEach(function() {
          this.$httpBackend.expectGET('https://api.parse.com/1/classes/Log?keys=updatedAt&where=%7B%22owner%22:%7B%22__type%22:%22Pointer%22,%22className%22:%22_User%22,%22objectId%22:%22userObject%22%7D%7D', function(headers) {
            return headers['X-Parse-Session-Token'] === 'token';
          }).respond({ results: [] });

          this.parseLogService.retrieveInfo({ objectId: 'userObject',
                                              sessionToken: 'token' })
            .then((function(result) {
              this.result = result;
            }).bind(this))
            .catch((function(error) {
              this.error = error;
            }).bind(this));

          this.$httpBackend.flush();
        });

        it('should reject with "no result"', function() {
          expect(this.error)
            .toEqual('no result');
        });
      });

      describe('when query fails', function() {
        beforeEach(function() {
          this.$httpBackend.expectGET('https://api.parse.com/1/classes/Log?keys=updatedAt&where=%7B%22owner%22:%7B%22__type%22:%22Pointer%22,%22className%22:%22_User%22,%22objectId%22:%22userObject%22%7D%7D', function(headers) {
            return headers['X-Parse-Session-Token'] === 'token';
          }).respond(401, { error: 'error' });

          this.parseLogService.retrieveInfo({ objectId: 'userObject',
                                              sessionToken: 'token' })
            .then((function(result) {
              this.result = result;
            }).bind(this))
            .catch((function(error) {
              this.error = error;
            }).bind(this));

          this.$httpBackend.flush();
        });

        it('should reject with query error', function() {
          expect(this.error)
            .toEqual('error');
        });
      });
    });
    
    describe('create(<user>, <data>)', function() {
      describe('when creation succeeds', function() {
        beforeEach(function() {
          this.$httpBackend.expectPOST('https://api.parse.com/1/classes/Log', {
            log: '"data"_compressed',
            owner: { __type: 'Pointer',
                     className: '_User',
                     objectId: 'userObject'
                   }
          }, function(headers) {
            return headers['X-Parse-Session-Token'] === 'token';
          })
            .respond({ objectId: 'logObject', createdAt: 'createdAt' });

          this.parseLogService.create({ objectId: 'userObject',
                                        sessionToken: 'token' }, 'data')
            .then((function(result) {
              this.result = result;
            }).bind(this))
            .catch((function(error) {
              this.error = error;
            }).bind(this));

          this.$httpBackend.flush();
        });

        it('should return creation log', function() {
          expect(this.result)
            .toEqual({ objectId: 'logObject', updatedAt: 'createdAt' });
        });
      });

      describe('when creation fails', function() {
        beforeEach(function() {
          this.$httpBackend.expectPOST('https://api.parse.com/1/classes/Log')
            .respond(401, { error: 'error' });

          this.parseLogService.create({ objectId: 'userObject',
                                        sessionToken: 'token' }, 'data')
            .then((function(result) {
              this.result = result;
            }).bind(this))
            .catch((function(error) {
              this.error = error;
            }).bind(this));

          this.$httpBackend.flush();
        });

        it('should reject with creation error', function() {
          expect(this.error)
            .toEqual('error');
        });
      });
    });

    describe('updateServerFromLocal(<user>, <sync>, <data>)', function() {
      beforeEach(function() {
        spyOn(this.parseLogService, 'retrieveInfo');
        mockReturnPromise(this.parseLogService.retrieveInfo);

        this.user = { sessionToken: 'token' };
        this.doTest = function() {
          this.parseLogService.updateServerFromLocal(this.user, this.sync, 'data')
            .then((function(result) {
              this.result = result;
            }).bind(this))
            .catch((function(error) {
              this.error = error;
            }).bind(this));
        };
      });

      it('should retrieve sync info', function() {
        this.doTest();
        expect(this.parseLogService.retrieveInfo)
          .toHaveBeenCalledWith(this.user);
      });

      describe('when server is ahead from last update', function() {
        beforeEach(function() {
          this.sync = { last: '2015-10-01' };
          this.doTest();

          this.parseLogService.retrieveInfo.resolve({ updatedAt: '2015-10-02' });
        });

        it('should prompt for update', function() {
          expect(this.promptService.prompt)
            .toHaveBeenCalledWith('confirm', [
              'Local data & Online data diverge.',
              'Do you want to update Online with Local data ?'
            ]);
        });

        describe('when user cancels prompt', function() {
          beforeEach(function() {
            this.promptService.prompt.reject('cancel');
          });

          it('should reject update', function() {
            expect(this.error).toBe('cancel');
          });
        });
      });

      describe('when last update is undefined', function() {
        beforeEach(function() {
          this.sync = { last: null };
          this.doTest();

          this.parseLogService.retrieveInfo.resolve({ updatedAt: '2015-10-02' });
        });

        it('should prompt for update', function() {
          expect(this.promptService.prompt)
            .toHaveBeenCalledWith('confirm', [
              'Local data & Online data diverge.',
              'Do you want to update Online with Local data ?'
            ]);
        });

        describe('when user cancels prompt', function() {
          beforeEach(function() {
            this.promptService.prompt.reject('cancel');
          });

          it('should reject update', function() {
            expect(this.error).toBe('cancel');
          });
        });
      });

      describe('when update is confirmed', function() {
        beforeEach(function() {
          this.sync = { last: '2015-10-02' };
          this.doTest();
        });

        it('should update server from local data', function() {
          this.$httpBackend.expectPUT('https://api.parse.com/1/classes/Log/logObject', {
            log: '"data"_compressed'
          }, function(headers) {
            return headers['X-Parse-Session-Token'] === 'token';
          }).respond(200, { updatedAt: 'updatedAt' });

          this.parseLogService.retrieveInfo.resolve({ updatedAt: '2015-10-01',
                                                      objectId: 'logObject' });

          this.$httpBackend.flush();
          
          expect(this.result)
            .toEqual([ { updatedAt: 'updatedAt', objectId: 'logObject' } ]);
        });
      });
    });

    describe('updateLocalFromServer(<user>, <sync>, <data>)', function() {
      beforeEach(function() {
        spyOn(this.parseLogService, 'retrieveInfo');
        mockReturnPromise(this.parseLogService.retrieveInfo);

        this.user = { sessionToken: 'token' };
        this.doTest = function() {
          this.parseLogService.updateLocalFromServer(this.user, this.sync, 'data')
            .then((function(result) {
              this.result = result;
            }).bind(this))
            .catch((function(error) {
              this.error = error;
            }).bind(this));
        };
      });

      it('should retrieve sync info', function() {
        this.doTest();
        expect(this.parseLogService.retrieveInfo)
          .toHaveBeenCalledWith(this.user);
      });

      describe('when server is ahead from last update', function() {
        beforeEach(function() {
          this.sync = { last: '2015-10-02' };
          this.doTest();

          this.parseLogService.retrieveInfo.resolve({ updatedAt: '2015-10-01' });
        });

        it('should reject with "server is behind"', function() {
          expect(this.error)
            .toBe('server is behind');
        });
      });

      describe('when local is invalid & server is ahead from last update', function() {
        beforeEach(function() {
          this.sync = { current: null, last: '2015-10-01' };
          this.doTest();

          this.parseLogService.retrieveInfo.resolve({ updatedAt: '2015-10-02' });
        });

        it('should prompt for update', function() {
          expect(this.promptService.prompt)
            .toHaveBeenCalledWith('confirm', [
              'Local data & Online data diverge.',
              'Do you want to update Local with Online data ?'
            ]);
        });

        describe('when user cancels prompt', function() {
          beforeEach(function() {
            this.promptService.prompt.reject('cancel');
          });

          it('should reject update', function() {
            expect(this.error).toBe('cancel');
          });
        });
      });

      describe('when local is invalid & last update is undefined', function() {
        beforeEach(function() {
          this.sync = { current: null, last: null };
          this.doTest();

          this.parseLogService.retrieveInfo.resolve({ updatedAt: '2015-10-02' });
        });

        it('should prompt for update', function() {
          expect(this.promptService.prompt)
            .toHaveBeenCalledWith('confirm', [
              'Local data & Online data diverge.',
              'Do you want to update Local with Online data ?'
            ]);
        });

        describe('when user cancels prompt', function() {
          beforeEach(function() {
            this.promptService.prompt.reject('cancel');
          });

          it('should reject update', function() {
            expect(this.error).toBe('cancel');
          });
        });
      });

      describe('when local is valid & server is ahead of last update', function() {
        beforeEach(function() {
          this.sync = { current: '2015-10-01', last: '2015-10-01' };
          this.doTest();

          this.parseLogService.retrieveInfo.resolve({ updatedAt: '2015-10-02',
                                                      objectId: 'logObject' });
        });

        it('should prompt for update', function() {
          expect(this.promptService.prompt)
            .toHaveBeenCalledWith('confirm', [
              'Online data is newer than Local data.',
              'Do you want to update Local with Online data ?'
            ]);
        });

        describe('when user cancels prompt', function() {
          beforeEach(function() {
            this.promptService.prompt.reject('cancel');
          });

          it('should reject update', function() {
            expect(this.error).toBe('cancel');
          });
        });

        describe('when update is confirmed', function() {
          it('should update local from server data', function() {
            this.$httpBackend
              .expectGET('https://api.parse.com/1/classes/Log/logObject?keys=log', function(headers) {
                return headers['X-Parse-Session-Token'] === 'token';
              })
              .respond(200, { objectId: 'objectId',
                              updatedAt: 'updatedAt',
                              log: '{ "data": "data" }'
                            });

            this.promptService.prompt.resolve('confirm');
            
            this.$httpBackend.flush();
            
            expect(this.result)
              .toEqual([
                { objectId: 'objectId', updatedAt: 'updatedAt' },
                { data: 'data' }
              ]);
          });
        });
      });
    });
  });
});
