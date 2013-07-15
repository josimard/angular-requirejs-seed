'use strict';
define(['angular', "models/Localization", "routing"], 
function (angular, Localization, Routing)
{
	var moduleName = "app";
	var module;
	var routing;
	
	/**
	* Initialize the application as a AngularJS module
	*/
	function init(angularConfig)
	{
		// Get all controllers from configuration, AMD or not
		require(angularConfig.controllers, function ()
		{
			// AngularJS Module
			module = angular.module(moduleName, []);

			// Register AMD controllers from configuration
			for(var i=0; i<arguments.length; i++)
			{
				var controllerName = angularConfig.controllers[i];
				controllerName = controllerName.substring(controllerName.lastIndexOf("/")+1, controllerName.length);
				if(arguments[i]) module.controller(controllerName, arguments[i]);
			}

			// Create our Routing module that will register itself as a AngularJS provider
			routing = new Routing(module);

			module.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
			{
				// Handling routes in the routing component
				routing.init($routeProvider, $locationProvider);
			}]);

			// Set the localization model as a injectable
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
