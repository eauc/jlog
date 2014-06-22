module.exports = function(grunt) {

  var js_src =  [ 'client/js/**/*.js', '!**/*.min.js' ];
  var spec_js_src = [ 'spec/javascripts/**/*Spec.js' ];
  var spec_js_helpers = [ 'spec/javascripts/helpers/*.js' ];
  var spec_js = spec_js_helpers.concat(spec_js_src);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      src: {
        options: {
          jshintrc: '.jshintrc'
        },
        files: {
          src: js_src
        }
      },
      spec: {
        options: {
          jshintrc: '.jshintrc_spec'
        },
        files: {
          src: spec_js
        }
      }
    },
    jasmine: {
      spec: {
        src: js_src,
        options: {
          specs: spec_js_src,
          helpers: spec_js_helpers,
          vendor: [
              'client/lib/underscore/underscore.min.js',
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
      src: {
        files: js_src,
        tasks: [ 'jshint:src' ],
        options: {
          spawn: true
        }
      },
      spec: {
        files: spec_js,
        tasks: [ 'jshint:spec', 'jasmine:spec' ],
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
