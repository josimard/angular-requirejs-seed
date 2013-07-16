/* 
Simple LESS CSS watcher 
http://lesscss.org/
*/

// RequireJS
var requirejs = require('grunt-contrib-requirejs/node_modules/requirejs'); 

// Get application configuration file
var baseUrl = "./app";
var config = requirejs(baseUrl+"/config.js");

var lessConfig = config.less;
var lessBinPath = "node_modules/grunt-contrib-less/node_modules/less/bin/";

// Node JS modules
/**
 * FileSystem
 * http://nodejs.org/api/fs.html
 */ 
var fs = require('fs');

/**
 * ChildProcess
 * http://nodejs.org/api/child_process.html
 */ 
var exec = require('child_process').exec;


var isProcessing = false;

function execute()
{
	if(!lessConfig.enabled)
	{
		console.log("LESS not enabled in configuration, please run install-less");
		return;
	}
	console.log("\nStarting less watcher...");

	var lessIn = baseUrl+"/"+lessConfig.file;
	var lessOut = baseUrl+"/"+config.css.file;

	watch(lessIn, lessOut, lessConfig.watch.interval);
}

function watch(lessIn, lessOut, interval)
{
	if(!fs.existsSync(lessIn))
	{
		console.log("Error: File does not exists: "+file);
		return;
	}
	console.log("Watching "+lessIn);

	// Build from file changes (only the root less file)
	fs.watchFile(lessIn, function(curr,prev) {
		if (curr.mtime - prev.mtime) {
			console.log("File change: "+lessIn);
			// file changed
			buildLess(lessIn, lessOut);
		} 
	});

	// Build from interval
	if(interval>0)
	{
		setInterval(function() {
			buildLess(lessIn, lessOut);
		}, interval);
	}

	// Build now
	buildLess(lessIn, lessOut);
}

/**
 * Compile LESS CSS, see server-side usage:
 * http://lesscss.org/#usage 
 */

function buildLess(lessIn, lessOut, onComplete)
{
	if(isProcessing) return;
	isProcessing = true;

	if(!lessOut) lessOut = lessIn.replace(".less", ".css");
	
	var lessCommand = "node "+lessBinPath+"lessc "+lessIn+" > "+lessOut;
	console.log("Processing Less CSS "+lessIn+" to "+lessOut);
	
	// Run the command
	exec(lessCommand, function (error, stdout, stderr)
	{
		if (error !== null) {
			console.log('exec error: ' + error);
			console.log("stdout : "+stdout);
			console.log("stderr : "+stderr);
		}
		isProcessing = false;
	});
}

execute();