"use strict";

// Load configuration file to configure require first
require(["config"], function (config)
{
	// Require JS configuration
	require.config(config.require);

	// Boot procedure
	require(["models/Localization", "app"], function (Localization, app)
	{
		console.log("Booting application...");

		// Load/initialize the localization component first (give the chance to load data if necessary)
		Localization.init(function()
		{
			// Start application 
			app.init(config.angular);
		});
	});
});

// Make sure IE has a console
if (!window.console) console = {log: function() {}};