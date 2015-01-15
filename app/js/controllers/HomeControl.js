/**
 * Example module controller
 *
 * Note: the Readme content is loaded via the widget directive defined in widgets/readmeWidget.js
 * 
 */
define(["angular"], function (angular)
{
	/** @ngInject */
	function HomeControl($scope, $http, $state, Routing, Localization)
	{
		var name = $state.current.name;
		var locales = Localization.locales[name];

		// Create scope model object
		$scope.model = {
			name: name,
			title: locales.title
		};

		// Set page title
		Routing.setPageTitle(locales.title);
	}

	return HomeControl;
});