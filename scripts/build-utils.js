/* NodeJS module */
module.exports = {
	shim: configureRequireShims,
	fillInjectionRules: fillInjectionRules,
	getConfig: getConfig
}

var grunt = require("grunt");

// lodash
var _ = grunt.util._

var requirejs = require('grunt-contrib-requirejs/node_modules/requirejs'); // ../node_modules/

/**
* Get AMD wrapped configuration and prepare for grunt tasks and minifications
*/
function getConfig(rootFile, destFile, configPath)
{
	// Add AngularJS controllers and such to the require.js shims
	var config = requirejs(configPath) // we load the r.js config

	var baseUrl = rootFile.substring(0,rootFile.lastIndexOf("/"));
	var requireName = rootFile.substring(rootFile.lastIndexOf("/")+1,rootFile.length);

	configureRequireShims(config);

	// RequireJS optimizer options
	// See example @ https://github.com/jrburke/r.js/blob/master/build/example.build.js
	config.require = _.merge(config.require, { 
		// RequireJS optimizer options and config.require overrides
		// See example @ https://github.com/jrburke/r.js/blob/master/build/example.build.js
		findNestedDependencies: true,
		preserveLicenseComments: false,
		baseUrl: baseUrl,
		name: requireName,
		optimize: 'none', // Not using the optimizer at this stage yet
		// Using method to make some pre-minifications modifications
		out: function(text)
		{
			// Fill Angular injection rules to avoid mangling issues with minification and AngularJS
			text = fillInjectionRules(text);

			grunt.file.write(destFile, text);
		}
	});

	return config;
}

function configureRequireShims(config)
{
	// Prepare base shims
	var requireShim = (config.require.shim) ? config.require.shim : {};
	if(!requireShim.app) requireShim.app = [];

	// AngularJS shims
	if(config.angular)
	{
		for (var i in config.angular.controllers)
		{
			requireShim.app.push(config.angular.controllers[i]);
		}
	}

	config.require.shim = requireShim;
}

/**
* Fill Angular injection rules to avoid mangling issues with minification and AngularJS
* To flag methods for injection, simply add the following comment before the function declaration: */
/** @ngInject */ 
function fillInjectionRules(text)
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