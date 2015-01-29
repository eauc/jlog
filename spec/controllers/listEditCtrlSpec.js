'use strict';

describe('controllers', function() {

  beforeEach(function() {
    module('jlogApp.services');
    module('jlogApp.controllers');
  });

  describe('listEditCtrl', function(c) {

    beforeEach(inject([
      '$rootScope',
      '$controller',
      '$window',
      function($rootScope,
               $controller,
               $window) {
        this.scope = $rootScope.$new();
        spyOn(this.scope, '$watch');
        this.scope.battles = {
          display_list: [ 'battle1','battle2','battle3','battle4','battle5' ]
        };

        this.state = {
          current: { data: {} }
        };
        this.stateParams = { index: 2 };

        this.window = $window;
        spyOn($window, 'prompt');
        spyOn($window, 'confirm');

        $controller('listEditCtrl', { 
          '$scope': this.scope,
          '$state': this.state,
          '$stateParams': this.stateParams
        });
        $rootScope.$digest();
      }
    ]));

    it('should init battle', function() {
      expect(this.state.current.data.index).toBe(2);
      expect(this.state.current.data.battle).toBe('battle3');
      expect(this.scope.battle).toBe('battle3');
    });

    it('should init save_enable', function() {
      expect(this.state.current.data.save_enable).toBe(false);
    });

    it('should watch form validation', function() {
      expect(this.scope.$watch)
        .toHaveBeenCalledWith('battle_edit.$valid', jasmine.any(Function));
    });
    describe('on form validation change', function() {
      beforeEach(function() {
        this.onFormValidation = findCallByArgs(this.scope.$watch, function(args) {
          return args[0] === 'battle_edit.$valid';
        }).args[1];
        expect(this.onFormValidation).toBeA('Function');
      });

      it('should update save_enable', function() {
        this.onFormValidation(true);
        expect(this.state.current.data.save_enable).toBe(true);
        this.onFormValidation(false);
        expect(this.state.current.data.save_enable).toBe(false);
      });
    });

    using([
      [ 'type'     , 'keys'               ],
      [ 'event'    , ['setup','event']    ],
      [ 'opponent' , ['opponent','name']  ],
      [ 'scenario' , ['setup','scenario'] ],
    ], function(e,d) {
      describe('doAdd("'+e.type+'")', function() {
        beforeEach(function() {
          this.typeService = spyOnService(e.type+'s');
          this.scope.battles[e.type+'s'] = [ e.type+'s' ];
          this.scope.battle = {};
        });

        it('should prompt the user for new '+e.type+' name', function() {
          this.scope.doAdd(e.type);
          
          expect(this.window.prompt).toHaveBeenCalled();
        });

        when('user enters valid name', function() {
          this.window.prompt.and.returnValue('  valid  name ');

          this.scope.doAdd(e.type);
        }, function() {
          it('should add name to '+e.type+'s', function() {
            expect(this.typeService.add)
              .toHaveBeenCalledWith([ e.type+'s' ], 'valid name');
            expect(this.scope.battles[e.type+'s'])
              .toBe(e.type+'s.add.returnValue');
          });

          it('should update '+e.type+' in battle', function() {
            expect(_.getPath(this.scope.battle, e.keys))
              .toBe('valid name');
          });

          it('should update current state data battle', function() {
            expect(this.state.current.data.battle)
              .toEqual(this.scope.battle);
          });
        });
      });

      describe('doDelete("'+e.type+'")', function() {
        beforeEach(function() {
          this.typeService = spyOnService(e.type+'s');
          this.scope.battles[e.type+'s'] = [ e.type+'s' ];
          this.scope.battle = _.setPath({}, 'current value', e.keys, {});
        });

        it('should ask the user for confirmation', function() {
          this.scope.doDelete(e.type);
          
          expect(this.window.confirm).toHaveBeenCalled();
        });

        when('user does not confirms', function() {
          this.window.confirm.and.returnValue(false);

          this.scope.doDelete(e.type);
        }, function() {
          it('should do nothing', function() {
            expect(this.scope.battles[e.type+'s'])
              .toEqual([e.type+'s']);
            expect(_.getPath(this.scope.battle, e.keys))
              .toBe('current value');
          });
        });

        when('user confirms', function() {
          this.window.confirm.and.returnValue(true);

          this.scope.doDelete(e.type);
        }, function() {
          it('should drop name from '+e.type+'s', function() {
            expect(this.typeService.drop)
              .toHaveBeenCalledWith([ e.type+'s' ], 'current value');
            expect(this.scope.battles[e.type+'s'])
              .toBe(e.type+'s.drop.returnValue');
          });

          it('should delete '+e.type+' in battle', function() {
            expect(_.getPath(this.scope.battle, e.keys))
              .toBe(null);
          });

          it('should update current state data battle', function() {
            expect(this.state.current.data.battle)
              .toEqual(this.scope.battle);
          });
        });
      });
    });

    describe('doAddTag()', function() {
      beforeEach(function() {
        this.tagsService = spyOnService('tags');
        this.scope.battles.tags = [ 'tags' ];
        this.scope.battle = { tags: [ 'tag1', 'tag2' ] };
      });

      it('should prompt the user for new tag name', function() {
        this.scope.doAddTag();
        
        expect(this.window.prompt).toHaveBeenCalled();
      });

      when('user enters valid name', function() {
        this.window.prompt.and.returnValue('  valid  name ');

        this.scope.doAddTag();
      }, function() {
        it('should add name to tags', function() {
          expect(this.tagsService.add)
            .toHaveBeenCalledWith([ 'tags' ], 'valid name');
          expect(this.scope.battles.tags)
            .toBe('tags.add.returnValue');
        });

        it('should update tag in battle', function() {
          expect(_.getPath(this.scope.battle, 'tags'))
            .toEqual([ 'tag1', 'tag2', 'valid name']);
        });

        it('should update current state data battle', function() {
          expect(this.state.current.data.battle)
            .toEqual(this.scope.battle);
        });
      });
    });

    describe('doDeleteTag()', function() {
      beforeEach(function() {
        this.tagsService = spyOnService('tags');
        this.scope.battles.tags = [ 'tags' ];
        this.scope.battle = {
          tags: [ 'current1', 'current2' ]
        };
      });

      it('should ask the user for confirmation', function() {
        this.scope.doDeleteTag();
        
        expect(this.window.confirm).toHaveBeenCalled();
      });

      when('user does not confirms', function() {
        this.window.confirm.and.returnValue(false);

        this.scope.doDeleteTag();
      }, function() {
        it('should do nothing', function() {
          expect(this.scope.battles.tags)
            .toEqual(['tags']);
          expect(this.scope.battle.tags)
            .toEqual([ 'current1', 'current2' ]);
        });
      });
      
      when('user confirms', function() {
        this.window.confirm.and.returnValue(true);

        this.scope.doDeleteTag();
      }, function() {
        it('should drop all current tags from tags', function() {
          expect(this.tagsService.drop)
            .toHaveBeenCalledWith([ 'tags' ], [ 'current1', 'current2' ]);
          expect(this.scope.battles.tags)
            .toBe('tags.drop.returnValue');
        });

        it('should delete tags in battle', function() {
          expect(this.scope.battle.tags)
            .toEqual([]);
        });
      });
    });
  });

  describe('listEditBottomCtrl', function(c) {

    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        this.scope = $rootScope.$new();
        this.scope.stateGo = jasmine.createSpy('stateGo');
        this.scope.battles = {
          display_list: ['battles_list']
        };

        this.state = { current: { data: { index: 'currentIndex',
                                          battle: 'currentBattle' } } };
        this.stateParams = { index: '2' };

        $controller('listEditBottomCtrl', { 
          '$scope': this.scope,
          '$state': this.state,
          '$stateParams': this.stateParams
        });
        $rootScope.$digest();
      }
    ]));

    it('init state', function() {
      expect(this.scope.state).toBe(this.state.current.data);
    });

    describe('doSave()', function() {
      beforeEach(function() {
        this.battles = spyOnService('battles');
        spyOn(this.scope, 'doClose');

        this.scope.doSave();
      });

      it('should save battle', function() {
        expect(this.battles.save)
          .toHaveBeenCalledWith([ 'battles_list' ],
                                this.state.current.data.index,
                                this.state.current.data.battle);
        expect(this.scope.battles.display_list)
          .toBe('battles.save.returnValue');
      });

      it('should close battle edit', function() {
        this.scope.doSave();

        expect(this.scope.doClose).toHaveBeenCalled();
      });
    });

    describe('doClose()', function() {
      it('should go back to battle list', function() {
        this.scope.doClose();
        expect(this.scope.stateGo)
          .toHaveBeenCalledWith('battle');
      });
    });
  });

});
