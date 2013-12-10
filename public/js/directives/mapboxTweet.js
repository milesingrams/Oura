window.angular.module('oura.directives.mapboxTweet', [])
  .directive('mapboxTweet', [
    function() {
    	return {
    		restrict: 'E',
    		scope: {
    			tweet: '=tweet',
                map: '=map'
    		},
    		templateUrl: '/templates/mapboxTweet.html',
            link: function (scope) {
                var minSince = Math.round((new Date() - new Date(scope.tweet.data.saved_at))/60000);
                if (minSince == 0) {
                    scope.timeText = "just now";
                } else {
                    scope.timeText = minSince + " mins ago";
                }

                scope.moveToTweet = function () {
                    scope.map.panTo(scope.tweet.location);
                    scope.map.setZoom(15);
                }
            }   
    	}
    }]);