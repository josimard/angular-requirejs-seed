// AMD controller
define([], function ()
{
	/** @ngInject */
	function PageControl($scope, $http, $state, Routing, Localization)
	{
		var context = this;
		var model = {
			// Set name from url param or defaults to path
			name: $state.current.name
		};

		// Link localized content against locales section
		// Content is from i18n locales file in app/nls/locales for now, but could come from a JSON service as demonstrated in ListControl.js
		model.locales = Localization.locales[model.name];

		// Display 404 when content/locales does not exists
		if(!model.locales)
		{
			model.name = "404";
			model.locales = Localization.locales[model.name];
		}

		// Set page title
		Routing.setPageTitle(model.locales.title);
		
		// Assign model to Angular scope
		$scope.model = this.model = model;
	}

	return PageControl;
});