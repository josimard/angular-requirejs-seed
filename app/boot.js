"use strict";

// Localization init (from html lang) -- http://www.w3.org/TR/html401/struct/dirlang.html#h-8.1.1
var locale = document.documentElement.lang;

// Default locale
if(!locale || locale=="en") locale = "en-US";

// Require JS configuration
require.config({
	baseUrl:"./",

	// i18n Locale, see documentation for supported locales or how to implement a new one
	locale: locale,

	paths:{
		"jquery":"http://code.jquery.com/jquery-1.10.2.min", 
		"i18n":"app/lib/require.i18n",
		
		// Link against a combined version of all AMD modules like this: (see http://requirejs.org/docs/optimization.html)
		// "app/app": "app/app.min" // This would try to load app/app.min.js

		// Or use the development version
		"app/app": "app/app"
	},
	priority:["jquery"]
});

// Define angular.js to acess from Require.js modules
define( "angular", [], function () { return window.angular; } );

// Boot procedure
require(["app/app"], function (app)
{
	console.log("Booting application...");

	// Start application 
	app.init();
});

// Make sure IE has a console
if (!window.console) console = {log: function() {}};