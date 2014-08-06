// AMD Format
define([], {
	version:"0.1",

	localization: {
		path: "assets/nls",
		defaultBundle: "locales"
	}, 

	// RequireJS configuration
	requirejs: {
		name: "js/app",
		baseUrl:"./",
		paths:{
			"i18n":"//cdnjs.cloudflare.com/ajax/libs/require-i18n/2.0.4/i18n",
			'angular':'empty:'
		},
		shim: {
			"jquery": { exports: "jquery" }
	    },
		priority:[]
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
			"js/controllers/FeedControl"
		], 

		// Routing configuration
		routing: {
			prefix:"/",
			home:"/home",
			not_found:"/404",

			/* ngRoute, handled in core/Routing.js */
			type:"ngRoute",
			routes: [
				{url: '/home', templateUrl: 'templates/home.html', controller: "HomeControl"},
				{url: '/feed/:name', templateUrl: 'templates/feed.html', controller: "FeedControl"},
				{url: '/:name', templateUrl: 'templates/page.html', controller: "PageControl"}
			]

			/* ui-router states
			states: [
				{name: "intro", url: '/', templateUrl: 'templates/home.html', controller: "IntroControl"}
			]*/
		}
	}
});