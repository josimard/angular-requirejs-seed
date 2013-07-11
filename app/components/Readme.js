/**
* Instantiable component example with jQuery dependency and external libraries loading at runtime
* jQuery will only load when this component is requested since it's the only one requesting it
* Using https://github.com/thomasklemm/Readme.js
*/
define(["jquery", "app/components/Localization"], function (jQuery, Localization)
{
	// Static scope
	var DefaultSettings = {

	};

	// Example to load additional libraries, a component could be created or other libraries used to handle such functionality
	var isLibrariesLoaded = false;
	function loadLibraries(onComplete)
	{
		if(isLibrariesLoaded) { onComplete(); return; }

		// Using modernizr included yepnope to inject JS libraries at runtime - http://modernizr.com/download/ + http://yepnopejs.com/
		yepnope({
			// Using raw.github url for demonstration purposes only, never do that on a production app since the code could change or github could block your server IP
			both: ["https://raw.github.com/thomasklemm/Readme.js/master/readme.js"],
			complete: function() {
				isLibrariesLoaded = true;
				onComplete();
			}
		});
	}

	// Instantiable Component Class
	function Readme()
	{
		var settings;

		function init(initSettings)
		{
			// Avoid loading it in IE
			// AJAX request could still be blocked by some browsers, but this defies the purpose of this example
			// In these cases use a reverse-proxy or use JSONP as demonstrated in ListControl.js
				
			if(jQuery("html").hasClass("ie")) return;

			settings = jQuery.extend(true, DefaultSettings, initSettings);

			// Make sure libraries are available
			loadLibraries(function()
			{
				// Can load now
				if(settings.element && settings.readme)
				{
					load(settings.element, settings.readme)
				}
			});
		}

		function load(element, readmeConfig)
		{
			// element value example: '#Readme'
			jQuery(element).readme(readmeConfig);
		}

		// Public methods
		this.init = init;
		this.load = load;

		return this;
	}

	return Readme;
});

