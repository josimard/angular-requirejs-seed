/*global module*/ 
module.exports = function(grunt) {
'use strict';

	// Custom utilities to ease the mix of AngularJS, the RequireJS optimizer and UglifyJS
	var buildUtils = require('./scripts/build-utils');

	// lodash
	var _ = grunt.util._

  	var rootFile = "./app/app";
  	var destFile = "app/app.min.js";

  	var buildDest = "./dist";

	// Will get the app configuration and inject controller shims for the RequireJS optimizer
	var config = buildUtils.getConfig(rootFile, destFile, './app/config.js');

	// Grunt configuration
	grunt.initConfig(
	{
		pkg: grunt.file.readJSON('package.json'),

		// RequireJS Optimizer
		// https://github.com/gruntjs/grunt-contrib-requirejs
		// http://requirejs.org/docs/optimization.html
		requirejs: {
			app: {
			options: _.merge(config.require, { 
				// config.require overrides
				// See example @ https://github.com/jrburke/r.js/blob/master/build/example.build.js
			})}
		},

		// UglifyJS
		// https://github.com/gruntjs/grunt-contrib-uglify
		// http://lisperator.net/uglifyjs/
		uglify: {
			options: {
				mangle:true,
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {"app/app.min.js": [destFile] }
			}
		},

		// Copy build
		// https://github.com/gruntjs/grunt-contrib-copy
		copy: {
			main: {
				files: [
					//{expand: true, src: ['app/**'], dest: 'dist/', filter: 'isFile'},
					{expand: true, src: ['app/index.html'], dest: buildDest},
					{expand: true, src: ['app/boot.js'], dest: buildDest},
					{expand: true, src: ['app/app.min.js'], dest: buildDest},
					{expand: true, src: ['app/config.js'], dest: buildDest},
					{expand: true, src: ['app/assets/**'], dest: buildDest},
					{expand: true, src: ['app/lib/**'], dest: buildDest},
					{expand: true, src: ['app/nls/**'], dest: buildDest},
					{expand: true, src: ['app/views/templates/**'], dest: buildDest}
				]
			}
        },
	});

	// Grunt plugins
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Register Default task.
	grunt.registerTask('default', ["requirejs", "uglify", "copy"]);

};