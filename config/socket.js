// export function for listening to the socket
var mongoose = require('mongoose'),
Tweet = mongoose.model('Tweet')

module.exports = function (socket) {

	var fullDataLimit = 150;
	var newDataLimit = 15;
	var fullTweetsLimit = 15;
	var updateDelay = 30000;

	socket.emit('config', {
		fullDataLimit: fullDataLimit,
		newDataLimit: newDataLimit,
		fullTweetsLimit: fullTweetsLimit,
		updateDelay: updateDelay
	});

	socket.on('getFullData', function (request) {
		var bounds = request.bounds; // region to query
		var untilDate = request.untilDate;
		var queryObject = {
			geo: {$geoWithin: {$box: [[bounds.sw.lat, bounds.sw.lng], [bounds.ne.lat, bounds.ne.lng]]}},
			created_at: {$lte: untilDate}
		};

		// perform and query and send results to client
		Tweet
			.find(queryObject)
			.sort({'created_at': -1})
			.limit(fullDataLimit)
			.exec( function(err, results) {
				var modifiedResults = [];
				for (var i=0; i<results.length; i++) {
					if (i < fullTweetsLimit) {
						modifiedResults.push(results[i]);
					} else {
						modifiedResults.push({geo: results[i].geo});
					}
				}

				var response = {points: modifiedResults, bounds: bounds};
				socket.emit('getFullDataResponse', response);
		});
	});

	socket.on('getNewData', function (request) {
		var bounds = request.bounds; // region to query
		var sinceDate = request.sinceDate;
		var queryObject = {
			geo: {$geoWithin: {$box: [[bounds.sw.lat, bounds.sw.lng], [bounds.ne.lat, bounds.ne.lng]]}},
			created_at: {$gt: sinceDate}
		};

		// perform and query and send results to client
		Tweet
			.find(queryObject)
			.limit(newDataLimit)
			.exec( function(err, results) {
				var response = {points: results, bounds: bounds, sinceDate: sinceDate, queryDate: new Date()};
				socket.emit('getNewDataResponse', response);
		});
	});
};