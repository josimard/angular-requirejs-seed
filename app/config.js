define([], {

	// AngularJS configuration
	angular: {
		controllers: [
			// Define AMD controllers first
			"controllers/PageControl",
			"controllers/HomeControl",

			// Define global scope controllers after
			"controllers/ListControl"
		]
	},

	// RequireJS configuration
	require: {
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
	}

});