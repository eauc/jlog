'use strict';

angular.module('jlogApp.services')
  .factory('filterMatchSimple', [
    function() {
      var filterMatchSimple = {
        create: function(data) {
          return _.extend({
            active: false,
            is: 'true',
            value: []
          }, data);
        },
        match: function(f, b, k) {
          var value = _.getPath(b, k);
          var match = ( _.isEmpty(f.value) ||
                        0 <= _.indexOf(f.value, value) );
          // console.log('simple('+f.value+','+f.is+','+b.index+','+k+') ' + match);
          return (f.is === 'true' ? match : !match);
        }
      };
      return filterMatchSimple;
    }
  ])
  .factory('compareDate', [
    function() {
      return function compareDate(date1, date2) {
        if (date1.year > date2.year) return 1;
        if (date1.year < date2.year) return -1;
        if (date1.month > date2.month) return 1;
        if (date1.month < date2.month) return -1;
        if (date1.day > date2.day) return 1;
        if (date1.day < date2.day) return -1;
        return 0;
      };
    }
  ])
  .factory('filterMatchComp', [
    function() {
      function typeMatchComp(type, comp) {
        switch(type) {
        case '==': return (comp === 0);
        case '!=': return (comp !== 0);
        case '>': return (comp === -1);
        case '>=': return (comp !== 1);
        case '<': return (comp === 1);
        case '<=': return (comp !== -1);
        }
        return false;
      }
      var filterMatchComp = {
        create: function(data, getDefault) {
          return _.deepExtend({
            active: false,
            is: '==',
            value: getDefault()
          }, data);
        },
        match: function filterMatchDate(f, b, k, c) {
          var value = _.getPath(b, k);
          var comp = c(f.value, value);
          var match = typeMatchComp(f.is, comp);
          // console.log('simple('+f.value+','+f.is+','+b.index+') ' + match);
          return match;
        }
      };
      return filterMatchComp;
    }
  ])
  .factory('filterMatchCaster', [
    function() {
      var filterMatchCaster = {
        create: function(data) {
          return _.deepExtend({
            active: false,
            is: 'true',
            value: {
              faction: null,
              caster: [],
            }
          }, data);
        },
        match: function(f, b, k) {
          var value = _.getPath(b, k);
          var match = ( f.value.faction === value.faction &&
                        (_.isEmpty(f.value.caster) || 
                         0 <= _.indexOf(f.value.caster, value.caster)) );
          // console.log('simple('+f.value.faction+'.'+f.value.caster+','+f.is+','+b.index+') '+match);
          return (f.is === 'true' ? match : !match);
        }
      };
      return filterMatchCaster;
    }
  ])
  .factory('filterMatchInitiative', [
    function() {
      var filterMatchInitiative = {
        create: function(data) {
          return _.extend({
            active: false,
            is: 'true',
            value: {
              won_roll: '',
              started: ''
            }
          }, data);
        },
        match: function(f, b) {
          var value = b.setup.initiative;
          var match = ( (s.isBlank(f.value.won_roll) ||
                         f.value.won_roll === value.won_roll) &&
                        (s.isBlank(f.value.started)  ||
                         f.value.started === value.started) );
          // console.log('simple('+f.value.won_roll+'.'+f.value.started+','+f.is+','+b.index+') '+match);
          return (f.is === 'true' ? match : !match);
        }
      };
      return filterMatchInitiative;
    }
  ])
  .factory('filterMatchTags', [
    function() {
      var filterMatchTags = {
        create: function(data) {
          return _.extend({
            active: false,
            is: 'any',
            value: [],
          }, data);
        },
        match: function(f, b) {
          if(_.isEmpty(f.value)) return true;
          if(_.isEmpty(b.tags)) {
            return ('none' === f.is ||
                    'not_all' === f.is);
          }
          var matches = _.map(f.value, function(value) {
            return (0 <= _.indexOf(b.tags, value));
          });
          var and = _.every(matches);
          var or = _.some(matches);
          // console.log('simple('+f.value+'.'+f.is+','+b.index+') '+and+','+or);
          switch (f.is) {
          case 'any':
            return or;
          case 'all':
            return and;
          case 'not_all':
            return !and;
          case 'none':
            return !or;
          default:
            return false;
          }
        }
      };
      return filterMatchTags;
    }
  ])
  .factory('filter', [
    '$window',
    'filterMatchSimple',
    'filterMatchComp',
    'filterMatchCaster',
    'filterMatchInitiative',
    'filterMatchTags',
    'compareDate',
    function($window,
             filterMatchSimple,
             filterMatchComp,
             filterMatchCaster,
             filterMatchInitiative,
             filterMatchTags,
             compareDate
            ) {
      function defaultDate() {
        var today = new Date();
        return {
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate()
        };
      }
      var filters = [
        { key: 'date',
          create: _.partial(filterMatchComp.create, _, defaultDate),
          match: _.partial(filterMatchComp.match, _, _, 'date', compareDate) },
        { key: 'my_army',
          create: filterMatchCaster.create,
          match: _.partial(filterMatchCaster.match, _, _, 'my_army') },
        { key: 'opp_name',
          create: filterMatchSimple.create,
          match: _.partial(filterMatchSimple.match, _, _, 'opponent.name') },
        { key: 'opp_caster',
          create: filterMatchCaster.create,
          match: _.partial(filterMatchCaster.match, _, _, 'opponent') },
        { key: 'result',
          create: filterMatchSimple.create,
          match: _.partial(filterMatchSimple.match, _, _, 'score') },
        { key: 'scenario',
          create: filterMatchSimple.create,
          match: _.partial(filterMatchSimple.match, _, _, 'setup.scenario') },
        { key: 'initiative',
          create: filterMatchInitiative.create,
          match: filterMatchInitiative.match },
        { key: 'size',
          create: _.partial(filterMatchComp.create, _, _.always(50)),
          match: _.partial(filterMatchComp.match, _, _, 'setup.size', _.comparator(_.lt)) },
        { key: 'event',
          create: filterMatchSimple.create,
          match: _.partial(filterMatchSimple.match, _, _, 'setup.event') },
        { key: 'tags',
          create: filterMatchTags.create,
          match: filterMatchTags.match },
      ];
      function toObject(data) {
        return _.isObject(data) ? data : {};
      }
      var filter = {
        init: function() {
          var fs;
          var fs_store = $window.localStorage.getItem('jlog_filter_v2');
          if(_.isString(fs_store)) {
            try {
              fs = JSON.parse(fs_store);
              if(_.isObject(fs)) {
                console.log('retrieve stored filter v2');
                // $window.localStorage.removeItem('jlog_filter');
                return filter.create(fs);
              }
            }
            catch(err) {
              console.log(err);
            }
          }
          return filter.create();
        },
        store: function(fs) {
          console.log('store filter v2');
          $window.localStorage.setItem('jlog_filter_v2', JSON.stringify(fs));
        },
        clearStorage: function() {
          console.log('clear stored filter');
          $window.localStorage.removeItem('jlog_filter');
          $window.localStorage.removeItem('jlog_filter_v2');
        },          
        create: function(data) {
          data = toObject(data);
          return _.chain(filters)
            .reduce(function(mem, f) {
              mem[f.key] = f.create(toObject(data[f.key]));
              return mem;
            }, {})
            .value();
        },
        match: function(fs, b, invert, cache) {
          cache = _.exists(cache) ? cache : {};
          if (!_.exists(cache[b.index])) {
            cache[b.index] = _.chain(filters)
              .filter(function(f) { return _.getPath(fs, f.key+'.active'); })
              .map(function(f) { return [f.match, fs[f.key]]; })
              .map(function(f) { return f[0](f[1], b); })
            // .spy('matches')
              .every()
            // .spy('every')
              .value();
          }
          return invert ? !cache[b.index] : cache[b.index];
        },
        clearCache: function(cache, index) {
          console.log('filter clearCache', index);
          if(!_.exists(index)) {
            return {};
          }
          else {
            return _.omit(cache, ''+index);
          }
        }
      };
      return filter;
    }
  ]);
