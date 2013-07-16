define(["angular", "jquery", "js/controllers/PageControl"], function (angular, jQuery, PageControl)
{
	/** @ngInject */
	function HomeControl($scope, $http, Routing, Localization)
	{
		var context = this;

		// Set routing param name for PageControl
		Routing.params.name = "home";

		// Uber-simple limited inheritance
		var _super = new PageControl($scope, $http, Routing, Localization);
		angular.extend(context, _super);

		function init()
		{
			// Avoid loading it in IE
			// AJAX request could still be blocked by some browsers, but this defies the purpose of this example
			// In these cases use a reverse-proxy or use JSONP as demonstrated in ListControl.js
			if(jQuery("html").hasClass("ie")) return;

			// Make sure libraries are available
			loadLibraries(function()
			{
				// Using https://github.com/thomasklemm/Readme.js
				jQuery("#Readme").readme({
					'owner': 'pheno7',
					'repo':  'angular-requirejs-seed'
				});
			});
		}

		// Auto-init
		init();

		return context;
	}

	// Static scope
	// Example to load additional libraries at runtime when only specific to one place in the application
	var _LibrariesLoaded = false;
	function loadLibraries(onComplete)
	{
		if(_LibrariesLoaded) { onComplete(); return; }

		// Using modernizr included yepnope to inject JS libraries at runtime - http://modernizr.com/download/ + http://yepnopejs.com/
		yepnope({
			// Using raw.github url for demonstration purposes only, never do that on a production app since the code could change and break your app, or github could block your server IP
			both: ["https://raw.github.com/thomasklemm/Readme.js/master/readme.js"],
			complete: function() {
				_LibrariesLoaded = true;
				onComplete();
			}
		});
	}
	
	return HomeControl;
});