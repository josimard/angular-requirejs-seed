// AMD Format
define([], {
	version:"0.1",

	localization: {
		path: "assets/nls",
		defaultBundle: "locales"
	}, 

	// AngularJS configuration
	angular: {
		name: "app",
		element: "#app",
		
		// ngController list (For inclusion in requirejs optimizer and run-time loading)
		controllers: [
			// Define AMD controllers first
			"js/controllers/PageControl",
			"js/controllers/HomeControl",

			// Global scope controllers can be used, but must be listed after AMD ones
			"js/controllers/ListControl"
		], 

		// Routing configuration
		routing: {
			prefix:"/",
			home:"/home",
			not_found:"/404",

			/* ngRoute, handled in core/Routing.js */
			type:"ngRoute",
			routes: [
				{url: '/home', templateUrl: 'assets/templates/home.html', controller: "HomeControl"},
				{url: '/list/:name', templateUrl: 'assets/templates/list.html', controller: "ListControl"},
				{url: '/:name', templateUrl: 'assets/templates/page.html', controller: "PageControl"}
			]

			/* ui-router states
			states: [
				{name: "intro", url: '/', templateUrl: 'templates/home.html', controller: "IntroControl"}
			]*/
		}
	},

	// RequireJS configuration
	requirejs: {
		name: "js/app",
		baseUrl:"./",
		paths:{
			"i18n":"lib/require.i18n",
			'angular':'empty:'
		},
		shim: {
			"jquery": { exports: "jquery" }
	    },
		priority:[]
	}
});