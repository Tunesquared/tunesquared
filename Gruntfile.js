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

    wrap: {
      desktop: {
        cwd: 'static/www/lib/bootstrap/',
        expand: true,
        src: ['js/*.js'],
        dest: 'static/www/lib/bootstrapAMD/',
        options: {
          wrapper: ['require(["jquery"], function ($) {\n', '\n});']
        }
      },
      mobile: {
        cwd: 'static/www-mobile/lib/bootstrap/',
        expand: true,
        src: ['js/*.js'],
        dest: 'static/www-mobile/lib/bootstrapAMD/',
        options: {
          wrapper: ['require(["jquery"], function ($) {\n', '\n});']
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
        /* TODO: minify mobile css */
        options: {
          mainConfigFile: 'static/www-mobile/js/main.js',
          out: 'tmp/mobile.js',
          name: 'main',
          baseURL: '.',
          optimize: 'none',
          paths: {
            // Files that should be loaded from a CDN
          }
        }
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tmp: ['tmp'],
      dist: ['dist'],
    },

    strip : {
      welcome: {
        src: 'tmp/welcome.js',
        dest: 'tmp/welcome.nolog.js',
        options : {
          nodes : ['console.log', 'debug']
        }
      },
      desktop: {
        src: 'tmp/desktop.js',
        dest: 'tmp/desktop.nolog.js',
        options : {
          nodes : ['console.log', 'debug']
        }
      },
      mobile: {
        src: 'tmp/mobile.js',
        dest: 'tmp/mobile.nolog.js',
        options : {
          nodes : ['console.log', 'debug']
        }
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
          {src: 'lib/require.min.js', dst: 'lib/require.js'},
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
          {src: '../../tmp/mobile.nolog.js', dst: 'js/main.js'},
          'img',
          'css',
          'lib/mobileutils',
          'lib/bootswatch/cyborg',
          'index.html'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-strip');
  grunt.loadNpmTasks('grunt-dist');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-wrap');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Builds and prepare code for deployment (the all-in-one command)
  grunt.registerTask('publish', ['build', 'clean:dist', 'dist']);
  // Builds precompiled files to run in development
  grunt.registerTask('setup', ['react', 'wrap']);
  // Builds everything
  grunt.registerTask('build', ['clean:tmp', 'setup', 'requirejs', 'strip', 'uglify']);
};
