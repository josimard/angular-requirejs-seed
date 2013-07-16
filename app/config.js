define([], {

	// AngularJS configuration
	angular: {
		controllers: [
			// Define AMD controllers first
			"js/controllers/PageControl",
			"js/controllers/HomeControl",

			// Global scope controllers can be used, but must be listed after AMD ones
			"js/controllers/ListControl"
		]
	},

	// RequireJS configuration
	require: {
		name: "js/app",
		baseUrl:"./",
		paths:{
			"angular":"http://code.angularjs.org/1.0.7/angular.min",
			"angular-ressource": "http://code.angularjs.org/1.0.7/angular-resource.min",
			"jquery":"http://code.jquery.com/jquery-1.10.2.min", 
			"i18n":"lib/require.i18n"
		},
		shim: {
			"angular": { exports: "angular" },
			"angular-resource": { deps: ["angular"] }
	    },
		priority:["angular","angular-resource","jquery"]
	},

	// CSS Files
	css: {
		// Main CSS file
		file: "assets/main.css",
		// Additional css files
		files: ["assets/normalize.css"]
	},
	
	// Optional LESS configuration
	// Run install-less.sh once to automagically setup LESS
	less: {
		enabled:false, // /scripts/install-less.js will set this to true
		file: "assets/main.less",
		watch: {
			interval: 5000
		}
	}

});