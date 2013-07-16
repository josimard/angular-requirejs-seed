// First, let's load configuration file to configure RequireJS
require.config({baseUrl:"./"});
require(["config"], function (config)
{
	"use strict";
	// Link against minified version:
	//config.require.paths["js/app"] = "js/app.min";

	// Configure RequireJS
	require.config(config.require);

	// Boot procedure
	require(["js/app"], function (app)
	{
		console.log("Booting application...");

		// Load/initialize localization first and give it the chance to load data if necessary
		require(["js/services/Localization"], function (Localization)
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