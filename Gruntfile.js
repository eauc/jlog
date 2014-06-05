module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      scripts: {
        options: {
          multistr: true,
          globals: {
            'angular': false,
            '$': false,
            'console': false
          },
          ignores: [ '**/*.min.js' ],
          '-W097': true, // 'use strict function form'
          '-W040': true // 'possible strict violation'
        },
        files: {
          src: [ 'client/js/**/*.js', '!**/*.min.js' ]
        }
      },
      tests: {
        options: {
          multistr: true,
          globals: {
            'angular': false,
            '$': false,
            'console': false,
            'describe': false,
            'it': false,
            'beforeEach': false,
            'expect': false,
            'module': false,
            'inject': false,
            'jasmine': false,
          },
          '-W097': true, // 'use strict function form'
          '-W040': true // 'possible strict violation'
        },
        files: {
          src: [ 'spec/javascripts/**/*.js' ]
        }
      }
    },
    jasmine: {
      unit: {
        src: [ 'client/js/**/*.js', '!**/*.min.js' ],
        options: {
          specs: [ 'spec/**/*Spec.js' ],
          helpers: 'spec/helpers/*Helper.js',
          vendor: [
              'client/lib/angular/angular.js',
              'client/lib/angular/angular-*.js',
              'spec/javascripts/lib/angular/angular-mocks.js'
          ],
          outfile: 'spec/SpecRunner.html',
          keepRunner: true
        }
      }
    },
    watch: {
      scripts: {
        files: [ 'client/js/**/*.js', 'spec/javascripts/**/*.js' ],
        tasks: [ 'jshint:scripts' ],
        options: {
          spawn: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');
};
