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
      compile: {
        options: {
          mainConfigFile: 'static/www/js/main.js',
          out: 'tmp/main.js',
          name: 'app',
          baseURL: '.',
          paths: {
            // Files that should be loaded from a CDN
            'socket.io': 'empty:'
           /* jquery: 'empty:',
            underscore: 'empty:',
            react: 'empty:'*/
          }
        }
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      dist: ['tmp'],
    },

    dist: {
      desktop: {
        input: 'tmp/',
        output: 'dist/www',
        dist: [
          'main.js'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-dist');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('publish', ['clean', 'react', 'requirejs', 'dist']);
  grunt.registerTask('build', ['clean', 'requirejs']);
};
