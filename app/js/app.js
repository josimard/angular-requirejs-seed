'use strict';
define(['angular', "js/services/Localization", "js/services/Routing"], 
function (angular, Localization, Routing)
{
	var moduleName = "app";
	var module;
	var routing;
	
	/**
	* Initialize the application as a AngularJS module
	*/
	function init(config)
	{
		// AngularJS Module
		module = angular.module(moduleName, ['ngRoute']);

		// Get all controllers from configuration, AMD or not
		requirejs(config.angular.controllers, function ()
		{
			// Register controllers to application
			for(var i=0; i<arguments.length; i++)
			{
				var controllerName = config.angular.controllers[i];
				controllerName = controllerName.substring(controllerName.lastIndexOf("/")+1, controllerName.length);
				if(arguments[i]) module.controller(controllerName, arguments[i]);
			}

			// Set the Localization component as an AngularJS service (singleton)
			module.service('Localization', function() {return Localization;});

			// Create our Routing module that will register itself as a AngularJS service/provider
			routing = new Routing(module, config);

			// Start angular JS boostrap
			angular.bootstrap(document.body, [moduleName]);

			onAppReady();
		});
	}

	function onAppReady()
	{
		// Hide the splash screen
		document.getElementById('splash').style.visibility = 'hidden'; 
	};

	// Public API
	return {
		init: init,
		module: function() {return module;}
	};
});
