'use strict';

describe('services', function() {

  beforeEach(function() {
    module('jlogApp.services');
  });

  describe('stats', function() {

    var stats;
    beforeEach(inject([
      'stats',
      function(_stats) {
        stats = _stats;
      }
    ]));

    describe('generate(<battles>, <entry>, <selector>, <selector arg>)', function() {
      beforeEach(function() {
        spyOn(stats.SELECTORS.total, 'sort')
          .and.returnValue(['group1', 'group2']);
        var results = [{ title: 'result2' }, { title: 'result1' }];
        spyOn(stats.ENTRIES.result, 'reduce')
          .and.callFake(function(b, i) { return results[i]; });
        this.battles = ['battles'];

        this.ret = stats.generate({}, this.battles, 'result', 'total', 'arg');
      });

      it('should sort <battles> by <selector>', function() {
        expect(stats.SELECTORS.total.sort)
          .toHaveBeenCalledWith(this.battles, 'arg');
      });

      it('should reduce <entry> for each group', function() {
        expect(stats.ENTRIES.result.reduce)
          .toHaveBeenCalledWith('group1', 0, ['group1', 'group2']);
        expect(stats.ENTRIES.result.reduce)
          .toHaveBeenCalledWith('group2', 1, ['group1', 'group2']);
      });

      it('should sort result by title', function() {
        expect(this.ret.result['total.arg'])
          .toEqual([{ title: 'result1' }, { title: 'result2' }]);
      });
    });

    describe('init()', function() {
      beforeEach(function() {
        this.statEntryFactionService = spyOnService('statEntryFaction');
        this.statEntryCasterService = spyOnService('statEntryCaster');
        this.statEntryScenarioService = spyOnService('statEntryScenario');
        this.statEntryTimeResultService = spyOnService('statEntryTimeResult');

        this.statSelectorFactionService = spyOnService('statSelectorFaction');
        this.statSelectorCasterService = spyOnService('statSelectorCaster');
        this.statSelectorScenarioService = spyOnService('statSelectorScenario');
        this.statSelectorResultService = spyOnService('statSelectorResult');

        stats.init();
      });

      it('should init entries services', function() {
        expect(this.statEntryFactionService.init).toHaveBeenCalled();
        expect(this.statEntryCasterService.init).toHaveBeenCalled();
        expect(this.statEntryScenarioService.init).toHaveBeenCalled();
        expect(this.statEntryTimeResultService.init).toHaveBeenCalled();
      });

      it('should init selectors services', function() {
        expect(this.statSelectorFactionService.init).toHaveBeenCalled();
        expect(this.statSelectorCasterService.init).toHaveBeenCalled();
        expect(this.statSelectorScenarioService.init).toHaveBeenCalled();
        expect(this.statSelectorResultService.init).toHaveBeenCalled();
      });
    });
  });

});
