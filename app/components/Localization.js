/**
* Singleton-style localization component example
* Using the require.js i18n plugin for the sake of simplicity
*
* Centralizing your localization in a component reduces your dependency over a single framework and switching system application-wide should prove be easier
* Another interesting framework: i18next @ http://i18next.com/
*
*/
define(["i18n!app/nls/locales"], function (locales)
{
	function init(onComplete)
	{
		// Instantly ready
		onComplete();
	}

	function get(path)
	{
		return locales[path];
	}
	
	// Singleton-style component public API
	return {
		init: init,
		get: get,
		locales: locales
	};
});