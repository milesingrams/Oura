// export function for listening to the socket
var mongoose = require('mongoose'),
Tweet = mongoose.model('Tweet')

module.exports = function (socket) {

	var fullDataLimit = 150;
	var newDataLimit = 15;
	var fullTweetsPerUpdate = 10;
	var tweetsNearPointLimit = 4;

	socket.on('getFullData', function (request) {
		var bounds = request.bounds; // region to query
		var untilDate = new Date(request.untilDate);
		var queryObject;

		if (bounds.sw.lng > bounds.ne.lng) {
			queryObject = {
				$or: [
					{coordinates: {$geoWithin: {$box: [[bounds.sw.lng, bounds.sw.lat], [180, bounds.ne.lat]]}}},
					{coordinates: {$geoWithin: {$box: [[-180, bounds.sw.lat], [bounds.ne.lng, bounds.ne.lat]]}}}
					],
				saved_at: {$lt: untilDate}
			};
		} else {
			queryObject = {
				coordinates: {$geoWithin: {$box: [[bounds.sw.lng, bounds.sw.lat], [bounds.ne.lng, bounds.ne.lat]]}},
				saved_at: {$lt: untilDate}
			};
		}

		// perform and query and send results to client
		Tweet
			.find(queryObject)
			.sort({'saved_at': -1})
			.limit(fullDataLimit)
			.exec( function(err, results) {
				var fullTweets = [];
				var pointsArray = [];
				for (var i=0; i<results.length; i++) {
					if (i < fullTweetsPerUpdate) {
						fullTweets.push(results[i]);
					}
					pointsArray.push({coordinates: results[i].coordinates});
				}

				var response = {pointsArray: pointsArray, fullTweets: fullTweets, bounds: bounds};
				socket.emit('getFullDataResponse', response);
		});
	});

	socket.on('getNewData', function (request) {
		var bounds = request.bounds; // region to query
		var sinceDate = new Date(request.sinceDate);
		var queryDate = new Date().setMilliseconds(0);
		var queryObject;

		if (bounds.sw.lng > bounds.ne.lng) {
			queryObject = {
				$or: [
					{coordinates: {$geoWithin: {$box: [[bounds.sw.lng, bounds.sw.lat], [180, bounds.ne.lat]]}}},
					{coordinates: {$geoWithin: {$box: [[-180, bounds.sw.lat], [bounds.ne.lng, bounds.ne.lat]]}}}
					],
				saved_at: {$gte: sinceDate}
			};
		} else {
			queryObject = {
				coordinates: {$geoWithin: {$box: [[bounds.sw.lng, bounds.sw.lat], [bounds.ne.lng, bounds.ne.lat]]}},
				saved_at: {$gte: sinceDate}
			};
		}

		// perform and query and send results to client
		Tweet
			.find(queryObject)
			.limit(newDataLimit)
			.exec( function(err, results) {
				var response = {fullTweets: results, bounds: bounds, sinceDate: sinceDate, queryDate: queryDate};
				socket.emit('getNewDataResponse', response);
		});
	});

	socket.on('getDataNearPoint', function (request) {
		var location = request.location; // location to query
		var radius = request.radius;
		var queryObject = {
			coordinates: {$geoWithin: {$centerSphere: [[location.lng, location.lat], radius]}}
		};

		// perform and query and send results to client
		Tweet
			.find(queryObject)
			.sort({'saved_at': -1})
			.limit(tweetsNearPointLimit)
			.exec( function(err, results) {
				var response = {fullTweets: results, location: location, radius: radius};
				socket.emit('getDataNearPointResponse', response);
		});
	});
};