/**
 * Get the latest version @ https://gist.github.com/josimard/cac777fae38ec80e9696#file-grunt-build-utils-js
 * 
 * Example use: 
 * https://github.com/josimard/angular-requirejs-seed/blob/master/Gruntfile.js
 * 
 * @author Jo Simard jo@josimard.com
 */

// NodeJS module public API
module.exports = {
	init:init,
	loadTasks:loadTasks,
	load:load,
	replaceInFile: replaceInFile,
	angularPass: angularPass,
	configureRequireJS: configureRequireJS
}

// Node JS modules

/**
 * FileSystem
 * http://nodejs.org/api/fs.html
 */ 
var fs = require('fs');

// RequireJS
//var requirejs = require('grunt-contrib-requirejs/node_modules/requirejs'); // ../node_modules/

// Grunt
var grunt;
var _; // lodash

var _taskMap = {
	"uglify":loadUglify,
	"requirejs":loadRequireJS,
	"css": loadCSS,
	"copy":loadCopy,
	"tokenize":loadTokenize,
	"processHtml": loadProcessHtml,
	"customize": loadCustomize
}

function init(gruntInstance)
{
	grunt = gruntInstance;
	_ = grunt.util._; // lodash
}

function loadTasks(tasks, taskList)
{
	if(!taskList) taskList = [];

	for (var i = 0; i < tasks.length; i++) {
		load(tasks[i], taskList);
	};

	return taskList;
}

function load(name, taskList, params)
{
	if(!_taskMap[name])
	{
		console.error("Task not found: '"+name+"'");
		return;
	}

	_taskMap[name](taskList, params);
}

function loadUglify(taskList)
{
	console.log("Loading UglifyJS2 custom task...");

	if(taskList) taskList.push("uglify");

	var UglifyJS = require("uglify-js");
	grunt.registerMultiTask('uglify', 'UglifyJS2 Custom Task', function()
	{
		// Default options
		var allFilesOptions = this.options({
			angularPass: false,
			fromString: true,

			// Output options
			// http://lisperator.net/uglifyjs/codegen
			output: {
				comments: /@preserve|@license|@cc_on/
			},

			// Compressor options
			// http://lisperator.net/uglifyjs/compress
			compress: {

			}
		});

		this.files.forEach(function (f)
		{
			var src;
			var options = allFilesOptions;

			// String manipulations mode
			if(options.fromString)
			{
				src = getGruntFilesSource(f);

				if(options.tokenize)
				{
					src = tokenize(options.tokenize, src)
				}

				// AngularJS pass
				// Fills Angular injection annotations to avoid mangling issues with minification and AngularJS
				// Similar result than in this Google Closure class: http://code.google.com/p/closure-compiler/source/browse/src/com/google/javascript/jscomp/AngularPass.java
				if(options.angularPass) src = angularPass(src.toString());

			} 
			// Default (let uglify concat files, good for source maps)
			else {
				src = f.src;
			}

			// Contextual options
			if(f.map)
			{
				options.outSourceMap = f.map;
			}

			// https://github.com/mishoo/UglifyJS2#the-simple-way
			var result = UglifyJS.minify(src, options);

			// Prepend license?
			if(options.license)
			{
				result.code=options.license+result.code;
			}

			// Write result
			console.log("\nWriting uglify output: "+f.dest);

			grunt.file.write(f.dest, result.code);

			// Write source map
			if(f.map)
			{
				var map;

				if(options.fromString)
				{
					map = JSON.parse(result.map);
					map.sources = f.src;
					map = JSON.stringify(map);
				} else {
					map = result.map;
				}

				console.log("\tsource map: "+f.map);
				
				grunt.file.write(f.map, map);
			}
			
		});
	});
}

/**
 * Process HTML 
 * @see https://github.com/dciccale/grunt-processhtml
 */
function loadProcessHtml(taskList, params)
{	
	if(taskList) taskList.push("processhtml");

	// https://github.com/dciccale/grunt-processhtml#advanced-example
	// Load tasks from npm
	grunt.loadNpmTasks('grunt-processhtml');
}

