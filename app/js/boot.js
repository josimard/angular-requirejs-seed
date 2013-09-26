// First, let's load configuration file to configure RequireJS
requirejs.config({baseUrl:"./"});
requirejs(["config"], function (config)
{
	"use strict";
	// Link against minified version:
	//config.require.paths["js/app"] = "js/app.min";

	// Configure RequireJS
	requirejs.config(config.requirejs);

	// Boot procedure
	requirejs(["js/app"], function (app)
	{
		console.log("Booting application...");

		// Load/initialize localization first and give it the chance to load data if necessary
		requirejs(["js/services/Localization"], function (Localization)
		{
			Localization.init(function()
			{
				// Start application 
				app.init(config.angular);
			});
		});
	});
});

// Make sure IE has a console
if (!window.console) console = {log: function() {}};