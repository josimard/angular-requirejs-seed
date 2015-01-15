// AMD controller
define([], function ()
{
	/** @ngInject */
	function PageControl($scope, $http, $state, $sce, Routing, Localization)
	{
		var name = $state.current.name;
		var locales = Localization.locales[name];

		// Create scope model object
		$scope.model = {
			name: name,
			title: locales.title,
			content: $sce.trustAsHtml(locales.content)
		};

		// Set page title
		Routing.setPageTitle(locales.title);
	}

	return PageControl;
});