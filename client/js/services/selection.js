'use strict';

angular.module('jlogApp.services')
    .factory('selection', [function() {
        var setMyArmy = function selectionSetMyArmy(battles) {
            var i, modified = false;
            if ('string' === typeof(this.my_army.faction) &&
               0 < this.my_army.faction.length) {
                modified = true;
                for (i = 0 ; i < this.battles.length ; i++) {
                    battles[this.battles[i]].my_army.faction =
                        this.my_army.faction;
                    battles[this.battles[i]].my_army.caster = '';
                }
            }
            if ('string' === typeof(this.my_army.caster) &&
               0 < this.my_army.caster.length) {
                modified = true;
                for (i = 0 ; i < this.battles.length ; i++) {
                    battles[this.battles[i]].my_army.caster =
                        this.my_army.caster;
                }
            }
            return modified;
        };
        var setOpponent = function selectionSetOpponent(battles) {
            var i, modified = false;
            if ('string' === typeof(this.opponent.name) &&
               0 < this.opponent.name.length) {
                modified = true;
                for (i = 0 ; i < this.battles.length ; i++) {
                    battles[this.battles[i]].opponent.name =
                        this.opponent.name;
                }
            }
            if ('string' === typeof(this.opponent.faction) &&
               0 < this.opponent.faction.length) {
                modified = true;
                for (i = 0 ; i < this.battles.length ; i++) {
                    battles[this.battles[i]].opponent.faction =
                        this.opponent.faction;
                    battles[this.battles[i]].opponent.caster = '';
                }
            }
            if ('string' === typeof(this.opponent.caster) &&
               0 < this.opponent.caster.length) {
                modified = true;
                for (i = 0 ; i < this.battles.length ; i++) {
                    battles[this.battles[i]].opponent.caster =
                        this.opponent.caster;
                }
            }
            return modified;
        };
        var setPoints = function selectionSetPoints(battles) {
            var i, modified = false;
            for (i = 0 ; i < this.battles.length ; i++) {
                if (undefined === battles[this.battles[i]].points) {
                    battles[this.battles[i]].points = {
                        my_army: {
                            scenario: null,
                            army: null
                        },
                        opponents: {
                            scenario: null,
                            army: null
                        }
                    };
                }
                if (undefined === battles[this.battles[i]].points.my_army) {
                    battles[this.battles[i]].points.my_army = {
                        scenario: null,
                        army: null
                    };
                }
                if (undefined === battles[this.battles[i]].points.opponent) {
                    battles[this.battles[i]].points.opponent = {
                        scenario: null,
                        army: null
                    };
                }
            }
            if ('number' === typeof(this.points.my_army.scenario)) {
                modified = true;
                for (i = 0 ; i < this.battles.length ; i++) {
                    battles[this.battles[i]].points.my_army.scenario =
                        this.points.my_army.scenario;
                }
            }
            if ('number' === typeof(this.points.my_army.army)) {
                modified = true;
                for (i = 0 ; i < this.battles.length ; i++) {
                    battles[this.battles[i]].points.my_army.army =
                        this.points.my_army.army;
                }
            }
            if ('number' === typeof(this.points.opponent.scenario)) {
                modified = true;
                for (i = 0 ; i < this.battles.length ; i++) {
                    battles[this.battles[i]].points.opponent.scenario =
                        this.points.opponent.scenario;
                }
            }
            if ('number' === typeof(this.points.opponent.army)) {
                modified = true;
                for (i = 0 ; i < this.battles.length ; i++) {
                    battles[this.battles[i]].points.opponent.army =
                        this.points.opponent.army;
                }
            }
            return modified;
        };
        var setDate = function selectionSetDate(battles) {
            var i, modified = false;
            for (i = 0 ; i < this.battles.length ; i++) {
                if (undefined === battles[this.battles[i]].date) {
                    battles[this.battles[i]].date = {
                        year: 2000,
                        month: 1,
                        day: 1
                    };
                }
            }
            if ('number' === typeof(this.date.year)) {
                modified = true;
                for (i = 0 ; i < this.battles.length ; i++) {
                    battles[this.battles[i]].date.year =
                        this.date.year;
                }
            }
            if ('number' === typeof(this.date.month)) {
                modified = true;
                for (i = 0 ; i < this.battles.length ; i++) {
                    battles[this.battles[i]].date.month =
                        this.date.month;
                }
            }
            if ('number' === typeof(this.date.day)) {
                modified = true;
                for (i = 0 ; i < this.battles.length ; i++) {
                    battles[this.battles[i]].date.day =
                        this.date.day;
                }
            }
            return modified;
        };
        var setScenario = function selectionSetScenario(battles) {
            var i, modified = false;
            for (i = 0 ; i < this.battles.length ; i++) {
                if (undefined === battles[this.battles[i]].setup) {
                    battles[this.battles[i]].setup = {
                        scenario: null,
                        event: null,
                        size: null,
                        initiative: {
                            won_roll: null,
                            started: null
                        }
                    };
                }
            }
            if ('string' === typeof(this.setup.scenario)) {
                modified = true;
                for (i = 0 ; i < this.battles.length ; i++) {
                    battles[this.battles[i]].setup.scenario =
                        this.setup.scenario;
                }
            }
            return modified;
        };
        var setSize = function selectionSetSize(battles) {
            var i, modified = false;
            for (i = 0 ; i < this.battles.length ; i++) {
                if (undefined === battles[this.battles[i]].setup) {
                    battles[this.battles[i]].setup = {
                        scenario: null,
                        event: null,
                        size: null,
                        initiative: {
                            won_roll: null,
                            started: null
                        }
                    };
                }
            }
            if ('number' === typeof(this.setup.size)) {
                modified = true;
                for (i = 0 ; i < this.battles.length ; i++) {
                    battles[this.battles[i]].setup.size =
                        this.setup.size;
                }
            }
            return modified;
        };
        var setEvent = function selectionSetEvent(battles) {
            var i, modified = false;
            for (i = 0 ; i < this.battles.length ; i++) {
                if (undefined === battles[this.battles[i]].setup) {
                    battles[this.battles[i]].setup = {
                        scenario: null,
                        event: null,
                        size: null,
                        initiative: {
                            won_roll: null,
                            started: null
                        }
                    };
                }
            }
            if ('string' === typeof(this.setup.event)) {
                modified = true;
                for (i = 0 ; i < this.battles.length ; i++) {
                    battles[this.battles[i]].setup.event =
                        this.setup.event;
                }
            }
            return modified;
        };
        var setScore = function selectionSetScore(battles) {
            var i, modified = false;
            if ('string' === typeof(this.score)) {
                modified = true;
                for (i = 0 ; i < this.battles.length ; i++) {
                    battles[this.battles[i]].score =
                        this.score;
                }
            }
            return modified;
        };
        var setTags = function selectionSetTags(battles) {
            var i, modified = false;
            if (0 < this.tags.length) {
                modified = true;
                for (i = 0 ; i < this.battles.length ; i++) {
                    battles[this.battles[i]].tags =
                        this.tags.slice(0);
                }
            }
            return modified;
        };
        var addTags = function selectionAddTags(battles) {
            var i, modified = false;
            if (0 < this.tags.length) {
                modified = true;
                for (i = 0 ; i < this.battles.length ; i++) {
                    var j;
                    for (j = 0 ; j < this.tags.length ; j++) {
                        if (undefined === battles[this.battles[i]].tags) {
                            battles[this.battles[i]].tags = [];
                        }
                        if (0 > battles[this.battles[i]].tags.indexOf(this.tags[j])) {
                            battles[this.battles[i]].tags.push(this.tags[j]);
                        }
                    }
                }
            }
            return modified;
        };
        var unsetMyArmy = function selectionUnsetMyArmy(battles) {
            var i;
            for (i = 0 ; i < this.battles.length ; i++) {
                this.my_army.faction = null;
                this.my_army.caster = null;
                battles[this.battles[i]].my_army.faction = null;
                battles[this.battles[i]].my_army.caster = null;
            }
        };
        var unsetOpponent = function selectionUnsetOpponent(battles) {
            var i;
            for (i = 0 ; i < this.battles.length ; i++) {
                this.opponent.name = null;
                this.opponent.faction = null;
                this.opponent.caster = null;
                battles[this.battles[i]].opponent.name = null;
                battles[this.battles[i]].opponent.faction = null;
                battles[this.battles[i]].opponent.caster = null;
            }
        };
        var unsetPoints = function selectionUnsetPoints(battles) {
            var i;
            for (i = 0 ; i < this.battles.length ; i++) {
                this.points = {
                    my_army: {
                        scenario: null,
                        army: null
                    },
                    opponent: {
                        scenario: null,
                        army: null
                    }
                };
                battles[this.battles[i]].points = {
                    my_army: {
                        scenario: null,
                        army: null
                    },
                    opponent: {
                        scenario: null,
                        army: null
                    }
                };
            }
        };
        var unsetDate = function selectionUnsetDate(battles) {
            var i;
            for (i = 0 ; i < this.battles.length ; i++) {
                this.date = {
                    year: null,
                    month: null,
                    day: null
                };
                battles[this.battles[i]].date = {
                    year: 2000,
                    month: 1,
                    day: 1
                };
            }
        };
        var unsetScenario = function selectionUnsetScenario(battles) {
            var i;
            for (i = 0 ; i < this.battles.length ; i++) {
                this.setup.scenario = null;
                battles[this.battles[i]].setup.scenario = null;
            }
        };
        var unsetSize = function selectionUnsetSize(battles) {
            var i;
            for (i = 0 ; i < this.battles.length ; i++) {
                this.setup.size = null;
                battles[this.battles[i]].setup.size = null;
            }
        };
        var unsetEvent = function selectionUnsetEvent(battles) {
            var i;
            for (i = 0 ; i < this.battles.length ; i++) {
                this.setup.event = null;
                battles[this.battles[i]].setup.event = null;
            }
        };
        var unsetScore = function selectionUnsetScore(battles) {
            var i;
            for (i = 0 ; i < this.battles.length ; i++) {
                this.score = null;
                battles[this.battles[i]].score = null;
            }
        };
        var unsetTags = function selectionUnsetTags(battles) {
            var i;
            for (i = 0 ; i < this.battles.length ; i++) {
                this.tags = [];
                battles[this.battles[i]].tags = [];
            }
        };
        var unsetAddTags = function selectionUnsetAddTags(battles) {
            var i;
            for (i = 0 ; i < this.battles.length ; i++) {
                var j;
                for (j = 0 ; j < this.tags.length ; j++) {
                    var index = battles[this.battles[i]].tags.indexOf(this.tags[j]);
                    if (0 <= index) {
                        battles[this.battles[i]].tags.splice(index, 1);
                    }
                }
            }
        };
        var unset = function selectionUnset(battles) {
            var i;
        };
        return {
            full: false,
            toggleFull: function(list) {
                var i;
                for (i = 0 ; i < list.length ; i++) {
                    list[i].selected = this.full;
                }
            },
            battles: [],
            my_army: {},
            opponent: {},
            setup: {},
            tags: [],
            points: {
                my_army: {
                    scenario: null,
                    army: null
                },
                opponent: {
                    scenario: null,
                    army: null
                }
            },
            reset: function(battles) {
                this.full = false;
                this.battles = [];
                this.my_army = {};
                this.opponent = {};
                this.setup = {};
                this.tags = [];
                this.points = {
                    my_army: {
                        scenario: null,
                        army: null
                    },
                    opponent: {
                        scenario: null,
                        army: null
                    }
                };
                var i;
                for (i = 0 ; i < battles.length ; i++) {
                    battles[i].selected = false;
                }
            },
            remove: function(battles) {
                var i;
                this.battles.sort();
                for (i = 0 ; i < this.battles.length ; i++) {
                    battles.splice(this.battles[this.battles.length - i - 1], 1);
                }
                var modified = (0 < this.battles.length);
                this.battles = [];
                return modified;
            },
            update: function(battles) {
                this.battles = battles.map(function(battle) {
                    return battle.index;
                });
            },
            set: function(type, battles) {
                if (0 === this.battles.length) return false;
                var modified = false;
                switch (type) {
                case 'my_army':
                    {
                        modified = setMyArmy.call(this, battles);
                        break;
                    }
                case 'opponent':
                    {
                        modified = setOpponent.call(this, battles);
                        break;
                    }
                case 'points':
                    {
                        modified = setPoints.call(this, battles);
                        break;
                    }
                case 'date':
                    {
                        modified = setDate.call(this, battles);
                        break;
                    }
                case 'scenario':
                    {
                        modified = setScenario.call(this, battles);
                        break;
                    }
                case 'size':
                    {
                        modified = setSize.call(this, battles);
                        break;
                    }
                case 'event':
                    {
                        modified = setEvent.call(this, battles);
                        break;
                    }
                case 'score':
                    {
                        modified = setScore.call(this, battles);
                        break;
                    }
                case 'tags':
                    {
                        modified = setTags.call(this, battles);
                        break;
                    }
                case 'addTags':
                    {
                        modified = addTags.call(this, battles);
                        break;
                    }
                }
                return modified;
            },
            unset: function(type, battles) {
                if (0 === this.battles.length) return false;
                var i, modified = false;
                switch (type) {
                case 'my_army':
                    {
                        modified = true;
                        unsetMyArmy.call(this, battles);
                        break;
                    }
                case 'opponent':
                    {
                        modified = true;
                        unsetOpponent.call(this, battles);
                        break;
                    }
                case 'points':
                    {
                        modified = true;
                        unsetPoints.call(this, battles);
                        break;
                    }
                case 'date':
                    {
                        modified = true;
                        unsetDate.call(this, battles);
                        break;
                    }
                case 'scenario':
                    {
                        modified = true;
                        unsetScenario.call(this, battles);
                        break;
                    }
                case 'size':
                    {
                        modified = true;
                        unsetSize.call(this, battles);
                        break;
                    }
                case 'event':
                    {
                        modified = true;
                        unsetEvent.call(this, battles);
                        break;
                    }
                case 'score':
                    {
                        modified = true;
                        unsetScore.call(this, battles);
                        break;
                    }
                case 'tags':
                    {
                        modified = true;
                        unsetTags.call(this, battles);
                        break;
                    }
                case 'addTags':
                    {
                        modified = true;
                        unsetAddTags.call(this, battles);
                        break;
                    }
                }
                return modified;
            }
        };
    }]);
