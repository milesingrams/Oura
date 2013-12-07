window.angular.module('oura.directives.mapboxTweet', [])
  .directive('mapboxTweet', [
    function() {
    	return {
    		restrict: 'E',
    		scope: {
    			tweet: '=tweet'
    		},
    		templateUrl: '/templates/mapboxTweet.html',
            link: function (scope) {
                var minSince = Math.round((new Date() - new Date(scope.tweet.data.saved_at))/60000);
                if (minSince == 0) {
                    scope.timeText = "just now";
                } else {
                    scope.timeText = minSince + " mins ago";
                }
            }   
    	}
    }]);