window.angular.module('ngOura.controllers.main', [])
  .controller('MainController', ['$scope', '$timeout', 'socket',
	function($scope, $timeout, socket) {

		// instantiate main variables
		var fullDataLimit, newDataLimit, fullTweetsLimit, updateDelay;

		var nextUpdatePromise;
		var addPointPromiseArray = [];
		google.maps.visualRefresh = true; // makes google maps look better
		$scope.mapPoints = new google.maps.MVCArray(); // array containing datapoints (updates view automatically when adjusted)
		$scope.shelfPoints = [];


		// sync configuration with server
		socket.on('config', function (config) {
			fullDataLimit = config.fullDataLimit;
			newDataLimit = config.newDataLimit;
			fullTweetsLimit = config.fullTweetsLimit;
			updateDelay = config.updateDelay;
		});

		// when a full data update arrives
		socket.on('getFullDataResponse', function (response) {
			var points = response.pointsArray;
			var fullTweets = response.fullTweets;
			var bounds = objectToBounds(response.bounds);

			// clear array
			$scope.mapPoints.clear();
			$scope.shelfPoints = fullTweets;

			// add points to array
			points.forEach(function (point) {
				var location = new google.maps.LatLng(point.coordinates[1], point.coordinates[0]);
				var weightedPoint = {location: location, weight: 0.3, point: point};
				$scope.mapPoints.push(weightedPoint);
			});
		});

		// when new data arrives
		socket.on('getNewDataResponse', function (response) {
			var points = response.fullTweets;
			var bounds = objectToBounds(response.bounds);
			var sinceDate = new Date(response.sinceDate);
			var lastUpdateDate = new Date(response.queryDate);

			// begin timers to add points exactly updateDelay milliseconds after they are created
			points.forEach(function (point) {
				var location = new google.maps.LatLng(point.coordinates[1], point.coordinates[0]);
				var weightedPoint = {location: location, weight: 0.3, point: point};
				var timeDiff = new Date(point.saved_at) - sinceDate;
				var addPointPromise = $timeout(function () {
					$scope.addPing(location);
					$scope.mapPoints.insertAt(0, weightedPoint);
					if (point.text) {
					}
					$scope.shelfPoints.unshift(point);
					if ($scope.mapPoints.getLength() > fullDataLimit) {
						$scope.mapPoints.pop();
					}
					if ($scope.shelfPoints.length > fullTweetsLimit) {
						$scope.shelfPoints.pop();
					}
				}, timeDiff);
				addPointPromiseArray.push(addPointPromise);
			});
			
			// begin timer until next update
			nextUpdatePromise = $timeout(function () {
				getNewData(bounds, lastUpdateDate);
			}, updateDelay);
		});
		
		// full data refresh
		var getFullData = function (bounds, untilDate) {
			// cancel current update timers
			$timeout.cancel(nextUpdatePromise);
			addPointPromiseArray.forEach(function (addPointPromise) {
				$timeout.cancel(addPointPromise);
			});

			// request a full data refresh
			socket.emit('getFullData', {
				bounds: boundsToObject(bounds),
				untilDate: untilDate
			});
		}

		// get new data
		var getNewData = function (bounds, sinceDate) {
			socket.emit('getNewData', {
				bounds: boundsToObject(bounds),
				sinceDate: sinceDate
			});
		}

		// called when map finishes being dragged or zoomed
		$scope.mapIdle = function () {
			var date = new Date(new Date() - updateDelay).setMilliseconds(0);
			var bounds = $scope.map.getBounds();
			getFullData(bounds, date);
			getNewData(bounds, date);
		}

		// conversion between google.maps.LatLngBounds and json object
		var boundsToObject = function (bounds) {
			var swlat = bounds.getSouthWest().lat();
			var swlng = bounds.getSouthWest().lng();
			var nelat = bounds.getNorthEast().lat();
			var nelng = bounds.getNorthEast().lng();

			return {sw: {lat: swlat, lng: swlng}, ne: {lat: nelat, lng: nelng}};
		}

		// conversion between json object and google.maps.LatLngBounds
		var objectToBounds = function (object) {
			var sw = new google.maps.LatLng(object.sw.lat, object.sw.lng);
			var ne = new google.maps.LatLng(object.ne.lat, object.ne.lng);

			return new google.maps.LatLngBounds(sw, ne);
		}
	}]);