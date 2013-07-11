define(["app/components/Localization"], function (Localization)
{
	function PageControl($scope, $http, $routeParams, $location, Page)
	{
		var model = {
			// Set name from url param or defaults to path
			name: ($routeParams.name) ? $routeParams.name : $location.path().replace("/","") 
		};

		function init()
		{
			// Link localized content against locales section
			// Content is from i18n locales file in app/nls/locales for now, but could come from a JSON service as demonstrated in ListControl.js
			model.locales = Localization.locales[model.name];

			// Home only component example
			if(model.name=="home")
			{
				initHome();
			}
			// Display 404 when content/locales does not exists
			else if(!model.locales)
			{
				model.name = "404";
				model.locales = Localization.locales[model.name];
			}

			// Set page title
			Page.title(model.locales.title);
			
			// Assign model to Angular scope
			$scope.model = model;
		}

		function initHome()
		{
			// Example use of a component not using AngularJS and still playing nice in the application context
			// Get the component class with RequireJS
			require(["app/components/Readme"], function (Readme)
			{
				// Instanciate the component
				var readme = new Readme();
				readme.init(
				{
					element:"#Readme", 
					readme: {
						'owner': 'pheno7',
						'repo':  'angular-requirejs-seed'
					}
				});
			});
		}

		// Auto-init
		init();

		return this;
	}

	return PageControl;
});