/* NodeJS module public API */
module.exports = {
	init:init,
	shim: configureRequireShims,
	angularPass: angularPass,
	getConfig: getConfig,
	replaceInFile: replaceInFile,
	createCustomizeTask: createCustomizeTask
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
function getConfig(baseUrl, destFile, configPath)
{
	if(!configPath) configPath = baseUrl+"/config.js";

	// Load app public config
	var config = requirejs(configPath);

	// RequireJS optimizer options
	// See example @ https://github.com/jrburke/r.js/blob/master/build/example.build.js
	config.require = _.merge(config.require, { 
		// RequireJS optimizer options and config.require overrides
		// See example @ https://github.com/jrburke/r.js/blob/master/build/example.build.js
		findNestedDependencies: true,
		preserveLicenseComments: false,
		baseUrl: baseUrl,
		//name: main,
		optimize: 'none' // Not using the optimizer at this stage yet
	});

	// Add AngularJS controllers and such to the require.js shims
	configureRequireShims(config);

	console.log("Require shims for app name '"+config.require.name+"': \n");
	console.log(config.require.shim);
	console.log("\n");

	return config;
}

function configureRequireShims(config)
{
	// Prepare base shims
	var requireShim = (config.require.shim) ? config.require.shim : {};
	if(!requireShim[config.require.name]) requireShim[config.require.name] = [];

	// AngularJS shims
	if(config.angular)
	{
		for (var i in config.angular.controllers)
		{
			requireShim[config.require.name].push(config.angular.controllers[i]);
		}
	}

	config.require.shim = requireShim;
}

/**
* Fill Angular injection rules to avoid mangling issues with minification and AngularJS
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

function createCustomizeTask(taskList)
{
	grunt.registerTask('customize', 'Build customization', function()
	{
		// https://github.com/gruntjs/grunt/wiki/grunt.config
		grunt.config.requires('customize.run');
		var runFunc = grunt.config('customize.run');
		runFunc();
	});
	taskList.push("customize");
	return taskList;
}

function replaceInFile(file,regexOrString,to)
{
	// https://github.com/gruntjs/grunt/wiki/grunt.file
	var text = grunt.file.read(file);
	text = text.replace(regexOrString, to);
	grunt.file.write(file, text);
}