/**
* Example menu widget (a controller-directive combo)
* 
* Note: Widgets are loaded in modules.js
*/
define(["angular"], function (angular)
{
	// Get the widget's module
	var module = angular.module('app.widgets');

	// http://docs.angularjs.org/guide/directive
	module.directive('menuWidget', function(Routing, Localization) {
		return {
			// Restrict to attribute only
			restrict: 'A',

			// Creating it's own scope
			scope: {
				model: '=', // This will bind the attribute references to this scope, see 'model' attribute in index.html
			},
			
			// You can also define a template for your widgets when needed
			templateUrl: Routing.getTemplateUrl('{{baseUrl}}/menu.html'),

			// In-line controller
			controller: function($scope){
				
			},

			// This method is called when binding the directive to the DIV element of the parent template
			link: function($scope, element, attrs, controller)
			{
				
			}
		};
	});

	return module;
});

