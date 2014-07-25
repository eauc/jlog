'use strict';

angular.module('jlogApp.services')
  .service('battles_display', [
    'battles',
    'battleFilter',
    'orderByFilter',
    function(battles,
             battleFilter,
             orderByFilter) {
      function more() {
        var more_battles = this.sorted_list.slice(this.last_index,
                                                  this.last_index + this.slice);
        this.display_list = this.display_list.concat(more_battles);
        this.last_index += this.slice;
        this.more = (this.last_index < this.sorted_list.length);
      }
      function sortBattles(active, invert, sort) {
        this.sorted_list = battleFilter(this.list, active, invert);
        this.sorted_list = orderByFilter(this.sorted_list,
                                         sort.types[sort.type].key,
                                         sort.reverse);
      }
      _.extend(battles, {
        sorted_list: [],
        display_list: [],
        slice: 15,
        last_index: 0,
        more: false,
        reset: function battlesDisplayReset(active, invert, sort) {
          this.sorted_list = [];
          this.display_list = [];
          this.slice = 15;
          this.last_index = 0;
          this.more = false;
          sortBattles.call(this, active, invert, sort);
          more.call(this);
        },
        showMore: function battlesDisplayShowMore() {
          console.log('display_battle_list showMore');
          if (this.more) {
            more.call(this);
          }
        }
      });
      return battles;
    }]);
