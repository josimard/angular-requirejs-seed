/**
* Application routing component and AngularJS service to:
* - configure angular routes
* - handle route localization
* - set page title, etc.
* 
* Using Angular UI router:
* https://github.com/angular-ui/ui-router
* http://angular-ui.github.io/ui-router/site/#/api/ui.router
* 
*/
define(["angular", "js/utils/AngularUtils"], function (angular, AngularUtils)
{
	function Routing(appConfig, angularModule, onComplete)
	{
		this.angularModule = angularModule;
		this.config = angular.extend({
			// Default settings
			type:"ngRoute",
			prefix: "/",
			home: "/"
		}, appConfig.angular.routing);

		this.defaultTitle = document.title;
		this.title = this.defaultTitle;
		this.lastWorkingUrl = this.home;

		// Templates cache busting - https://gist.github.com/ecowden/4637806
		if(appConfig.debug) this.cacheBustSuffix = Date.now();

		this.init(onComplete);
	}

	Routing.prototype.init = function(onComplete)
	{
		var context = this;
		
		// Register states
		this.angularModule.config(function($stateProvider, $urlRouterProvider)
		{
			// For any unmatched url, redirect to /state1
  			$urlRouterProvider.otherwise(context.config.home);

  			/* You can still set states here:
  			$stateProvider.state('home', {
				url: "/home",
				templateUrl: "templates/home.html"
			});*/

			/* config.js states */
			var states = context.config.states;
			if(states!=null)
			{
				for (var i = 0; i < states.length; i++) {
					var stateConfig = states[i];

					// Adapt template url if necessary
					if(stateConfig.templateUrl) stateConfig.templateUrl = context.getTemplateUrl(stateConfig.templateUrl);

					console.log("state:",stateConfig);

					$stateProvider.state(stateConfig.name, {
						url: stateConfig.url,
						templateUrl: stateConfig.templateUrl,
						controller: stateConfig.controller
					});

					// TODO: Support named views
					// https://github.com/angular-ui/ui-router#multiple--named-views
					
				};	
			}
		});	

		onComplete();
	}

	// Public methods
	Routing.prototype.getTemplateUrl = function(templateUrl)
	{
		if(this.config.templatesBase)
		{
			templateUrl = templateUrl.replace('{{baseUrl}}', this.config.templatesBase);
		}
		
		// Cache-busting templates suffix
		if(this.cacheBustSuffix)
		{
			templateUrl = templateUrl + "?v=" + this.cacheBustSuffix;
		}

		return templateUrl;
	}
	
	Routing.prototype.setPageTitle = function(value) {
		if(value){
			this.title = value+" | "+this.defaultTitle;
			document.title = this.title;
		}
		return this.title;
	}
	
	Routing.prototype.setDefaultTitle = function() {
		return this.setPageTitle(this.defaultTitle);
	}

	/*Routing.prototype.show404 = function(referer)
	{
		this.location.url( this.get404url(referer) );
	}

	Routing.prototype.get404url = function(referer)
	{
		var url = this.config.prefix+"404";
		if(referer) url+= "?r="+referer;
		return url;
	}*/

	return Routing;
});