/* NodeJS module public API */
module.exports = {
	init:init,
	buildTasks: buildTasks,
	shim: configureRequireShims,
	angularPass: angularPass,
	getAppConfig: getAppConfig,
	replaceInFile: replaceInFile
}

// Node JS modules

/**
 * FileSystem
 * http://nodejs.org/api/fs.html
 */ 
var fs = require('fs');

// RequireJS
var requirejs = require('grunt-contrib-requirejs/node_modules/requirejs'); // ../node_modules/

// Grunt
var grunt;
var _; // lodash

function init(gruntInstance)
{
	grunt = gruntInstance;
	_ = grunt.util._; // lodash
}

/**
* Get AMD wrapped configuration and prepare for grunt tasks and minifications
*/
function getAppConfig(baseUrl, configPath, buildConfig)
{
	// Load app public config
	var config = requirejs(configPath);

	if(config.requirejs)
	{
		initRequireConfig(config, baseUrl, buildConfig.js.dest);
	}

	return config;
}

//////////////////////////////////////////////
// Grunt tasks/plugins - modular way
function buildTasks(tasks, gruntConfig)
{
	// RequireJS
	if(gruntConfig.requirejs)
	{
		/* RequireJS Optimizer */
		// https://github.com/gruntjs/grunt-contrib-requirejs
		// http://requirejs.org/docs/optimization.html
		
		tasks.push("requirejs");
		grunt.loadNpmTasks('grunt-contrib-requirejs');
	}

	/* UglifyJS2 Custom Task */
	if(gruntConfig.uglify)
	{
		var UglifyJS = require("uglify-js");
		tasks.push("uglify2");
		grunt.registerTask('uglify2', 'UglifyJS2 Custom Task', function()
		{
			// TODO: grunt files types http://gruntjs.com/configuring-tasks#files
			var done = this.async();
			var config = grunt.config().uglify;
			var dist = config.dist;
			var result = UglifyJS.minify(dist.src);
				
			if(config.options)
			{
				if(config.options.license)
				{
					result.code=config.options.license+result.code;
				}
			}
			
			console.log("Writing uglify output: "+dist.out)
			fs.writeFile(dist.dest, result.code, function (err) {
			  if (err) throw err;
			  done();
			});
		});
	}

	// Add the copy task at the end
	if(gruntConfig.copy)
	{
		tasks.push("copy");
		grunt.loadNpmTasks('grunt-contrib-copy');
	}

	if(gruntConfig.processhtml)
	{
		// https://github.com/dciccale/grunt-processhtml#advanced-example
		// Load tasks from npm
		grunt.loadNpmTasks('grunt-processhtml');
		grunt.task.run("processhtml:dist");
	}

	// Then the build customization task if necessary
	if(gruntConfig.customize)
	{
		grunt.registerTask('customize', 'Build customization', function()
		{
			// https://github.com/gruntjs/grunt/wiki/grunt.config
			grunt.config.requires('customize.run');
			var runFunc = grunt.config('customize.run');
			runFunc();
		});
		tasks.push("customize");
		return tasks;
	}
}

function initRequireConfig(config, baseUrl, destFile)
{
	// RequireJS optimizer options
	// See example @ https://github.com/jrburke/r.js/blob/master/build/example.build.js
	config.requirejs = _.merge(config.requirejs, { 
		// RequireJS optimizer options and config.require overrides
		// See example @ https://github.com/jrburke/r.js/blob/master/build/example.build.js
		findNestedDependencies: true,
		preserveLicenseComments: false,
		baseUrl: baseUrl,
		//name: main,
		optimize: 'none', // Not using the optimizer at this stage yet

		// IMPORTANT: changing the 'out' option will break AngularJS @ngInject
		// Using method to make some pre-minifications modifications
		out: function(text)
		{
			// Fill Angular injection rules to avoid mangling issues with minification and AngularJS
			// Similar result than in this Google Closure class: http://code.google.com/p/closure-compiler/source/browse/src/com/google/javascript/jscomp/AngularPass.java
			text = angularPass(text);
			grunt.file.write(destFile, text);
		}
	});

	console.log("Require shims for app name '"+config.requirejs.name+"': \n");
	console.log(config.requirejs.shim);
	console.log("\n");

	// Add AngularJS controllers and such to the require.js shims
	configureRequireShims(config);
}

function configureRequireShims(config)
{
	// Prepare base shims
	var requireShim = (config.requirejs.shim) ? config.requirejs.shim : {};
	if(!requireShim[config.requirejs.name]) requireShim[config.requirejs.name] = [];

	// AngularJS shims
	if(config.angular)
	{
		for (var i in config.angular.controllers)
		{
			requireShim[config.requirejs.name].push(config.angular.controllers[i]);
		}
	}

	config.requirejs.shim = requireShim;
}

/**
* Fill Angular injection rules to avoid mangling issues with minification
* @see http://code.google.com/p/closure-compiler/source/browse/src/com/google/javascript/jscomp/AngularPass.java
* */
// To flag methods for injection, simply add the following comment before the function declaration:
/** @ngInject */ 
function angularPass(text)
{
	text = text.replace(/@ngInject([.\s\S]+?){/gi, function(match,functionDef)
	{
		// Get method name
		var functionName = /function ([.\s\S]+?)\(/.exec(functionDef)[1];

		// Get method argument list
		var args = /\(([^)]+)/.exec(functionDef);
		if (args[1]) args = args[1].split(/\s*,\s*/);

		// Injection directive
		var angularInject = "@generated */ "+functionName+".$inject = "+JSON.stringify(args)+";\n/**";

		return angularInject+match;
	});

	return text;
}


function replaceInFile(file,regexOrString,to)
{
	// https://github.com/gruntjs/grunt/wiki/grunt.file
	var text = grunt.file.read(file);
	text = text.replace(regexOrString, to);
	grunt.file.write(file, text);
}