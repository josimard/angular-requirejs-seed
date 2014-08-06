/* 
* AngularJS + Require.js Application module with:
* Routing, Controller Registration and dependency management from a configuration file.
* 
* The application must use manual boostrap (https://docs.angularjs.org/guide/bootstrap)
*
* Documentation in ../README.md 
*
* Project seeded from https://github.com/pheno7/angular-requirejs-seed
* 
*/
'use strict';
// Module dependencies 
define(['angular', "js/core/Routing", "js/services/Localization", "js/modules"], 
function (angular, Routing, Localization, Modules)
{
	function App(config)
	{
		// Save application configuration
		this.config = config;

		// Application name (try to get from config.js)
		this.name = (config.angular && config.angular.name) ? config.angular.name : "app";
	}

	App.prototype.init = function()
	{
		// Create application module and require other modules dependencies - http://docs.angularjs.org/guide/module
		this.module = angular.module(this.name, [
			// Local modules
			"app.widgets",

			// Angular JS modules
			'ngRoute',
			//'ui.router'
			//'ngAnimate',
			//'ngTouch'
		]); 

		// Make application config injectable
		this.module.service('appConfig', function() { return this.config; });

		// Load localization module first
		var localization = this.localization = new Localization(this.module, this.config, this.onLocalizationReady.bind(this));

		// Register the localization module as a service (singleton)
		this.module.service('Localization', function() {return localization;});
	}

	App.prototype.onLocalizationReady = function()
	{
		// Then load application specific modules
		this.modules = new Modules(this, this.module, this.onModulesReady.bind(this));
	}
	
	App.prototype.onModulesReady = function(modules)
	{
		// Then create routing module module, controllers in config.js will be mapped there
		this.routing = new Routing(this, this.module, this.onRoutingReady.bind(this) );
	}

	App.prototype.onRoutingReady = function()
	{	
		// Finally bootstrap the application
		this.boostrap();
	}


	/**
	 * Manual angular.js application boostrap
	 * @see https://docs.angularjs.org/guide/bootstrap
	 */
	App.prototype.boostrap = function()
	{
		var elementQuery = this.config.angular.element;
		
		this.element = angular.element( document.querySelector(elementQuery) );

		if(!this.element || this.element.length<=0) console.error("Application element not found using query: '"+elementQuery+"'");

		angular.bootstrap(this.element, [this.name]);

		angular.element(this.element).removeClass("on-init");
		angular.element(this.element).addClass("loaded");

		console.log("Application boostrap complete");
	};

	return App;
});
