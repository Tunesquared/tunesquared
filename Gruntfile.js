'use strict';
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    react: {
      app: {
        options: {
          extension:    'jsx',
          ignoreMTime:  false // Default
        },
        files: {
          'static/www/js/components-build': 'static/www/js/components'
        }
      },
    },

    requirejs: {
      desktop: {
        options: {
          mainConfigFile: 'static/www/js/main.js',
          out: 'tmp/desktop.js',
          name: 'main',
          baseURL: '.',
          optimize: 'none',
          paths: {
            // Files that should be loaded from a CDN
            'socket.io': 'empty:'
           /* jquery: 'empty:',
            underscore: 'empty:',
            react: 'empty:'*/
          }
        }
      },

      welcome: {
        options: {
          mainConfigFile: 'static/www/js/welcome.js',
          out: 'tmp/welcome.js',
          name: 'welcome',
          baseURL: '.',
          optimize: 'none',
          paths: {
            // Files that should be loaded from a CDN
            'socket.io': 'empty:'
           /* jquery: 'empty:',
            underscore: 'empty:',
            react: 'empty:'*/
          }
        }
      },

      mobile: {
        options: {
          mainConfigFile: 'static/www-mobile/js/main.js',
          out: 'tmp/mobile.js',
          name: 'main',
          baseURL: '.',
          optimize: 'none',
          paths: {
            // Files that should be loaded from a CDN
           /* jquery: 'empty:',
            underscore: 'empty:'*/
          }
        }
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      dist: ['tmp', 'dist'],
    },

    removelogging: {
      welcome: {
        src: 'tmp/welcome.js',
        dest: 'tmp/welcome.nolog.js',
        options: {
          replaceWith: '0;'
        }
      },
      desktop: {
        src: 'tmp/desktop.js',
        dest: 'tmp/desktop.nolog.js',
        options: {}
      },
      mobile: {
        src: 'tmp/mobile.js',
        dest: 'tmp/mobile.nolog.js',
        options: {}
      }
    },

    uglify: {
      welcome: {
        files: {
          'tmp/welcome.built.js': ['tmp/welcome.nolog.js']
        }
      },
      desktop: {
        files: {
          'tmp/desktop.built.js': ['tmp/desktop.nolog.js']
        }
      },
      mobile: {
        files: {
          'tmp/mobile.built.js': ['tmp/mobile.nolog.js']
        }
      }
    },

    dist: {
      desktop: {
        input: 'static/www',
        output: 'dist/www',
        dist: [
          {src: '../../tmp/desktop.built.js', dst: 'js/main.js'},
          {src: '../../tmp/welcome.built.js', dst: 'js/welcome.js'},
          'lib/require.js',
          'css',
          'img',
          'lib/slider/css',
          'lib/bootswatch/cyborg'
        ]
      },

      mobile: {
        input: 'static/www-mobile',
        output: 'dist/www-mobile',
        dist: [
          {src: '../../tmp/mobile.built.js', dst: 'js/main.js'},
          'img',
          'css'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-remove-logging');
  grunt.loadNpmTasks('grunt-dist');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('publish', ['build', 'dist']);
  grunt.registerTask('build', ['clean', 'react', 'requirejs', 'removelogging', 'uglify']);
};
