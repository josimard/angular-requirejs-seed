/**
* Example widget directive (a controller-directive combo)
* 
* Notes: 
* - Widgets are loaded in modules.js
* - Repo owner and is defined from the 'data-readme' attribute, see in home.html
*/
define(["angular"], function (angular)
{
	// Get the widget's module
	var module = angular.module('app.widgets');

	// http://docs.angularjs.org/guide/directive
	module.directive('readmeWidget', function(Localization) {
		return {
			// Restrict to attribute only
			restrict: 'A',

			// This method is called when binding the directive to the DIV element of the parent template
			link: function($scope, element, attrs, controller)
			{
				// Get the owner and repo from the 'data-readme' attribute
				var info = attrs.readme.split("/");
				var readmeOwner = info[0];
				var readmeRepo = info[1];

				// Reference to the settings sent from the attributes in home.html
				var settings = $scope.settings;

				// Temp loading text
				angular.element(element).text(Localization.locales.loading.title);

				// Using https://github.com/thomasklemm/Readme.js
				jQuery(element).readme({
					owner: readmeOwner,
					repo:  readmeRepo
				});
			}
		};
	});

	return module;
});

