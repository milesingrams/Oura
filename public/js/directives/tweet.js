window.angular.module('ngOura.directives.tweet', [])
  .directive('tweet', [
    function() {
    	return {
    		restrict: 'E',
    		scope: {
    			tweet: '=tweet',
                map: '=map'
    		},
    		templateUrl: '/templates/tweet.html',
            link: function (scope, element) {
                var ouraLevel = Math.floor(Math.random()*3 + 0.5);
                var boxShadows = [];
                for (var i=1; i<=ouraLevel; i++) {
                    boxShadows.push("0 0 0 " + i*3 + "px rgba(255, 0, 150, 0.15)");
                }
                scope.ouraStyle = {'box-shadow': boxShadows.join(", ")};

                scope.addToMap = function () {
                    scope.tweet.location = new google.maps.LatLng(scope.tweet.coordinates[1], scope.tweet.coordinates[0]);
                    scope.mapOverlay = new TweetOverlay(scope.tweet.location, scope.map, scope.tweet);
                }
                scope.removeFromMap = function () {
                    scope.mapOverlay.setMap(null);
                }
                scope.$on('$destroy', function() {
                    if(scope.mapOverlay) {
                        scope.removeFromMap();
                    }
                });
            }   
    	}
    }]);