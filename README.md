AngularJS + RequireJS project seed
==================================

AngularJS + RequireJS HTML5 project example, could easily be used as a boilerplate.

## Why?

- Because AMD modules are great for code re-usability and application scalabilty
- Because we like browser errors like "syntaxError: missing X on ListControl.js (line 56, col 2)"
- Because AngularJS is great, but we want to use jQuery plugins and awesome HTML5 libraries.
This application demonstrates the freedom you can get while staying organized.
- Because we don't want to add a script tag for each controller nor manually manage js files, see [config.js](https://github.com/pheno7/angular-requirejs-seed/blob/master/app/config.js).
- Because the [RequireJS Optimizer](http://requirejs.org/docs/optimization.html) is our friend when it's time to make that build.

##Installation

A first-time installation is necessary to get [Grunt](http://gruntjs.com/) and it's related plugins. Also make sure you have [Node.js](http://nodejs.org/) installed and run this command from this project root folder:

    $ npm install

To install the latest Grunt depencencies
  
    $ npm install grunt-cli -g
    $ npm update --save

##Building the project

To generate an optimized build, use Grunt as usual

	$ grunt

A "dist" folder will be generated with a minified version of your app/js files and only the necessary dependencies to serve over HTTP. Feel free to modify the [Gruntfile.js](https://github.com/pheno7/angular-requirejs-seed/blob/master/Gruntfile.js) to suit your needs.

Keep in mind that no build tool or build watcher is necessary to develop and debug your application. Simply open [app/index.html](https://github.com/pheno7/angular-requirejs-seed/blob/master/app/index.html) and experience coding comfort. Thanks to [RequireJS](http://requirejs.org/).


## Wiring AngularJS controllers 

To wire controllers in this rig it's a piece of cake:

- Register it's path in [config.js](https://github.com/pheno7/angular-requirejs-seed/blob/master/app/config.js)

		angular: {
			controllers: [
				// Define AMD controllers first
				"js/controllers/MyControl",

				// Global scope controllers can be used, but must be listed after AMD ones
				"js/controllers/MyGlobalScopeControl"
			]
		}

- Use a string in your [routes](https://github.com/pheno7/angular-requirejs-seed/blob/master/app/js/services/Routing.js) instead of linking with the functions directly:

		$routeProvider.when('path', {templateUrl: 'templates/yeah.html', controller: "MyControl"});


- Add the @ngInject build directive comment before controllers constructors using [AngularJS injectables](http://docs.angularjs.org/guide/di).

		/** @ngInject */
		function MyControl($scope, $http)
		{
			
		}

## Understanding the @ngInject build directive


There is normally two ways to setup AngularJS controllers:

- _Global scope controllers_ ( like [this one](https://github.com/pheno7/angular-requirejs-seed/blob/master/app/js/controllers/ListControl.js) )

		function MyGlobalScopeControl($scope, $http)
		{
				
		}
		
- _Registered controllers_ 
	
		angular.module('app').controller('MyController', function($scope, $http){
		
		});

Usually, when minifying code, your minifier would change the attributes names and AngularJS would not understand what to inject anymore, getting you into [trouble like this](http://stackoverflow.com/questions/16242406/angular-js-error-with-providerinjector).

You would then have to end up writing some weird and hard-to-maintain declarations:

		angular.module('app').controller("MyController", ["$scope", "$http", "Service1", "Service2"], function ($scope, $http, Service1, Service2) {
			// Yeah, right… what this controller name yet?
		}

People at Google are clever and came up with [this solution](http://code.google.com/p/closure-compiler/source/browse/src/com/google/javascript/jscomp/AngularPass.java) for their Closure compiler. But what if we prefer using UglifyJS? We can, since we are in control of our build with Grunt! That's why I wired-in a simple angularPass() method in the [build utilities](https://github.com/pheno7/angular-requirejs-seed/blob/master/scripts/build-utils.js), this pass also permit to avoid listing injectable strings with the use of [ng-annotate](https://github.com/olov/ng-annotate).

By adding the @ngInject before your controllers constructors, injection will be automatically added:

		/** @ngInject */		
		function MyController('$scope', '$http'])
		{		
			
		}

Once minified with this projet's [grunt file](https://github.com/pheno7/angular-requirejs-seed/blob/master/Gruntfile.js), the previous code will look like this:
	
		MyController.$inject = ['$scope', '$http'];		
		function MyController(a, b)
		{		
			// a and b will not throw an error due to $inject
		}
    
## What else is in there?

Good practices for overall productivity, code maintanability, ease-of-debugging and most of all keeping it simple as possible but ready for scaling.

- _Comments_: preaching commenting your code by example.
- Localization using the [RequireJS i18n plugin](https://github.com/requirejs/i18n) for it's simplicity, see the [Localization](https://github.com/pheno7/angular-requirejs-seed/blob/master/app/models/Localization.js) model.
- [Dynamic routing](https://github.com/pheno7/angular-requirejs-seed/blob/master/app/routing.js) to handle more cases, flexibility, route localization and page title changes.
- A simple [boot](https://github.com/pheno7/angular-requirejs-seed/blob/master/app/boot.js) procedure triggered by RequireJS. 
- [Normalize.css](http://necolas.github.io/normalize.css/), as included the [HTML5 Boilerplate](http://html5boilerplate.com/)
- Unit testing should be coming coming soon
