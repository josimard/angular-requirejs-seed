/* 
LESS CSS setup script using application configuration (app/config.js)
http://lesscss.org/
*/

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

// RequireJS
var requirejs = require('grunt-contrib-requirejs/node_modules/requirejs'); 

// Get application configuration file
var baseUrl = "./app";
var config = requirejs(baseUrl+"/config.js");

function execute()
{
	var lessConfig = config.less;
	var lessIn = baseUrl+"/"+lessConfig.file;
	var lessOut = baseUrl+"/"+config.css.file;

	if(fs.existsSync(lessIn))
	{
		console.log("Error: Less file already exists: "+lessIn);
		return;
	}

	if(!fs.existsSync(lessOut))
	{
		console.log("Error: Cannot find main CSS file: "+lessOut);
		return;
	}

	// Copy CSS to LESS
	fs.createReadStream(lessOut).pipe(fs.createWriteStream(lessIn));

	// Enable less in config
	replaceInFile(baseUrl+"/config.js", "enabled:false, // /scripts/install-less.js", "enabled:true, // /scripts/install-less.js");

	// Add main CSS file to Git ignores
	fs.appendFile(".gitignore", "\r\n"+lessIn, function (err) {});

	// Remove main css from source control (but let user commit after)
	exec("git rm "+lessOut, function (error, stdout, stderr)
	{
		if (error !== null) {
			console.log('exec error: ' + error);
			console.log("stdout : "+stdout);
			console.log("stderr : "+stderr);
		}
	});

	console.log("LESS embeded sucessfully");
}

function replaceInFile(file,regexOrString,to)
{
	fs.readFile(file, 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		var result = data.replace(regexOrString, to);
		fs.writeFile(file, result, 'utf8', function (err) {
			if (err) return console.log(err);
		});
	});
}

execute();