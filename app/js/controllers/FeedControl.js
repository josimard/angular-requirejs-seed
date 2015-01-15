/**
 * Example controller that loads RSS Feeds via the Google Feed API in JSONP
 *
 * @see https://developers.google.com/feed/v1/
 */
define(["angular"], function (angular)
{
	// Static settings
	var FeedSettings = {
		feedApiUrl:"http://ajax.googleapis.com/ajax/services/feed/load?callback=JSON_CALLBACK&hl=ja&output=json-in-script&v=1.0&num=10&q=",

		// Feeds example for list sources
		feeds: {
			feed1: "http://rss.sciam.com/sciam/alternative-energy-technology",
			feed2: "http://rss.sciam.com/sciam/technology"
		}
	};

	/** @ngInject */
	function FeedControl($scope, $http, $state, Routing, Localization)
	{
		var name = $state.current.name;
		var locales = Localization.locales.list;
		var feedName = $state.params.name;;

		// Keep a reference of injected instances
		this.routing = Routing;

		// Scope model
		$scope.model = this.model = {
			// Set name from url param
			name: name,
			locales: locales,
			params: $state.params,
			// For example, you can set initial title to "loading..." until feed is ready
			title: Localization.locales.loading.title
		};

		// JSONP RSS feed example to populate the item list
		var feedUrl = FeedSettings.feedApiUrl+FeedSettings.feeds[feedName];
		this.load($http, feedUrl);
	}

	FeedControl.prototype.load = function($http, url)
	{
		// Load the feed with Angular http.jsonp
		// http://docs.angularjs.org/api/ng.$http#jsonp
		$http.jsonp(url, {}).
		success(this.onFeedLoaded.bind(this)).
		error(function(data, status, headers, config)
		{
			// called asynchronously if an error occurs or server returns response with an error status.
			console.error(status, data, url);
		});
	}

	/**
	 * Example feed parsing and attribution to model object
	 */
	FeedControl.prototype.onFeedLoaded = function(response, status, headers, config)
	{
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