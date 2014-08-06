/**
* Localization service example
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
		this.locale = appConfig.locale;
		this.lang = appConfig.lang;

		var path = appConfig.localization.path;
		var defaultBundle = path+"/"+appConfig.localization.defaultBundle;

		// i18n plugin init
		// Get default locales bundle
		console.log("Loading locales bundle '"+defaultBundle+".js'");

		var context = this;
		requirejs(["i18n!"+defaultBundle], function (i18nLocales)
		{
			// Assign merged locales object to singleton
			context.locales = i18nLocales;
			onComplete();
		});
	}

	// Example to dynamically get a locales bundle asynchronously
	Localization.prototype.getLocales = function(name, onComplete, assign)
	{
		var context = this;
		requirejs(["i18n!"+path+"/"+name], function (i18nLocales)
		{
			// Assign merged locales object to module for easy access
			if(assign) context.locales[name] = i18nLocales;
			
			onComplete(i18nLocales);
		});
	}

	return Localization;
});