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
		tasks.push("uglify");
		grunt.registerMultiTask('uglify', 'UglifyJS2 Custom Task', function()
		{
			// Default options
			var options = this.options({
				angularPass: true
			});

			this.files.forEach(function (f)
			{
				var src = f.src.filter(function (filepath)
					{
						if (!grunt.file.exists(filepath)) {
							grunt.log.warn('Source file "' + filepath + '" not found.');
							return false;
						} else {
							return true;
						}
					}).map(function (filepath)
					{
						var content = fs.readFileSync(filepath).toString();
						return content;
				}).join('\n');

				// AngularJS pass
				// Fills Angular injection annotations to avoid mangling issues with minification and AngularJS
				// Similar result than in this Google Closure class: http://code.google.com/p/closure-compiler/source/browse/src/com/google/javascript/jscomp/AngularPass.java
				if(options.angularPass) src = angularPass(src.toString());

				var result = UglifyJS.minify(src, {fromString: true});

				// Prepend liscense?
				if(options.license)
				{
					result.code=options.license+result.code;
				}

				console.log("Writing uglify output: "+f.dest)
				grunt.file.write(f.dest, result.code);
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

		out: function(text)
		{
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
* Prepare Angular injection rules for minification: to avoid mangling issues with minification
*/
function angularPass(text)
{
	// Using NG annotate for inline-injection (for module.controller(), module.service(), module.factory(), etc.)
	// https://github.com/olov/ng-annotate
	var ngAnnotate = require("ng-annotate");
	text = ngAnnotate(text, {add: true}).src;

	/* 
	* Angular Pass, Google closure-style - see http://code.google.com/p/closure-compiler/source/browse/src/com/google/javascript/jscomp/AngularPass.java
	* */

	// To flag methods for injection, simply add the following comment before the function declaration:
	/** @ngInject */ 
	text = text.replace(/@ngInject([.\s\S]+?){/gi, function(match,functionDef)
	{
		// Get method name
		var functionHead = /function ([.\s\S]+?)\(/.exec(functionDef);
		var functionName = (functionHead) ? functionHead[1] : null;

		// Get method argument list
		var args = /\(([^)]+)/.exec(functionDef);
		if (args[1]) args = args[1].split(/\s*,\s*/);

		// Injection directive
		if(functionName)
		{
			var angularInject = "@generated */ "+functionName+".$inject = "+JSON.stringify(args)+";\n/**";
		}
		// Anonymous functions
		else {
			// SHOULD NOT HAPPEND!
			// Injection will not apply, ng-annotate should handle those cases
		}

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