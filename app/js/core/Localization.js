/**
* Localization component example
* Using the require.js i18n plugin for the sake of simplicity
*
* Centralizing your localization in a component reduces your dependency over a single framework and switching system application-wide should prove be easier
*
* @see Another interesting framework:  i18next @ http://i18next.com/
*
*/
define([], function ()
{
	function Localization(angularModule, appConfig, onComplete)
	{
		var context = this;
		context.locale = appConfig.locale;
		context.lang = appConfig.lang;

		var path = appConfig.localization.path;
		var defaultBundle = path+"/"+appConfig.localization.defaultBundle;

		// Register AngularJS as service (singleton)
		angularModule.service('Localization', function() {return context;});

		// i18n plugin init
		// Get default locales bundle
		console.log("Loading locales bundle '"+defaultBundle+".js'");
		requirejs(["i18n!"+defaultBundle], function (i18nLocales)
		{
			// Assign merged locales object to singleton
			context.locales = i18nLocales;
			onComplete();
		});

		// Example to dynamically get a locales bundle asynchronously
		function getLocales(name, onComplete, assign)
		{
			requirejs(["i18n!"+path+"/"+name], function (i18nLocales)
			{
				// Assign merged locales object to module for easy access
				if(assign) context.locales[name] = i18nLocales;
				
				onComplete(i18nLocales);
			});
		}
		
		// Public methods
		context.getLocales = getLocales;
		
		// Singleton-style component public API
		return context;
	}

	return Localization;
});