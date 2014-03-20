/* 
* AngularJS + RequireJS HTML5 Application
* @see https://github.com/pheno7/angular-requirejs-seed
* @author Jo Simard
*/
'use strict';
define(['angular', "js/services/Localization", "js/services/Routing"], 
function (angular, Localization, Routing)
{
	function App(config)
	{
		var context = this;

		// AngularJS Module - http://docs.angularjs.org/guide/module
		var module;

		// Localization service
		var localization;

		// Routing service
		var routing;

		function init()
		{
			module = angular.module(config.angular.name, ['ngRoute']);

			localization = new Localization(module, config, onLocalizationReady);
		}

		function onLocalizationReady()
		{
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

				// Create our Routing service
				routing = new Routing(module, config);

				onAppReady();
			});
		}

		function onAppReady()
		{
			// Start angular JS boostrap
			angular.bootstrap(document.body, [config.angular.name]);

			// Hide the splash screen
			document.getElementById('splash').style.visibility = 'hidden'; 
		};

		// Public API
		context.init = init;

		return context;
	}

	return App;
});
