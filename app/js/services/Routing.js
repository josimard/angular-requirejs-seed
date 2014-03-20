/**
* Instantiable routing component and AngularJS service to:
* - configure angular routes
* - handle route localization
* - set page title, etc.
*/
define(["angular","js/services/Localization"], 
function (angular, Localization)
{
	// Class
	function Routing(angularModule, config)
	{
		var context = this;
		var routePrefix = "/";
		var defaultTitle = document.title;
		var title = defaultTitle;

		// Register as angular provider
		angularModule.service('Routing', function($location, $routeParams)
		{
			// Self-assign injectables for public availability
			context.location = $location;
			context.params = $routeParams;
			return context;
		});

		// Configure application module
		angularModule.config(function($routeProvider, $locationProvider)
		{
			// You can set the urls to hashbang ajax urls with $locationProvider, but all your adresses will need to be prefixed with "!" ie "#!/home/"
			// More info @ https://developers.google.com/webmasters/ajax-crawling/docs/faq
			if(routePrefix=="!/") $locationProvider.html5Mode(false).hashPrefix('!');

			// Setup routes here 
			// Verify your templates accessibility if you receive a similar error:
			// "[Exception... "Access to restricted URI denied"  code: "1012" ..."

			// Routes in config.js?
			if(config.angular.routes)
			{
				for(var i=0; i<config.angular.routes.length; i++)
				{
					//console.log(config.angular.routes[i].url)
					$routeProvider.when(config.angular.routes[i].url, config.angular.routes[i]);
				}
			}

			// Handle other url queries
			$routeProvider.otherwise({redirectTo: function(routeParams, path, search)
			{
				// Home path
				if(path=="/" || path=="") return getHomeUrl();
				
				// Not compatible with page controller, use as a query
				if(path.split("/").length>4) {
					path = get404url(path);
				}
				return path;
			}});
		});

		function getHomeUrl()
		{
			return routePrefix+Localization.lang+"/home";
		}

		function get404url(referer)
		{
			var url = routePrefix+Localization.lang+"/404";
			if(referer) url+= "?r="+referer;
			return url;
		}

		// Public methods
		function pageTitle(value) {
			if(value){
				title = value+" | "+defaultTitle;
				document.title = title;
			}
			return title;
		}
		
		function setDefaultTitle() {
			return pageTitle(defaultTitle);
		}

		function show404(referer)
		{
			context.location.url( get404url(referer) );
		}
		
		// Expose public methods
		this.init = init;
		this.show404 = show404;
		this.pageTitle = pageTitle;
		this.setDefaultTitle = setDefaultTitle;

		return this;
	}

	return Routing;
});