/**
 * Copy
 * @see https://github.com/gruntjs/grunt-contrib-copy
 */
function loadCopy(taskList, params)
{	
	if(taskList) taskList.push("copy");
	grunt.loadNpmTasks('grunt-contrib-copy');
}


/**
 * Build customization custom task
 */
function loadCustomize(taskList, params)
{	
	if(taskList) taskList.push("customize");

	grunt.registerTask('customize', 'Build customization', function()
	{
		// https://github.com/gruntjs/grunt/wiki/grunt.config
		grunt.config.requires('customize.run');
		var runFunc = grunt.config('customize.run');
		runFunc();
	});
}


/**
 * Css Minification Custom Task, using CleanCSS
 * @see  https://github.com/GoalSmashers/clean-css#how-to-use-clean-css-programmatically
 */
function loadCSS(taskList, params)
{
	if(taskList) taskList.push("css");

	grunt.registerMultiTask('css', 'CSS Custom Task (clean-css)', function()
	{
		// Default options
		var options = this.options({
			
		});

		var CleanCSS = require('clean-css');

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

			// https://github.com/mishoo/UglifyJS2#the-simple-way
			var result = new CleanCSS(options).minify(src);

			// Prepend license?
			if(options.license)
			{
				result=options.license+result;
			}

			console.log("Writing css output: "+f.dest)
			grunt.file.write(f.dest, result);
		});
	});
}

/**
 * RequireJS Optimizer
 * @see  https://github.com/gruntjs/grunt-contrib-requirejs
 * @see  http://requirejs.org/docs/optimization.html
 */
function loadRequireJS(taskList, params)
{
	console.log("Loading RequireJS Optimizer (grunt-contrib-requirejs)");

	if(taskList) taskList.push("requirejs");
	grunt.loadNpmTasks('grunt-contrib-requirejs');
}

/**
 * Modify an application config for the RequireJS Optimizer
 * @see https://github.com/josimard/angular-requirejs-seed/blob/master/Gruntfile.js
 */
function configureRequireJS(params)
{
	var config = params.config;
	var destFile = params.dest;
	var baseUrl = params.baseUrl;

	// TODO: Some validation here
	
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

	// Add AngularJS controllers and such to the require.js shims
	configureRequireShims(config);

	console.log("\nRequireJS shims for '"+config.requirejs.name+"': \n");
	console.log(config.requirejs.shim);
	console.log("\n");

	return config;
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

	// Paths shims to include in optimized application
	if(config.requirejs.paths)
	{
		for (var p in config.requirejs.paths) {
			var value = config.requirejs.paths[p];
			if(value!="empty:")
			{
				requireShim[config.requirejs.name].push(p);
			}
		};
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



function loadTokenize()
{
	grunt.registerMultiTask('tokenize', 'Tokenize Custom Task', function()
	{
		// Default options
		var options = this.options({
			
		});

		this.files.forEach(function (f)
		{
			var src = getGruntFilesSource(f);

			src = tokenize(options, src)

			console.log("Writing tokenized output: "+f.dest)
			grunt.file.write(f.dest, src);
		});
	});
}


function getGruntFilesSource(f)
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

	return src;
}

function tokenize(tokens, s)
{
	// Ant tokens ie: @debug@
	if(tokens.ant)
	{
		s = replaceTokens(s, tokens.ant,"@","@");
	}

	return s;
}
function replaceTokens(s, values,prefix,suffix)
{
	console.log("Ant tokens: ")
	for(p in values)
	{
		var val = values[p];
		console.log("\t"+p+":"+val);
		var regex = new RegExp("@"+p+"@", "gi");
		s = s.replace(regex, val);
	}
	return s;
}

function replaceInFile(file,regexOrString,to)
{
	// https://github.com/gruntjs/grunt/wiki/grunt.file
	var text = grunt.file.read(file);
	text = text.replace(regexOrString, to);
	grunt.file.write(file, text);
}