/**
* Application routing component and AngularJS service to:
* - configure angular routes
* - handle route localization
* - set page title, etc.
* 
* Using Angular UI router:
* https://github.com/angular-ui/ui-router/wiki
* 
*/
define(["angular"], 
function (angular)
{
	function Routing(app, angularModule, onComplete)
	{
		this.app = app;
		this.angularModule = angularModule;
		this.onComplete = onComplete;

		var appConfig = app.config;

		// Default settings
		this.settings = angular.extend({
			type:"ngRoute",
			prefix: "/",
			home: "/"
		}, appConfig.angular.routing);

		this.defaultTitle = document.title;
		this.title = this.defaultTitle;

		// Load controllers from config?
		if(appConfig.angular.controllers)
		{
			this.loadControllers(appConfig.angular.controllers);
		} else {
			this.init();
		}
	}

	Routing.prototype.init = function()
	{
		if(this.settings.type == "ngRoute")
		{
			this.initNgRoutes();
		} else {
			this.initUiRouter();
		}
		
		if(this.onComplete) this.onComplete();
	}

	Routing.prototype.initNgRoutes = function()
	{
		var context = this;
		var module = this.angularModule;
		var routes = this.settings.routes;

		// Register as angular provider
		module.service('Routing', function($location, $routeParams)
		{
			// Assign injectables for public availability
			context.location = $location;
			module.location = $location;
			context.params = $routeParams;
			return context;
		});

		// Configure application module
		module.config(function($routeProvider, $locationProvider)
		{
			// Routes in appConfig.js?
			if(routes)
			{
				for(var i=0; i<routes.length; i++)
				{
					var routeData = routes[i];

					console.log("Registering route '" +routeData.url+"'", routeData);

					$routeProvider.when(routeData.url, routeData);
				}
			}

			// Handle other url queries
			$routeProvider.otherwise({redirectTo: context.onNgRouteNotFound.bind(context)});
		});

	}

	Routing.prototype.onNgRouteNotFound = function(routeParams, path, search)
	{
		if(path.indexOf("/debug")>-1) return path;
		if(path=="") return this.settings.home;
		if(path==this.settings.home) return path;
		
		console.log("Unkown path: "+path);
		
		return this.settings.not_found;
	}

	/**
	 * Load controllers using Require.js
	 */
	Routing.prototype.loadControllers = function(controllerList)
	{
		this.controllerList = controllerList;

		// Get all controllers from configuration, AMD or not
		requirejs(controllerList, this.onControllersLoaded.bind(this));
	}

	Routing.prototype.onControllersLoaded = function()
	{
		// Register controllers to application
		for(var i=0; i<arguments.length; i++)
		{
			var controllerName = this.controllerList[i];
			controllerName = controllerName.substring(controllerName.lastIndexOf("/")+1, controllerName.length);

			if(arguments[i])
			{
				console.log("Registering controller " +controllerName);
				this.angularModule.controller(controllerName, arguments[i]);
			}
		}

		this.init();
	}

	Routing.prototype.get404url = function(referer)
	{
		var url = routePrefix+"404";
		if(referer) url+= "?r="+referer;
		return url;
	}

	// Public methods
	Routing.prototype.pageTitle = function(value) {
		if(value){
			this.title = value+" | "+this.defaultTitle;
			document.title = this.title;
		}
		return this.title;
	}
	
	Routing.prototype.setDefaultTitle = function() {
		return pageTitle(this.defaultTitle);
	}

	Routing.prototype.show404 = function(referer)
	{
		context.location.url( get404url(referer) );
	}

	return Routing;
});