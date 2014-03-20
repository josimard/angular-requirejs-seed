/*global module*/ 
module.exports = function(grunt) {
'use strict';

	// Custom utilities to ease the mix of AngularJS, the RequireJS optimizer and UglifyJS
	var buildUtils = require('./scripts/build-utils');
	buildUtils.init(grunt);

	// lodash
	var _ = grunt.util._

	var buildDest = "./dist";
	var baseUrl = "./app";
	var destFile = baseUrl+"/js/app.min.js";
	var jsLicense = '/* <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n';

	// Will get the app configuration and inject controller shims for the RequireJS optimizer
	var config = buildUtils.getConfig(baseUrl, destFile);

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
			options: _.merge(config.require, { 
				// config.require overrides
				// See example @ https://github.com/jrburke/r.js/blob/master/build/example.build.js

				// IMPORTANT: changing the 'out' option will break AngularJS @ngInject
				// Using method to make some pre-minifications modifications
				out: function(text)
				{
					// Fill Angular injection rules to avoid mangling issues with minification and AngularJS
					// Similar result than in this Google Closure class: http://code.google.com/p/closure-compiler/source/browse/src/com/google/javascript/jscomp/AngularPass.java
					text = buildUtils.angularPass(text);
					grunt.file.write(destFile, text);
				}
			})}
		},

		/* UglifyJS */
		// https://github.com/gruntjs/grunt-contrib-uglify
		// http://lisperator.net/uglifyjs/
		uglify: {
			options: {
				mangle:true,
				banner: jsLicense,
			},
			dist: {
				files: {
					// Add more JS files here, main file will be added dynamically
					// 'dest/output.min.js': ['src/input1.js', 'src/input2.js']
				}
			}
		},

		/* Less */
		// https://github.com/gruntjs/grunt-contrib-less
		less: {
			production: {
				options: {
					paths: ["assets/css"],
						compress: true
					},
				files: {
					// Add more JS files here, main file will be added dynamically
				}
			}
		},

		/* Copy build */
		// http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically
		// https://github.com/gruntjs/grunt-contrib-copy
		copy: {
			main: {
				files: [
					{expand: true, src: [baseUrl+'/index.html'], dest: buildDest},
					{expand: true, src: [baseUrl+'/js/boot.js'], dest: buildDest},
					{expand: true, src: [baseUrl+'/js/app.min.js'], dest: buildDest},
					{expand: true, src: [baseUrl+'/config.js'], dest: buildDest},
					{expand: true, src: [baseUrl+'/assets/**', '!*.less'], dest: buildDest},
					{expand: true, src: [baseUrl+'/lib/**'], dest: buildDest},
					{expand: true, src: [baseUrl+'/nls/**'], dest: buildDest},
					{expand: true, src: [baseUrl+'/templates/**'], dest: buildDest}
				]
			}
		},

		/* Customize task at the end of the build */
		customize: {
			run: function() {
				// Link against minified app in the boot.js script
				buildUtils.replaceInFile(buildDest+"/app/js/boot.js", "//config.require.paths[", "config.require.paths[");
			}
		}
	};

	//////////////////////////////////////////////
	// Grunt plugins - The modular way

	// RequireJS
	if(gruntConfig.requirejs)
	{
		defaultTasks.push("requirejs");
		grunt.loadNpmTasks('grunt-contrib-requirejs');
	}

	// UglifyJS
	if(gruntConfig.uglify)
	{
		// Add main file to Uglify
		gruntConfig.uglify.dist.files[destFile] = destFile;

		defaultTasks.push("uglify");
		grunt.loadNpmTasks('grunt-contrib-uglify');
	}

	// LESS
	// Run install-less.sh once to automagically setup LESS
	if(config.less && config.less.enabled)
	{
		// Add main config less
		gruntConfig.less.production.files[config.css.file] = config.less.file;

		defaultTasks.push("less");
		grunt.loadNpmTasks('grunt-contrib-less');
	}

	// Add the copy task at the end
	if(gruntConfig.copy)
	{
		defaultTasks.push("copy");
		grunt.loadNpmTasks('grunt-contrib-copy');
	}

	// Then the build customization task if necessary
	if(gruntConfig.customize)
	{
		buildUtils.createCustomizeTask(defaultTasks);
	}

	// Grunt configuration/task
	console.log("\n\nBuilding project to "+buildDest+"\n");

	grunt.initConfig(gruntConfig);
	grunt.registerTask('default', defaultTasks);
};