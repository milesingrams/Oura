window.angular.module('ngOura.directives.ouraMap', [])
  .directive('ouraMap', [
    function() {
    	return function(scope, element) {

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
                        { lightness: 35 }
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
                        { lightness: 35 }
                    ]
                }
            ];

            // sets options for map
            var mapOptions = {
                zoom: 10,
                minZoom: 1,
                center: new google.maps.LatLng(40.7, -74),
                disableDefaultUI: true,
                styles: mapStyle
            };

            // creates new map on the directive element
            scope.map = new google.maps.Map(element[0], mapOptions);

            // called when map finished being dragged or zoomed
            google.maps.event.addListener(scope.map, 'idle', function() {
                if (this.getBounds())
                scope.$apply(function() {
                    scope.mapIdle();
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
                data: scope.ouraPoints
            });

            // applies custom visual characteristics to the heatmap
            scope.heatmap.setOptions({radius: 35, gradient: heatMapGradient});

            // attaches heatmap to the map
            scope.heatmap.setMap(scope.map);
		}
    }]);