/**
* Angular.js various utilities
* @author jo@josimard.com
*/
define(["angular"], function (angular)
{
	var AngularUtils = this;

	/**
	 * Various scope utilities
	 */
	AngularUtils.initScopeUtils = function($scope)
	{
		// Global string interpolation shortcut: ease the use of dynamic variables in localized files or use of dynamic strings
		// http://docs.angularjs.org/api/ng/service/$interpolate
		$scope.interpolate = function(string, context) {
			if(!context) context = $scope;
			return $interpolate(string)(context);
		};

		// https://coderwall.com/p/ngisma
		$scope.update = function(fn) {
			var phase = this.$root.$$phase;
			if(phase == '$apply' || phase == '$digest') {
				if(fn && (typeof(fn) === 'function')) {
					fn();
				}
			} else {
				this.$apply(fn);
			}
		};
	}

	/**
	 * Dynamically load angular controllers using Require.js
	 */
	AngularUtils.loadControllers = function(angularModule, controllerList, onComplete)
	{
		// Nothing to load?
		if(!controllerList || controllerList.length<=0) 
		{
			onComplete();
			return;
		}

		// Get all controllers from configuration, AMD or not
		requirejs(controllerList, function() {
			// Register controllers to application
			for(var i=0; i<arguments.length; i++)
			{
				var controllerName = controllerList[i];
				controllerName = controllerName.substring(controllerName.lastIndexOf("/")+1, controllerName.length);

				if(arguments[i])
				{
					console.log("Registering controller " +controllerName);
					angularModule.controller(controllerName, arguments[i]);
				}
			}

			onComplete();
		});
	}

	return AngularUtils;
});