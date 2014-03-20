define([], {

	localization: {
		path: "assets/nls",
		defaultBundle: "locales"
	}, 

	// AngularJS configuration
	angular: {
		name: "app",
		
		// ngController list (For inclusion in requirejs optimizer and run-time loading)
		controllers: [
			// Define AMD controllers first
			"js/controllers/PageControl",
			"js/controllers/HomeControl",

			// Global scope controllers can be used, but must be listed after AMD ones
			"js/controllers/ListControl"
		], 
		// ngRoutes
		routes: [
			{url: '/:lang/home', templateUrl: 'assets/templates/home.html', controller: "HomeControl"},
			{url: '/:lang/list/:name', templateUrl: 'assets/templates/list.html', controller: "ListControl"},
			{url: '/:lang/:name', templateUrl: 'assets/templates/page.html', controller: "PageControl"}
		]
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