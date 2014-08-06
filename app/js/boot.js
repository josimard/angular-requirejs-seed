// Wrapper
(function()
{
	var script = document.getElementById("bootScript");
	var debug = (script && script.getAttribute('data-debug')=="true") ? true : false;

	// angular.js dependency module
	define('angular', function () {return window.angular;}); 

	// Cache busting
	// http://requirejs.org/docs/api.html#config-urlArgs
	var requireCacheBust = ( new Date().getTime() )+"";
	requireCacheBust = "v=" + requireCacheBust.substr(requireCacheBust.length - 4);

	// Basic RequireJS config
	requirejs.config({
		baseUrl:"./",
		urlArgs:requireCacheBust
	});

	// First, let's load configuration file to configure RequireJS
	requirejs(["js/config"], function (config)
	{
		"use strict";

		// Link against minified version when not in debug mode (must be a built version) 
		if(!debug)
		{
			config.requirejs.paths["js/app"] = "js/app.min";
			config.requirejs.urlArgs = null;
		}

		// Localization init (from html lang) -- http://www.w3.org/TR/html401/struct/dirlang.html#h-8.1.1	
		config.locale = document.documentElement.lang;
		if(!config.locale || config.locale=="en") config.locale = "en-US";
		config.lang = config.locale.substring(0,2);
		config.debug = debug;

		// Configure RequireJS
		config.requirejs.locale = config.locale;

		// Apply Configuration
		requirejs.config(config.requirejs);

		// Boot procedure (async angular.js bootstrap)
		requirejs(["js/app"], function (App)
		{
			console.log("Booting "+config.angular.name+", debug: "+debug);

			// Start application 
			var app = new App(config);
			app.init();
		});
	});

	// Make sure IE has a console object
	if (!window.console) console = {log: function() {}};

// End of wrapper
})();