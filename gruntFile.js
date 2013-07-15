/*global module*/ 
module.exports = function(grunt){
'use strict';

	// Custom utilities to ease the mix of AngularJS, AMD modules, the requireJS optimizer and UglifyJS
	var angularRequireUtils = require('./scripts/AngularRequireUtils');

	// lodash
	var _ = grunt.util._

  	var rootFile = "./app/app";
  	var destFile = "app/app.min.js";

	// Will get the app configuration and inject controller shims for the RequireJS optimizer
	var config = angularRequireUtils.getConfig(rootFile, destFile, './app/config.js');

	// Grunt configuration
	grunt.initConfig({
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
		}
	});

	// Load tasks from "grunt-sample" grunt plugin installed via Npm.
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	// Load tasks from "grunt-sample" grunt plugin installed via Npm.
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task.
	grunt.registerTask('default', ["requirejs", "uglify"]); // 

};