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

		// Routing configuration, see routing.js for implementation
		routing: {
			templatesBase:"assets/partials", // Templates base url to replace {{baseUrl}} token
			assetsUrl:"",
			prefix:"/",
			home:"/home",
			not_found:"/404",

			/* ui-router states */
			states: [
				{ name: "home", url: '/home', templateUrl: '{{baseUrl}}/home.html', controller: "HomeControl"},
				{ name: "test", url: '/test', templateUrl: '{{baseUrl}}/page.html', controller: "PageControl"},
				{ name: "feed", url: '/feed/:name', templateUrl: '{{baseUrl}}/feed.html', controller: "FeedControl"},
			]
		}
	}
});