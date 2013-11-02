window.angular.module('ngOura.controllers.map', [])
  .controller('MapController', ['$scope', 'Global',
	function($scope, Global) {

		var map, heatMap, ouraPoints;

		$scope.global = Global;

		initializeMap();
		weightedLoc = {location: new google.maps.LatLng(37.765838, -122.405200), weight:1};
		ouraPoints.push(weightedLoc);

		


		function initializeMap() {

			// MAP CODE -----------------------------------------------------

			var featureOpts = [
				{
					elementType: "labels.icon",
					stylers: [
						{ visibility: "off" }
					]
				},{
					featureType: "poi",
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
				},{
					featureType: "poi.park",
					elementType: "geometry",
					stylers: [
						{ visibility: "on" },
						{ lightness: 30 }
					]
				}
			];

			var styledMapOptions = {
				name: 'Oura Style'
			};

			var MAPTYPE_ID = 'oura_style';

			var mapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

			var mapOptions = {
				zoom: 13,
				minZoom: 3,
				center: new google.maps.LatLng(37.782745, -122.444586),
				disableDefaultUI: true,
				mapTypeControlOptions: {
					mapTypeIds: [google.maps.MapTypeId.ROADMAP, MAPTYPE_ID]
				},
				mapTypeId: MAPTYPE_ID
			};

			google.maps.visualRefresh = true;
			var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
			map.mapTypes.set(MAPTYPE_ID, mapType);

			// HEATMAP CODE -----------------------------------------------------

			var gradient = [
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

			ouraPoints = new google.maps.MVCArray();

			heatmap = new google.maps.visualization.HeatmapLayer({
				data: ouraPoints
			});

			heatmap.setMap(map);
			heatmap.setOptions({radius: 40, gradient: gradient});
		}
	}]);