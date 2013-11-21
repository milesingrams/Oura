window.angular.module('oura.directives.venue', [])
  .directive('venue', [
    function() {
    	return {
    		restrict: 'E',
    		scope: {
    			venue: '=venue',
                map: '=map'
    		},
    		templateUrl: '/templates/venue.html',
            link: function (scope, element) {
                var ouraLevel = Math.floor(Math.random()*3 + 0.5);
                var boxShadows = [];
                for (var i=1; i<=ouraLevel; i++) {
                    boxShadows.push("0 0 0 " + i*3 + "px rgba(255, 0, 150, 0.15)");
                }
                scope.ouraStyle = {'box-shadow': boxShadows.join(", ")};
            }   
    	}
    }]);