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
    useminPrepare: {
      html: 'client/index-dev.html',
      options: {
        dest: 'client',
        flow: {
          steps: {
            js: ['uglify']
          },
          post: {
            js: [{
              name: 'uglify',
              createConfig: function (context, block) {
                var generated = context.options.generated;
                generated.options = {
                  sourceMap: true,
                  compress: {
                    drop_console: true
                  }
                };
              }
            }]
          }
        }
      }
    },
    usemin: {
      html: ['client/index.html']
    },
    copy: {
      html: {
	src: 'client/index-dev.html',
        dest: 'client/index.html'
      }
    },
    concat: {
      appendTemplates: {
        src: [ 'client/js/app.min.js', 'client/js/services/templates.js' ],
        dest: 'client/js/app.min.js'
      }
    },
    sass: {
      dist: {
        files: {
          'client/css/app.css': 'client/css/app.scss'
        }
      },
      options: {
        style: 'compressed'
      }
    },
    ngtemplates: {
      'jlogApp.services': {
        cwd:      'client',
        src:      'partials/**/*.html',
        dest:     'client/js/services/templates.js',
        options: {
          htmlmin: {
            collapseBooleanAttributes:      true,
            collapseWhitespace:             true,
            removeAttributeQuotes:          true,
            removeComments:                 true,
            removeEmptyAttributes:          true,
            removeRedundantAttributes:      true,
            removeScriptTypeAttributes:     true,
            removeStyleLinkTypeAttributes:  true
          }
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
              'client/lib/underscore-contrib/dist/underscore-contrib.js',
              'client/lib/underscore.string/dist/underscore.string.js',
              'client/lib/angular/angular.js',
              'client/lib/angular-ui-router/release/angular-ui-router.min.js',
              'client/lib/angular-mocks/angular-mocks.js',
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
      spec_src: {
        files: spec_js.concat(js_src),
        tasks: [ 'jshint:app_src', 'jshint:spec_src', 'jasmine:spec' ],
        options: {
          spawn: true
        }
      },
      jshint: {
        files: spec_js.concat(js_src),
        tasks: [ 'jshint' ],
        options: {
          spawn: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-copy');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('build', [
    'ngtemplates',
    'copy:html',
    'useminPrepare',
    'uglify:generated',
    'usemin',
    'concat:appendTemplates',
    'sass'
  ]);
};
