'use strict';
define(['angular', "app/components/Localization" ], 
function (angular, Localization)
{
	var moduleName = "app";
	var module;
	
	function init()
	{
		// Load/initialize the localization component first (give the chance to load data if necessary)
		Localization.init(function()
		{
			// Can now init application
			initAngular();

			// Hide the splash screen
			document.getElementById('splash').style.visibility = 'hidden'; 
		});
	}

	function initAngular()
	{
		// Get all application-wide required controllers here to avoid making a component clutter at the top of this script
		require(["app/controllers/PageControl", "app/controllers/ListControl"], 
		function (PageControl, ListControl)
		{
			// Getting all those AMD modules should be quick-as if you are using the require.js optimizer
			// Check boot.js to see how to link against a combined version of all AMD modules
			// @see http://requirejs.org/docs/optimization.html

			// App Module
			module = angular.module(moduleName, []).
				config(function($routeProvider, $locationProvider)
				{
					// You can set the urls to hashbang ajax urls with $locationProvider, but all your adresses will need to be prefixed with "!" ie "#!/home/"
					// More info @ https://developers.google.com/webmasters/ajax-crawling/docs/faq
					//$locationProvider.html5Mode(false).hashPrefix('!');

					// Setup routes directly here for the sake of simplicity
					$routeProvider.
						// Generic page getter (will handle 404)
						when('/p/:name', {templateUrl: 'app/templates/page.html', controller: PageControl}).
						// Specific template for home (and re-using PageControl)
						when('/home', {templateUrl: 'app/templates/home.html', controller: PageControl}).
						// Call to a list
						when('/list/:name', {templateUrl: 'app/templates/list.html', controller: ListControl}).

						// Handle other url queries
						otherwise({redirectTo: function(routeParams, path, search)
						{
							// Home path
							if(path=="/" || path=="") return "/home";
							// Redirect to PageControl
							var newPath = (path.indexOf("/p") !=0) ? "/p"+path : path;
							// Not compatible with page controller, use as a query
							if(newPath.split("/").length>3) {
								newPath = "/p/404?r="+path;
							}
							return newPath;
						}
				});
			});

			// Inline Page service
			module.factory('Page', function()
			{
				var defaultTitle = document.title;
				// You can create a more compact title here
				var partialTitle = document.title;
				var title = defaultTitle;
				return {
					// Set pages title, keeping the original title on the right
					title: function(value) {
						if(value){
							title = value+" | "+partialTitle;
							document.title = title;
						}
						return title;
					},
					setDefaultTitle: function() {
						return this.title(defaultTitle);
					}
				};
			});

			// Start angular JS boostrap
			angular.bootstrap(document.body, [moduleName]);
		});
	};


	// Public API
	return {
		init: init,
		module: function() {return module;}
	};
});
