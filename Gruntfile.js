module.exports = function(grunt) {

  var js_src =  [ 'client/js/**/*.js', '!**/*.min.js' ];
  var spec_js_src = [ 'spec/**/*Spec.js' ];
  var spec_js_helpers = [ 'spec/support/helpers/*.js' ];
  var spec_js = spec_js_helpers.concat(spec_js_src);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      app_src: {
        options: {
          jshintrc: '.jshintrc'
        },
        files: {
          src: js_src
        }
      },
      spec_src: {
        options: {
          jshintrc: '.jshintrc_spec'
        },
        files: {
          src: spec_js
        }
      }
    },
    uglify: {
      app_src: {
        options: {
          compress: {
            drop_console: true
          }
        },
        files: {
          'client/js/app.min.js': js_src
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
              'client/lib/underscore/underscore.js',
              'client/lib/underscore/underscore-contrib.js',
              'client/lib/underscore.string/underscore.string.js',
              'client/lib/angular/angular.js',
              'client/lib/angular-ui-router/angular-ui-router.min.js',
              'client/lib/angular/angular-mocks.js',
          ],
          outfile: 'spec/SpecRunner.html',
          keepRunner: true
        }
      }
    },
    watch: {
      app_src: {
        files: js_src,
        tasks: [ 'jshint:app_src', 'uglify:app_src' ],
        options: {
          spawn: true
        }
      },
      uglify: {
        files: js_src,
        tasks: [ 'uglify:app_src' ],
        options: {
          spawn: true
        }
      },
      spec_src: {
        files: spec_js.concat(js_src),
        tasks: [ 'jshint:app_src', 'jshint:spec_src', 'jasmine:spec' ],
        options: {
          spawn: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
};
