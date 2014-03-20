/*global module*/ 
module.exports = function(grunt) {
'use strict';

	// Custom utilities to ease the mix of AngularJS, the RequireJS optimizer and UglifyJS
	var buildUtils = require('./tools/build-utils');
	buildUtils.init(grunt);

	// lodash
	var _ = grunt.util._;

	var baseUrl = "./app";

	var buildConfig = {
		dest: "./dist",
		js: {
			license: '/* <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
			dest: "./app/js/app.min.js"
		},
		css: {
			// Main CSS file
			file: "assets/main.css",
			// Additional css files
			files: ["assets/normalize.css"]
		}
	}

	// Will get the app configuration and inject controller shims for the RequireJS optimizer
	var appConfig = buildUtils.getAppConfig(baseUrl, "app/js/config.js", buildConfig);

	//////////////////////////////////////////////
	// Grunt Configuration

	var pkg = grunt.file.readJSON('package.json');
	var defaultTasks = [];

	var gruntConfig =
	{
		pkg: pkg,

		/* RequireJS Optimizer */
		// https://github.com/gruntjs/grunt-contrib-requirejs
		// http://requirejs.org/docs/optimization.html
		requirejs: {
			app: {
				options: appConfig.requirejs
			}
		},

		/* UglifyJS2 */
		// Custom task defined in tools/build-utils.js
		// https://github.com/mishoo/UglifyJS2
		uglify: {
			options: {
				license: buildConfig.js.license
			},
			// Only compact format supported, single destination: http://gruntjs.com/configuring-tasks#compact-format
			dist: {
				src: buildConfig.js.dest,
				dest: buildConfig.js.dest
			}
		}, 

		/* Copy build */
		// http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically
		// https://github.com/gruntjs/grunt-contrib-copy
		copy: {
			main: {
				files: [
					{expand: true, src: [baseUrl+'/index.html'], dest: buildConfig.dest},
					{expand: true, src: [buildConfig.js.dest], dest: buildConfig.dest},
					{expand: true, src: [baseUrl+'/js/boot.js'], dest: buildConfig.dest},
					{expand: true, src: [baseUrl+'/js/config.js'], dest: buildConfig.dest},
					{expand: true, src: [baseUrl+'/assets/**', '!*.less'], dest: buildConfig.dest},
					{expand: true, src: [baseUrl+'/lib/**'], dest: buildConfig.dest}
				]
			}
		},

		/* Process HTML https://github.com/dciccale/grunt-processhtml
		processhtml: {
			options: {
				
			},
			dist: {
				// http://gruntjs.com/configuring-tasks#files-array-format
				files: [
					{src: baseUrl+'/index.html', dest: buildConfig.dest+'/app/index.html'}
				]
			}
		}, */

		/* Customize task at the end of the build */
		customize: {
			run: function() {
				// Link against minified app in the boot.js script
				buildUtils.replaceInFile(buildConfig.dest+"/app/js/boot.js", "//config.requirejs.paths[", "config.requirejs.paths[");
			}
		}
	};

	buildUtils.buildTasks(defaultTasks, gruntConfig);

	// Grunt configuration/task
	console.log("\n\nBuilding project to "+buildConfig.dest+"\n");

	grunt.initConfig(gruntConfig);
	grunt.registerTask('default', defaultTasks);
};