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
define(['angular', "js/utils/AngularUtils", "js/routing", "js/services/Localization", "js/modules", "js/controllers/AppControl"], 
function (angular, AngularUtils, Routing, Localization, Modules, AppControl)
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
		var context = this;

		// Create application module and require other modules dependencies - http://docs.angularjs.org/guide/module
		this.module = angular.module(this.name, [
			// Local modules
			"app.widgets",

			// Angular JS modules
			'ui.router'
			//'ngAnimate',
			//'ngTouch'
		]); 

		// Register main application controllers (other controllers are registred in core/Routing.js)
		this.module.controller("AppControl", AppControl);
		
		// Load localization module first
		this.localization = new Localization(this.module, this.config, this.onLocalizationReady.bind(this));

		// Register modules as services (singleton access)
		this.module.service('AppConfig', function() {return context.config;});
		this.module.service('Localization', function() {return context.localization;});
		this.module.service('Routing', function() {return context.routing;});
	}

	App.prototype.onLocalizationReady = function()
	{
		// Load controllers from configuration?
		AngularUtils.loadControllers(this.module, this.config.angular.controllers, this.onControllersLoaded.bind(this));
	}

	App.prototype.onControllersLoaded = function()
	{
		// Then create routing module module, controllers in config.js will be mapped there
		this.routing = new Routing(this.config, this.module, this.onRoutingReady.bind(this) );
	}
	
	App.prototype.onRoutingReady = function(modules)
	{
		// Then load application specific modules
		this.modules = new Modules(this.config, this.module, this.onModulesReady.bind(this));
	}

	App.prototype.onModulesReady = function()
	{	
		// Finally bootstrap the application
		this.bootstrap();
	}

	/**
	 * Manual angular.js application boostrap
	 * @see https://docs.angularjs.org/guide/bootstrap
	 */
	App.prototype.bootstrap = function()
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
