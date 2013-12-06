window.angular.module('oura.directives.mapbox', [])
  .directive('mapbox', [
    function() {
    	return {
    		restrict: 'E',
            transclude: true,
    		templateUrl: '/templates/mapbox.html'
    	}
    }]);