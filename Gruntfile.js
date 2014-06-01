module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      scripts: {
        options: {
          multistr: true,
          globals: {
            "angular": false,
            "$": false,
            "console": false
          },
          ignores: [ '**/*.min.js' ],
          "-W097": true, // "use strict function form"
          "-W040": true // "possible strict violation"
        },
        files: {
          src: [ "client/js/**/*.js" ]
        }
      },
      tests: {
        options: {
          multistr: true,
          globals: {
            "angular": false,
            "$": false,
            "console": false,
            "describe": false,
            "it": false,
            "beforeEach": false,
            "expect": false,
            "module": false,
            "inject": false,
            "jasmine": false,
          },
          "-W097": true, // "use strict function form"
          "-W040": true // "possible strict violation"
        },
        files: {
          src: [ "spec/javascripts/**/*.js" ]
        }
      }
    },
    watch: {
      scripts: {
        files: [ "client/js/**/*.js", "spec/javascripts/**/*.js" ],
        tasks: [ "jshint:scripts" ],
        options: {
          spawn: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
};
