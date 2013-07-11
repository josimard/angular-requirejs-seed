/**
 * Default locale - en-US 
 * 
 * i18n Localization bundle
 * http://requirejs.org/docs/api.html#i18n
 * 
 * Data in JSON format
 *
 * Templating expressions are using mustache/handlebars semantic templates: 
 * ie "Pages {{index1}} - {{index2}}"
 * http://handlebarsjs.com/expressions.html
 * 
 */
define( { 
// Available language tags
"fr-CA": true,

// Default locale needs "root" object 
"root": 

// JSON Data Starts Here >>>>
{
	"home": {
		"title": "Home",
		"title_ie": "Basic Angular JS + Require JS Boilerplate",
		"content_ie": '<p>Using Internet Explorer on page will not display this page content since this defies the purpose of this example. I wish that your were using IE only for testing purposes...</p>'
	},

	"test": {
		"title": "Test page",
		"content": '<p>Hello!</p>'
	},

	"list": {
		"noresult": 'No result found'
	},

	"loading":{
		"title": "Loading..."
	},

	"404": {
		"title": "404 Not found",
		"content": '<p>Sorry, we could not find this page</p><p><a href="#/home">Return home</a></p>'
	}
}
// JSON Ends Here <<<
});