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
  });

  grunt.loadNpmTasks('grunt-react');
}
