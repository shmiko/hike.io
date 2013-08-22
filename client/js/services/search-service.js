"use strict";

angular.module("hikeio").
	factory("search", ["$http", "$log", "navigation", "progressbar", "resourceCache", function($http, $log, navigation, progressbar, resourceCache) {

		var SearchService = function() {
		};

		SearchService.prototype.search = function(query) {
			progressbar.start();
			$http({method: "GET", url: "/api/v1/hikes/search", params: { q: query }, cache: resourceCache}).
				success(function(data, status, headers, config) {
					if (data.length === 1) {
						var hike = data[0].hike;
						resourceCache.put("/api/v1/hikes/" + hike.string_id, jQuery.extend(true, {}, hike));
						navigation.toEntry(hike.string_id);
					} else {
						navigation.toSearch(query);
					}
					progressbar.complete();
				}).
				error(function(data, status, headers, config) {
					$log.error(data, status, headers, config);
					progressbar.complete();
				});
		};

		return new SearchService();
	}]);
