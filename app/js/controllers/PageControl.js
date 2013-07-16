// AMD controller
define([], function ()
{
	/** @ngInject */
	function PageControl($scope, $http, Routing, Localization)
	{
		var context = this;
		var model = {
			// Set name from url param or defaults to path
			name: (Routing.params.name) ? Routing.params.name :  Routing.location.path().replace("/","") 
		};

		function init()
		{
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
			Routing.pageTitle(model.locales.title);
			
			// Assign model to Angular scope
			$scope.model = model;
		}

		// Auto-init
		init();

		// Public
		// When using methods/properties of their own scope, you can expose them as public methods of this instance this way
		context.model = model;

		return context;
	}

	return PageControl;
});