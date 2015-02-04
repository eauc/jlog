'use strict';

describe('service', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('server', function() {

    var server;

    beforeEach(inject([
      'server',
      '$httpBackend',
      function(_server, $httpBackend) {
        server = _server;
        this.httpBackend = $httpBackend;
      }
    ]));

    describe('upload(<battles>)', function() {
      beforeEach(function() {
        this.battles = [ 'b1','b2','b3','b4' ];
      });

      it('should post <battles> to server', function() {
        this.httpBackend
          .expectPOST('/api/log', {battles: this.battles})
          .respond(201, { id: 42 });

        server.upload(this.battles);

        this.httpBackend.flush();
      });

      when('post succeeds', function() {
        this.httpBackend
          .expectPOST('/api/log', {battles: this.battles})
          .respond(201, { id: '42' });

        this.cbk = jasmine.createSpy('cbk');
        server.upload(this.battles).then(this.cbk);

        this.httpBackend.flush();
      }, function() {
        it('should resolve promise with upload id', function() {
          expect(this.cbk).toHaveBeenCalledWith(['42', 'data uploaded']);
        });
      });

      when('post fails', function() {
        this.httpBackend
          .expectPOST('/api/log', {battles: this.battles})
          .respond(404);

        this.cbk = jasmine.createSpy('cbk');
        server.upload(this.battles).then(this.cbk);

        this.httpBackend.flush();
      }, function() {
        it('should resolve promise with null', function() {
          expect(this.cbk).toHaveBeenCalledWith([null, 'upload failure (404)']);
        });
      });
    });

    describe('download(<id>)', function() {
      beforeEach(function() {
        this.id = '42';
        this.battles = [ 'b1','b2','b3','b4' ];
      });

      it('should post <battles> to server', function() {
        this.httpBackend
          .expectGET('/api/log/'+this.id)
          .respond(201, { battles: this.battles });

        server.download(this.id);

        this.httpBackend.flush();
      });

      when('get succeeds', function() {
        this.httpBackend
          .expectGET('/api/log/'+this.id)
          .respond(201, { battles: this.battles });

        this.cbk = jasmine.createSpy('cbk');
        server.download(this.id).then(this.cbk);

        this.httpBackend.flush();
      }, function() {
        it('should resolve promise with download battles', function() {
          expect(this.cbk).toHaveBeenCalledWith([this.battles, 'data downloaded']);
        });
      });

      when('post fails', function() {
        this.httpBackend
          .expectGET('/api/log/'+this.id)
          .respond(404);

        this.cbk = jasmine.createSpy('cbk');
        server.download(this.id).then(this.cbk);

        this.httpBackend.flush();
      }, function() {
        it('should resolve promise with null', function() {
          expect(this.cbk).toHaveBeenCalledWith([null, 'download failure (404)']);
        });
      });
    });
  });

});
