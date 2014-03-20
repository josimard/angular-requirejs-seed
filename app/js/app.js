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
			// Register controllers from config
			for(var i=0; i<arguments.length; i++)
			{
				var controllerName = config.angular.controllers[i];
				controllerName = controllerName.substring(controllerName.lastIndexOf("/")+1, controllerName.length);
				if(arguments[i]) module.controller(controllerName, arguments[i]);
			}

			// Create our Routing module that will register itself as a AngularJS provider
			routing = new Routing(module);

			// Configure application module
			module.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
			{
				// Handling routes in the routing component
				routing.init(config, $routeProvider, $locationProvider);


			}]);

			// Set the Localization component as an AngularJS service
			module.factory('Localization', function() {return Localization;});

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
