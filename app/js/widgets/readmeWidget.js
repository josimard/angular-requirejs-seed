/**
* Example widget
* A widget is a controller-directive combo
* 
* Note: Widgets are self-registering but must be loaded in modules.js
*/
define(["angular"], function (angular)
{
	// Get the widget's module
	var module = angular.module('app.widgets');

	// Static scope
	var locales;

	// http://docs.angularjs.org/guide/directive
	module.directive('readmeWidget', function() {
		return {
			// Restrict to attribute only
			restrict: 'A',

			// Using parent scope
			//scope: {eventSources:'=ngModel'},
			
			// You can also define a template for your widgets when needed
			// templateUrl: 'templates/readmeWidget.html',

			// In-line controller
			controller: function($scope, $timeout, Localization){
				locales = Localization.locales;
			},

			// This method is called when binding the directive to the DIV element of the parent template
			link: function($scope, element, attrs, controller)
			{
				// Temp loading text
				angular.element(element).text(locales.loading.title);

				// Avoid loading it in IE
				// AJAX request could still be blocked by some browsers, but this defies the purpose of this example
				// In these cases use a reverse-proxy or use JSONP as demonstrated in ListControl.js
				if(jQuery("html").hasClass("ie")) return;

				// Make sure libraries are available
				loadLibraries(function()
				{
					// Using https://github.com/thomasklemm/Readme.js
					jQuery(element).readme({
						'owner': 'josimard',
						'repo':  'angular-requirejs-seed'
					});
				});
			}
		};
	});

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

	return module;
});

