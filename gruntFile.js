// TODO
module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    requirejs: {
        compile: {
            options: {
                baseUrl: '.',
                paths: {
                    jquery: 'jquery.min' //Use this to minifiy jquery into your main
                    //jquery: 'empty:' //Use this to continue using CDN loading
                },
                name: 'main',
                out: 'compiled/main.js',
                removeCombined: false
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib');

  // Default task.
  grunt.registerTask("default", "requirejs");
};
