window.angular.module('oura.directives.ouraMap', [])
  .directive('ouraMap', ['$timeout',
    function($timeout) {
    	return function (scope, element) {

            // properties for customizing map style
            var mapStyle = [
                {
                    elementType: "labels.icon",
                    stylers: [
                        { visibility: "off" }
                    ]
                },{
                    featureType: "transit",
                    stylers: [
                        { visibility: "off" }
                    ]
                },{
                    featureType: "landscape",
                    stylers: [
                        { saturation: -100 },
                        { lightness: 40 }
                    ]
                },{
                    featureType: "road",
                    stylers: [
                        { saturation: -100 }
                    ]
                },{
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [
                        { visibility: "simplified" },
                        { lightness: 40 }
                    ]
                },{
                    featureType: "poi",
                    elementType: "geometry",
                    stylers: [
                        { visibility: "simplified" },
                        { lightness: 40 }
                    ]
                }
            ];

            // sets options for map
            var mapOptions = {
                zoom: 6,
                minZoom: 1,
                center: new google.maps.LatLng(40.7, -74),
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
                scope.$apply(function () {
                    scope.mapIdle(event);
                });
            });

            google.maps.event.addListener(scope.map, 'zoom_changed', function (event) {
                scope.$apply(function () {
                    scope.mapZoomed(event);
                });
            });

            google.maps.event.addListener(scope.map, 'click', function (event) {
                scope.$apply(function () {
                    scope.mapClicked(event);
                });
            });

            // HEATMAP CODE -----------------------------------------------------

            // defines a custom heatmap gradient
            var heatMapGradient = [
                'rgba(255, 0, 150, 0)',
                'rgba(255, 0, 150, 0)',
                'rgba(255, 0, 150, 0)',
                'rgba(255, 0, 150, 0)',
                'rgba(255, 0, 150, 0.25)',
                'rgba(255, 0, 150, 0.25)',
                'rgba(255, 0, 150, 0.25)',
                'rgba(255, 0, 150, 0.25)',
                'rgba(255, 0, 150, 0.5)',
                'rgba(255, 0, 150, 0.5)',
                'rgba(255, 0, 150, 0.5)',
                'rgba(255, 0, 150, 0.5)',
                'rgba(255, 0, 150, 0.75)',
                'rgba(255, 0, 150, 0.75)',
                'rgba(255, 0, 150, 0.75)',
                'rgba(255, 0, 150, 0.75)',
                'rgba(255, 0, 150, 1)',
                'rgba(255, 0, 150, 1)',
                'rgba(255, 0, 150, 1)',
                'rgba(255, 0, 150, 1)'
            ];

            // creates a new heatmap layer with data from the scope
            scope.heatmap = new google.maps.visualization.HeatmapLayer({
                data: scope.mapPoints
            });

            // applies custom visual characteristics to the heatmap
            scope.heatmap.setOptions({radius: 30, gradient: heatMapGradient});

            // attaches heatmap to the map
            scope.heatmap.setMap(scope.map);
		}
    }]);