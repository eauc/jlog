'use strict';

describe('services', function() {

  beforeEach(function() {
    module('jlogApp.directives');
  });

  describe('prompt', function() {

    var prompt;
    beforeEach(inject([
      'prompt',
      function(_prompt) {
        prompt = _prompt;
      }
    ]));

    describe('register(<state>)', function() {
      it('should init state', function() {
        var state = {};
        prompt.register(state);
        expect(state.active).toBe(false);
        expect(state.message).toBe(null);
        expect(state.input).toBe(null);
        expect(state.type).toBe('alert');
      });
    });

    describe('prompt()', function() {
      beforeEach(inject(function($rootScope) {
        this.state = {};
        prompt.register(this.state);
        this.state.open = jasmine.createSpy('open');
        this.state.close = jasmine.createSpy('close');

        this.successCbk = jasmine.createSpy('successCbk');
        this.errorCbk = jasmine.createSpy('errorCbk');
        prompt.prompt('type', 'msg')
          .then(this.successCbk, this.errorCbk);
        $rootScope.$digest();
      }));

      it('should set state', function() {
        expect(this.state.open).toHaveBeenCalled();
        expect(this.state.input).toBe(null);
        expect(this.state.message).toEqual(['msg']);
        expect(this.state.type).toBe('type');
      });

      when('user validate prompt', inject(function($rootScope) {
        this.state.input = 'input';
        this.state.doValidate();
        $rootScope.$digest();
      }), function() {
        it('should close prompt', function() {
          expect(this.state.close).toHaveBeenCalled();
        });

        it('should resolve promise with input value', function() {
          expect(this.successCbk).toHaveBeenCalledWith('input');
        });
      });

      when('user cancel prompt', inject(function($rootScope) {
        this.state.input = 'input';
        this.state.doCancel();
        $rootScope.$digest();
      }), function() {
        it('should close prompt', function() {
          expect(this.state.close).toHaveBeenCalled();
        });

        it('should reject promise', function() {
          expect(this.errorCbk).toHaveBeenCalled();
        });
      });
    });
  });

});
