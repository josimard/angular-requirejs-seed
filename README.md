AngularJS + RequireJS project seed
==================================

AngularJS + RequireJS HTML5 project example, could easily be used as a boilerplate.

## Why?

- Because AMD modules are great for code re-usability and scalabilty
- Because we like browser errors like "syntaxError: missing X on ListControl.js (line 56, col 2)"
- Because AngularJS is great, but we want to use jQuery plugins and awesome HTML5 libraries.
This application demonstrates the freedom you can get while staying organized.
- Because we don't want to add a <script> tag for each controller, see [config.js](https://github.com/pheno7/angular-requirejs-seed/blob/master/app/config.js).

##Installation

A first-time installation is necessary to get [Grunt](http://gruntjs.com/) and it's related plugins. Also make sure you have [Node.js](http://nodejs.org/) installed and run this command from this project root folder:

    $ npm install

To install the latest Grunt depencencies with [install-latest.sh](https://github.com/pheno7/angular-requirejs-seed/blob/master/install-latest.sh)
  
    $ npm install grunt-cli -g
    $ npm install grunt --save-dev
    $ npm install grunt-contrib-requirejs --save-dev
    $ npm install grunt-contrib-uglify --save-dev
    $ npm install grunt-contrib-copy --save-dev

- Tip: On windows, you can run easily run shell scripts (.sh files) by double-clicking when you install [Git Bash](http://git-scm.com/downloads) shipped with Git.

##Building the project
To generate an optimized build, use Grunt as usual or run [build.sh](https://github.com/pheno7/angular-requirejs-seed/blob/master/build.sh).

Keep in mind that no build tool or build watcher is necessary to develop and debug your application. Simply open [app/index.html](https://github.com/pheno7/angular-requirejs-seed/blob/master/app/index.html) in a browser and experience coding comfort. Thanks to RequireJS.

By default a "./dist" folder will be generated with a minified and obfuscated version of your code and only the necessary files to serve over HTTP. Feel free to modify the [Gruntfile.sh](https://github.com/pheno7/angular-requirejs-seed/blob/master/Gruntfile.js) to suit your needs.

## LESS, SASS or plain CSS?

It's up to you really, but since I like [LESS](http://lesscss.org/), I included the necessary to get you up and running easily:

You can setup LESS for this project running [install-less.sh](https://github.com/pheno7/angular-requirejs-seed/blob/master/install-less.sh).

    $ npm install grunt-contrib-less --save-dev
    $ node scripts/install-less.js

There is also a lightweight LESS watching script to transform your LESS to CSS on the fly. You can start it running [watch-less.sh](https://github.com/pheno7/angular-requirejs-seed/blob/master/watch-less.sh).

    $ node scripts/watch-less.js

## What else?

Good practices for overall productivity, code maintanability, ease-of-debugging and most of all keeping it simple as possible but ready for scaling.

- Localization using the [RequireJS i18n plugin](https://github.com/requirejs/i18n) for it's simplicity, see the [Localization](https://github.com/pheno7/angular-requirejs-seed/blob/master/app/models/Localization.js) model.
- [Dynamic routing](https://github.com/pheno7/angular-requirejs-seed/blob/master/app/routing.js) to handle more cases, flexibility, route localization and page title changes.
- A simple [boot](https://github.com/pheno7/angular-requirejs-seed/blob/master/app/boot.js) procedure triggered by RequireJS. 
- [Normalize.css](http://necolas.github.io/normalize.css/), as included the [HTML5 Boilerplate](http://html5boilerplate.com/)
- Unit testing should be coming coming soon
