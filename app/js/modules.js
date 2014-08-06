/**
*
* Application specific modules manager
* 
* Register services and such after loading AMD modules or additional dependencies here
* 
* Prevents the need for a lazy-loading system, ie: https://github.com/nikospara/angular-require-lazy)
*
*/
define(["angular"], function (angular)
{
	function Modules(app, angularModule, onComplete)
	{
		this.onComplete = onComplete;

		// Create application widgets module (must be required in application)
		app.widgets = angular.module('app.widgets', []);

		// Load application specific modules/directives/widgets/etc here
		require([
			"js/widgets/menuWidget",
			"js/widgets/readmeWidget"
		], this.onModulesLoaded.bind(this));
	}

	Modules.prototype.onModulesLoaded = function()
	{
		// Register application factories (instances)
		
		// Register application services (singletons)
		

		/* Fast click polyfill 
		// Use ngTouch unless click delay is not acceptable
		// @see https://github.com/ftlabs/fastclick
		// @see https://github.com/angular/angular.js/issues/2548
		// @see http://stackoverflow.com/questions/18338640/enable-tapping-angular-1-2-ngmobile-and-ng-click
		FastClick.attach(document.body);
		*/
	
		if(this.onComplete) this.onComplete();
	}

	return Modules;
});