/**
 * Main Application controller
 */
define(["angular", "js/utils/AngularUtils"], function (angular, AngularUtils)
{
	/** @ngInject */
	function AppControl($scope, $location, $interpolate, Localization, AppConfig)
	{
		var context = this;

		// Setup application scope
		$scope.locales = Localization.locales;
		
		// Application API
		$scope.app =
		{
			config: AppConfig,
			assetsUrl: AppConfig.baseUrl+"/assets",
		}

		// Angular utilities
		AngularUtils.initScopeUtils($scope);

		return context;
	}

	return AppControl;
});