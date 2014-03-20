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
    $ npm install grunt --save-dev
    $ npm install grunt-contrib-requirejs --save-dev
    $ npm install grunt-contrib-uglify --save-dev
    $ npm install grunt-contrib-copy --save-dev


##Building the project

To generate an optimized build, use Grunt as usual

	$ npm install grunt

Keep in mind that no build tool or build watcher is necessary to develop and debug your application. Simply open [app/index.html](https://github.com/pheno7/angular-requirejs-seed/blob/master/app/index.html) in a browser and experience coding comfort. Thanks to [RequireJS](http://requirejs.org/).

By default a "./dist" folder will be generated with a minified and obfuscated version of your code and only the necessary files to serve over HTTP. Feel free to modify the [Gruntfile.js](https://github.com/pheno7/angular-requirejs-seed/blob/master/Gruntfile.js) to suit your needs.

    
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


- Add the @ngInject build directive comment before a function declaration with AngularJS injectables.

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

When making a build, you minified code will change the attributes names and AngularJS will not understand what to inject anymore, getting you into [trouble like this](http://stackoverflow.com/questions/16242406/angular-js-error-with-providerinjector).

The problem is that with AMD modules you would normally have to use the second option, and you would end up with having to write ridiculous controller declarations:

		angular.module('app').controller("MyController", ["$scope", "$http", "Service1", "Service2"], function ($scope, $http, Service1, Service2) {
			// Yeah, right… what this controller name yet?
		}

People at Google are clever and came up with [this solution](http://code.google.com/p/closure-compiler/source/browse/src/com/google/javascript/jscomp/AngularPass.java) for their Closure compiler. But what if we prefer using UglifyJS? We can, since we are in control of our build with Grunt! That's why I wired-in a simple angularPass() method in the [build utilities](https://github.com/pheno7/angular-requirejs-seed/blob/master/scripts/build-utils.js).

Using the @ngInject comment, once minified, your controller methods will have injection rules on top of them: (for both global scope methods or AMD wrapped)
	
		MyMinifiedControl.$inject = ['$scope', '$http'];		
		function MyMinifiedControl(a, b)
		{		
			// a and b will not throw an error due to $inject
			// a is $scope
			// b is $http
		}
    
## What else is in there?

Good practices for overall productivity, code maintanability, ease-of-debugging and most of all keeping it simple as possible but ready for scaling.

- _Comments_: preaching commenting your code by example.
- Localization using the [RequireJS i18n plugin](https://github.com/requirejs/i18n) for it's simplicity, see the [Localization](https://github.com/pheno7/angular-requirejs-seed/blob/master/app/models/Localization.js) model.
- [Dynamic routing](https://github.com/pheno7/angular-requirejs-seed/blob/master/app/routing.js) to handle more cases, flexibility, route localization and page title changes.
- A simple [boot](https://github.com/pheno7/angular-requirejs-seed/blob/master/app/boot.js) procedure triggered by RequireJS. 
- [Normalize.css](http://necolas.github.io/normalize.css/), as included the [HTML5 Boilerplate](http://html5boilerplate.com/)
- Unit testing should be coming coming soon
