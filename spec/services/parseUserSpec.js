'use strict';

describe('services', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('parseUser', function() {

    beforeEach(inject([
      'parseUser',
      '$httpBackend',
      function(parseUser,
               $httpBackend) {
        this.parseUserService = parseUser;

        this.$httpBackend = $httpBackend;
        spyOn(self.localStorage, 'getItem');
        spyOn(self.localStorage, 'setItem');
        spyOn(self.localStorage, 'removeItem');
      }
    ]));

    describe('init()', function() {
      beforeEach(inject([
        '$rootScope',
        function($rootScope) {
          self.localStorage.getItem
            .and.returnValue('validToken');

          this.$httpBackend
            .expectGET('https://api.parse.com/1/users/me', function(headers) {
              return headers['X-Parse-Session-Token'] === 'validToken';
            })
            .respond({ user: 'user' });
          
          this.parseUserService.init()
            .then((function(result) {
              this.result = result;
            }).bind(this));

          $rootScope.$digest();
        }
      ]));

      it('should retrieve sync state from local storage', function() {
        expect(self.localStorage.getItem)
          .toHaveBeenCalledWith('jlogApp.parse.sessionToken');
      });

      it('should return user from parse API', function() {
        this.$httpBackend.flush();
        
        expect(this.result)
          .toEqual({ user: 'user' });
      });
    });

    describe('signup(<signup>)', function() {
      describe('when signup succeeds', function() {
        beforeEach(function() {
          this.$httpBackend
            .expectPOST('https://api.parse.com/1/users', '{"username":"signup"}')
            .respond({ sessionToken: 'token' });
        
          this.parseUserService.signup({ username: 'signup' })
            .then((function(result) {
              this.result = result;
            }).bind(this));
        
          this.$httpBackend.flush();
        });
        
        it('should return new user from parse API', function() {
          expect(this.result)
            .toEqual({
              username: 'signup',
              sessionToken: 'token'
            });
        });
        
        it('should store sessionToken in localStorage', function() {
          expect(self.localStorage.setItem)
            .toHaveBeenCalledWith('jlogApp.parse.sessionToken', 'token');
        });
      });

      describe('when signup fails', function() {
        beforeEach(function() {
          this.$httpBackend
            .expectPOST('https://api.parse.com/1/users', '{"username":"signup"}')
            .respond(401, { error: 'error' });
        
          this.parseUserService.signup({ username: 'signup' })
            .catch((function(error) {
              this.error = error;
            }).bind(this));
        
          this.$httpBackend.flush();
        });
        
        it('should reject error from parse API', function() {
          expect(this.error).toBe('error');
        });
        
        it('should not store sessionToken in localStorage', function() {
          expect(self.localStorage.setItem)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('login(<login>)', function() {
      describe('when login succeeds', function() {
        beforeEach(function() {
          this.$httpBackend
            .expectGET('https://api.parse.com/1/login?username=login')
            .respond({ username: 'user', sessionToken: 'token' });
        
          this.parseUserService.login({ username: 'login' })
            .then((function(result) {
              this.result = result;
            }).bind(this));
        
          this.$httpBackend.flush();
        });
        
        it('should return user from parse API', function() {
          expect(this.result)
            .toEqual({
              username: 'user',
              sessionToken: 'token'
            });
        });
        
        it('should store sessionToken in localStorage', function() {
          expect(self.localStorage.setItem)
            .toHaveBeenCalledWith('jlogApp.parse.sessionToken', 'token');
        });
      });

      describe('when login fails', function() {
        beforeEach(function() {
          this.$httpBackend
            .expectGET('https://api.parse.com/1/login?username=login')
            .respond(401, { error: 'error' });
        
          this.parseUserService.login({ username: 'login' })
            .catch((function(error) {
              this.error = error;
            }).bind(this));
        
          this.$httpBackend.flush();
        });
        
        it('should reject error from parse API', function() {
          expect(this.error).toBe('error');
        });
        
        it('should not store sessionToken in localStorage', function() {
          expect(self.localStorage.setItem)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('logout(<logout>)', function() {
      describe('when logout succeeds', function() {
        beforeEach(function() {
          this.$httpBackend
            .expectPOST('https://api.parse.com/1/logout', undefined, function(headers) {
              return headers['X-Parse-Session-Token'] === 'token';
            })
            .respond(200);
        
          this.parseUserService.logout({ sessionToken: 'token' })
            .then((function(result) {
              this.result = result;
            }).bind(this));
        
          this.$httpBackend.flush();
        });
        
        it('should logout user from parse API', function() {
          expect(this.result)
            .toEqual({});
        });
        
        it('should remove sessionToken in localStorage', function() {
          expect(self.localStorage.removeItem)
            .toHaveBeenCalledWith('jlogApp.parse.sessionToken');
        });
      });

      describe('when logout fails', function() {
        beforeEach(function() {
          this.$httpBackend
            .expectPOST('https://api.parse.com/1/logout', undefined, function(headers) {
              return headers['X-Parse-Session-Token'] === 'token';
            })
            .respond(401, { error: 'error' });
        
          this.parseUserService.logout({ sessionToken: 'token' })
            .catch((function(error) {
              this.error = error;
            }).bind(this));
        
          this.$httpBackend.flush();
        });
        
        it('should reject error from parse API', function() {
          expect(this.error).toBe('error');
        });
        
        it('should not store sessionToken in localStorage', function() {
          expect(self.localStorage.setItem)
            .not.toHaveBeenCalled();
        });
      });
    });
  });
});
