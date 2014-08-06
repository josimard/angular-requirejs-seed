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

		// Note: the Readme content is loaded via the widget directive defined in widgets/readmeWidget.js

		return context;
	}

	
	
	return HomeControl;
});