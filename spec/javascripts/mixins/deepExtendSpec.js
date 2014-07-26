'use strict';

describe('mixin', function() {

  describe('describe deepExtend(<dst>, <src>)', function(context) {

    it('should return <dst>', function() {
      var dst = {};
      expect(_.deepExtend(dst, { toto: 'titi' })).toBe(dst);
    });

    it('should add <src> properties to <dst> if not present', function() {
      var dst = _.deepExtend({
        toto: 'titi',
        object: {
          toto: 'titi',
        }
      }, {
        tata: 'toto',
        object: {
          tata: 'toto'
        }
      });
      expect(dst.tata).toBe('toto');
      expect(dst.object.tata).toBe('toto');
    });

    it('should leave <dst> properties unchanged if not present in src', function() {
      var dst = _.deepExtend({
        toto: 'titi',
        object: {
          toto: 'titi',
        }
      }, {
        tata: 'toto',
        object: {
          tata: 'toto'
        }
      });
      expect(dst.toto).toBe('titi');
      expect(dst.object.toto).toBe('titi');
    });

    it('should replace <dst> properties if present in <src>', function() {
      var dst = _.deepExtend({
        toto: 'titi',
        tata: 'tutu',
        object: {
          toto: 'titi',
          tata: function() {}
        }
      }, {
        tata: 'toto',
        object: {
          tata: { toto: 'titi' }
        }
      });
      expect(dst.tata).toBe('toto');
      expect(dst.object.tata).toEqual({ toto: 'titi' });
    });

  });

});
