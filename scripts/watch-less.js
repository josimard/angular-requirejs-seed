/* 
Simple LESS CSS watcher 
http://lesscss.org/

Install the less node module to use and define the less file in the config:
npm install less
*/
                                 
var config = {
	file: 'app/assets/main.less',
	modulesPath: './',
	interval: 5000
}

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

function execute()
{
	watch(config.file, config.interval);
}

function watch(file, interval)
{
	if(!fs.existsSync(file))
	{
		console.log("Error: File does not exists: "+file);
		return;
	}
	console.log("Watching "+file);

	// Build from file changes (only the root less file)
	fs.watchFile(file, function(curr,prev) {
		if (curr.mtime - prev.mtime) {
			console.log("File change: "+file);
			// file changed
			buildLess(file)
		} 
	});

	// Build from interval
	if(interval>0)
	{
		setInterval(function() {
			buildLess(file);
		}, interval);
	}

	// Build now
	buildLess(file);
}

/**
 * Compile LESS CSS, see server-side usage:
 * http://lesscss.org/#usage 
 */
var isProcessing = false;
function buildLess(lessIn, lessOut, onComplete)
{
	if(isProcessing) return;
	isProcessing = true;

	if(!lessOut) lessOut = lessIn.replace(".less", ".css");
	
	var lessCommand = "node "+config.modulesPath+"node_modules/less/bin/lessc "+lessIn+" > "+lessOut;
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