// export function for listening to the socket
var mongoose = require('mongoose'),
Tweet = mongoose.model('Tweet')

module.exports = function (socket) {

	var fullDataLimit = 150;
	var newDataLimit = 15;
	var fullTweetsLimit = 15;
	var updateDelay = 10000;

	socket.emit('config', {
		fullDataLimit: fullDataLimit,
		newDataLimit: newDataLimit,
		fullTweetsLimit: fullTweetsLimit,
		updateDelay: updateDelay
	});

	socket.on('getFullData', function (request) {
		var bounds = request.bounds; // region to query
		var untilDate = new Date(request.untilDate);
		var queryObject = {
			coordinates: {$geoWithin: {$box: [[bounds.sw.lng, bounds.sw.lat], [bounds.ne.lng, bounds.ne.lat]]}},
			saved_at: {$lt: untilDate}
		};

		// perform and query and send results to client
		Tweet
			.find(queryObject)
			.sort({'created_at': -1})
			.limit(fullDataLimit)
			.exec( function(err, results) {
				var fullTweets = [];
				var pointsArray = [];
				for (var i=0; i<results.length; i++) {
					if (i < fullTweetsLimit) {
						fullTweets.push(results[i]);
					} else {
						pointsArray.push({coordinates: results[i].coordinates});
					}
				}

				var response = {pointsArray: pointsArray, fullTweets: fullTweets, bounds: bounds};
				socket.emit('getFullDataResponse', response);
		});
	});

	socket.on('getNewData', function (request) {
		var bounds = request.bounds; // region to query
		var sinceDate = new Date(request.sinceDate);
		var queryDate = new Date().setMilliseconds(0);
		var queryObject = {
			coordinates: {$geoWithin: {$box: [[bounds.sw.lng, bounds.sw.lat], [bounds.ne.lng, bounds.ne.lat]]}},
			saved_at: {$gte: sinceDate}
		};

		// perform and query and send results to client
		Tweet
			.find(queryObject)
			.limit(newDataLimit)
			.exec( function(err, results) {
				var response = {fullTweets: results, bounds: bounds, sinceDate: sinceDate, queryDate: queryDate};
				socket.emit('getNewDataResponse', response);
		});
	});
};