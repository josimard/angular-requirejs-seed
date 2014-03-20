/**
* Singleton-style localization component example
* Using the require.js i18n plugin for the sake of simplicity
* init() should be called before any other compenent requires the i18n plugin
*
* Centralizing your localization in a component reduces your dependency over a single framework and switching system application-wide should prove be easier
* Another interesting framework: i18next @ http://i18next.com/
*
*/
define([], function ()
{
	var context = this;
	var localesPath = "assets/nls";
	var defaultLocalesBundle = localesPath+"/locales";

	function init(onComplete)
	{
		// Localization init (from html lang) -- http://www.w3.org/TR/html401/struct/dirlang.html#h-8.1.1
		var locale = document.documentElement.lang;

		// Default locale
		if(!locale || locale=="en") locale = "en-US";

		// Two letter lang
		context.lang = locale.substring(0,2);

		// Four or two letter localization
		context.locale = locale;

		// i18n plugin init
		initI18N(onComplete);
	}

	function initI18N(onComplete)
	{
		// Configure require.js locale
		requirejs.config({
			// i18n Locale, see documentation for supported locales or how to implement a new one
			locale: context.locale,
		});

		// Get default locales bundle
		requirejs(["i18n!"+defaultLocalesBundle], function (i18nLocales)
		{
			// Assign merged locales object to singleton
			context.locales = i18nLocales;
			
			onComplete();
		});
	}

	// Example to dynamically get a locales bundle asynchronously
	function getLocales(name, onComplete)
	{
		requirejs(["i18n!"+localesPath+"/"+name], function (i18nLocales)
		{
			// We could assign merged locales object to singleton for easy access
			//context.locales[name] = i18nLocales;
			
			onComplete(i18nLocales);
		});
	}

	// Set public API methods
	this.init = init;
	
	// Singleton-style component public API
	return context;
});