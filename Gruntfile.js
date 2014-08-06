/* 
* AngularJS+RequireJS project build
* @see https://github.com/josimard/angular-requirejs-seed
*/
module.exports = function(grunt) {
'use strict';

	////////////////////////////////////////////////////////////////////////////////////////////
	// Build configuration

	var buildConfig = {
		"baseUrl": "./app",
		"dest": "./build/",
		"js": {
			"license": "/* <%= pkg.name %> <%= grunt.template.today('dd-mm-yyyy') %> */\n",
			"dest":"./app/js/app.min.js"
		}
	};

	var pkg = grunt.file.readJSON('package.json');

	////////////////////////////////////////////////////////////////////////////////////////////
	// Custom utilities to ease the mix of AngularJS, the RequireJS optimizer and UglifyJS2

	var buildUtils = require('./tools/build-utils');
	buildUtils.init(grunt);
	
	////////////////////////////////////////////////////////////////////////////////////////////
	// Default tasks

	grunt.registerTask('default', ["build"]);


	/*//////////////////////////////////////////////////////////////////////////////////////////
	// BUILD TASK */

	grunt.registerTask('build', 'Build', function()
	{
		// Tasks sequence
		// Load and add build tasks in priority order
		var taskList = buildUtils.loadTasks(["requirejs", "uglify", "css", "copy","processHtml", "customize"]);

		// Get the app configuration
		var requirejs = require('grunt-contrib-requirejs/node_modules/requirejs');
		var appConfig = requirejs(buildConfig.baseUrl+"/js/config.js");

		// Modify application config for the RequireJS Optimizer (Inject controller shims, etc. )
		appConfig = buildUtils.configureRequireJS({
			config: appConfig,
			baseUrl: buildConfig.baseUrl,
			dest: buildConfig.js.dest
		});

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
					angularPass:true, 
					license: buildConfig.js.license,

					// http://lisperator.net/uglifyjs/compress
					compress: {
						unsafe:true,
						warnings:false,
						drop_console:false,
						unused:true
					}
				},
				main: {
					files: [
						// Main application file
						{
							src:  buildConfig.js.dest, dest: buildConfig.js.dest
						}

						/* You can combined vendor scripts/plugins this way
						{ src: [
							"./app/lib/plugins/jquery.pep.js",
							"./app/lib/plugins/jquery.mousewheel.js",
							"./app/lib/plugins/jquery.magnific-popup.js"

						], dest: "./app/lib/plugins.min.js", map: './app/lib/plugins.min.js.map'} */
					]
				}
			}, 

			/* Clean-css */
			// Custom task defined in tools/build-utils.js
			// https://github.com/GoalSmashers/clean-css
			css: {
				options: {
					baseUrl: "./app/assets/css/",
					license: buildConfig.js.license
				},
				main: {
					files: [
						{src: [
							"./app/assets/css/normalize.css",
							"./app/assets/css/main.css"
						], dest: "./app/assets/css/main.min.css"}
					]
				}
			}, 

			/* Copy build */
			// https://github.com/gruntjs/grunt-contrib-copy
			copy: {
				main: {
					// http://gruntjs.com/configuring-tasks#globbing-patterns
					// http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically
					files: [
						{expand: true, src: ['./app/index.html'], dest: buildConfig.dest},
						{expand: true, src: ['./app/templates/**'], dest: buildConfig.dest},

						// JS
						{expand: true, src: [buildConfig.js.dest], dest: buildConfig.dest},
						{expand: true, src: ['./app/js/boot.js'], dest: buildConfig.dest},
						{expand: true, src: ['./app/js/config.js'], dest: buildConfig.dest},

						// JS Lib
						{expand: true, src: [
								'./app/lib/**',
								// Except:
								"!./app/lib/angular/**",
								"!./app/lib/plugins/**",
								"!./app/lib/createjs/**",
								"!./app/lib/greensock/**"
							], dest: buildConfig.dest},

						// Assets
						{expand: true, src: [
								'./app/assets/**', 
								// Except:
								'!*.less',
								"!./app/assets/images/sprites/**",
								"!./app/assets/images/loader/**",
								"!./app/assets/images/anim/frames/**",
								"!./app/assets/images/anim/zoe/**"
							], dest: buildConfig.dest}
					]
				}
			},

			/* Process HTML  */
			// https://github.com/dciccale/grunt-processhtml
			processhtml: {
				options: {
					
				},
				dist: {
					files: [
						{src: buildConfig.baseUrl+'/index.html', dest: buildConfig.dest+'app/index.html'}
					]
				}
			}, 

			/* Custom task at the end of the build */
			customize: {
				run: function()
				{
					var fs = require('fs');

					// Remove some generated files
					fs.unlink(buildConfig.js.dest);
					fs.unlink("./app/assets/css/main.min.css");
				}
			}
		}
		
		// Configure grunt
		grunt.initConfig(gruntConfig);

		// Run sub-tasks
		console.log("Running tasks list: ", taskList);
		grunt.task.run(taskList);

	}); // End task build


	/* ////////////////////////////////////////////////////////////////////////////////////////////
	// SPRITESHEETS TASK 

	grunt.registerTask('sprites', 'Spritesheets', function()
	{
		// Tasks sequence
		// Load and add build tasks in priority order
		var taskList = ["spritesheet", "pngquant"];

		// https://github.com/richardbutler/node-spritesheet
		grunt.loadNpmTasks('node-spritesheet');

		var gruntConfig =
		{
			pkg: pkg,

			// CSS Spritesheets
			// https://github.com/richardbutler/node-spritesheet
			spritesheet: {
				compile: {
					options: {
						outputCss: 'css/sprites.css',
						selector: '.sprite',
						output: {
							legacy: {
								pixelRatio: 1,
								outputImage: 'images/sprites.png',
								// Just process the non-retina files
								filter: function( fullpath ) {
									return fullpath.indexOf( "2x" ) === -1;
								}
							}//,
							//retina: {
							//	pixelRatio: 2,
							//	outputImage: 'images/sprites@2x.png',
							//	// Just process the retina files
							//	filter: function( fullpath ) {
							//		return fullpath.indexOf( "2x" ) >= 0;
							//	}
							//}
						}
					},
					files: [
						{
							src: './app/assets/images/sprites/**', 
							dest: './app/assets'
						}
					]
				}
			},

			// PngQuant Custom Task
			pngquant: {
				main: {
					files: [
						{ src: './app/assets/images/sprites.png' }//,
						//{ src: './app/assets/images/sprites@2x.png' }
					]
				}
			}
		}
		
		// Configure grunt
		grunt.initConfig(gruntConfig);

		// Run sub-tasks
		console.log("Running tasks list: ", taskList);
		grunt.task.run(taskList);
	}); // End task sprites */


}