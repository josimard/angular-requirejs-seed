/**
 * Example module controller
 *
 * TODO: All the jQuery code should be wrapped in a Directive or Widget container
 * 
 */
define(["angular", "js/controllers/PageControl"], function (angular, PageControl)
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
					'owner': 'josimard',
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

		jQuery.getScript( "https://rawgit.com/thomasklemm/Readme.js/master/readme.js", function(script, textStatus, jqXHR){
			_LibrariesLoaded = true;
				onComplete();
		});
	}
	
	return HomeControl;
});