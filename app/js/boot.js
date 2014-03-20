// angular.js dependency module
define('angular', function () {return window.angular;}); 

// First, let's load configuration file to configure RequireJS
requirejs.config({baseUrl:"./"});
requirejs(["js/config"], function (config)
{
	"use strict";

	// Link against minified version: (activate in build, see Gruntfile.js customize task)
	//config.requirejs.paths["js/app"] = "js/app.min";

	// Localization init (from html lang) -- http://www.w3.org/TR/html401/struct/dirlang.html#h-8.1.1	
	config.locale = document.documentElement.lang;
	if(!config.locale || config.locale=="en") config.locale = "en-US";
	config.lang = config.locale.substring(0,2);

	// Configure RequireJS
	config.requirejs.locale = config.locale;
	requirejs.config(config.requirejs);

	// Boot procedure (async angular.js bootstrap)
	requirejs(["js/app"], function (App)
	{
		console.log("Booting application...");

		// Start application 
		var app = new App(config);
		app.init();
	});
});

// Make sure IE has a console
if (!window.console) console = {log: function() {}};