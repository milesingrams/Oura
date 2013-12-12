window.angular.module('oura.directives.ouraMap', [])
	.directive('ouraMap', ['$timeout',
		function($timeout) {
			return function (scope, element) {

						// properties for customizing map style
						var mapStyle = [
							{
								"elementType": "labels.icon",
								"stylers": [
									{ "visibility": "off" }
								]
							},{
								"featureType": "landscape",
								"stylers": [
									{ "lightness": 35 }
								]
							},{
								"featureType": "poi",
								"elementType": "geometry",
								"stylers": [
									{ "lightness": 35 }
								]
							},{
								"featureType": "road.highway",
								"elementType": "geometry",
								"stylers": [
									{ "visibility": "simplified" },
									{ "lightness": 25 }
								]
							},{
								"featureType": "road",
								"elementType": "geometry",
								"stylers": [
									{ "lightness": 25 }
								]
							},{
								"elementType": "labels.text",
								"stylers": [
									{ "lightness": 25 }
								]
							},{
								"featureType": "transit",
								"stylers": [
									{ "visibility": "off" }
								]
							}
						];

						// sets options for map
						var mapOptions = {
								zoom: 4,
								minZoom: 1,
								center: new google.maps.LatLng(40.7, -114),
								disableDefaultUI: true,
								styles: mapStyle
						};

						// creates new map on the directive element
						scope.map = new google.maps.Map(element[0], mapOptions);

						// Make an overlay so screen position can be derived from location
						function CanvasProjectionOverlay(){};
						CanvasProjectionOverlay.prototype = new google.maps.OverlayView();
						CanvasProjectionOverlay.prototype.constructor = CanvasProjectionOverlay;
						CanvasProjectionOverlay.prototype.onAdd = function(){};
						CanvasProjectionOverlay.prototype.draw = function(){};
						CanvasProjectionOverlay.prototype.onRemove = function(){};
						var canvasProjectionOverlay = new CanvasProjectionOverlay();
						canvasProjectionOverlay.setMap(scope.map);

						scope.getPixelFromLocation = function (location) {
								var pos = canvasProjectionOverlay.getProjection().fromLatLngToDivPixel(location);
								return pos;
						}

						// called when map finished being dragged or zoomed
						google.maps.event.addListener(scope.map, 'idle', function (event) {
								scope.mapIdle(event);
						});

						google.maps.event.addListener(scope.map, 'zoom_changed', function (event) {
								scope.mapZoomed(event);
						});

						google.maps.event.addListener(scope.map, 'click', function (event) {
								scope.mapClicked(event);
						});

						// HEATMAP CODE -----------------------------------------------------

						// defines a custom heatmap gradient
						var heatMapGradient = [
								'rgba(255, 50, 220, 0)',
								'rgba(255, 50, 220, 0)',
								'rgba(255, 50, 220, 0)',
								'rgba(255, 50, 220, 0)',
								'rgba(255, 50, 220, 0.25)',
								'rgba(255, 50, 220, 0.25)',
								'rgba(255, 50, 220, 0.25)',
								'rgba(255, 50, 220, 0.25)',
								'rgba(255, 50, 220, 0.25)',
								'rgba(255, 50, 220, 0.25)',
								'rgba(255, 50, 220, 0.5)',
								'rgba(255, 50, 220, 0.5)',
								'rgba(255, 50, 220, 0.5)',
								'rgba(255, 50, 220, 0.5)',
								'rgba(255, 50, 220, 0.5)',
								'rgba(255, 50, 220, 0.75)',
								'rgba(255, 50, 220, 0.75)',
								'rgba(255, 50, 220, 0.75)',
								'rgba(255, 50, 220, 0.75)',
								'rgba(255, 50, 220, 1)',
								'rgba(255, 50, 220, 1)',
								'rgba(255, 50, 220, 1)'
						];

						// creates a new heatmap layer with data from the scope
						scope.heatmap = new google.maps.visualization.HeatmapLayer({
								data: scope.mapPoints,
								options: {
										radius: 25,
										opacity: 0.6,
										gradient: heatMapGradient,
										map: scope.map
								}
						});
		}
		}]);