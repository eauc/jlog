'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('ui.router');
    module('jlogApp.services');
    module('jlogApp.controllers');
  });

  describe('statsCtrl', function(c) {

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        this.scope = $rootScope.$new();
        spyOn(this.scope, '$watch');
        this.state = { current: {} };

        this.statsService = spyOnService('stats');

        $controller('statsCtrl', { 
          '$scope': this.scope,
          '$state': this.state,
        });
        // $rootScope.$digest();
      }
    ]));

    it('should init stats service', function() {
      expect(this.statsService.init).toHaveBeenCalled();
    });

    it('should init stats state', function() {
      expect(this.state.current.data.entry).toBe('result');
      expect(this.state.current.data.selector).toBe('total');
      expect(this.state.current.data.selector_arg).toBe(null);

      expect(this.scope.stats).toEqual({});
      expect(this.scope.state).toBe(this.state.current.data);
    });

    it('should watch battles display list', function() {
      expect(this.scope.$watch)
        .toHaveBeenCalledWith('battles.display_list', jasmine.any(Function));
    });
    describe('on display list change', function() {
      beforeEach(function() {
        this.watcher = findCallByArgs(this.scope.$watch, function(args) {
          return args[0] === 'battles.display_list';
        }).args[1];
        spyOn(this.state.current.data, 'doGenerate');
      });

      it('should re-generate current stats', function() {
        this.watcher('display_list');

        expect(this.state.current.data.doGenerate)
          .toHaveBeenCalled();
      });
    });

    describe('state.doGenerate()', function() {
      it('should generate state for current entry & selector', function() {
        this.state.current.data.entry = 'entry';
        this.state.current.data.selector = 'selector';
        this.state.current.data.selector_arg = 'selector_arg';
        this.scope.stats = [ 'stats' ];
        this.scope.battles = { display_list: [ 'display_list' ] };

        this.state.current.data.doGenerate();

        expect(this.statsService.generate)
          .toHaveBeenCalledWith([ 'stats' ], [ 'display_list' ],
                                'entry', 'selector', 'selector_arg');
        expect(this.scope.stats).toBe('stats.generate.returnValue');
      });
    });
  });

  describe('statsBottomCtrl', function(c) {

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        this.scope = $rootScope.$new();
        this.state = { current: { data: {
          doGenerate: jasmine.createSpy('doGenerate')
        } } };

        this.statsService = spyOnService('stats');

        $controller('statsBottomCtrl', { 
          '$scope': this.scope,
          '$state': this.state,
        });
        // $rootScope.$digest();
      }
    ]));

    it('should map state data to scope', function() {
      expect(this.scope.state).toBe(this.state.current.data);
    });

    it('should map stats selectors & entries to scope', function() {
      expect(this.scope.ENTRIES).toBe(this.statsService.ENTRIES);
      expect(this.scope.SELECTORS).toBe(this.statsService.SELECTORS);
    });

    describe('doSetEntry(<id>)', function() {
      beforeEach(function() {
        this.scope.doSetEntry('id');
      });

      it('should update state entry', function() {
        expect(this.state.current.data.entry).toBe('id');
      });

      it('should generate stats for new entry', function() {
        expect(this.state.current.data.doGenerate).toHaveBeenCalled();
      });
    });

    describe('doSetSelector(<id>)', function() {
      when('<id> is current selector', function() {
        this.state.current.data.selector = 'id';
        this.state.current.data.selector_arg = 'arg';

        this.scope.doSetSelector('id');
      }, function() {
        it('should keep current selector argument', function() {
          expect(this.state.current.data.selector_arg).toBe('arg');
        });
      });

      when('<id> is not current selector', function() {
        this.state.current.data.selector = 'other';
        this.state.current.data.selector_arg = 'arg';

        this.scope.doSetSelector('id');
      }, function() {
        it('should keep reset selector argument', function() {
          expect(this.state.current.data.selector_arg).toBe(null);
        });
      });

      it('should update state selector', function() {
        this.scope.doSetSelector('id');

        expect(this.state.current.data.selector).toBe('id');
      });

      it('should generate stats for new entry', function() {
        this.scope.doSetSelector('id');

        expect(this.state.current.data.doGenerate).toHaveBeenCalled();
      });
    });
  });

});
