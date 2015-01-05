/**
* Example menu widget
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
	module.directive('menuWidget', function(Routing) {
		return {
			// Restrict to attribute only
			restrict: 'A',

			// Using parent scope
			//scope: {eventSources:'=ngModel'},
			
			// You can also define a template for your widgets when needed
			templateUrl: Routing.getTemplateUrl('{{baseUrl}}/menu.html'),

			// In-line controller
			controller: function($scope, $timeout, Localization){
				locales = Localization.locales;
			},

			// This method is called when binding the directive to the DIV element of the parent template
			link: function($scope, element, attrs, controller)
			{
				
			}
		};
	});

	return module;
});

