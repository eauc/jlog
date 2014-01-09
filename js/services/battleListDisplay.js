'use strict';

angular.module('jlogApp.services')
    .service('battle_list_display', [
        'filterBattleFilter',
        'orderByFilter',
        'sort_types',
        function(filterBattleFilter,
                 orderByFilter,
                 sort_types) {
            function more() {
                console.log("display_battle_list more");
                var more_battles = this.sorted_battles.slice(this.last_index,
                                                             this.last_index + this.slice);
                this.battles = this.battles.concat(more_battles);
                this.last_index += this.slice;
                this.more = (this.last_index < this.sorted_battles.length);
            };
            function sortBattles(battles, filter, active, invert, sort) {
                this.sorted_battles = filterBattleFilter(battles, filter, active, invert);
                this.sorted_battles = orderByFilter(this.sorted_battles,
                                                    sort_types[sort.type].key,
                                                    sort.reverse);
            };
            return {
                battles: [],
                sorted_battles: [],
                slice: 15,
                last_index: 0,
                reset: function displayBattleListReset(battles, filter, active, invert, sort) {
                    this.battles = [];
                    this.sorted_battles = [];
                    this.slice = 15;
                    this.last_index = 0;
                    this.more = false;
                    sortBattles.call(this, battles, filter, active, invert, sort);
                    more.call(this);
                },
                showMore: function displayBattleListShowMore() {
                    console.log("display_battle_list showMore");
                    if(this.more) {
                        more.call(this);
                    }
                }
            }
        }]);
