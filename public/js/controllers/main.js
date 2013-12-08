window.angular.module('oura.controllers.main', [])
  .controller('MainController', ['$scope', '$timeout', '$compile', 'socket', 'mapOverlay',
	function($scope, $timeout, $compile, socket, mapOverlay) {

		// instantiate main variables
		var fullDataLimit = 150;
		var updateDelay = 10000;
		$scope.fullTweetLimit = 40;

		var updatePromise;
		var nextUpdatePromise;
		var addPointPromiseArray = [];
		google.maps.visualRefresh = true; // makes google maps look better
		$scope.mapPoints = new google.maps.MVCArray(); // array containing datapoints (updates view automatically when adjusted)
		$scope.fullTweets = [];
		$scope.localTweets = [];

		// when a full data update arrives
		socket.on('getFullDataResponse', function (response) {
			var points = response.pointsArray;
			var fullTweets = response.fullTweets;
			var bounds = objectToBounds(response.bounds);

			// clear array
			$scope.mapPoints.clear();
			$scope.fullTweets = [];

			// add points to array
			angular.forEach(points, function (point) {
				var location = new google.maps.LatLng(point.coordinates[1], point.coordinates[0]);
				var mapPointObj = {location: location, weight: 0.3};
				$scope.mapPoints.push(mapPointObj);
			});

			angular.forEach(fullTweets, function (tweet) {
				var location = new google.maps.LatLng(tweet.coordinates[1], tweet.coordinates[0]);
				var fullTweetObj = {location: location, data: tweet};
				$scope.fullTweets.push(fullTweetObj);
			});
		});

		// when new data arrives
		socket.on('getNewDataResponse', function (response) {
			var fullTweets = response.fullTweets;
			var bounds = objectToBounds(response.bounds);
			var sinceDate = new Date(response.sinceDate);
			var lastUpdateDate = new Date(response.queryDate);

			// begin timers to add points exactly updateDelay milliseconds after they are created
			angular.forEach(fullTweets, function (tweet) {
				var location = new google.maps.LatLng(tweet.coordinates[1], tweet.coordinates[0]);
				var mapPointObj = {location: location, weight: 0.3};
				var fullTweetObj = {location: location, data: tweet};
				var timeDiff = new Date(tweet.saved_at) - sinceDate;

				var addPointPromise = $timeout(function () {
					addMapPing(location);

					$scope.mapPoints.insertAt(0, mapPointObj);
					if ($scope.mapPoints.getLength() > fullDataLimit) {
						$scope.mapPoints.pop();
					}

					$scope.fullTweets.unshift(fullTweetObj);
					if ($scope.fullTweets.length > $scope.fullTweetLimit) {
						$scope.fullTweets.pop();
					}
				}, timeDiff);

				addPointPromiseArray.push(addPointPromise);
			});
			
			// begin timer until next update
			nextUpdatePromise = $timeout(function () {
				getNewData(bounds, lastUpdateDate);
			}, updateDelay);
		});

		// when new data arrives
		socket.on('getDataNearPointResponse', function (response) {
			var fullTweets = response.fullTweets;
			var location = objectToLocation(response.location);
			var radius = response.radius;

			$scope.localTweets = [];

			if (fullTweets.length > 0) {
				angular.forEach(fullTweets, function (tweet) {
					var location = new google.maps.LatLng(tweet.coordinates[1], tweet.coordinates[0]);
					var fullTweetObj = {location: location, data: tweet};
					$scope.localTweets.push(fullTweetObj);
				});
				addMapTweetBox(location);
			}
		});
		
		// full data refresh
		var getFullData = function (bounds, untilDate) {
			// cancel current update timers
			$timeout.cancel(nextUpdatePromise);
			angular.forEach(addPointPromiseArray, function (addPointPromise) {
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

		// get data within a radius around a point
		var getDataNearPoint = function (location, radius) {
			socket.emit('getDataNearPoint', {
				location: locationToObject(location),
				radius: radius
			});
		}

		// called when map finishes being dragged or zoomed
		$scope.mapIdle = function (event) {
			$timeout.cancel(updatePromise);
			updatePromise = $timeout(function () {
				var date = new Date(new Date() - updateDelay).setMilliseconds(0);
				var bounds = $scope.map.getBounds();
				getFullData(bounds, date);
				getNewData(bounds, date);
			}, 100);
		}

		$scope.mapZoomed = function (event) {
			if ($scope.mapbox) {
                mapOverlay.destroy($scope.mapbox);
            }
		}

		// called when map is clicked but not dragged
		$scope.mapClicked = function (event) {
			if ($scope.mapbox) {
                mapOverlay.destroy($scope.mapbox);
            }
			var mouseLocation = event.latLng;
			var radius = 0.25/Math.pow(2, $scope.map.getZoom());
			getDataNearPoint(mouseLocation, radius);
		}

		// conversion between google.maps.LatLng and json object
		var locationToObject = function (location) {
			return {lat: location.lat(), lng: location.lng()};
		}

		// conversion between json object and google.maps.LatLng
		var objectToLocation = function (object) {
			return new google.maps.LatLng(object.lat, object.lng);
		}

		// conversion between google.maps.LatLngBounds and json object
		var boundsToObject = function (bounds) {
			return {sw: locationToObject(bounds.getSouthWest()), ne: locationToObject(bounds.getNorthEast())};
		}

		// conversion between json object and google.maps.LatLngBounds
		var objectToBounds = function (object) {
			return new google.maps.LatLngBounds(objectToLocation(object.sw), objectToLocation(object.ne));
		}

		// Adds a ping to the map at a location
        var addMapPing = function (location) {
        	var template = "<div class='ping'></div>"
            var ping = mapOverlay.create(location, $scope.map, $scope, template);

            $timeout(function () {
                mapOverlay.destroy(ping);
            }, 1500);
        };

        // Adds a mapbox to the map with tweets at a location
        var addMapTweetBox = function (location) {
            var template = "<mapbox class='mapbox'><mapbox-tweet ng-repeat='tweet in localTweets | limitTo: 4' tweet='tweet' map='map'></mapbox-tweet></mapbox>";
            $scope.mapbox = mapOverlay.create(location, $scope.map, $scope, template);
        };
	}]);