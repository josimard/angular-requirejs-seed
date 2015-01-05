/**
 * Example controller that loads JSONP feeds and show them in a template
 */
define(["angular"], function (angular)
{
	// Static settings
	var Settings = {
		// Base service url
		serviceUrl:"http://ajax.googleapis.com/ajax/services/feed/load?callback=JSON_CALLBACK&hl=ja&output=json-in-script&v=1.0&num=10&q=",

		// Feeds example for list sources
		feeds: {
			feed1: "http://rss.sciam.com/sciam/alternative-energy-technology",
			feed2: "http://rss.sciam.com/sciam/technology"
		}
	};

	/** @ngInject */
	function FeedControl($scope, $http, $state, Routing, Localization)
	{
		this.routing = Routing;

		// instance settings
		this.settings = Settings;

		// Create/get model
		$scope.model = this.model = {
			// Set name from url param
			name: $state.current.name,
			locales: Localization.locales.list,
			params: $state.params,
			// For example, you can set initial title to "loading..." until feed is ready
			title: Localization.locales.loading.title
		};

		// RSS feed example to populate the item list
		var feedName = $state.params.name;
		var feedUrl = this.settings.feeds[feedName];
		// Feed not found, redirect to 404
		if(!feedUrl)
		{
			// TODO: 404
			console.log("Feed not found");
			//Routing.show404();
			return;
		}

		this.load($http, this.settings.serviceUrl+feedUrl);
	}

	FeedControl.prototype.load = function($http, url)
	{
		// Load the feed with Angular http.jsonp
		// http://docs.angularjs.org/api/ng.$http#jsonp
		$http.jsonp(url, {}).
		success(this.onFeedLoaded.bind(this)).
		error(function(data, status, headers, config)
		{
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	}

	/**
	 * Example feed parsing and attribution to model object
	 */
	FeedControl.prototype.onFeedLoaded = function(response, status, headers, config)
	{
		console.log(response);

		var data = response.responseData;

		if(data.feed)
		{
			this.model.title = data.feed.title;
			this.model.items = data.feed.entries;

			// Set page title
			this.routing.setPageTitle(this.model.title);

			// Act on items data here (hacking content example)
			// A more powerful way of dealing with this here: 
			// http://reactive-extensions.github.io/RxJS/
			for(var i=0; i<this.model.items.length; i++)
			{
				var item = this.model.items[i];
				var contentEndIndex = item.content.indexOf("[More]");
				if(contentEndIndex==-1) contentEndIndex = item.content.indexOf("-- Read more");
				if(contentEndIndex>-1)
				{
					item.content = item.content.substring(0, contentEndIndex);
				}
			}
		}
	}
	
	return FeedControl;
});