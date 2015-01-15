/**
* Application routing service
*
* Routes are defined in config.js
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
			// For any unmatched url, redirect to home (could be a 404 page)
  			$urlRouterProvider.otherwise(context.config.home);

  			// You can set states custom states here:
  			
  			/*$stateProvider.state('home', {
				url: "/home",
				templateUrl: "templates/home.html"
			});*/

			// config.js routing states
			var statesConfig = context.config.states;
			if(statesConfig!=null)
			{
				for (var i = 0; i < statesConfig.length; i++){
					var state = statesConfig[i];

					// Adapt template url if necessary?
					if(state.templateUrl) state.templateUrl = context.getTemplateUrl(state.templateUrl);

					console.log("state:",state);

					$stateProvider.state(state.name, state);
				};	
			}
		});	

		onComplete();
	}

	// Public methods
	Routing.prototype.getTemplateUrl = function(templateUrl)
	{
		// Replace template baseUrl?
		if(this.config.templatesBase)
		{
			templateUrl = templateUrl.replace('{{baseUrl}}', this.config.templatesBase);
		}
		
		// Cache-busting templates suffix?
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